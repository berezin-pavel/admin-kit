"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { AdminToaster, notify } from "@/registry/admin-toaster/admin-toaster"
import { FormDialog } from "@/registry/form-dialog/form-dialog"
import { NumberField } from "@/registry/number-field/number-field"
import { TextField } from "@/registry/text-field/text-field"

export function FormDialogView({ simulateSaving }: { simulateSaving?: boolean }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState("Pulse Headphones")
  const [price, setPrice] = useState("850")

  return (
    <div>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Edit product
      </Button>
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title="Edit product"
        description="Name and price update right after saving"
        submitting={saving}
        onSubmit={() => {
          if (!simulateSaving) {
            setOpen(false)
            notify.success("Product updated")
            return
          }

          setSaving(true)
          window.setTimeout(() => {
            setSaving(false)
            setOpen(false)
            notify.success("Product updated")
          }, 900)
        }}
      >
        <TextField label="Name" value={name} onChange={setName} />
        <NumberField label="Price" value={price} onChange={setPrice} min={0} />
      </FormDialog>
      <AdminToaster />
    </div>
  )
}
