import { AdminShell } from "@/registry/admin-shell/admin-shell"

import type { ShowcaseEntry } from "./types"

const nav = [
  { href: "/", title: "Overview" },
  { href: "/orders", title: "Orders" },
  { href: "/users", title: "Users" },
] as const

export const adminShellEntry: ShowcaseEntry = {
  item: "admin-shell",
  title: "Admin shell",
  description:
    "The persistent frame of the admin panel: a header, a side navigation, and an empty work area. Nav items and the active section are set by props.",
  views: [
    {
      name: "With an empty work area",
      render: () => <AdminShell title="Admin Panel" nav={nav} activeHref="/" />,
    },
    {
      name: "With content in the work area",
      render: () => (
        <AdminShell title="Admin Panel" nav={nav} activeHref="/orders">
          <div className="text-sm text-muted-foreground">
            Widgets go here.
          </div>
        </AdminShell>
      ),
    },
  ],
}
