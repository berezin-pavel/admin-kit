import { NotificationsMenu } from "@/registry/notifications-menu/notifications-menu"

import { NotificationsMenuView } from "./notifications-menu-view"
import type { ShowcaseEntry } from "./types"

export const notificationsMenuEntry: ShowcaseEntry = {
  item: "notifications-menu",
  title: "Notifications menu",
  description:
    "A bell button with the unread count over it — capped at 9+ in the badge, spelled out in the button's name — opening a dropdown of entries: a title, an optional explanation clamped to two lines, and a preformatted timestamp. Reading state is the consumer's: the item only reports the picked entry and the mark-all-read press.",
  views: [
    {
      id: "unread",
      name: "Unread and read (picking one marks it read)",
      render: () => <NotificationsMenuView />,
    },
    {
      id: "empty",
      name: "Nothing to show",
      render: () => <NotificationsMenu notifications={[]} />,
    },
  ],
}
