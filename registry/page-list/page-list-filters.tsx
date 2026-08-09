"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { PageListFilter } from "./page-list"

export interface PageListFiltersProps {
  filters: readonly PageListFilter[]
  onFilterChange?: (id: string, value: string) => void
}

export function PageListFilters({
  filters,
  onFilterChange,
}: PageListFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      {filters.map((filter) => {
        const controlId = `page-list-filter-${filter.id}`

        return (
          <div key={filter.id} className="flex flex-col gap-1.5">
            <Label
              htmlFor={controlId}
              className="text-xs text-muted-foreground"
            >
              {filter.label}
            </Label>
            {filter.kind === "search" ? (
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id={controlId}
                  value={filter.value}
                  onChange={(event) =>
                    onFilterChange?.(filter.id, event.target.value)
                  }
                  placeholder={filter.label}
                  className="w-48 pl-8"
                />
              </div>
            ) : (
              <Select
                value={filter.value}
                onValueChange={(value) =>
                  onFilterChange?.(filter.id, value ?? "")
                }
              >
                <SelectTrigger id={controlId} className="w-48">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )
      })}
    </div>
  )
}
