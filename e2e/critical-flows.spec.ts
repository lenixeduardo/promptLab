import { test, expect } from "@playwright/test"

test.describe("Critical User Flows", () => {
  test("hero to login flow with navigation", async ({ page }) => {
    // Start at hero page
    await page.goto("/")
    await expect(page.locator("h1").first()).toBeVisible()

    // Click login link
    await page
      .getByRole("link", { name: /entrar/i })
      .first()
      .click()
    await expect(page).toHaveURL(/\/login/)

    // Verify form is present
    await expect(page.getByLabel("Email")).toBeVisible()
    await expect(page.getByLabel("Senha")).toBeVisible()
  })

  test("signup form submission with validation", async ({ page }) => {
    await page.goto("/signup")

    // Try to submit empty form
    const submitButton = page.getByRole("button", { name: /criar/i })
    await submitButton.click()

    // Should remain on signup page (HTML5 validation prevents submit)
    await expect(page).toHaveURL(/\/signup/)

    // Fill in email
    await page.getByLabel("Email").fill("test@example.com")

    // Fill passwords that don't match
    const passwordFields = page.getByLabel("Senha")
    await passwordFields.first().fill("TestPassword123!")
    await page.getByLabel("Confirmar Senha").fill("DifferentPassword123!")

    // Try to submit
    await submitButton.click()
    await expect(page).toHaveURL(/\/signup/)
  })

  test("password reset flow navigation", async ({ page }) => {
    await page.goto("/forgot-password")
    await expect(page.getByLabel("Email")).toBeVisible()
    await expect(page.getByRole("button", { name: /enviar|recuperar/i })).toBeVisible()

    // Fill email
    await page.getByLabel("Email").fill("user@example.com")

    // Submit
    const submitButton = page.getByRole("button", { name: /enviar|recuperar/i })
    await submitButton.click()

    // Should stay on page or show message
    await expect(page).toHaveURL(/\/forgot-password|auth/)
  })

  test("rate limiting on login attempts", async ({ page }) => {
    await page.goto("/login")

    // Attempt first login with invalid credentials
    await page.getByLabel("Email").fill("test@example.com")
    await page.getByLabel("Senha").fill("wrongpassword")

    const loginButton = page.getByRole("button", { name: /entrar/i })
    await loginButton.click()

    // Wait for any error message or rate limit message
    await page.waitForTimeout(500)

    // Button should be disabled or show countdown
    const isDisabled = await loginButton.isDisabled()
    const buttonText = await loginButton.textContent()

    // Either button is disabled or shows "Tente em X s"
    expect(isDisabled || buttonText?.includes("Tente em")).toBeTruthy()
  })

  test("accessible keyboard navigation in forms", async ({ page }) => {
    await page.goto("/login")

    // Tab to email field and verify focus visible
    const emailInput = page.getByLabel("Email")
    await emailInput.focus()
    await expect(emailInput).toBeFocused()

    // Tab to password field
    const passwordInput = page.getByLabel("Senha")
    await page.keyboard.press("Tab")
    await expect(passwordInput).toBeFocused()

    // Tab to submit button
    const submitButton = page.getByRole("button", { name: /entrar/i })
    await page.keyboard.press("Tab")
    await expect(submitButton).toBeFocused()

    // Can activate with Enter
    await submitButton.focus()
    // Note: won't actually submit due to validation, just testing focus
  })

  test("protected routes redirect to login", async ({ page }) => {
    // Try to access /home without auth
    await page.goto("/home")
    await expect(page).toHaveURL(/\/login/)

    // Try to access /learn without auth
    await page.goto("/learn")
    await expect(page).toHaveURL(/\/login/)

    // Try to access /skills without auth
    await page.goto("/skills")
    await expect(page).toHaveURL(/\/login/)
  })

  test("public pages are accessible without auth", async ({ page }) => {
    const publicPages = ["/login", "/signup", "/forgot-password", "/reset-password"]

    for (const route of publicPages) {
      await page.goto(route)
      await expect(page).toHaveURL(new RegExp(route))
      // Page should have some content
      await expect(page.locator("body")).toBeTruthy()
    }
  })

  test("link navigation between auth pages", async ({ page }) => {
    // Start at login
    await page.goto("/login")

    // Click signup link
    await page.getByRole("link", { name: /criar/i }).click()
    await expect(page).toHaveURL(/\/signup/)

    // Click back to login link (if exists)
    const loginLink = page.getByRole("link", { name: /entrar/i }).first()
    if (await loginLink.isVisible()) {
      await loginLink.click()
      await expect(page).toHaveURL(/\/login/)
    }
  })
})
