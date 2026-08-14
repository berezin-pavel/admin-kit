import { expect, test } from "@playwright/test"

test.describe("page-tabs", () => {
  test("switches panels and keeps only the active one mounted", async ({
    page,
  }) => {
    await page.goto("/preview/page-tabs/default")

    const tabs = page.getByRole("tab")
    await expect(tabs.first()).toBeVisible()

    const first = await page.getByRole("tabpanel").innerText()
    await tabs.nth(1).click()
    const second = await page.getByRole("tabpanel").innerText()

    expect(second).not.toBe(first)
    await expect(page.getByRole("tabpanel")).toHaveCount(1)
  })

  test("moves between tabs with arrow keys", async ({ page }) => {
    await page.goto("/preview/page-tabs/default")

    await page.getByRole("tab").first().focus()
    await page.keyboard.press("ArrowRight")

    const role = await page.evaluate(() =>
      document.activeElement?.getAttribute("role")
    )
    expect(role).toBe("tab")
  })
})

test.describe("page-auth", () => {
  test("blocks a second submit while the first runs", async ({ page }) => {
    await page.goto("/preview/page-auth/default")

    await page.getByLabel("Email").fill("owner@example.com")
    const submit = page.getByRole("button", { name: "Sign in" })
    await submit.click()

    await expect(submit).toBeDisabled()
    await expect(submit).toBeEnabled({ timeout: 5000 })
  })

  test("announces a failed sign-in through a live region", async ({ page }) => {
    await page.goto("/preview/page-auth/error")

    await page.getByRole("button", { name: "Sign in" }).click()

    await expect(page.getByRole("alert")).toBeVisible()
  })
})

test.describe("page-list", () => {
  test("keeps the heading and the filters when the request fails", async ({
    page,
  }) => {
    await page.goto("/preview/page-list/error")

    await expect(page.getByRole("heading").first()).toBeVisible()
    await expect(page.getByRole("textbox").first()).toBeVisible()
  })
})
