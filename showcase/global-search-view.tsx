"use client"

import { useState } from "react"
import {
  CreditCard,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  Package,
  Plus,
  Settings,
  ShoppingCart,
  Tags,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react"

import {
  GlobalSearch,
  type GlobalSearchItem,
} from "@/registry/global-search/global-search"

const items: readonly GlobalSearchItem[] = [
  {
    id: "overview",
    label: "Overview",
    group: "Sections",
    icon: LayoutDashboard,
    hint: "/overview",
  },
  {
    id: "orders",
    label: "Orders",
    group: "Sections",
    icon: ShoppingCart,
    hint: "/orders",
  },
  {
    id: "products",
    label: "Products",
    group: "Sections",
    icon: Package,
    hint: "/products",
  },
  {
    id: "customers",
    label: "Customers",
    group: "Sections",
    icon: Users,
    hint: "/customers",
  },
  {
    id: "payouts",
    label: "Payouts",
    group: "Sections",
    icon: Wallet,
    hint: "/payouts",
  },
  {
    id: "new-order",
    label: "New order",
    group: "Actions",
    icon: Plus,
    hint: "⌘N",
  },
  {
    id: "new-product",
    label: "New product",
    group: "Actions",
    icon: Tags,
  },
  {
    id: "invite",
    label: "Invite a teammate",
    group: "Actions",
    icon: UserPlus,
  },
  {
    id: "refund",
    label: "Refund an order",
    group: "Actions",
    icon: CreditCard,
  },
  {
    id: "settings",
    label: "Workspace settings",
    icon: Settings,
    hint: "/settings",
  },
  {
    id: "docs",
    label: "Documentation",
    icon: FileText,
  },
  {
    id: "support",
    label: "Contact support",
    icon: LifeBuoy,
  },
]

export function GlobalSearchView({
  variant,
  hotkey = true,
}: {
  variant: "field" | "icon"
  hotkey?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <GlobalSearch
        items={items}
        variant={variant}
        hotkey={hotkey}
        open={open}
        onOpenChange={setOpen}
        onSelect={setPicked}
      />
      <p className="text-sm text-muted-foreground">
        {picked ? `Picked: ${picked}` : "Nothing picked yet"}
      </p>
    </div>
  )
}
