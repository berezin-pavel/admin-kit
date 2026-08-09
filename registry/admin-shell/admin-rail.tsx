import { cn } from "@/lib/utils"

import type { AdminNavItem, AdminNavLinkRenderer } from "./admin-nav"

export interface AdminRailProps {
  nav: readonly AdminNavItem[]
  activeHref: string
  renderLink?: AdminNavLinkRenderer
  className?: string
}

const defaultRenderLink: AdminNavLinkRenderer = ({
  href,
  className,
  children,
}) => (
  <a href={href} className={className}>
    {children}
  </a>
)

export function AdminRail({
  nav,
  activeHref,
  renderLink,
  className,
}: AdminRailProps) {
  const renderItem = renderLink ?? defaultRenderLink

  return (
    <nav
      aria-label="Sections"
      className={cn(
        "flex w-14 shrink-0 flex-col items-center gap-1 border-r border-sidebar-border bg-sidebar py-3 md:hidden",
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
                "flex size-10 items-center justify-center rounded-md text-sm font-medium transition-colors",
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
                      item.title.charAt(0).toUpperCase()
                    )}
                  </span>
                  <span className="sr-only">{item.title}</span>
                </>
              ),
            })}
          </div>
        )
      })}
    </nav>
  )
}
