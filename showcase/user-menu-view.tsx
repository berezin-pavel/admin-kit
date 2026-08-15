"use client"

import { LogOut, User } from "lucide-react"

import { AdminToaster, notify } from "@/registry/admin-toaster/admin-toaster"
import { UserMenu } from "@/registry/user-menu/user-menu"

const menuItems = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    onSelect: () => notify.info("Opened profile"),
  },
  {
    id: "sign-out",
    label: "Sign out",
    icon: LogOut,
    tone: "danger" as const,
    onSelect: () => notify.info("Signed out"),
  },
]

export function UserMenuVariantsView() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <div className="flex flex-col items-start gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          variant=&quot;icon&quot;
        </span>
        <UserMenu
          variant="icon"
          name="Alex Morgan"
          email="alex@example.com"
          side="bottom"
          align="start"
          items={menuItems}
        />
      </div>
      <div className="flex flex-col items-start gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          variant=&quot;row&quot; (default width)
        </span>
        <div className="w-56 rounded-xl bg-card p-2 ring-1 ring-foreground/10">
          <UserMenu
            variant="row"
            name="Alex Morgan"
            email="alex@example.com"
            side="bottom"
            align="start"
            items={menuItems}
          />
        </div>
      </div>
      <div className="flex flex-col items-start gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          variant=&quot;row&quot; (narrow — truncates instead of widening)
        </span>
        <div className="w-40 rounded-xl bg-card p-2 ring-1 ring-foreground/10">
          <UserMenu
            variant="row"
            name="Bartholomew Fitzgerald-Whitmore"
            email="bartholomew.fitzgerald-whitmore@example.com"
            side="bottom"
            align="start"
            items={menuItems}
          />
        </div>
      </div>
      <AdminToaster />
    </div>
  )
}

export function UserMenuView() {
  return (
    <div>
      <UserMenu
        name="Alex Morgan"
        email="alex@example.com"
        items={menuItems}
      />
      <AdminToaster />
    </div>
  )
}

export function UserMenuNoEmailView() {
  return (
    <div>
      <UserMenu name="Jordan Lee" items={menuItems} />
      <AdminToaster />
    </div>
  )
}
