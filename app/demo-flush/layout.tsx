import type { ReactNode } from "react"

import { DemoAppearanceProvider } from "@/components/demo-appearance-provider"
import { DemoShell } from "@/components/demo-shell"

import { readDemoSettings } from "@/app/demo/demo-settings"

export default async function DemoFlushLayout({
  children,
}: {
  children: ReactNode
}) {
  const { appearanceCookie, localeCookie } = await readDemoSettings()

  return (
    <DemoAppearanceProvider
      appearanceCookie={appearanceCookie}
      localeCookie={localeCookie}
    >
      <DemoShell layout="flush-header">{children}</DemoShell>
    </DemoAppearanceProvider>
  )
}
