import { expect, test } from "@playwright/test"

test("the sign-in screen rejects a wrong password and lets the documented one through", async ({
  page,
}) => {
  await page.goto("/demo/sign-in")

  await expect(page.locator("nav")).toHaveCount(0)

  await page.getByLabel("Email").fill("owner@example.com")
  await page.getByLabel("Password").fill("wrong")
  await page.getByRole("button", { name: "Sign in" }).click()

  await expect(page.getByRole("alert")).toBeVisible()

  await page.getByLabel("Password").fill("demo")
  await page.getByRole("button", { name: "Sign in" }).click()

  await expect(page).toHaveURL(/\/demo$/)
})

test("the overview reload button puts every widget into loading and back", async ({
  page,
}) => {
  await page.goto("/demo")

  const skeleton = page.locator('[data-slot="skeleton"]')
  await expect(skeleton).toHaveCount(0)

  await page.getByRole("button", { name: /reload/i }).click()

  await expect(skeleton.first()).toBeVisible()
  await expect(skeleton).toHaveCount(0, { timeout: 10_000 })
})

test("the order screen splits into working tabs", async ({ page }) => {
  await page.goto("/demo/order")

  const tabs = page.getByRole("tab")
  await expect(tabs).toHaveCount(3)

  const overview = await page.getByRole("tabpanel").innerText()
  await tabs.nth(1).click()
  const history = await page.getByRole("tabpanel").innerText()

  expect(history).not.toBe(overview)
  await expect(page.getByRole("tabpanel")).toHaveCount(1)
})

test("the order edit form picks a customer by search and saves", async ({
  page,
}) => {
  await page.goto("/demo/order/edit")

  const customer = page.getByRole("combobox").first()
  await customer.click()
  await customer.fill("a")
  await expect(page.getByRole("option").first()).toBeVisible()

  const chosen = (await page.getByRole("option").first().innerText()).trim()
  await page.getByRole("option").first().click()
  await expect(customer).toHaveValue(chosen)

  await page.getByRole("button", { name: /save/i }).click()
  await expect(page.getByText(/saved|updated/i).first()).toBeVisible({
    timeout: 10_000,
  })
})
