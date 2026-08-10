"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/registry/confirm-dialog/confirm-dialog"

export function DemoConfirmDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Delete order
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete order #1042?"
        description="The order and its related data will be deleted with no way to restore them. The customer will receive a cancellation email."
        tone="danger"
        confirmLabel="Delete"
        loading={loading}
        onConfirm={() => {
          setLoading(true)
          setTimeout(() => {
            setLoading(false)
            setOpen(false)
          }, 1500)
        }}
      />
    </div>
  )
}
