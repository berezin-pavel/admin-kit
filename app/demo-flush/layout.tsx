import type { ReactNode } from "react"

import { DemoAppearanceProvider } from "@/components/demo-appearance-provider"
import { DemoShell } from "@/components/demo-shell"

export default function DemoFlushLayout({ children }: { children: ReactNode }) {
  return (
    <DemoAppearanceProvider>
      <DemoShell layout="flush-header">{children}</DemoShell>
    </DemoAppearanceProvider>
  )
}
