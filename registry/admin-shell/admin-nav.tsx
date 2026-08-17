import type { ComponentType, ReactNode } from "react"

import { cn } from "@/lib/utils"

import { adminRowClassName, adminRowIconClassName } from "./admin-row"

export interface AdminNavItem {
  href: string
  title: string
  icon?: ComponentType<{ className?: string }>
}

export interface AdminNavLinkProps {
  href: string
  isActive: boolean
  className: string
  children: ReactNode
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

const renderNavLink: AdminNavLinkRenderer = ({ href, className, children }) => (
  <a href={href} className={className}>
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
      {nav.map((item) => {
        const isActive = item.href === activeHref
        const Icon = item.icon

        return (
          <div key={item.href} aria-current={isActive ? "page" : undefined}>
            {renderItem({
              href: item.href,
              isActive,
              className: cn(
                "cursor-default text-sm font-normal transition-colors",
                adminRowClassName(collapsed),
                isActive
                  ? "bg-sidebar-active text-sidebar-active-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              ),
              children: (
                <>
                  {Icon || collapsed ? (
                    <span aria-hidden="true" className={adminRowIconClassName}>
                      {Icon ? (
                        <Icon className="size-4" />
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
