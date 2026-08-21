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

test("the columns menu hides a column and leaves the pinned one alone", async ({
  page,
}) => {
  await page.goto("/preview/widget-table/with-columns-menu")

  const headers = page.getByRole("columnheader")
  const before = await headers.count()

  await page.getByRole("button", { name: "Columns" }).click()

  const items = page.getByRole("menuitemcheckbox")
  await expect(items.first()).toBeVisible()
  await expect(items.first()).toBeDisabled()

  const count = await items.count()
  for (let i = 0; i < count; i += 1) {
    if (!(await items.nth(i).isDisabled())) {
      await items.nth(i).click()
      break
    }
  }

  await page.keyboard.press("Escape")
  await expect(items.first()).toBeHidden()
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
  await page.goto("/demo/order?tab=edit")
  await expect(page.getByRole("button", { name: /save/i })).toBeVisible()

  const documentScroll = await page.evaluate(
    () =>
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
  )
  expect(documentScroll).toBe(0)
})

test("hiding a column leaves the other columns' widths in place when one column grows", async ({
  page,
}) => {
  await page.goto("/preview/widget-table/grow-column")

  const widths = async () =>
    await page.getByRole("columnheader").evaluateAll((headers) =>
      headers.map((header): [string, number] => [
        header.textContent?.trim() ?? "",
        Math.round(header.getBoundingClientRect().width),
      ])
    )

  const before = await widths()
  const grown = before.reduce((a, b) => (a[1] > b[1] ? a : b))
  await page.getByRole("button", { name: "Columns" }).click()
  const items = page.getByRole("menuitemcheckbox")
  await expect(items.first()).toBeVisible()
  const count = await items.count()
  for (let i = 0; i < count; i += 1) {
    const item = items.nth(i)
    if ((await item.isDisabled()) || (await item.textContent())?.trim() === grown[0]) {
      continue
    }
    await item.click()
    break
  }
  await page.keyboard.press("Escape")
  await expect(page.getByRole("columnheader")).toHaveCount(before.length - 1)

  const after = await widths()
  for (const [title, width] of after) {
    if (title === grown[0]) continue
    const previous = before.find(([name]) => name === title)
    expect(previous, title).toBeDefined()
    expect(Math.abs((previous?.[1] ?? 0) - width), title).toBeLessThanOrEqual(1)
  }
})
