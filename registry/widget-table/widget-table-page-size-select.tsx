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
}

export function WidgetTablePageSizeSelect({
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
}: WidgetTablePageSizeSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Show per page</span>
      <Select
        value={String(pageSize)}
        onValueChange={(value) => {
          if (value) {
            onPageSizeChange(Number(value))
          }
        }}
      >
        <SelectTrigger className="w-20">
          <SelectValue>{pageSize}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {pageSizeOptions.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
