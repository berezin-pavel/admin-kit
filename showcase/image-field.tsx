import type { ImageFieldItem } from "@/registry/image-field/image-field"

import { ImageFieldView } from "./image-field-view"
import type { ShowcaseEntry } from "./types"

const showcaseImages: readonly ImageFieldItem[] = [
  { id: "front", url: "/demo-images/front.svg", name: "Front view" },
  { id: "side", url: "/demo-images/side.svg", name: "Side view" },
  { id: "sole", url: "/demo-images/sole.svg", name: "Sole" },
  { id: "box", url: "/demo-images/box.svg", name: "Box" },
]

const uploadingImages: readonly ImageFieldItem[] = [
  showcaseImages[0],
  {
    id: "uploading",
    url: "/demo-images/side.svg",
    name: "side-view.jpg",
    progress: 62,
    speed: "1.4 MB/s",
  },
  {
    id: "failed",
    url: "/demo-images/sole.svg",
    name: "sole.jpg",
    error: "The server rejected the file",
  },
]

export const imageFieldEntry: ShowcaseEntry = {
  item: "image-field",
  title: "Image field",
  description:
    "A gallery of a record's images: thumbnails in a row with the drop zone stretching to the end of it, reordering by dragging one thumbnail onto another, a full-size preview dialog that steps through the whole set, a link that opens the original in a new tab, and removal that takes effect at once — there is no Apply button, because the form's Save is the only one that should exist. The field uploads nothing itself: onSelect hands the picked File objects over, and the stored result comes back through value as {id, url, name}. An item carrying progress and speed draws an upload bar; one carrying error shows what the server said. Every thumbnail also has move-earlier and move-later buttons, since HTML5 drag never reaches a keyboard. Drag a file onto the views below, or drag one thumbnail onto another to reorder them.",
  views: [
    {
      id: "gallery",
      name: "A gallery of four images",
      render: () => <ImageFieldView initial={showcaseImages} />,
    },
    {
      id: "uploading",
      name: "Uploading and failed",
      render: () => <ImageFieldView initial={uploadingImages} />,
    },
    {
      id: "empty",
      name: "Empty, with a hint",
      render: () => (
        <ImageFieldView initial={[]} hint="PNG, JPG or WEBP, up to 5 MB each" />
      ),
    },
    {
      id: "single",
      name: "A single image",
      render: () => (
        <ImageFieldView
          label="Cover"
          multiple={false}
          maxItems={1}
          initial={showcaseImages.slice(0, 1)}
        />
      ),
    },
    {
      id: "capped",
      name: "Capped at four, the drop zone gone",
      render: () => <ImageFieldView initial={showcaseImages} maxItems={4} />,
    },
    {
      id: "error",
      name: "With an error",
      render: () => (
        <ImageFieldView initial={[]} error="Add at least one image" />
      ),
    },
    {
      id: "disabled",
      name: "Disabled",
      render: () => (
        <ImageFieldView disabled initial={showcaseImages.slice(0, 2)} />
      ),
    },
  ],
}
