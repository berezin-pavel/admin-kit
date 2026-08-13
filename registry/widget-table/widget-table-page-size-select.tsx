"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface WidgetTablePageSizeSelectProps {
  pageSize: number
  pageSizeOptions: readonly number[]
  onPageSizeChange: (pageSize: number) => void
  ariaLabel?: string
}

export function WidgetTablePageSizeSelect({
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  ariaLabel = "Rows per page",
}: WidgetTablePageSizeSelectProps) {
  return (
    <Select
      value={String(pageSize)}
      onValueChange={(value) => {
        if (value) {
          onPageSizeChange(Number(value))
        }
      }}
    >
      <SelectTrigger className="w-20" aria-label={ariaLabel}>
        <SelectValue>{pageSize}</SelectValue>
      </SelectTrigger>
      <SelectContent
        align="start"
        alignItemWithTrigger={false}
        className="w-auto min-w-(--anchor-width)"
      >
        {pageSizeOptions.map((size) => (
          <SelectItem key={size} value={String(size)}>
            {size}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
