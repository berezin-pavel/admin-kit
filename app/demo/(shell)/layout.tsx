import type { ReactNode } from "react"

import { DemoShell } from "@/components/demo-shell"

export default function DemoLayout({ children }: { children: ReactNode }) {
  return <DemoShell layout="card">{children}</DemoShell>
}
