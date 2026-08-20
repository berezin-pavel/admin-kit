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
  await expect(tabs).toHaveCount(4)

  const overview = await page.getByRole("tabpanel").innerText()
  await tabs.nth(1).click()
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true")
  await expect(page.getByRole("tabpanel")).toHaveCount(1)

  const history = await page.getByRole("tabpanel").innerText()

  expect(history).not.toBe(overview)

  await page.getByRole("tab", { name: "Edit" }).click()
  await expect(page.getByRole("tab", { name: "Edit" })).toHaveAttribute("aria-selected", "true")
  await expect(page.getByRole("tabpanel").getByRole("button", { name: /save/i })).toBeVisible()
})

test("the order edit form picks a customer by search and saves", async ({
  page,
}) => {
  await page.goto("/demo/order?tab=edit")

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

test("the orders page exports a selection, hides a column and resets its filters", async ({
  page,
}) => {
  await page.goto("/demo/orders")

  await expect(page.locator("th").first()).toBeVisible()
  const columnsBefore = await page.locator("th").count()

  await expect(page.getByRole("button", { name: /export/i })).toHaveCount(0)

  await page.getByRole("checkbox").first().click()
  await expect(page.getByRole("button", { name: /select all 100/i })).toBeVisible()
  await page.getByRole("button", { name: /^export$/i }).click()
  await expect(page.getByText(/rows are ready as CSV/i)).toBeVisible()
  await page.getByRole("button", { name: /clear selection/i }).click()

  await page.getByRole("button", { name: "Columns" }).click()
  const items = page.getByRole("menuitemcheckbox")
  await expect(items.first()).toBeVisible()
  await expect(items.first()).toBeDisabled()
  for (let i = 0; i < (await items.count()); i += 1) {
    if (!(await items.nth(i).isDisabled())) {
      await items.nth(i).click()
      break
    }
  }
  await page.keyboard.press("Escape")
  await expect(page.locator("th")).toHaveCount(columnsBefore - 1)

  await expect(
    page.getByRole("button", { name: "Reset filters" })
  ).toHaveCount(0)
  await page.getByRole("textbox").first().fill("no such order anywhere")
  const reset = page.getByRole("button", { name: "Reset filters" })
  await expect(reset).toBeVisible()
  await reset.click()
  await expect(page.getByRole("row").first()).toBeVisible()
})

test("the flush demo runs a full-width header with the account menu at its right", async ({
  page,
}) => {
  await page.goto("/demo-flush")
  await page.waitForLoadState("networkidle")

  const root = page.locator('[data-variant="flush"]')
  await expect(root).toBeVisible()
  const header = page.locator('[data-slot="admin-header"]')
  await expect(header).toContainText("My Store")
  await expect(header.getByRole("button", { name: "Open user menu" })).toBeVisible()
  await expect(page.locator("aside").getByRole("button", { name: /Alex Morgan/ })).toHaveCount(0)

  await page.getByRole("link", { name: "Orders" }).click()
  await expect(page).toHaveURL(/\/demo-flush\/orders$/)
  const table = page.locator('[data-block-id="orders.table"]')
  await expect(table).toHaveAttribute("data-heading", "none", { timeout: 15_000 })
  await expect(table.getByRole("button", { name: "Reload" })).toBeVisible()
  await expect(page.locator('[data-block-id="orders.header"]')).toHaveCount(0)

  await table.getByRole("link", { name: "#4187" }).click()
  await expect(page).toHaveURL(/\/demo-flush\/order$/)
  await expect(page.getByRole("tab", { name: "Overview" })).toBeVisible()
  await page.getByRole("link", { name: "Orders" }).first().click()
  await expect(page).toHaveURL(/\/demo-flush\/orders$/)
})

test("the header gradient picked in the menu paints the flush demo's bar", async ({ page }) => {
  await page.goto("/demo-flush")
  await page.evaluate(() => window.localStorage.removeItem("admin-kit-demo-appearance"))
  await page.reload()
  await page.waitForLoadState("networkidle")

  const trigger = page.getByRole("button", { name: "Appearance", exact: true })
  const menu = page.getByRole("dialog", { name: "Appearance", exact: true })
  await expect(async () => {
    await trigger.click()
    await expect(menu).toBeVisible({ timeout: 2_000 })
  }).toPass({ timeout: 15_000 })
  await menu.getByRole("combobox", { name: "Header" }).click()
  await page.getByRole("option", { name: "Midnight" }).click()
  await page.keyboard.press("Escape")

  await expect(page.locator('[data-slot="admin-header"]')).toHaveAttribute(
    "data-gradient",
    "midnight"
  )
})

test("the header search opens on Cmd+K and routes to the picked page", async ({ page }) => {
  await page.goto("/demo-flush")
  await page.waitForLoadState("networkidle")

  await page.keyboard.press("ControlOrMeta+k")
  const dialog = page.getByRole("dialog", { name: "Search" })
  await expect(dialog).toBeVisible()
  await page.getByRole("option", { name: /Orders Navigation/ }).click()
  await expect(page).toHaveURL(/\/demo-flush\/orders$/)
})

test("the bell counts unread and mark-all-read clears the badge", async ({ page }) => {
  await page.goto("/demo-flush")
  await page.waitForLoadState("networkidle")

  const bell = page.getByRole("button", { name: "Notifications, 3 unread" })
  await bell.click()
  await expect(page.getByText("New order #4187")).toBeVisible()
  await page.getByText("Mark all as read").click()
  await expect(page.getByRole("button", { name: "Notifications" })).toBeVisible()
})
