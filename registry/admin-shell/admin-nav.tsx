import type { ComponentType, ReactNode } from "react"

import { cn } from "@/lib/utils"

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
        "flex flex-col gap-1 py-2",
        collapsed ? "items-center" : "items-stretch px-3",
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
                "flex cursor-default items-center gap-2 rounded-md text-sm transition-colors",
                collapsed
                  ? "size-10 justify-center font-medium"
                  : "w-full justify-start px-3 py-2 font-normal",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              ),
              children: (
                <>
                  <span aria-hidden="true">
                    {Icon ? (
                      <Icon className="size-4 shrink-0" />
                    ) : collapsed ? (
                      item.title.charAt(0).toUpperCase()
                    ) : null}
                  </span>
                  <span className={cn(collapsed && "sr-only")}>
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
