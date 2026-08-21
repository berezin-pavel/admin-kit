"use client"

import type { ComponentType } from "react"
import { Bell } from "lucide-react"

import { Badge } from "@/components/ui/badge"
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

export interface NotificationItem {
  id: string
  title: string
  description?: string
  timestamp?: string
  read?: boolean
  icon?: ComponentType<{ className?: string }>
}

export interface NotificationsMenuLabels {
  button?: string
  title?: string
  empty?: string
  markAllRead?: string
  unread?: (count: number) => string
  unreadItem?: string
}

export interface NotificationsMenuProps {
  notifications: readonly NotificationItem[]
  onSelect?: (id: string) => void
  onMarkAllRead?: () => void
  labels?: NotificationsMenuLabels
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  className?: string
}

export function NotificationsMenu({
  notifications,
  onSelect,
  onMarkAllRead,
  labels,
  side = "bottom",
  align = "end",
  className,
}: NotificationsMenuProps) {
  const buttonLabel = labels?.button ?? "Notifications"
  const titleLabel = labels?.title ?? "Notifications"
  const emptyLabel = labels?.empty ?? "You're all caught up"
  const markAllReadLabel = labels?.markAllRead ?? "Mark all as read"
  const unreadLabel = labels?.unread ?? ((count: number) => `${count} unread`)
  const unreadItemLabel = labels?.unreadItem ?? "Unread"

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length
  const triggerLabel =
    unreadCount > 0 ? `${buttonLabel}, ${unreadLabel(unreadCount)}` : buttonLabel

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-slot="notifications-menu"
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label={triggerLabel}
            className={cn("relative", className)}
          >
            <Bell className="size-4" />
            {unreadCount > 0 ? (
              <Badge
                aria-hidden="true"
                variant="destructive"
                className="absolute -top-1.5 -right-1.5 h-4 min-w-4 justify-center bg-destructive-mark px-1 text-[0.625rem] leading-none text-destructive-mark-foreground dark:bg-destructive-mark dark:text-destructive-mark-foreground"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            ) : null}
          </Button>
        }
      />
      <DropdownMenuContent side={side} align={align} className="w-88 p-1">
        <DropdownMenuGroup className="flex items-center justify-between gap-2 px-1.5 py-1.5">
          <DropdownMenuLabel className="p-0 text-sm font-medium text-popover-foreground">
            {titleLabel}
          </DropdownMenuLabel>
          {onMarkAllRead && unreadCount > 0 ? (
            <DropdownMenuItem
              closeOnClick={false}
              onClick={onMarkAllRead}
              className="h-6 w-auto shrink-0 gap-1 rounded-[10px] px-2 py-0 text-xs font-normal text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
            >
              {markAllReadLabel}
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            {emptyLabel}
          </p>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => {
              const Icon = notification.icon

              return (
                <DropdownMenuItem
                  key={notification.id}
                  data-read={notification.read ? "" : undefined}
                  className={cn(
                    "items-start gap-2 py-2",
                    !notification.read && "bg-destructive-mark/5"
                  )}
                  onClick={() => onSelect?.(notification.id)}
                >
                  <span
                    aria-hidden="true"
                    className="flex size-4 shrink-0 items-center justify-center pt-0.5"
                  >
                    {Icon ? (
                      <Icon
                        className={cn(
                          "size-4",
                          notification.read
                            ? "text-muted-foreground"
                            : "text-destructive-mark"
                        )}
                      />
                    ) : (
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          notification.read ? "bg-transparent" : "bg-destructive-mark"
                        )}
                      />
                    )}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "truncate text-sm",
                          notification.read ? "font-normal" : "font-semibold"
                        )}
                      >
                        {notification.title}
                      </span>
                      {!notification.read ? (
                        <>
                          <span className="sr-only">{unreadItemLabel}</span>
                          <span
                            aria-hidden="true"
                            className="size-1.5 shrink-0 rounded-full bg-destructive-mark"
                          />
                        </>
                      ) : null}
                    </span>
                    {notification.description ? (
                      <span className="line-clamp-2 text-xs text-muted-foreground">
                        {notification.description}
                      </span>
                    ) : null}
                    {notification.timestamp ? (
                      <span className="text-xs text-muted-foreground">
                        {notification.timestamp}
                      </span>
                    ) : null}
                  </span>
                </DropdownMenuItem>
              )
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
