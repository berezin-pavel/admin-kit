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
  children: ReactNode
}

export function AdminMenu({ appName, children }: AdminMenuProps) {
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
        <div
          onClick={(event) => {
            if (event.target instanceof Element && event.target.closest("a")) {
              setOpen(false)
            }
          }}
        >
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}
