import { expect, test } from "@playwright/test"

test("a filtered-out list offers to clear the filter instead of claiming there is no data", async ({
  page,
}) => {
  await page.goto("/preview/widget-table/filtered-empty")

  const clear = page.getByRole("button", { name: /clear/i })
  await expect(clear).toBeVisible()

  await clear.click()

  await expect(page.getByRole("row")).not.toHaveCount(0)
})

test("the settings dialog hides a column and leaves the pinned one alone", async ({
  page,
}) => {
  await page.goto("/preview/widget-table/with-settings-dialog")

  const headers = page.getByRole("columnheader")
  const before = await headers.count()

  await page.getByRole("button", { name: "Table settings" }).click()

  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()

  const boxes = dialog.getByRole("checkbox")
  const pinned = boxes.first()
  await expect(pinned).toBeDisabled()

  const toggles = await boxes.count()
  for (let i = 0; i < toggles; i += 1) {
    if (!(await boxes.nth(i).isDisabled())) {
      await boxes.nth(i).click()
      break
    }
  }

  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(headers).toHaveCount(before - 1)
})

test("the header row stays put while the table body scrolls", async ({
  page,
}) => {
  await page.goto("/preview/widget-table/sticky-header")

  const header = page.getByRole("columnheader").first()
  const topBefore = (await header.boundingBox())?.y

  const scrolled = await page.evaluate(() => {
    const node = [...document.querySelectorAll("div")].find(
      (candidate) =>
        candidate.querySelector("table") !== null &&
        candidate.scrollHeight > candidate.clientHeight + 20
    )
    if (!node) return false
    node.scrollTo(0, 400)
    return node.scrollTop > 0
  })
  expect(scrolled).toBe(true)
  await page.waitForTimeout(300)

  const topAfter = (await header.boundingBox())?.y

  expect(topBefore).toBeDefined()
  expect(topAfter).toBeDefined()
  expect(Math.abs((topAfter ?? 0) - (topBefore ?? 0))).toBeLessThan(4)
})

test("export is a selection action rather than a header button", async ({
  page,
}) => {
  await page.goto("/preview/widget-table/with-export")

  await expect(
    page.getByRole("button", { name: /export/i })
  ).toHaveCount(0)

  await page.getByRole("checkbox").first().click()

  const exportAction = page.getByRole("button", { name: /export/i })
  await expect(exportAction).toBeVisible()
  await exportAction.click()

  const output = page.locator("pre")
  await expect(output).toBeVisible()
  expect(await output.innerText()).toContain(",")
})

test("a sticky-header list scrolls inside the table, not the page", async ({
  page,
}) => {
  await page.goto("/demo/orders")

  await page.locator('[aria-label="Rows per page"]').first().click()
  await page.getByRole("option", { name: "100", exact: true }).click()
  await expect(page.locator("tbody tr")).toHaveCount(100)

  const header = page.locator("th").nth(1)
  const before = (await header.boundingBox())?.y

  const scrolled = await page.evaluate(() => {
    const node = [...document.querySelectorAll("div")].find(
      (candidate) =>
        candidate.querySelector("table") !== null &&
        candidate.scrollHeight > candidate.clientHeight + 20
    )
    if (!node) return false
    node.scrollTo(0, 600)
    return node.scrollTop > 0
  })
  expect(scrolled).toBe(true)
  await page.waitForTimeout(300)

  const after = (await header.boundingBox())?.y
  expect(Math.abs((after ?? 0) - (before ?? 0))).toBeLessThan(4)

  const documentScroll = await page.evaluate(
    () =>
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
  )
  expect(documentScroll).toBe(0)
})

test("a long form does not add a second scrollbar to the page", async ({
  page,
}) => {
  await page.goto("/demo/order/edit")
  await expect(page.getByRole("button", { name: /save/i })).toBeVisible()

  const documentScroll = await page.evaluate(
    () =>
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
  )
  expect(documentScroll).toBe(0)
})
