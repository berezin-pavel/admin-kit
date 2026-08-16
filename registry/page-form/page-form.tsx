import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { StateError } from "@/registry/state-error/state-error"
import { StateForbidden } from "@/registry/state-forbidden/state-forbidden"
import { StateLoading } from "@/registry/state-loading/state-loading"
import { StateOffline } from "@/registry/state-offline/state-offline"

import { PageFormBody } from "./page-form-body"

export interface PageFormSection {
  title?: string
  description?: string
  columns?: 1 | 2 | 3
  children: ReactNode
}

export type PageStatus = "ready" | "loading" | "error" | "forbidden" | "offline"

export interface PageFormProps {
  title: string
  description?: string
  actions?: ReactNode
  sections: readonly PageFormSection[]
  onSubmit?: () => void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  submitting?: boolean
  status?: PageStatus
  className?: string
}

export function PageForm({
  title,
  description,
  actions,
  sections,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  submitting = false,
  status = "ready",
  className,
}: PageFormProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
      {status === "loading" ? (
        <StateLoading />
      ) : status === "error" ? (
        <StateError />
      ) : status === "forbidden" ? (
        <StateForbidden />
      ) : status === "offline" ? (
        <StateOffline />
      ) : (
        <PageFormBody
          sections={sections}
          onSubmit={onSubmit}
          onCancel={onCancel}
          submitLabel={submitLabel}
          cancelLabel={cancelLabel}
          submitting={submitting}
        />
      )}
    </div>
  )
}
