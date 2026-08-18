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

export interface PageEntityProps {
  blockId?: string
  title: string
  description?: string
  actions?: ReactNode
  breadcrumbs?: ReactNode
  sections: readonly PageEntitySection[]
  status?: PageStatus
  className?: string
}

export function PageEntity({
  blockId,
  title,
  description,
  actions,
  breadcrumbs,
  sections,
  status = "ready",
  className,
}: PageEntityProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <PageHeader
        title={title}
        description={description}
        actions={actions}
        breadcrumbs={breadcrumbs}
        blockId={blockId ? `${blockId}.header` : undefined}
      />
      {status === "loading" ? (
        <StateLoading />
      ) : status === "error" ? (
        <StateError />
      ) : status === "forbidden" ? (
        <StateForbidden />
      ) : status === "offline" ? (
        <StateOffline />
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">
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
