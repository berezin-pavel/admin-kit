import {
  UserMenuNoEmailView,
  UserMenuVariantsView,
  UserMenuView,
} from "./user-menu-view"
import type { ShowcaseEntry } from "./types"

export const userMenuEntry: ShowcaseEntry = {
  item: "user-menu",
  title: "User menu",
  description:
    "An avatar trigger that opens a dropdown with the user's name, email, and a list of actions. name, email, avatarUrl, and items come in as props; without avatarUrl the avatar falls back to initials derived from name. variant=\"icon\" (the default) is a sidebarFooter companion to theme-toggle, sidebar-toggle, and language-toggle — just the avatar. variant=\"row\" fills admin-shell's sidebarProfile slot instead: the avatar, the name, the email in muted text under it, and a trailing chevron, the whole row a single trigger with one accessible name for the person rather than three separate labels. The row's name and email truncate on overflow instead of forcing the sidebar wider. The dropdown's open state is transient UI state and lives in the primitive, like every select popup in the kit — that doesn't violate the sidebarFooter contract, which is about persistent state. tone=\"danger\" on an item colors it text-destructive, the same shape row-actions uses.",
  views: [
    {
      id: "default",
      name: "Open the menu — Profile and Sign out both notify",
      render: () => <UserMenuView />,
    },
    {
      id: "no-email",
      name: "Without an email — the header shows just the name",
      render: () => <UserMenuNoEmailView />,
    },
    {
      id: "variants",
      name: "variant=\"icon\" vs variant=\"row\", including truncation in a narrow sidebar",
      render: () => <UserMenuVariantsView />,
    },
  ],
}
