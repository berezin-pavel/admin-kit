import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export interface StateLoadingProps {
  rows?: number
  label?: string
  className?: string
}

export function StateLoading({
  rows = 3,
  label = "Loading",
  className,
}: StateLoadingProps) {
  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      role="status"
      aria-busy="true"
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-9 w-full" />
      ))}
    </div>
  )
}
