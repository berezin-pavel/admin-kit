import type { ReactNode } from "react"

import { DemoAppearanceProvider } from "@/components/demo-appearance-provider"

export default function DemoRootLayout({ children }: { children: ReactNode }) {
  return <DemoAppearanceProvider>{children}</DemoAppearanceProvider>
}
