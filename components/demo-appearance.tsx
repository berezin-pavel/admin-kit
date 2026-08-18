"use client"

import { DemoGradientAssignment } from "@/components/demo-gradient-assignment"
import { localeRu } from "@/registry/locale-ru/locale-ru"
import { PageHeader } from "@/registry/page-header/page-header"
import { ThemeEditor } from "@/registry/theme-editor/theme-editor"

import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"
import { setDemoTheme, useDemoTheme } from "@/app/demo/theme-store"

export function DemoAppearance() {
  const locale = useDemoLocale()
  const strings = demoDictionary[locale].appearance
  const theme = useDemoTheme()

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={strings.title} description={strings.description} />
      <ThemeEditor
        value={theme}
        onChange={setDemoTheme}
        labels={locale === "ru" ? localeRu.themeEditor : undefined}
      />
      <DemoGradientAssignment
        theme={theme}
        labels={{
          title: strings.gradientAssignmentTitle,
          description: strings.gradientAssignmentDescription,
          noneOption: strings.noneOption,
          shellSurfaceLabel: strings.shellSurfaceLabel,
          signInSurfaceLabel: strings.signInSurfaceLabel,
          ordersMetricBlockLabel: strings.ordersMetricBlockLabel,
          revenueMetricBlockLabel: strings.revenueMetricBlockLabel,
        }}
      />
    </div>
  )
}
