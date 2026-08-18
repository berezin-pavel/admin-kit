import { Suspense } from "react"

import { DemoOrderEntity } from "@/components/demo-order-entity"

export default function DemoOrderPage() {
  return (
    <Suspense>
      <DemoOrderEntity />
    </Suspense>
  )
}
