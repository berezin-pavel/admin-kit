import { expect, test, type Page } from "@playwright/test"

const STORAGE_KEY = "admin-kit-demo-theme"
const HYDRATION_POLL_TIMEOUT = 15_000
const BRAND_HEX = "3b82f6"
const BRAND_PRIMARY = "oklch(0.623 0.188 259.815)"

async function readPrimary(page: Page) {
  return page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--primary")
  )
}

async function hasGradientToken(page: Page, token: string) {
  return page.evaluate(
    (needle) =>
      Array.from(document.styleSheets)
        .flatMap((sheet) => {
          try {
            return Array.from(sheet.cssRules)
          } catch {
            return []
          }
        })
        .some((rule) => rule.cssText.includes(needle)),
    token
  )
}

test.beforeEach(async ({ page }) => {
  await page.goto("/demo")
  await page.evaluate(
    (key) => window.localStorage.removeItem(key),
    STORAGE_KEY
  )
})

test("a brand colour picked in the demo repaints a widget and survives a reload", async ({
  page,
}) => {
  const defaultPrimary = (await readPrimary(page)).trim()

  expect(defaultPrimary).not.toBe(BRAND_PRIMARY)

  await page.goto("/demo/appearance")
  await page.getByLabel("Brand").click()
  await page.getByLabel("Color HEX code").fill(BRAND_HEX)
  await page.keyboard.press("Escape")

  await page.goto("/demo")
  await expect
    .poll(async () => (await readPrimary(page)).trim(), {
      timeout: HYDRATION_POLL_TIMEOUT,
    })
    .toBe(BRAND_PRIMARY)

  await page.reload()
  await expect
    .poll(async () => (await readPrimary(page)).trim(), {
      timeout: HYDRATION_POLL_TIMEOUT,
    })
    .toBe(BRAND_PRIMARY)
})

test("a gradient added in the editor becomes a token", async ({ page }) => {
  await page.goto("/demo/appearance")

  expect(await hasGradientToken(page, "--gradient-new-gradient")).toBe(false)

  await page.getByRole("button", { name: "Add gradient" }).click()

  await expect(page.getByText("New gradient")).toBeVisible()
  await expect
    .poll(() => hasGradientToken(page, "--gradient-new-gradient"))
    .toBe(true)
})
