"use client"

import { useId, type ComponentType } from "react"
import { ChevronsUpDown, User } from "lucide-react"

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
  const baseId = useId()
  const nameId = `${baseId}-name`
  const emailId = `${baseId}-email`
  const avatar = (
    <Avatar size="sm">
      {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
      <AvatarFallback className="text-foreground">
        <User className="size-3.5" />
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
              aria-labelledby={email ? `${nameId} ${emailId}` : nameId}
              className={cn(
                "h-auto w-full min-w-0 justify-start gap-2 px-2 py-1.5 text-left font-normal",
                className
              )}
            />
          ) : (
            <Button
              variant="outline"
              size="icon"
              aria-label={label}
              className={className}
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
              <span
                id={nameId}
                className="w-full truncate text-sm font-medium text-foreground"
              >
                {name}
              </span>
              {email ? (
                <span
                  id={emailId}
                  className="w-full truncate text-xs font-normal text-muted-foreground"
                >
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
