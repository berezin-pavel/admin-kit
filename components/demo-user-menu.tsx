"use client"

import { LogOut, User } from "lucide-react"

import { notify } from "@/registry/admin-toaster/admin-toaster"
import { localeRu } from "@/registry/locale-ru/locale-ru"
import { UserMenu } from "@/registry/user-menu/user-menu"

import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"

const NAME = "Alex Morgan"
const EMAIL = "alex@example.com"

export function DemoUserMenu() {
  const locale = useDemoLocale()
  const strings = demoDictionary[locale].userMenu

  return (
    <UserMenu
      name={NAME}
      email={EMAIL}
      items={[
        {
          id: "profile",
          label: strings.profileAction,
          icon: User,
          onSelect: () => notify.info(strings.profileToastTitle),
        },
        {
          id: "sign-out",
          label: strings.signOutAction,
          icon: LogOut,
          tone: "danger",
          onSelect: () => notify.info(strings.signOutToastTitle),
        },
      ]}
      label={locale === "ru" ? localeRu.userMenu.label : undefined}
      side="bottom"
      align="end"
    />
  )
}
