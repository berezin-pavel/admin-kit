"use client"

import { LogOut, User } from "lucide-react"

import { AdminToaster, notify } from "@/registry/admin-toaster/admin-toaster"
import { UserMenu } from "@/registry/user-menu/user-menu"

export function UserMenuView() {
  return (
    <div>
      <UserMenu
        name="Alex Morgan"
        email="alex@example.com"
        items={[
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
            tone: "danger",
            onSelect: () => notify.info("Signed out"),
          },
        ]}
      />
      <AdminToaster />
    </div>
  )
}

export function UserMenuNoEmailView() {
  return (
    <div>
      <UserMenu
        name="Jordan Lee"
        items={[
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
            tone: "danger",
            onSelect: () => notify.info("Signed out"),
          },
        ]}
      />
      <AdminToaster />
    </div>
  )
}
