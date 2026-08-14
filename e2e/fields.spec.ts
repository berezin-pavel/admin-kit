import { expect, test } from "@playwright/test"

test.describe("combobox-field", () => {
  test("filters as you type, selects, and reports no match", async ({ page }) => {
    await page.goto("/preview/combobox-field/default")

    const input = page.getByRole("combobox").first()
    await input.click()

    const total = await page.getByRole("option").count()
    expect(total).toBeGreaterThan(20)

    await input.fill("blanket")
    const filtered = page.getByRole("option")
    await expect(filtered.first()).toBeVisible()
    expect(await filtered.count()).toBeLessThan(total)

    const label = (await filtered.first().innerText()).trim()
    await filtered.first().click()
    await expect(input).toHaveValue(label)

    await input.click()
    await input.fill("no such option at all")
    await expect(page.getByText("Nothing found")).toBeVisible()
  })

  test("long options stay inside the popup instead of stretching it", async ({
    page,
  }) => {
    await page.goto("/preview/combobox-field/default")

    const input = page.getByRole("combobox").first()
    await input.click()
    await input.fill("blanket")

    const option = page.getByRole("option").first()
    await expect(option).toBeVisible()

    const optionBox = await option.boundingBox()
    const popupBox = await page
      .locator('[data-slot="combobox-content"]')
      .boundingBox()

    expect(optionBox).not.toBeNull()
    expect(popupBox).not.toBeNull()
    expect(optionBox!.width).toBeLessThanOrEqual(popupBox!.width + 1)
  })
})

test.describe("multi-select-field", () => {
  test("collects chips and removes them one by one", async ({ page }) => {
    await page.goto("/preview/multi-select-field/default")

    const chip = page.getByRole("button", { name: /^Remove / })
    const before = await chip.count()

    await page.getByRole("combobox").first().click()
    await page.getByRole("option", { selected: false }).first().click()
    await page.keyboard.press("Escape")

    await expect(chip).toHaveCount(before + 1)

    await chip.first().click()
    await expect(chip).toHaveCount(before)
  })

  test("maxItems disables the rest instead of hiding it", async ({ page }) => {
    await page.goto("/preview/multi-select-field/limit")

    await page.getByRole("combobox").first().click()

    const options = page.getByRole("option")
    const optionCount = await options.count()

    for (let i = 0; i < optionCount; i += 1) {
      const option = options.nth(i)
      const disabled = await option.getAttribute("data-disabled")
      const selected = await option.getAttribute("aria-selected")
      if (disabled === null && selected !== "true") {
        await option.click()
        break
      }
    }

    const disabledCount = await options.evaluateAll(
      (nodes) => nodes.filter((n) => n.hasAttribute("data-disabled")).length
    )
    expect(disabledCount).toBeGreaterThan(0)
    expect(await options.count()).toBe(optionCount)

    await page.keyboard.press("Escape")
    await expect(page.getByRole("button", { name: /^Remove / })).toHaveCount(3)
  })
})
