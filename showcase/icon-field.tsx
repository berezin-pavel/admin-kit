import { IconFieldView } from "./icon-field-view"
import type { ShowcaseEntry } from "./types"

export const iconFieldEntry: ShowcaseEntry = {
  item: "icon-field",
  title: "Icon field",
  description:
    "A field for picking an icon out of the kit's built-in catalogue — a category glyph, a nav item icon, a status marker. The value is the icon's kebab-case name (a Lucide icon like \"shopping-cart\", or a Lucide Lab icon disambiguated with a \"-lab\" suffix when it collides with a core name) or null for none, fully controlled via value and onChange. The trigger shows the current icon and its name, or the placeholder when empty; a clear button sits beside it. The popover holds a search input (matching icon names and tags, word-prefix ranked above substring) and a grid of tiles with roving-tabindex arrow-key navigation; the icon catalogue itself, and any extra search keywords from loadKeywords, load lazily on first open so an empty trigger costs nothing. Depends on registry/admin-appearance's radio-group-nav, components/ui/popover, components/ui/input, and components/ui/button.",
  views: [
    {
      id: "default",
      name: "Empty value",
      render: () => <IconFieldView />,
    },
    {
      id: "with-value",
      name: "With a value",
      render: () => <IconFieldView initialValue="shopping-cart" />,
    },
    {
      id: "disabled",
      name: "Disabled",
      render: () => (
        <IconFieldView initialValue="shopping-cart" disabled />
      ),
    },
    {
      id: "with-error",
      name: "With an error",
      render: () => <IconFieldView error="Choose an icon" />,
    },
  ],
}
