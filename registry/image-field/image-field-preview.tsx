"use client"

import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import type { ImageFieldItem } from "./image-field"

export interface ImageFieldPreviewProps {
  items: readonly ImageFieldItem[]
  index: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
  imageName: (index: number) => string
  openInNewTabLabel: string
  previousLabel: string
  nextLabel: string
  counterLabel: (index: number, total: number) => string
}

export function ImageFieldPreview({
  items,
  index,
  onIndexChange,
  onClose,
  imageName,
  openInNewTabLabel,
  previousLabel,
  nextLabel,
  counterLabel,
}: ImageFieldPreviewProps) {
  const item = index === null ? undefined : items[index]
  const name = index === null ? "" : (item?.name ?? imageName(index))
  const hasSiblings = items.length > 1

  const step = (direction: -1 | 1) => {
    if (index === null) return
    onIndexChange((index + direction + items.length) % items.length)
  }

  return (
    <Dialog
      open={item !== undefined}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent
        className="sm:max-w-3xl"
        onKeyDown={(event) => {
          if (!hasSiblings) return

          if (event.key === "ArrowLeft") {
            event.preventDefault()
            step(-1)
          }

          if (event.key === "ArrowRight") {
            event.preventDefault()
            step(1)
          }
        }}
      >
        <DialogHeader className="flex-row items-center gap-2 pr-8">
          <DialogTitle className="min-w-0 flex-1 truncate">{name}</DialogTitle>
          {hasSiblings && index !== null ? (
            <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
              {counterLabel(index, items.length)}
            </span>
          ) : null}
          {item ? (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={openInNewTabLabel}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                "shrink-0 cursor-default"
              )}
            >
              <ExternalLink />
            </a>
          ) : null}
        </DialogHeader>
        {item ? (
          <div className="relative">
            <img
              src={item.url}
              alt={name}
              className="max-h-[70svh] w-full rounded-lg object-contain"
            />
            {hasSiblings ? (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  aria-label={previousLabel}
                  onClick={() => step(-1)}
                  className="absolute top-1/2 left-2 -translate-y-1/2"
                >
                  <ChevronLeft />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  aria-label={nextLabel}
                  onClick={() => step(1)}
                  className="absolute top-1/2 right-2 -translate-y-1/2"
                >
                  <ChevronRight />
                </Button>
              </>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
