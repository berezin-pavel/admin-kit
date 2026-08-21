import { expect, test } from "@playwright/test"

const altTexts = async (page: import("@playwright/test").Page) =>
  await page.locator("li img").evaluateAll((images) =>
    images.map((image) => image.getAttribute("alt"))
  )

test("thumbnails reorder by dragging one onto another", async ({ page }) => {
  await page.goto("/preview/image-field/gallery")

  const thumbnails = page.locator("li:has(img)")
  await expect(thumbnails).toHaveCount(4)
  expect(await altTexts(page)).toEqual([
    "Front view",
    "Side view",
    "Sole",
    "Box",
  ])

  const fromBox = await thumbnails.first().boundingBox()
  const toBox = await thumbnails.nth(2).boundingBox()
  if (!fromBox || !toBox) throw new Error("thumbnail bounding box missing")

  const fromX = fromBox.x + fromBox.width / 2
  const fromY = fromBox.y + fromBox.height / 2
  const toX = toBox.x + toBox.width / 2
  const toY = toBox.y + toBox.height / 2

  await page.mouse.move(fromX, fromY)
  await page.mouse.down()
  await page.mouse.move(fromX + 10, fromY + 10)
  await page.mouse.move(toX, toY, { steps: 10 })
  await page.mouse.up()

  expect(await altTexts(page)).toEqual([
    "Side view",
    "Sole",
    "Front view",
    "Box",
  ])
})

test("a picked file joins the gallery and removal applies at once", async ({
  page,
}) => {
  await page.goto("/preview/image-field/empty")

  await expect(page.locator("li:has(img)")).toHaveCount(0)

  await page.locator('input[type="file"]').setInputFiles({
    name: "cover.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64"
    ),
  })

  const thumbnail = page.locator("li:has(img)").first()
  await expect(thumbnail).toBeVisible()

  await thumbnail.hover()
  await page.getByRole("button", { name: "Remove: cover.png" }).click()

  await expect(page.locator("li:has(img)")).toHaveCount(0)
})

test("the preview steps through the gallery with the arrow keys", async ({
  page,
}) => {
  await page.goto("/preview/image-field/gallery")

  await page.locator("li:has(img)").first().hover()
  await page.getByRole("button", { name: "Preview: Front view" }).click()

  await expect(page.getByRole("dialog", { name: "Front view" })).toBeVisible()
  await expect(page.getByText("1 of 4")).toBeVisible()

  await page.keyboard.press("ArrowRight")
  await expect(page.getByRole("dialog", { name: "Side view" })).toBeVisible()

  await page.keyboard.press("ArrowLeft")
  await page.keyboard.press("ArrowLeft")
  await expect(page.getByRole("dialog", { name: "Box" })).toBeVisible()
})

test("an uploading image reports its progress and a failed one its error", async ({
  page,
}) => {
  await page.goto("/preview/image-field/uploading")

  await expect(
    page.getByRole("progressbar", { name: "Uploading: side-view.jpg" })
  ).toHaveAttribute("aria-valuenow", "62")
  await expect(page.getByText("1.4 MB/s")).toBeVisible()
  await expect(page.getByText("The server rejected the file")).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Preview: sole.jpg" })
  ).toHaveCount(0)
})

test("the preview dialog shows the image and links to the original", async ({
  page,
}) => {
  await page.goto("/preview/image-field/gallery")

  await page.locator("li:has(img)").nth(1).hover()
  await page.getByRole("button", { name: "Preview: Side view" }).click()

  const dialog = page.getByRole("dialog", { name: "Side view" })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole("img", { name: "Side view" })).toHaveAttribute(
    "src",
    "/demo-images/side.svg"
  )
  await expect(
    dialog.getByRole("link", { name: "Open in a new tab" })
  ).toHaveAttribute("target", "_blank")
})
