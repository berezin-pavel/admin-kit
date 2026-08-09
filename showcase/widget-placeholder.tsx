import { WidgetPlaceholder } from "@/registry/widget-placeholder/widget-placeholder"

import type { ShowcaseEntry } from "./types"

export const widgetPlaceholderEntry: ShowcaseEntry = {
  item: "widget-placeholder",
  title: "Widget placeholder",
  description:
    "A dashed border with muted text in a work-area spot where a widget hasn't been picked yet. Both texts are optional and default to English.",
  views: [
    {
      id: "default",
      name: "Default",
      render: () => <WidgetPlaceholder />,
    },
    {
      id: "custom-text",
      name: "With custom text",
      render: () => (
        <WidgetPlaceholder
          title="Sales widget"
          hint="Connect a data source to add it here"
        />
      ),
    },
  ],
}
