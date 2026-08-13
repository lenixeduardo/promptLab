import Stripe from "npm:stripe@14"
import { createClient } from "npm:@supabase/supabase-js@2"
import { resolveCorsHeaders } from "../_shared/cors.ts"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
})
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

type PremiumStatus = "free" | "trial" | "active" | "cancelled"

/** Map a Stripe subscription status to our simplified premium_status. */
function mapSubscriptionStatus(subscription: Stripe.Subscription): PremiumStatus {
  switch (subscription.status) {
    case "trialing":
      return "trial"
    case "active":
      return "active"
    case "canceled":
    case "unpaid":
    case "incomplete_expired":
      return "cancelled"
    case "past_due":
    case "incomplete":
    default:
      // Keep whatever the user currently has; caller decides what to persist.
      return "active"
  }
}

async function findUserByCustomerId(customerId: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id, premium_status")
    .eq("stripe_customer_id", customerId)
    .maybeSingle()

  if (error) {
    console.error("stripe-webhook: failed to look up user by customer id:", error)
    return null
  }
  return data
}

/** Insert an audit row in public.subscriptions (history), best-effort. */
async function recordSubscriptionHistory(params: {
  userId: string
  stripeSubscriptionId: string
  stripeCustomerId: string
  status: string
  priceId?: string | null
  productId?: string | null
  currentPeriodStart?: number | null
  currentPeriodEnd?: number | null
  cancelAtPeriodEnd?: boolean
}) {
  const {
    userId,
    stripeSubscriptionId,
    stripeCustomerId,
    status,
    priceId,
    productId,
    currentPeriodStart,
    currentPeriodEnd,
    cancelAtPeriodEnd,
  } = params

  const { error } = await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: stripeSubscriptionId,
      stripe_customer_id: stripeCustomerId,
      product_id: productId ?? "unknown",
      price_id: priceId ?? "unknown",
      status,
      current_period_start: currentPeriodStart
        ? new Date(currentPeriodStart * 1000).toISOString()
        : null,
      current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null,
      cancel_at_period_end: cancelAtPeriodEnd ?? false,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" }
  )

  if (error) {
    console.error("stripe-webhook: failed to record subscription history:", error)
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id
  const subscriptionId =
    typeof session.subscription === "string" ? session.subscription : session.subscription?.id

  if (!customerId || !subscriptionId) {
    console.error(
      "stripe-webhook: checkout.session.completed missing customer/subscription",
      session.id
    )
    return
  }

  const user = await findUserByCustomerId(customerId)
  if (!user) {
    console.error("stripe-webhook: no user found for customer", customerId)
    return
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const premiumStatus: PremiumStatus = subscription.status === "trialing" ? "trial" : "active"

  const { error } = await supabaseAdmin
    .from("users")
    .update({
      premium_status: premiumStatus,
      stripe_subscription_id: subscription.id,
      premium_since: new Date().toISOString(),
      trial_ends_at:
        subscription.status === "trialing" && subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null,
    })
    .eq("id", user.id)

  if (error) {
    console.error("stripe-webhook: failed to update user after checkout completed:", error)
  }

  const item = subscription.items.data[0]
  await recordSubscriptionHistory({
    userId: user.id,
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: customerId,
    status: subscription.status,
    priceId: item?.price?.id,
    productId: typeof item?.price?.product === "string" ? item.price.product : undefined,
    currentPeriodStart: subscription.current_period_start,
    currentPeriodEnd: subscription.current_period_end,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id

  const user = await findUserByCustomerId(customerId)
  if (!user) {
    console.error("stripe-webhook: no user found for customer", customerId)
    return
  }

  if (subscription.status === "past_due" || subscription.status === "unpaid") {
    // Don't downgrade the user's access yet — log so it can be investigated /
    // followed up (e.g. dunning emails), but keep their current premium_status.
    console.warn(
      `stripe-webhook: subscription ${subscription.id} for user ${user.id} is ${subscription.status}`
    )
  } else {
    const premiumStatus = mapSubscriptionStatus(subscription)
    const { error } = await supabaseAdmin
      .from("users")
      .update({
        premium_status: premiumStatus,
        stripe_subscription_id: subscription.id,
        trial_ends_at:
          subscription.status === "trialing" && subscription.trial_end
            ? new Date(subscription.trial_end * 1000).toISOString()
            : null,
      })
      .eq("id", user.id)

    if (error) {
      console.error("stripe-webhook: failed to update user on subscription updated:", error)
    }
  }

  const item = subscription.items.data[0]
  await recordSubscriptionHistory({
    userId: user.id,
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: customerId,
    status: subscription.status,
    priceId: item?.price?.id,
    productId: typeof item?.price?.product === "string" ? item.price.product : undefined,
    currentPeriodStart: subscription.current_period_start,
    currentPeriodEnd: subscription.current_period_end,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id

  const user = await findUserByCustomerId(customerId)
  if (!user) {
    console.error("stripe-webhook: no user found for customer", customerId)
    return
  }

  const { error } = await supabaseAdmin
    .from("users")
    .update({ premium_status: "cancelled" })
    .eq("id", user.id)

  if (error) {
    console.error("stripe-webhook: failed to update user on subscription deleted:", error)
  }

  const item = subscription.items.data[0]
  await recordSubscriptionHistory({
    userId: user.id,
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: customerId,
    status: "canceled",
    priceId: item?.price?.id,
    productId: typeof item?.price?.product === "string" ? item.price.product : undefined,
    currentPeriodStart: subscription.current_period_start,
    currentPeriodEnd: subscription.current_period_end,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  })
}

Deno.serve(async (req) => {
  const corsHeaders = resolveCorsHeaders(req)

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  const signature = req.headers.get("stripe-signature")
  const body = await req.text()

  let event: Stripe.Event
  try {
    if (!signature) throw new Error("Missing stripe-signature header")
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
  } catch (err) {
    console.error("stripe-webhook: signature verification failed:", err)
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  // Respond 200 quickly; log (rather than throw) so a failure processing one
  // event never causes Stripe to think the whole delivery failed and doesn't
  // block other events from being processed.
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      default:
        // Ignore events we don't care about.
        break
    }
  } catch (err) {
    console.error(`stripe-webhook: error processing event ${event.type} (${event.id}):`, err)
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
})
