"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { AdminTheme } from "@/registry/admin-theme-tokens/admin-theme-tokens"
import { SelectField, type SelectFieldOption } from "@/registry/select-field/select-field"

import {
  setDemoGradientAssignment,
  useDemoGradientAssignment,
  type DemoGradientBlockId,
} from "@/app/demo/theme-store"

const NONE_VALUE = ""

export interface DemoGradientAssignmentLabels {
  title: string
  description: string
  noneOption: string
  shellSurfaceLabel: string
  signInSurfaceLabel: string
  ordersMetricBlockLabel: string
  revenueMetricBlockLabel: string
}

export function DemoGradientAssignment({
  theme,
  labels,
}: {
  theme: AdminTheme
  labels: DemoGradientAssignmentLabels
}) {
  const assignment = useDemoGradientAssignment()

  const options: readonly SelectFieldOption[] = [
    { value: NONE_VALUE, label: labels.noneOption },
    ...theme.gradients.map((gradient) => ({
      value: gradient.id,
      label: gradient.name,
    })),
  ]

  const setShell = (value: string) =>
    setDemoGradientAssignment({
      ...assignment,
      surfaces: { ...assignment.surfaces, shell: value || undefined },
    })

  const setSignIn = (value: string) =>
    setDemoGradientAssignment({
      ...assignment,
      surfaces: { ...assignment.surfaces, signIn: value || undefined },
    })

  const setBlock = (id: DemoGradientBlockId, value: string) => {
    const blocks = { ...assignment.blocks }
    if (value) {
      blocks[id] = value
    } else {
      delete blocks[id]
    }
    setDemoGradientAssignment({ ...assignment, blocks })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{labels.title}</CardTitle>
        <CardDescription>{labels.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField
            label={labels.shellSurfaceLabel}
            value={assignment.surfaces.shell ?? NONE_VALUE}
            onChange={setShell}
            options={options}
            width="full"
          />
          <SelectField
            label={labels.signInSurfaceLabel}
            value={assignment.surfaces.signIn ?? NONE_VALUE}
            onChange={setSignIn}
            options={options}
            width="full"
          />
          <SelectField
            label={labels.ordersMetricBlockLabel}
            value={assignment.blocks["orders-metric"] ?? NONE_VALUE}
            onChange={(value) => setBlock("orders-metric", value)}
            options={options}
            width="full"
          />
          <SelectField
            label={labels.revenueMetricBlockLabel}
            value={assignment.blocks["revenue-metric"] ?? NONE_VALUE}
            onChange={(value) => setBlock("revenue-metric", value)}
            options={options}
            width="full"
          />
        </div>
      </CardContent>
    </Card>
  )
}
