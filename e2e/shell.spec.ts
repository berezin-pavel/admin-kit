import { expect, test } from "@playwright/test"

const sidebarNav = "Sections"
const burgerLabel = "Open navigation menu"

test("a wide screen keeps the sidebar and offers no burger, collapsed or not", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto("/demo")

  await expect(page.getByRole("navigation", { name: sidebarNav })).toBeVisible()
  await expect(page.getByRole("button", { name: burgerLabel })).toBeHidden()

  await page.getByRole("button", { name: "Collapse sidebar" }).click({ force: true })

  await expect(page.getByRole("navigation", { name: sidebarNav })).toBeVisible()
  await expect(page.getByRole("button", { name: burgerLabel })).toBeHidden()
})

test("the collapsed rail still announces who is signed in", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto("/demo")

  const account = page.locator('aside [data-slot="user-menu"]')
  const expanded = await account.ariaSnapshot()

  await page.getByRole("button", { name: "Collapse sidebar" }).click({ force: true })

  await expect(account).toHaveAttribute("aria-labelledby", /.+/)
  expect(await account.ariaSnapshot()).toBe(expanded)
  expect(expanded).toContain("Alex Morgan")
})

test("a narrow screen drops the sidebar and navigates through the burger", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 800 })
  await page.goto("/demo")

  await expect(page.getByRole("navigation", { name: sidebarNav })).toBeHidden()

  await page.getByRole("button", { name: burgerLabel }).click()

  const panel = page.getByRole("navigation", { name: sidebarNav })
  await expect(panel).toBeVisible()
  await panel.getByRole("link", { name: "Orders" }).click()

  await expect(page).toHaveURL(/\/demo\/orders$/)
})

test("a narrow screen keeps the account on the top bar, not in the burger", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 800 })
  await page.goto("/demo")

  const topBar = page.locator('[data-slot="admin-top-bar"]')
  await expect(topBar.getByText("My Store")).toBeVisible()
  await expect(topBar.locator('[data-slot="user-menu"]')).toBeVisible()

  await page.getByRole("button", { name: burgerLabel }).click()

  const panel = page.getByRole("dialog")
  await expect(panel).toBeVisible()
  await expect(panel.locator('[data-slot="user-menu"]')).toHaveCount(0)

  const panelName = await panel.getByText("My Store").boundingBox()
  expect(panelName?.width ?? 0).toBeLessThanOrEqual(1)
})
