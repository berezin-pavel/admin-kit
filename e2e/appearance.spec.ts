import { expect, test, type Page } from "@playwright/test"

const STORAGE_KEY = "admin-kit-demo-appearance"
const HYDRATION_POLL_TIMEOUT = 15_000

async function readPrimary(page: Page) {
  return page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--primary").trim()
  )
}

async function openMenu(page: Page) {
  const trigger = page.getByRole("button", { name: "Appearance", exact: true })
  const dialog = page.getByRole("dialog", { name: "Appearance", exact: true })
  await expect(async () => {
    await trigger.click()
    await expect(dialog).toBeVisible({ timeout: 2_000 })
  }).toPass({ timeout: HYDRATION_POLL_TIMEOUT })
  return dialog
}

test.beforeEach(async ({ page }) => {
  await page.goto("/demo")
  await page.evaluate((key) => window.localStorage.removeItem(key), STORAGE_KEY)
  await page.reload()
  await page.waitForLoadState("networkidle")
})

test("an accent picked in the menu repaints the panel and survives a reload", async ({
  page,
}) => {
  const defaultPrimary = await readPrimary(page)

  const menu = await openMenu(page)
  await menu.getByRole("radiogroup", { name: "Accent color" }).getByRole("radio", { name: "Blue" }).click()

  await expect
    .poll(() => readPrimary(page), { timeout: HYDRATION_POLL_TIMEOUT })
    .not.toBe(defaultPrimary)
  const bluePrimary = await readPrimary(page)

  await page.reload()
  await expect
    .poll(() => readPrimary(page), { timeout: HYDRATION_POLL_TIMEOUT })
    .toBe(bluePrimary)
})

test("a block's corner button changes that block's gradient and heading", async ({
  page,
}) => {
  const block = page.locator('[data-block-id="overview.average"]')
  await expect(block).toHaveAttribute("data-gradient", "lagoon")

  await block.hover()
  await block.getByRole("button", { name: "Block appearance" }).click()
  const popover = page.getByRole("dialog", { name: "Block appearance" })
  await popover.getByRole("radiogroup", { name: "Gradient" }).getByRole("radio", { name: "Ember" }).click()
  await expect(block).toHaveAttribute("data-gradient", "ember")

  await popover.getByRole("radiogroup", { name: "Heading" }).getByRole("radio", { name: "Hidden" }).click()
  await expect(block).toHaveAttribute("data-heading", "none")

  await page.keyboard.press("Escape")
  await page.reload()
  await expect(page.locator('[data-block-id="overview.average"]')).toHaveAttribute(
    "data-gradient",
    "ember",
    { timeout: HYDRATION_POLL_TIMEOUT }
  )
})

test("a per-page backdrop chosen in the menu paints only that page", async ({
  page,
}) => {
  const menu = await openMenu(page)
  await menu.getByRole("combobox", { name: "Orders" }).click()
  await page.getByRole("option", { name: "Grape", exact: true }).click()
  await page.keyboard.press("Escape")

  await page.goto("/demo/orders")
  await expect(page.locator("[data-backdrop]").first()).toHaveAttribute("data-backdrop", "grape", {
    timeout: HYDRATION_POLL_TIMEOUT,
  })

  await page.goto("/demo")
  await expect(page.locator("[data-backdrop]").first()).toHaveAttribute("data-backdrop", "ocean", {
    timeout: HYDRATION_POLL_TIMEOUT,
  })
})

test("the sidebar gradient and its burger panel follow the menu", async ({ page }) => {
  await expect(page.locator("aside")).toHaveAttribute("data-gradient", "forest")

  const menu = await openMenu(page)
  await menu.getByRole("combobox", { name: "Sidebar" }).click()
  await page.getByRole("option", { name: "Midnight" }).click()
  await page.keyboard.press("Escape")

  await expect(page.locator("aside")).toHaveAttribute("data-gradient", "midnight")

  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole("button", { name: "Open navigation menu" }).click()
  await expect(page.locator('[data-slot="sheet-content"]')).toHaveAttribute(
    "data-gradient",
    "midnight"
  )
})
