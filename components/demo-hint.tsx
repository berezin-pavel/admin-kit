"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Hint } from "@/registry/hint/hint"

import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"

export function DemoHint() {
  const locale = useDemoLocale()
  const strings = demoDictionary[locale].hint

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          {strings.metricLabel}
          <Hint text={strings.metricHint} />
        </div>
        <span className="text-3xl font-semibold tabular-nums">
          {locale === "ru" ? "₽ 1 559" : "$1,559"}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="demo-hint-discount">{strings.discountLabel}</Label>
          <Hint text={strings.discountHint} />
        </div>
        <Input id="demo-hint-discount" placeholder={strings.discountPlaceholder} />
      </div>
    </div>
  )
}
