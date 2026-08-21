import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { PageHeader } from "@/registry/page-header/page-header"
import { StateError } from "@/registry/state-error/state-error"
import { StateForbidden } from "@/registry/state-forbidden/state-forbidden"
import { StateLoading } from "@/registry/state-loading/state-loading"
import { StateOffline } from "@/registry/state-offline/state-offline"

import { PageFormBody } from "./page-form-body"

export interface PageFormSection {
  id?: string
  title?: string
  description?: string
  columns?: 1 | 2 | 3
  children: ReactNode
}

export type PageStatus = "ready" | "loading" | "error" | "forbidden" | "offline"

export interface PageStatusLabels {
  loading?: { label?: string }
  error?: { title?: string; description?: string }
  forbidden?: { title?: string; description?: string }
  offline?: { title?: string; description?: string }
}

export interface PageStateActions {
  error?: ReactNode
  forbidden?: ReactNode
  offline?: ReactNode
}

export interface PageFormProps {
  blockId?: string
  header?: boolean
  title: string
  description?: string
  actions?: ReactNode
  breadcrumbs?: ReactNode
  sections: readonly PageFormSection[]
  onSubmit?: () => void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  submitting?: boolean
  status?: PageStatus
  stateLabels?: PageStatusLabels
  stateActions?: PageStateActions
  className?: string
}

export function PageForm({
  blockId,
  header = true,
  title,
  description,
  actions,
  breadcrumbs,
  sections,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  submitting = false,
  status = "ready",
  stateLabels,
  stateActions,
  className,
}: PageFormProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {header ? (
        <PageHeader
          title={title}
          description={description}
          actions={actions}
          breadcrumbs={breadcrumbs}
          blockId={blockId ? `${blockId}.header` : undefined}
        />
      ) : null}
      {status === "loading" ? (
        <StateLoading {...stateLabels?.loading} />
      ) : status === "error" ? (
        <StateError {...stateLabels?.error} actions={stateActions?.error} />
      ) : status === "forbidden" ? (
        <StateForbidden
          {...stateLabels?.forbidden}
          actions={stateActions?.forbidden}
        />
      ) : status === "offline" ? (
        <StateOffline
          {...stateLabels?.offline}
          actions={stateActions?.offline}
        />
      ) : (
        <PageFormBody
          blockId={blockId}
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
