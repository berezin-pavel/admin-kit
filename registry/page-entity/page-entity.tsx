import type { ReactNode } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
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
  fields: readonly PageEntityField[]
}

export type PageStatus = "ready" | "loading" | "error" | "forbidden" | "offline"

export interface PageEntityProps {
  title: string
  description?: string
  actions?: ReactNode
  sections: readonly PageEntitySection[]
  status?: PageStatus
  className?: string
}

export function PageEntity({
  title,
  description,
  actions,
  sections,
  status = "ready",
  className,
}: PageEntityProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
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
        <div className="flex flex-col gap-6">
          {sections.map((section) => (
            <Card key={section.id}>
              {section.title ? (
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {section.title}
                  </CardTitle>
                </CardHeader>
              ) : null}
              <CardContent>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
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
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
