import { ColorFieldView } from "./color-field-view"
import type { ShowcaseEntry } from "./types"

export const colorFieldEntry: ShowcaseEntry = {
  item: "color-field",
  title: "Color field",
  description:
    "A color picker field for entities with their own color — an order label, a product category, a kanban status. The value is a lowercase HEX string like #rrggbb; an empty string means \"none selected\". Fully controlled, with value and onChange owned by the consumer. The popover holds a grid of quick colors from presets (its own palette of 8–12 data colors, not theme tokens), a native input[type=color] for a custom shade, and a text field for manual HEX entry. Depends on components/ui/popover, components/ui/input, and components/ui/label.",
  views: [
    {
      id: "empty",
      name: "Empty value",
      render: () => <ColorFieldView label="Label color" />,
    },
    {
      id: "filled",
      name: "Filled",
      render: () => (
        <ColorFieldView label="Label color" initialValue="#22c55e" />
      ),
    },
    {
      id: "custom-presets",
      name: "Custom palette",
      render: () => (
        <ColorFieldView
          label="Status color"
          initialValue="#0ea5e9"
          presets={["#0ea5e9", "#8b5cf6", "#f43f5e", "#65a30d"]}
        />
      ),
    },
    {
      id: "no-label",
      name: "No label",
      render: () => <ColorFieldView initialValue="#f97316" />,
    },
    {
      id: "disabled",
      name: "Disabled",
      render: () => (
        <ColorFieldView label="Label color" initialValue="#6366f1" disabled />
      ),
    },
  ],
}
