import { Button } from "@/components/ui/button"
import type { GradientStops } from "@/registry/admin-theme-tokens/admin-theme-tokens"
import { StateEmpty } from "@/registry/state-empty/state-empty"
import { StateLoading } from "@/registry/state-loading/state-loading"

import { GradientFrame } from "./gradient-frame"
import type { ShowcaseEntry } from "./types"

const emptyGradientStops: GradientStops = {
  angle: 135,
  from: "#bbf7d0",
  to: "#bae6fd",
}

export const stateLoadingEntry: ShowcaseEntry = {
  item: "state-loading",
  title: "Loading state",
  description:
    "A skeleton in place of content while data is on its way. The number of rows is set by a prop.",
  views: [
    { id: "three-rows", name: "Three rows", render: () => <StateLoading /> },
    {
      id: "six-rows",
      name: "Six rows",
      render: () => <StateLoading rows={6} />,
    },
  ],
}

export const stateEmptyEntry: ShowcaseEntry = {
  item: "state-empty",
  title: "Empty state",
  description:
    "A screen for when there's no data: a title, an optional description, and an optional action.",
  views: [
    {
      id: "title-only",
      name: "Title only",
      render: () => <StateEmpty title="No orders yet" />,
    },
    {
      id: "with-description",
      name: "With a description",
      render: () => (
        <StateEmpty
          title="No orders yet"
          description="They'll show up here as soon as a customer places the first one."
        />
      ),
    },
    {
      id: "with-action",
      name: "With an action",
      render: () => (
        <StateEmpty
          title="No orders yet"
          description="You can create an order manually."
          actions={<Button>Create order</Button>}
        />
      ),
    },
    {
      id: "gradient",
      name: "With a gradient backdrop",
      render: () => (
        <GradientFrame id="meadow" stops={emptyGradientStops}>
          <StateEmpty
            title="No orders yet"
            description="They'll show up here as soon as a customer places the first one."
            actions={<Button>Create order</Button>}
            gradient="meadow"
          />
        </GradientFrame>
      ),
    },
  ],
}
