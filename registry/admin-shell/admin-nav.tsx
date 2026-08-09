import { cn } from "@/lib/utils"

export interface AdminNavItem {
  href: string
  title: string
}

export function AdminNav({
  items,
  activeHref,
}: {
  items: readonly AdminNavItem[]
  activeHref: string
}) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          aria-current={item.href === activeHref ? "page" : undefined}
          className={cn(
            "rounded-md px-3 py-2 text-sm transition-colors",
            item.href === activeHref
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          {item.title}
        </a>
      ))}
    </nav>
  )
}
