"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { PageFormSection } from "./page-form"

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
      className="flex flex-col gap-6"
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
          <CardContent>{section.children}</CardContent>
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
