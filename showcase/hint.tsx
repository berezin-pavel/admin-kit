import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Hint } from "@/registry/hint/hint"

import type { ShowcaseEntry } from "./types"

export const hintEntry: ShowcaseEntry = {
  item: "hint",
  title: "Hint",
  description:
    "A tooltip hint for field labels, column headers, and metrics: it explains a term or what a number includes without taking up screen space. Without children it draws a muted question icon with an accessible name from text; with children it wraps the passed element with its own trigger and draws no icon of its own. Works on its own — there's no need to wrap the app in a TooltipProvider, it only synchronizes the delay between neighboring tooltips.",
  views: [
    {
      id: "icon",
      name: "Icon",
      render: () => (
        <Hint text="The total of all paid orders for the period, excluding refunds" />
      ),
    },
    {
      id: "children",
      name: "Around text",
      render: () => (
        <p className="text-sm">
          Only{" "}
          <Hint text="An order counts as paid once the payment has gone through and hasn't been refunded">
            <span className="cursor-help underline decoration-dotted underline-offset-4">
              paid orders
            </span>
          </Hint>{" "}
          are included in the calculation
        </p>
      ),
    },
    {
      id: "with-label",
      name: "Next to a field label",
      render: () => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <Label htmlFor="hint-showcase-sku">SKU</Label>
            <Hint text="A unique product code in the inventory system, not the same as the barcode" />
          </div>
          <Input id="hint-showcase-sku" placeholder="e.g. SKU-10234" />
        </div>
      ),
    },
    {
      id: "sides",
      name: "Popover sides",
      render: () => (
        <div className="flex items-center gap-8">
          <Hint text="Left" side="left" />
          <Hint text="Top" side="top" />
          <Hint text="Right" side="right" />
          <Hint text="Bottom" side="bottom" />
        </div>
      ),
    },
  ],
}
