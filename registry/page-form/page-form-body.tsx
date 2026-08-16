"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { cn } from "@/lib/utils"

import type { PageFormSection } from "./page-form"

const sectionColumnsClassName: Record<1 | 2 | 3, string> = {
  1: "",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
}

export interface PageFormBodyProps {
  sections: readonly PageFormSection[]
  onSubmit?: () => void
  onCancel?: () => void
  submitLabel: string
  cancelLabel: string
  submitting: boolean
}

export function PageFormBody({
  sections,
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel,
  submitting,
}: PageFormBodyProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.()
      }}
      aria-busy={submitting || undefined}
      className="flex flex-col gap-4"
    >
      {sections.map((section, index) => (
        <Card key={index}>
          {section.title || section.description ? (
            <CardHeader>
              {section.title ? (
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {section.title}
                </CardTitle>
              ) : null}
              {section.description ? (
                <CardDescription>{section.description}</CardDescription>
              ) : null}
            </CardHeader>
          ) : null}
          <CardContent>
            {section.columns && section.columns > 1 ? (
              <div
                className={cn(
                  "grid items-start gap-4",
                  sectionColumnsClassName[section.columns]
                )}
              >
                {section.children}
              </div>
            ) : (
              section.children
            )}
          </CardContent>
        </Card>
      ))}
      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={submitting}
        >
          {cancelLabel}
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
