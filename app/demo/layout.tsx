import type { ReactNode } from "react"

import { DemoAppearanceProvider } from "@/components/demo-appearance-provider"

import { readDemoSettings } from "./demo-settings"

export default async function DemoRootLayout({
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
      {children}
    </DemoAppearanceProvider>
  )
}
