"use client"

import type { ComponentType } from "react"
import { ChevronsUpDown } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface UserMenuItem {
  id: string
  label: string
  icon?: ComponentType<{ className?: string }>
  tone?: "default" | "danger"
  onSelect: () => void
}

export interface UserMenuProps {
  name: string
  email?: string
  avatarUrl?: string
  items: readonly UserMenuItem[]
  label?: string
  variant?: "icon" | "row"
  side?: "top" | "bottom"
  align?: "start" | "end"
  className?: string
}

export function getUserMenuInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
}

export function UserMenu({
  name,
  email,
  avatarUrl,
  items,
  label = "Open user menu",
  variant = "icon",
  side = "top",
  align = "start",
  className,
}: UserMenuProps) {
  const avatar = (
    <Avatar size="sm">
      {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
      <AvatarFallback className="font-medium text-foreground">
        {getUserMenuInitials(name)}
      </AvatarFallback>
    </Avatar>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-slot="user-menu"
        render={
          variant === "row" ? (
            <Button
              variant="ghost"
              className={cn(
                "h-auto w-full min-w-0 justify-start gap-2 px-2 py-1.5 text-left font-normal",
                className
              )}
            />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              aria-label={label}
              className={cn("rounded-full p-0", className)}
            />
          )
        }
      >
        {variant === "row" ? (
          <>
            {avatar}
            <span
              data-slot="user-menu-details"
              className="flex min-w-0 flex-1 flex-col items-start overflow-hidden"
            >
              <span className="w-full truncate text-sm font-medium text-foreground">
                {name}
              </span>
              {email ? (
                <span className="w-full truncate text-xs font-normal text-muted-foreground">
                  {email}
                </span>
              ) : null}
            </span>
            <ChevronsUpDown
              data-slot="user-menu-chevron"
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
          </>
        ) : (
          avatar
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5 px-1.5 py-1.5">
            <span className="font-medium text-popover-foreground">{name}</span>
            {email ? (
              <span className="text-xs font-normal text-muted-foreground">
                {email}
              </span>
            ) : null}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {items.map((item) => {
          const Icon = item.icon

          return (
            <DropdownMenuItem
              key={item.id}
              variant={item.tone === "danger" ? "destructive" : "default"}
              onClick={item.onSelect}
            >
              {Icon ? <Icon className="size-4" /> : null}
              {item.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
