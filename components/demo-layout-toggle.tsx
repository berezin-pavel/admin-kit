"use client"

import { LayoutPanelLeft, PanelLeft, PanelTop } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Hint } from "@/registry/hint/hint"

import {
  DEMO_LAYOUT_ORDER,
  setDemoLayout,
  useDemoLayout,
  type DemoLayout,
} from "@/app/demo/layout-store"
import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"

const layoutIcons: Record<
  DemoLayout,
  React.ComponentType<{ className?: string }>
> = {
  card: LayoutPanelLeft,
  flush: PanelLeft,
  "flush-header": PanelTop,
}

export function DemoLayoutToggle() {
  const layout = useDemoLayout()
  const locale = useDemoLocale()
  const label = demoDictionary[locale].layoutToggle[layout]
  const Icon = layoutIcons[layout]
  const next =
    DEMO_LAYOUT_ORDER[
      (DEMO_LAYOUT_ORDER.indexOf(layout) + 1) % DEMO_LAYOUT_ORDER.length
    ]

  return (
    <Hint
      text={label}
      render={
        <Button
          variant="outline"
          size="icon"
          aria-label={label}
          onClick={() => setDemoLayout(next)}
        >
          <Icon className="size-4" />
        </Button>
      }
    />
  )
}
