import { CircleUserRound, CreditCard, ShoppingCart } from "lucide-react"

import { StateEmpty } from "@/registry/state-empty/state-empty"
import {
  WidgetList,
  type WidgetListItem,
} from "@/registry/widget-list/widget-list"

import type { ShowcaseEntry } from "./types"

const teamItems: readonly WidgetListItem[] = [
  { id: "anna", title: "Anna Bennett", description: "Designer" },
  { id: "sergey", title: "Sergey Peters", description: "Developer" },
  { id: "maria", title: "Maria Sanders", description: "Project manager" },
]

const teamItemsWithIcons: readonly WidgetListItem[] = [
  {
    id: "anna",
    title: "Anna Bennett",
    description: "Designer",
    icon: CircleUserRound,
  },
  {
    id: "sergey",
    title: "Sergey Peters",
    description: "Developer",
    icon: CircleUserRound,
  },
  {
    id: "maria",
    title: "Maria Sanders",
    description: "Project manager",
    icon: CircleUserRound,
  },
]

const orderItemsWithMeta: readonly WidgetListItem[] = [
  {
    id: "1043",
    title: "Order #1043",
    description: "Bennett A.",
    meta: "$4,200",
    icon: ShoppingCart,
  },
  {
    id: "1042",
    title: "Order #1042",
    description: "Peters S.",
    meta: "$1,750",
    icon: ShoppingCart,
  },
  {
    id: "1041",
    title: "Subscription payment",
    description: "Sanders M.",
    meta: "$990",
    icon: CreditCard,
  },
]

export const widgetListEntry: ShowcaseEntry = {
  item: "widget-list",
  title: "List widget",
  description:
    "A list of rows for a dashboard: a name, an optional description, optional meta on the right, and an optional icon on the left. Without rows and without the empty prop it shows a default state.",
  views: [
    {
      id: "multiple-rows",
      name: "Multiple rows",
      render: () => <WidgetList title="Team" items={teamItems} />,
    },
    {
      id: "with-icons",
      name: "Rows with icons",
      render: () => <WidgetList title="Team" items={teamItemsWithIcons} />,
    },
    {
      id: "with-meta",
      name: "Rows with meta",
      render: () => (
        <WidgetList title="Recent transactions" items={orderItemsWithMeta} />
      ),
    },
    {
      id: "empty-custom",
      name: "No rows",
      render: () => (
        <WidgetList
          title="Team"
          items={[]}
          empty={<StateEmpty title="No one on the team yet" />}
        />
      ),
    },
    {
      id: "empty-default",
      name: "No rows, default state",
      render: () => <WidgetList title="Team" items={[]} />,
    },
    {
      id: "prominent-heading",
      name: "Prominent heading with a summary",
      render: () => (
        <WidgetList
          title="Recent transactions"
          items={orderItemsWithMeta}
          heading="prominent"
          summary="$6,940 total"
        />
      ),
    },
    {
      id: "loading",
      name: "Loading",
      render: () => <WidgetList title="Team" items={teamItems} loading />,
    },
    {
      id: "gradient",
      name: "With a gradient backdrop",
      render: () => (
        <WidgetList
          title="Recent transactions"
          items={orderItemsWithMeta}
          gradient="copper"
        />
      ),
    },
  ],
}
