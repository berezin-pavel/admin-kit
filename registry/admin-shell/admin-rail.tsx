import { cn } from "@/lib/utils"

import type { AdminNavItem, AdminNavLinkRenderer } from "./admin-nav"

export interface AdminRailProps {
  nav: readonly AdminNavItem[]
  activeHref: string
  renderLink?: AdminNavLinkRenderer
  className?: string
}

export function AdminRail({
  nav,
  activeHref,
  renderLink,
  className,
}: AdminRailProps) {
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
        const defaultRenderLink: AdminNavLinkRenderer = ({
          href,
          className: linkClassName,
          children,
        }) => (
          <a href={href} className={linkClassName} aria-label={item.title}>
            {children}
          </a>
        )
        const renderItem = renderLink ?? defaultRenderLink

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
                  {Icon ? (
                    <Icon className="size-4 shrink-0" />
                  ) : (
                    item.title.charAt(0).toUpperCase()
                  )}
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
