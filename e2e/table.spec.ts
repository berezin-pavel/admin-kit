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

test("hiding a column removes it from the table and keeps the pinned one", async ({
  page,
}) => {
  await page.goto("/preview/widget-table/with-column-visibility")

  const headers = page.getByRole("columnheader")
  const before = await headers.count()

  await page.getByRole("button", { name: /columns/i }).click()

  const items = page.getByRole("menuitemcheckbox")
  await expect(items.first()).toBeVisible()

  const disabled = await items.evaluateAll(
    (nodes) => nodes.filter((n) => n.getAttribute("aria-disabled") === "true").length
  )
  expect(disabled).toBeGreaterThan(0)

  const toggleable = items.filter({ hasNotText: "" })
  for (let i = 0; i < (await toggleable.count()); i += 1) {
    const item = toggleable.nth(i)
    if ((await item.getAttribute("aria-disabled")) !== "true") {
      await item.click()
      break
    }
  }

  await page.keyboard.press("Escape")
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

test("export hands the current rows to the consumer as CSV", async ({
  page,
}) => {
  await page.goto("/preview/widget-table/with-export")

  await page.getByRole("button", { name: /export/i }).click()

  const output = page.locator("pre")
  await expect(output).toBeVisible()
  expect(await output.innerText()).toContain(",")
})

test("the header sticks to an outer scroller when the table has no scroll area of its own", async ({
  page,
}) => {
  await page.goto("/demo/orders")

  await page.locator('[aria-label="Rows per page"]').first().click()
  await page.getByRole("option", { name: "100", exact: true }).click()
  await expect(page.locator("tbody tr")).toHaveCount(100)

  const header = page.locator("th").nth(1)
  await expect(header).toBeVisible()

  await page.evaluate(() => document.querySelector("main")?.scrollTo(0, 1500))
  await page.waitForTimeout(300)

  const box = await header.boundingBox()
  expect(box).not.toBeNull()
  expect(box!.y).toBeGreaterThan(0)
  expect(box!.y).toBeLessThan(200)

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
