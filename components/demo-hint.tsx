import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Hint } from "@/registry/hint/hint"

export function DemoHint() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          Average order value
          <Hint text="The sum of all paid orders for the period, divided by their count. Refunds and cancelled orders are excluded." />
        </div>
        <span className="text-3xl font-semibold tabular-nums">$1,559</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="demo-hint-discount">Supplier discount</Label>
          <Hint text="Applied before tax and reflected in the purchase price, not the retail price" />
        </div>
        <Input id="demo-hint-discount" placeholder="e.g. 12%" />
      </div>
    </div>
  )
}
