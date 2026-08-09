import { cn } from "@/lib/utils"

export interface WidgetPlaceholderProps {
  title?: string
  hint?: string
  className?: string
}

export function WidgetPlaceholder({
  title = "Widget goes here",
  hint = "Space reserved, no widget selected yet",
  className,
}: WidgetPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed px-6 py-12 text-center",
        className
      )}
    >
      <span className="text-sm font-medium text-muted-foreground">{title}</span>
      <span className="text-sm text-muted-foreground/70">{hint}</span>
    </div>
  )
}
