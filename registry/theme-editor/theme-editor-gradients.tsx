"use client"

import * as React from "react"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { contrastRatio, oklchToHex } from "@/registry/admin-theme-tokens/admin-theme-color"
import {
  gradientCss,
  gradientForeground,
  isGradientId,
} from "@/registry/admin-theme-tokens/admin-theme-css"
import {
  suggestDarkStops,
  type AdminThemeGradient,
  type GradientStops,
} from "@/registry/admin-theme-tokens/admin-theme-tokens"
import { ColorField } from "@/registry/color-field/color-field"
import { ConfirmDialog } from "@/registry/confirm-dialog/confirm-dialog"
import { NumberField } from "@/registry/number-field/number-field"
import { TextField } from "@/registry/text-field/text-field"

import type { ThemeEditorLabels } from "./theme-editor"

export interface ThemeEditorGradientsProps {
  gradients: readonly AdminThemeGradient[]
  onChange: (gradients: readonly AdminThemeGradient[]) => void
  labels: Required<ThemeEditorLabels>
  className?: string
}

type GradientStopKey = "from" | "via" | "to"

const HEX_PATTERN = /^#[0-9a-f]{6}$/i
const LEGIBLE_CONTRAST = 4.5
const NEAR_WHITE_HEX = oklchToHex({ l: 0.985, c: 0, h: 0 })
const NEAR_BLACK_HEX = oklchToHex({ l: 0.205, c: 0, h: 0 })
const DEFAULT_GRADIENT_NAME = "New gradient"
const DEFAULT_GRADIENT_LIGHT: GradientStops = {
  angle: 90,
  from: "#2563eb",
  to: "#7c3aed",
}
const FALLBACK_GRADIENT_ID = "gradient"

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function deriveGradientId(
  name: string,
  existingIds: ReadonlySet<string>
): string {
  const slug = slugify(name)
  const base = isGradientId(slug) ? slug : FALLBACK_GRADIENT_ID

  if (isGradientId(base) && !existingIds.has(base)) {
    return base
  }

  let suffix = 2
  let candidate = `${base}-${suffix}`
  while (!isGradientId(candidate) || existingIds.has(candidate)) {
    suffix += 1
    candidate = `${base}-${suffix}`
  }
  return candidate
}

function stopColorsOf(stops: GradientStops): string[] {
  return stops.via ? [stops.from, stops.via, stops.to] : [stops.from, stops.to]
}

function contrastRatioOf(stops: GradientStops): number | null {
  const colors = stopColorsOf(stops)
  if (!colors.every((color) => HEX_PATTERN.test(color))) {
    return null
  }

  const worstAgainst = (hex: string) =>
    Math.min(...colors.map((color) => contrastRatio(color, hex)))

  return Math.max(worstAgainst(NEAR_WHITE_HEX), worstAgainst(NEAR_BLACK_HEX))
}

interface GradientStopFieldsProps {
  stops: GradientStops
  labels: Required<ThemeEditorLabels>
  onStopChange: (key: GradientStopKey, value: string) => void
}

function GradientStopFields({
  stops,
  labels,
  onStopChange,
}: GradientStopFieldsProps): React.ReactElement {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <ColorField
        label={labels.gradientFrom}
        value={stops.from}
        onChange={(value) => onStopChange("from", value)}
      />
      <ColorField
        label={labels.gradientVia}
        value={stops.via ?? ""}
        onChange={(value) => onStopChange("via", value)}
      />
      <ColorField
        label={labels.gradientTo}
        value={stops.to}
        onChange={(value) => onStopChange("to", value)}
      />
    </div>
  )
}

export function ThemeEditorGradients(
  props: ThemeEditorGradientsProps
): React.ReactElement {
  const { gradients, onChange, labels, className } = props
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const deletingGradient = gradients.find(
    (gradient) => gradient.id === deletingId
  )

  const updateGradient = (
    id: string,
    updater: (gradient: AdminThemeGradient) => AdminThemeGradient
  ) => {
    onChange(
      gradients.map((gradient) =>
        gradient.id === id ? updater(gradient) : gradient
      )
    )
  }

  const handleAdd = () => {
    const existingIds = new Set(gradients.map((gradient) => gradient.id))
    const id = deriveGradientId(DEFAULT_GRADIENT_NAME, existingIds)

    onChange([
      ...gradients,
      {
        id,
        name: DEFAULT_GRADIENT_NAME,
        light: DEFAULT_GRADIENT_LIGHT,
        dark: suggestDarkStops(DEFAULT_GRADIENT_LIGHT),
      },
    ])
  }

  const handleRemove = () => {
    if (!deletingGradient) return
    onChange(
      gradients.filter((gradient) => gradient.id !== deletingGradient.id)
    )
    setDeletingId(null)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{labels.gradientsTitle}</CardTitle>
        <CardAction>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
          >
            {labels.addGradient}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {gradients.map((gradient) => {
          const lightContrast = contrastRatioOf(gradient.light)
          const darkContrast = contrastRatioOf(gradient.dark)

          return (
            <div
              key={gradient.id}
              className="flex flex-col gap-4 rounded-lg border p-4"
            >
              <div
                className="flex h-16 items-center rounded-lg px-4 text-sm font-medium"
                style={{
                  background: gradientCss(gradient.light),
                  color: gradientForeground(gradient.light),
                }}
              >
                {gradient.name}
              </div>
              <div className="flex flex-wrap items-end gap-4">
                <TextField
                  label={labels.gradientName}
                  value={gradient.name}
                  onChange={(name) =>
                    updateGradient(gradient.id, (current) => ({
                      ...current,
                      name,
                    }))
                  }
                  className="min-w-48 flex-1"
                />
                <NumberField
                  label={labels.gradientAngle}
                  value={String(gradient.light.angle)}
                  onChange={(next) =>
                    updateGradient(gradient.id, (current) => ({
                      ...current,
                      light: { ...current.light, angle: Number(next) },
                      dark: { ...current.dark, angle: Number(next) },
                    }))
                  }
                  min={0}
                  max={360}
                  step={5}
                  className="w-28"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`${labels.removeGradient}: ${gradient.id}`}
                  onClick={() => setDeletingId(gradient.id)}
                >
                  <Trash2 />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-3">
                  <span className="text-sm font-medium">
                    {labels.lightScheme}
                  </span>
                  <GradientStopFields
                    stops={gradient.light}
                    labels={labels}
                    onStopChange={(key, value) =>
                      updateGradient(gradient.id, (current) => ({
                        ...current,
                        light: { ...current.light, [key]: value },
                      }))
                    }
                  />
                  {lightContrast !== null && lightContrast < LEGIBLE_CONTRAST ? (
                    <p role="status" className="text-sm text-destructive">
                      {`${labels.lightScheme}: ${labels.contrastWarning} (${lightContrast.toFixed(2)}:1)`}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">
                      {labels.darkScheme}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-label={`${labels.suggestDark}: ${gradient.id}`}
                      onClick={() =>
                        updateGradient(gradient.id, (current) => ({
                          ...current,
                          dark: suggestDarkStops(current.light),
                        }))
                      }
                    >
                      {labels.suggestDark}
                    </Button>
                  </div>
                  <GradientStopFields
                    stops={gradient.dark}
                    labels={labels}
                    onStopChange={(key, value) =>
                      updateGradient(gradient.id, (current) => ({
                        ...current,
                        dark: { ...current.dark, [key]: value },
                      }))
                    }
                  />
                  {darkContrast !== null && darkContrast < LEGIBLE_CONTRAST ? (
                    <p role="status" className="text-sm text-destructive">
                      {`${labels.darkScheme}: ${labels.contrastWarning} (${darkContrast.toFixed(2)}:1)`}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
      <ConfirmDialog
        open={deletingGradient !== undefined}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null)
        }}
        title={labels.removeGradientTitle}
        description={labels.removeGradientDescription}
        confirmLabel={labels.removeGradient}
        tone="danger"
        onConfirm={handleRemove}
      />
    </Card>
  )
}
