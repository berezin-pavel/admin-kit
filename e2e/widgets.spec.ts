import { expect, test } from "@playwright/test"

const widgets = [
  "widget-metric",
  "widget-chart",
  "widget-table",
  "widget-tree-table",
  "widget-list",
  "widget-progress",
  "widget-activity",
  "widget-donut",
  "widget-quick-actions",
] as const

for (const widget of widgets) {
  test(`${widget} shows skeletons and nothing operable while loading`, async ({
    page,
  }) => {
    await page.goto(`/preview/${widget}/loading`)

    await expect(page.locator('[data-slot="skeleton"]').first()).toBeVisible()
    await expect(page.locator("main button")).toHaveCount(0)
  })
}

test("date-range-field selects a range by dragging across the calendar", async ({
  page,
}) => {
  await page.goto("/preview/date-range-field/empty")

  const trigger = page.getByRole("button").first()
  const before = await trigger.innerText()
  await trigger.click()

  const days = page.locator('[data-slot="calendar"] button:not([disabled])')
  await expect(days.first()).toBeVisible()
  const from = days.nth(7)
  const to = days.nth(11)

  const fromBox = await from.boundingBox()
  const toBox = await to.boundingBox()
  expect(fromBox).not.toBeNull()
  expect(toBox).not.toBeNull()

  await page.mouse.move(
    fromBox!.x + fromBox!.width / 2,
    fromBox!.y + fromBox!.height / 2
  )
  await page.mouse.down()
  await page.mouse.move(
    toBox!.x + toBox!.width / 2,
    toBox!.y + toBox!.height / 2,
    { steps: 8 }
  )
  await page.mouse.up()

  await expect(trigger).not.toHaveText(before)
})

test("a table's select-all reflects a partial page selection", async ({
  page,
}) => {
  await page.goto("/preview/widget-table/with-row-selection")

  const checkboxes = page.getByRole("checkbox")
  const selectAll = checkboxes.first()

  await checkboxes.nth(1).click()

  await expect(selectAll).toHaveAttribute("aria-checked", "mixed")
})
