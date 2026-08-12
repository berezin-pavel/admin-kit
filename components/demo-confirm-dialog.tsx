"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/registry/confirm-dialog/confirm-dialog"
import { localeRu } from "@/registry/locale-ru/locale-ru"

import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"

export function DemoConfirmDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const locale = useDemoLocale()
  const strings = demoDictionary[locale].confirmDialogDemo

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => setOpen(true)}>
        {strings.triggerLabel}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={strings.title}
        description={strings.description}
        tone="danger"
        confirmLabel={strings.confirmLabel}
        cancelLabel={locale === "ru" ? localeRu.confirmDialog.cancelLabel : undefined}
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
