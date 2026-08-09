"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export interface AdminMenuProps {
  appName: string
  footer?: ReactNode
  children: ReactNode
}

export function AdminMenu({ appName, footer, children }: AdminMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation menu"
          />
        }
      >
        <Menu className="size-4" />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>{appName}</SheetTitle>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col">
          <div
            onClick={(event) => {
              if (
                event.target instanceof Element &&
                event.target.closest("a")
              ) {
                setOpen(false)
              }
            }}
          >
            {children}
          </div>
          {footer ? (
            <div className="mt-auto flex items-center gap-2 border-t border-sidebar-border p-3">
              {footer}
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
