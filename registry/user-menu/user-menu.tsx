"use client"

import type { ComponentType } from "react"

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
  className,
}: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label={label}
            className={className}
          />
        }
      >
        {avatarUrl ? (
          <Avatar size="sm">
            <AvatarImage src={avatarUrl} alt="" />
            <AvatarFallback>{getUserMenuInitials(name)}</AvatarFallback>
          </Avatar>
        ) : (
          <span className="text-[10px] font-semibold tracking-wide">
            {getUserMenuInitials(name)}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start">
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
