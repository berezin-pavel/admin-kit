"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  ConfirmDialog,
  type ConfirmDialogProps,
} from "@/registry/confirm-dialog/confirm-dialog"

export function ConfirmDialogView({
  triggerLabel,
  title,
  description,
  tone = "default",
  simulateLoading = false,
}: {
  triggerLabel: string
  title: string
  description: string
  tone?: ConfirmDialogProps["tone"]
  simulateLoading?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        tone={tone}
        loading={loading}
        onConfirm={() => {
          if (!simulateLoading) {
            setOpen(false)
            return
          }
          setLoading(true)
          setTimeout(() => {
            setLoading(false)
            setOpen(false)
          }, 1500)
        }}
      />
    </>
  )
}
