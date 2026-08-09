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
  className?: string
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
  className,
}: AdminNavProps) {
  const renderItem = renderLink ?? renderNavLink

  return (
    <nav className={cn("flex flex-col gap-1 p-3", className)}>
      {nav.map((item) => {
        const isActive = item.href === activeHref
        const Icon = item.icon

        return (
          <div key={item.href} aria-current={isActive ? "page" : undefined}>
            {renderItem({
              href: item.href,
              isActive,
              className: cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              ),
              children: (
                <>
                  {Icon ? <Icon className="size-4 shrink-0" /> : null}
                  {item.title}
                </>
              ),
            })}
          </div>
        )
      })}
    </nav>
  )
}
