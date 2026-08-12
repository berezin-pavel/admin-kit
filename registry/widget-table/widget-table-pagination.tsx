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
  previousLabel?: string
  nextLabel?: string
}

const BOUNDARY_COUNT = 1
const SIBLING_COUNT = 1
const MAX_VISIBLE_PAGES = BOUNDARY_COUNT * 2 + SIBLING_COUNT * 2 + 3

function range(start: number, end: number): number[] {
  if (end < start) {
    return []
  }
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

function getPageNumbers(
  page: number,
  pageCount: number
): readonly (number | "ellipsis")[] {
  if (pageCount <= MAX_VISIBLE_PAGES) {
    return range(1, pageCount)
  }

  const startPages = range(1, BOUNDARY_COUNT)
  const endPages = range(pageCount - BOUNDARY_COUNT + 1, pageCount)

  const siblingsStart = Math.max(
    Math.min(
      page - SIBLING_COUNT,
      pageCount - BOUNDARY_COUNT - SIBLING_COUNT * 2 - 1
    ),
    BOUNDARY_COUNT + 2
  )
  const siblingsEnd = Math.min(
    Math.max(page + SIBLING_COUNT, BOUNDARY_COUNT + SIBLING_COUNT * 2 + 2),
    (endPages[0] ?? pageCount) - 2
  )

  const items: (number | "ellipsis")[] = [...startPages]

  if (siblingsStart > BOUNDARY_COUNT + 2) {
    items.push("ellipsis")
  } else if (BOUNDARY_COUNT + 1 < pageCount - BOUNDARY_COUNT) {
    items.push(BOUNDARY_COUNT + 1)
  }

  items.push(...range(siblingsStart, siblingsEnd))

  if (siblingsEnd < pageCount - BOUNDARY_COUNT - 1) {
    items.push("ellipsis")
  } else if (pageCount - BOUNDARY_COUNT > BOUNDARY_COUNT) {
    items.push(pageCount - BOUNDARY_COUNT)
  }

  items.push(...endPages)

  return items
}

export function WidgetTablePaginationControls({
  page,
  pageSize,
  total,
  onPageChange,
  previousLabel = "Previous page",
  nextLabel = "Next page",
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
            aria-label={previousLabel}
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
            aria-label={nextLabel}
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
