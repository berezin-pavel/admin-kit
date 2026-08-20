import { Suspense } from "react"

import { DemoOrderEntity } from "@/components/demo-order-entity"

export default function DemoOrderHeaderTabsPage() {
  return (
    <Suspense>
      <DemoOrderEntity headerTabs />
    </Suspense>
  )
}
