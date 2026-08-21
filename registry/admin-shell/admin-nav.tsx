import type { ComponentType, ReactNode } from "react"

import { cn } from "@/lib/utils"

import { adminRowClassName, adminRowIconClassName } from "./admin-row"

export interface AdminNavItem {
  href: string
  title: string
  icon?: ComponentType<{ className?: string }>
  group?: string
}

export interface AdminNavLinkProps {
  href: string
  isActive: boolean
  className: string
  children: ReactNode
  "aria-current": "page" | undefined
}

export type AdminNavLinkRenderer = (props: AdminNavLinkProps) => ReactNode

export interface AdminNavProps {
  nav: readonly AdminNavItem[]
  activeHref: string
  renderLink?: AdminNavLinkRenderer
  collapsed?: boolean
  className?: string
  sectionsLabel?: string
}

const renderNavLink: AdminNavLinkRenderer = ({
  href,
  className,
  children,
  "aria-current": ariaCurrent,
}) => (
  <a href={href} className={className} aria-current={ariaCurrent}>
    {children}
  </a>
)

export function AdminNav({
  nav,
  activeHref,
  renderLink,
  collapsed = false,
  className,
  sectionsLabel = "Sections",
}: AdminNavProps) {
  const renderItem = renderLink ?? renderNavLink

  return (
    <nav
      aria-label={sectionsLabel}
      className={cn(
        "flex flex-col gap-1 px-2 py-2",
        collapsed ? "items-center" : "items-stretch",
        className
      )}
    >
      {nav.map((item, index) => {
        const isActive = item.href === activeHref
        const Icon = item.icon
        const startsGroup =
          item.group !== undefined && item.group !== nav[index - 1]?.group

        return (
          <div key={item.href}>
            {startsGroup ? (
              <div
                className={cn(
                  "px-3 pb-1 text-xs font-medium tracking-wide text-sidebar-foreground uppercase",
                  index > 0 && "pt-3",
                  collapsed && "sr-only"
                )}
              >
                {item.group}
              </div>
            ) : null}
            {startsGroup && collapsed && index > 0 ? (
              <div
                aria-hidden="true"
                className="mx-auto my-1 h-px w-6 bg-sidebar-border"
              />
            ) : null}
            {renderItem({
              href: item.href,
              isActive,
              "aria-current": isActive ? "page" : undefined,
              className: cn(
                "cursor-default text-[0.9375rem] transition-colors",
                adminRowClassName(collapsed),
                isActive
                  ? "bg-sidebar-active font-semibold text-sidebar-active-foreground"
                  : "font-medium text-sidebar-foreground hover:bg-sidebar-accent/50"
              ),
              children: (
                <>
                  {Icon || collapsed ? (
                    <span aria-hidden="true" className={adminRowIconClassName}>
                      {Icon ? (
                        <Icon className="size-[1.125rem]" />
                      ) : (
                        item.title.charAt(0).toUpperCase()
                      )}
                    </span>
                  ) : null}
                  <span className={cn("truncate", collapsed && "sr-only")}>
                    {item.title}
                  </span>
                </>
              ),
            })}
          </div>
        )
      })}
    </nav>
  )
}
