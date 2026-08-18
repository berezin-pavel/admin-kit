import { AppearanceMenuView } from "./admin-appearance-view"
import type { ShowcaseEntry } from "./types"

export const appearanceMenuEntry: ShowcaseEntry = {
  item: "appearance-menu",
  title: "Appearance menu",
  description:
    "A popover over the accent and gradient choices an administrator makes for the whole panel — the sidebar, the sign-in screen, the default page background, and any per-page override. It's controlled, like every control in the kit: value and onChange, storage stays with the consumer.",
  views: [
    {
      id: "default",
      name: "Default",
      render: () => <AppearanceMenuView />,
    },
  ],
}
