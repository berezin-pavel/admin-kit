import { FullscreenToggle } from "@/registry/fullscreen-toggle/fullscreen-toggle"

import type { ShowcaseEntry } from "./types"

export const fullscreenToggleEntry: ShowcaseEntry = {
  item: "fullscreen-toggle",
  title: "Fullscreen toggle",
  description:
    "A button that puts the whole panel into the browser's full-screen mode and brings it back. It reads and follows the Fullscreen API itself — the state lives in the browser, not in the consumer's store — and renders nothing where the browser forbids full screen. Sits at the right of the header bar, beside the account menu.",
  views: [
    {
      id: "default",
      name: "Default",
      render: () => <FullscreenToggle />,
    },
  ],
}
