"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { adminThemeToCss } from "@/registry/admin-theme-tokens/admin-theme-css"
import type {
  AdminTheme,
  AdminThemeSources,
} from "@/registry/admin-theme-tokens/admin-theme-tokens"
import { ColorField } from "@/registry/color-field/color-field"
import { NumberField } from "@/registry/number-field/number-field"

import { ThemeEditorGradients } from "./theme-editor-gradients"

export interface ThemeEditorLabels {
  brand?: string
  surface?: string
  success?: string
  warning?: string
  danger?: string
  radius?: string
  sourcesTitle?: string
  gradientsTitle?: string
  addGradient?: string
  gradientPresetsLabel?: string
  addGradientPreset?: string
  gradientName?: string
  gradientAngle?: string
  gradientFrom?: string
  gradientVia?: string
  gradientTo?: string
  lightScheme?: string
  darkScheme?: string
  suggestDark?: string
  removeGradient?: string
  removeGradientTitle?: string
  removeGradientDescription?: string
  contrastWarning?: string
  cssTitle?: string
  copyCss?: string
  copiedCss?: string
}

export const themeEditorLabelDefaults: Required<ThemeEditorLabels> = {
  brand: "Brand",
  surface: "Surface",
  success: "Success",
  warning: "Warning",
  danger: "Danger",
  radius: "Corner radius",
  sourcesTitle: "Colors",
  gradientsTitle: "Gradients",
  addGradient: "Add gradient",
  gradientPresetsLabel: "Presets",
  addGradientPreset: "Add preset",
  gradientName: "Name",
  gradientAngle: "Angle",
  gradientFrom: "From",
  gradientVia: "Via",
  gradientTo: "To",
  lightScheme: "Light",
  darkScheme: "Dark",
  suggestDark: "Suggest dark",
  removeGradient: "Remove",
  removeGradientTitle: "Remove gradient",
  removeGradientDescription:
    "This removes the gradient from the theme. This can't be undone.",
  contrastWarning: "Contrast is too low for readable text",
  cssTitle: "CSS output",
  copyCss: "Copy CSS",
  copiedCss: "Copied",
}

export interface ThemeEditorProps {
  value: AdminTheme
  onChange: (theme: AdminTheme) => void
  showCss?: boolean
  labels?: ThemeEditorLabels
  className?: string
}

const COPIED_FLASH_MS = 2000

export function ThemeEditor(props: ThemeEditorProps): React.ReactElement {
  const { value, onChange, showCss = false, labels, className } = props

  const resolvedLabels = { ...themeEditorLabelDefaults, ...labels }
  const [copied, setCopied] = React.useState(false)
  const copyTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )

  React.useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  const setSource = <Key extends keyof AdminThemeSources>(
    key: Key,
    next: AdminThemeSources[Key]
  ) => onChange({ ...value, sources: { ...value.sources, [key]: next } })

  const handleCopyCss = async () => {
    await navigator.clipboard?.writeText(adminThemeToCss(value))
    setCopied(true)
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current)
    }
    copyTimeoutRef.current = setTimeout(() => setCopied(false), COPIED_FLASH_MS)
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Card>
        <CardHeader>
          <CardTitle>{resolvedLabels.sourcesTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ColorField
              label={resolvedLabels.brand}
              value={value.sources.brand}
              onChange={(next) => setSource("brand", next)}
            />
            <ColorField
              label={resolvedLabels.surface}
              value={value.sources.surface}
              onChange={(next) => setSource("surface", next)}
            />
            <ColorField
              label={resolvedLabels.success}
              value={value.sources.success}
              onChange={(next) => setSource("success", next)}
            />
            <ColorField
              label={resolvedLabels.warning}
              value={value.sources.warning}
              onChange={(next) => setSource("warning", next)}
            />
            <ColorField
              label={resolvedLabels.danger}
              value={value.sources.danger}
              onChange={(next) => setSource("danger", next)}
            />
            <NumberField
              label={resolvedLabels.radius}
              value={String(value.sources.radius)}
              onChange={(next) => setSource("radius", Number(next))}
              min={0}
              max={2}
              step={0.05}
            />
          </div>
        </CardContent>
      </Card>
      <ThemeEditorGradients
        gradients={value.gradients}
        onChange={(gradients) => onChange({ ...value, gradients })}
        labels={resolvedLabels}
      />
      {showCss ? (
        <Card>
          <CardHeader>
            <CardTitle>{resolvedLabels.cssTitle}</CardTitle>
            <CardAction>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyCss}
              >
                {copied ? (
                  <CheckIcon aria-hidden="true" />
                ) : (
                  <CopyIcon aria-hidden="true" />
                )}
                {copied ? resolvedLabels.copiedCss : resolvedLabels.copyCss}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs">
              {adminThemeToCss(value)}
            </pre>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
