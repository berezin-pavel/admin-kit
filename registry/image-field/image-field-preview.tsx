"use client"

import { ExternalLink } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import type { ImageFieldItem } from "./image-field"

export interface ImageFieldPreviewProps {
  item?: ImageFieldItem
  name: string
  openInNewTabLabel: string
  onClose: () => void
}

export function ImageFieldPreview({
  item,
  name,
  openInNewTabLabel,
  onClose,
}: ImageFieldPreviewProps) {
  return (
    <Dialog
      open={item !== undefined}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="truncate">{name}</DialogTitle>
        </DialogHeader>
        {item ? (
          <>
            <img
              src={item.url}
              alt={name}
              className="max-h-[70svh] w-full rounded-lg object-contain"
            />
            <div className="flex justify-end">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer noopener"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "cursor-default"
                )}
              >
                <ExternalLink />
                {openInNewTabLabel}
              </a>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
