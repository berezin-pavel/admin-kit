"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { WidgetTableSort, WidgetTableSortOption } from "./widget-table"

export interface WidgetTableSortSelectProps {
  sortOptions: readonly WidgetTableSortOption[]
  sort?: WidgetTableSort
  onSortChange: (sort: WidgetTableSort | undefined) => void
}

const NONE_VALUE = "none"

function isSameSort(a: WidgetTableSort, b: WidgetTableSort): boolean {
  return a.columnId === b.columnId && a.direction === b.direction
}

export function WidgetTableSortSelect({
  sortOptions,
  sort,
  onSortChange,
}: WidgetTableSortSelectProps) {
  const activeIndex = sort
    ? sortOptions.findIndex((option) => isSameSort(option.sort, sort))
    : -1
  const activeOption = activeIndex === -1 ? undefined : sortOptions[activeIndex]
  const value = activeOption ? String(activeIndex) : NONE_VALUE

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (!next || next === NONE_VALUE) {
          onSortChange(undefined)
          return
        }

        const option = sortOptions[Number(next)]
        if (option) {
          onSortChange(option.sort)
        }
      }}
    >
      <SelectTrigger className="w-44" aria-label="Sort">
        <SelectValue>{activeOption?.label ?? "No sorting"}</SelectValue>
      </SelectTrigger>
      <SelectContent align="start" alignItemWithTrigger={false}>
        <SelectItem value={NONE_VALUE}>No sorting</SelectItem>
        {sortOptions.map((option, index) => (
          <SelectItem key={index} value={String(index)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
