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
  responsive?: boolean
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
  responsive = false,
  className,
  sectionsLabel = "Sections",
}: AdminNavProps) {
  const renderItem = renderLink ?? renderNavLink
  const isExpanded = !collapsed && !responsive
  const collapsesAtMd = responsive && !collapsed

  return (
    <nav
      aria-label={sectionsLabel}
      className={cn(
        "flex flex-col gap-1 py-2",
        isExpanded ? "items-stretch px-3" : "items-center",
        collapsesAtMd && "md:items-stretch md:px-3",
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
                "flex items-center gap-2 rounded-md text-sm font-medium transition-colors",
                !isExpanded && "size-10 justify-center",
                isExpanded && "w-full justify-start px-3 py-2 font-normal",
                collapsesAtMd &&
                  "md:h-auto md:w-full md:justify-start md:px-3 md:py-2 md:font-normal",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              ),
              children: (
                <>
                  <span aria-hidden="true">
                    {Icon ? (
                      <Icon className="size-4 shrink-0" />
                    ) : (
                      <span
                        className={cn(
                          isExpanded && "hidden",
                          collapsesAtMd && "md:hidden"
                        )}
                      >
                        {item.title.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </span>
                  <span
                    className={cn(
                      !isExpanded && "sr-only",
                      collapsesAtMd && "md:not-sr-only"
                    )}
                  >
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
