import type { ReactNode } from "react"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Block } from "@/registry/admin-appearance/block"
import { PageHeader } from "@/registry/page-header/page-header"
import { StateError } from "@/registry/state-error/state-error"
import { StateForbidden } from "@/registry/state-forbidden/state-forbidden"
import { StateLoading } from "@/registry/state-loading/state-loading"
import { StateOffline } from "@/registry/state-offline/state-offline"

export interface PageEntityField {
  id: string
  label: ReactNode
  value: ReactNode
}

export interface PageEntitySection {
  id: string
  title?: string
  columns?: 1 | 2 | 3
  fields: readonly PageEntityField[]
}

const sectionColumnsClassName: Record<1 | 2 | 3, string> = {
  1: "",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
}

export type PageStatus = "ready" | "loading" | "error" | "forbidden" | "offline"

export interface PageStatusLabels {
  loading?: { label?: string }
  error?: { title?: string }
  forbidden?: { title?: string }
  offline?: { title?: string }
}

export interface PageEntityProps {
  blockId?: string
  header?: boolean
  combined?: boolean
  title: string
  description?: string
  actions?: ReactNode
  breadcrumbs?: ReactNode
  sections: readonly PageEntitySection[]
  status?: PageStatus
  stateLabels?: PageStatusLabels
  className?: string
}

export function PageEntity({
  blockId,
  header = true,
  combined = false,
  title,
  description,
  actions,
  breadcrumbs,
  sections,
  status = "ready",
  stateLabels,
  className,
}: PageEntityProps) {
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
        <StateError {...stateLabels?.error} />
      ) : status === "forbidden" ? (
        <StateForbidden {...stateLabels?.forbidden} />
      ) : status === "offline" ? (
        <StateOffline {...stateLabels?.offline} />
      ) : combined ? (
        <Block id={blockId ? `${blockId}.details` : undefined} headings>
          {sections.map((section) => (
            <div
              key={section.id}
              className="flex flex-col gap-4 [&:not(:first-child)]:pt-2"
            >
              {section.title ? (
                <CardHeader>
                  <CardTitle className="text-[0.84375rem] font-semibold">
                    {section.title}
                  </CardTitle>
                </CardHeader>
              ) : null}
              <CardContent>
                <dl
                  className={cn(
                    "grid grid-cols-1 gap-x-6 gap-y-3",
                    sectionColumnsClassName[section.columns ?? 2]
                  )}
                >
                  {section.fields.map((field) => (
                    <div key={field.id} className="flex flex-col gap-1">
                      <dt className="text-sm text-muted-foreground">
                        {field.label}
                      </dt>
                      <dd className="text-sm">{field.value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </div>
          ))}
        </Block>
      ) : (
        <div className="flex flex-col gap-4">
          {sections.map((section) => (
            <Block
              key={section.id}
              id={blockId ? `${blockId}.${section.id}` : undefined}
              headings
            >
              {section.title ? (
                <CardHeader>
                  <CardTitle className="text-[0.84375rem] font-semibold">
                    {section.title}
                  </CardTitle>
                </CardHeader>
              ) : null}
              <CardContent>
                <dl
                  className={cn(
                    "grid grid-cols-1 gap-x-6 gap-y-3",
                    sectionColumnsClassName[section.columns ?? 2]
                  )}
                >
                  {section.fields.map((field) => (
                    <div key={field.id} className="flex flex-col gap-0.5">
                      <dt className="text-sm text-muted-foreground">
                        {field.label}
                      </dt>
                      <dd className="text-sm">{field.value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Block>
          ))}
        </div>
      )}
    </div>
  )
}
