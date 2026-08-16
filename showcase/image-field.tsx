import type { ImageFieldItem } from "@/registry/image-field/image-field"

import { ImageFieldView } from "./image-field-view"
import type { ShowcaseEntry } from "./types"

const showcaseImages: readonly ImageFieldItem[] = [
  { id: "front", url: "/demo-images/front.svg", name: "Front view" },
  { id: "side", url: "/demo-images/side.svg", name: "Side view" },
  { id: "sole", url: "/demo-images/sole.svg", name: "Sole" },
  { id: "box", url: "/demo-images/box.svg", name: "Box" },
]

export const imageFieldEntry: ShowcaseEntry = {
  item: "image-field",
  title: "Image field",
  description:
    "A gallery of a record's images: thumbnails in a responsive grid, a drop zone that takes dragged files or opens the native picker, reordering by dragging one thumbnail onto another, a full-size preview in a dialog, a link that opens the original in a new tab, and removal that takes effect at once — there is no Apply button, because the form's Save is the only one that should exist. The field uploads nothing itself: onSelect hands the picked File objects over, and the stored result comes back through value as {id, url, name}. Every thumbnail also carries move-earlier and move-later buttons, since HTML5 drag never reaches a keyboard. Drag a file onto the views below, or drag one thumbnail onto another to reorder them.",
  views: [
    {
      id: "gallery",
      name: "A gallery of four images",
      render: () => <ImageFieldView initial={showcaseImages} />,
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
        <ImageFieldView initial={[]} error="Add at least one photo" />
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
