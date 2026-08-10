"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination"

export interface WidgetTablePaginationControlsProps {
  page: number
  pageSize: number
  total: number
  onPageChange?: (page: number) => void
}

function getPageNumbers(
  page: number,
  pageCount: number
): readonly (number | "ellipsis")[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const keep = new Set(
    [1, pageCount, page - 1, page, page + 1].filter(
      (value) => value >= 1 && value <= pageCount
    )
  )
  const sorted = [...keep].sort((a, b) => a - b)

  return sorted.reduce<(number | "ellipsis")[]>((items, value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) {
      items.push("ellipsis")
    }
    items.push(value)
    return items
  }, [])
}

export function WidgetTablePaginationControls({
  page,
  pageSize,
  total,
  onPageChange,
}: WidgetTablePaginationControlsProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const pageNumbers = getPageNumbers(page, pageCount)

  return (
    <Pagination className="mx-0 w-fit">
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => onPageChange?.(page - 1)}
          >
            <ChevronLeft />
          </Button>
        </PaginationItem>
        {pageNumbers.map((item, index) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <Button
                variant={item === page ? "outline" : "ghost"}
                size="icon"
                aria-current={item === page ? "page" : undefined}
                onClick={() => onPageChange?.(item)}
              >
                {item}
              </Button>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next page"
            disabled={page >= pageCount}
            onClick={() => onPageChange?.(page + 1)}
          >
            <ChevronRight />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
