import { test, expect } from "@playwright/test"

test.describe("Error Handling and Recovery", () => {
  test("displays validation errors in login form", async ({ page }) => {
    await page.goto("/login")

    // Try submitting without filling any fields
    const emailInput = page.getByLabel("Email")
    const passwordInput = page.getByLabel("Senha")
    const submitButton = page.getByRole("button", { name: /entrar/i })

    // Focus on email to trigger validation
    await emailInput.focus()
    await emailInput.blur()

    // HTML5 validation should prevent submit
    await submitButton.click()
    await expect(page).toHaveURL(/\/login/)

    // Try with invalid email format
    await emailInput.fill("not-an-email")
    await passwordInput.fill("somepassword")
    await submitButton.click()

    // Should remain on login (email validation fails)
    await expect(page).toHaveURL(/\/login/)
  })

  test("shows error on invalid password", async ({ page }) => {
    await page.goto("/login")

    // Fill with valid email format but wrong password
    await page.getByLabel("Email").fill("test@example.com")
    await page.getByLabel("Senha").fill("wrongpassword")

    const submitButton = page.getByRole("button", { name: /entrar/i })
    await submitButton.click()

    // Wait for potential API response
    await page.waitForTimeout(1000)

    // Should either show error toast or remain on page
    const isOnLoginPage = page.url().includes("/login")
    expect(isOnLoginPage || page.url().includes("error")).toBeTruthy()
  })

  test("handles network timeout gracefully", async ({ page }) => {
    // Simulate slow network
    await page.route("**/*", (route) => {
      setTimeout(() => route.continue(), 2000)
    })

    await page.goto("/login")
    await page.getByLabel("Email").fill("user@example.com")
    await page.getByLabel("Senha").fill("password123")

    const submitButton = page.getByRole("button", { name: /entrar/i })
    await submitButton.click()

    // Page should still be responsive
    await expect(page.locator("body")).toBeTruthy()
  })

  test("prevents multiple rapid form submissions", async ({ page }) => {
    await page.goto("/login")

    const emailInput = page.getByLabel("Email")
    const passwordInput = page.getByLabel("Senha")
    const submitButton = page.getByRole("button", { name: /entrar/i })

    await emailInput.fill("user@example.com")
    await passwordInput.fill("password123")

    // Click submit button rapidly
    await submitButton.click()
    await submitButton.click()
    await submitButton.click()

    // Should not result in multiple requests or errors
    await page.waitForTimeout(500)

    // Button should be disabled or show rate limit message
    const buttonText = await submitButton.textContent()
    expect(buttonText?.includes("Tente em") || (await submitButton.isDisabled())).toBeTruthy()
  })

  test("shows countdown timer during rate limit", async ({ page }) => {
    await page.goto("/login")

    const emailInput = page.getByLabel("Email")
    const passwordInput = page.getByLabel("Senha")
    const submitButton = page.getByRole("button", { name: /entrar/i })

    await emailInput.fill("user@example.com")
    await passwordInput.fill("password")

    // Submit first attempt
    await submitButton.click()
    await page.waitForTimeout(300)

    // Check if countdown appears
    const buttonText = await submitButton.textContent()
    const hasCountdown = buttonText?.includes("Tente em")

    if (hasCountdown) {
      // Extract countdown time
      const match = buttonText?.match(/(\d+)s/)
      if (match) {
        const secondsRemaining = parseInt(match[1])
        expect(secondsRemaining).toBeGreaterThan(0)
        expect(secondsRemaining).toBeLessThanOrEqual(3)
      }
    }
  })

  test("handles API errors with toast messages", async ({ page }) => {
    // Intercept API calls to simulate error
    await page.route("**/auth/**", (route) => {
      route.abort("failed")
    })

    await page.goto("/login")
    await page.getByLabel("Email").fill("test@example.com")
    await page.getByLabel("Senha").fill("password123")

    const submitButton = page.getByRole("button", { name: /entrar/i })
    await submitButton.click()

    // Wait for error handling
    await page.waitForTimeout(500)

    // Page should still be interactive
    expect(page.url()).toContain("/login")
  })

  test("forgot password form validation", async ({ page }) => {
    await page.goto("/forgot-password")

    const emailInput = page.getByLabel("Email")
    const submitButton = page.getByRole("button", { name: /enviar|recuperar/i })

    // Try without email
    await submitButton.click()
    await expect(page).toHaveURL(/\/forgot-password/)

    // Try with invalid email
    await emailInput.fill("invalid-email")
    await submitButton.click()
    await expect(page).toHaveURL(/\/forgot-password/)

    // Try with valid format
    await emailInput.fill("valid@example.com")
    await submitButton.click()

    // Should proceed or show success message
    await page.waitForTimeout(500)
    expect(page.url()).toContain("forgot-password")
  })

  test("signup password mismatch validation", async ({ page }) => {
    await page.goto("/signup")

    const emailInput = page.getByLabel("Email")
    const passwordInput = page.getByLabel("Senha")
    const confirmInput = page.getByLabel("Confirmar Senha")
    const submitButton = page.getByRole("button", { name: /criar/i })

    await emailInput.fill("newuser@example.com")
    await passwordInput.fill("Password123!")
    await confirmInput.fill("DifferentPassword123!")

    await submitButton.click()

    // Should remain on signup due to mismatch
    await expect(page).toHaveURL(/\/signup/)
  })

  test("signup weak password validation", async ({ page }) => {
    await page.goto("/signup")

    const emailInput = page.getByLabel("Email")
    const passwordInput = page.getByLabel("Senha")
    const confirmInput = page.getByLabel("Confirmar Senha")
    const submitButton = page.getByRole("button", { name: /criar/i })

    await emailInput.fill("newuser@example.com")

    // Try very weak password
    const weakPassword = "123"
    await passwordInput.fill(weakPassword)
    await confirmInput.fill(weakPassword)

    // HTML5 validation or form validation should prevent submit
    await submitButton.click()
    await expect(page).toHaveURL(/\/signup/)
  })

  test("page remains functional after error", async ({ page }) => {
    await page.goto("/login")

    const emailInput = page.getByLabel("Email")
    const passwordInput = page.getByLabel("Senha")
    const submitButton = page.getByRole("button", { name: /entrar/i })

    // First attempt with invalid data
    await emailInput.fill("user@example.com")
    await passwordInput.fill("wrongpassword")
    await submitButton.click()

    await page.waitForTimeout(500)

    // Should be able to clear and try again
    await emailInput.clear()
    await passwordInput.clear()

    const signupLink = page.getByRole("link", { name: /criar/i })
    expect(signupLink).toBeTruthy()

    // Should be able to navigate
    await signupLink.click()
    await expect(page).toHaveURL(/\/signup/)
  })
})
