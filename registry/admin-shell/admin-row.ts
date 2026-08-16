import { cn } from "@/lib/utils"

export const adminRowIconClassName =
  "flex size-6 shrink-0 items-center justify-center"

export function adminRowClassName(collapsed: boolean) {
  return cn(
    "flex items-center gap-2 rounded-md",
    collapsed ? "size-10 justify-center" : "h-9 w-full justify-start px-2"
  )
}

export const adminRowProfileClassName =
  "[&_[data-slot=user-menu]]:h-auto [&_[data-slot=user-menu]]:w-full [&_[data-slot=user-menu]]:px-[7px]"

export const adminRailProfileClassName =
  "flex justify-center [&_[data-slot=user-menu-chevron]]:hidden [&_[data-slot=user-menu-details]]:hidden [&_[data-slot=user-menu]]:size-10 [&_[data-slot=user-menu]]:justify-center [&_[data-slot=user-menu]]:rounded-md [&_[data-slot=user-menu]]:p-0"

export const adminNarrowProfileClassName =
  "[&_[data-slot=user-menu-chevron]]:hidden [&_[data-slot=user-menu-details]]:hidden [&_[data-slot=user-menu]]:size-8 [&_[data-slot=user-menu]]:justify-center [&_[data-slot=user-menu]]:rounded-md [&_[data-slot=user-menu]]:p-0"
