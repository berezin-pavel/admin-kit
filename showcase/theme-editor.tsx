import {
  defaultAdminThemeSources,
  type AdminTheme,
} from "@/registry/admin-theme-tokens/admin-theme-tokens"

import { ThemeEditorView } from "./theme-editor-view"
import type { ShowcaseEntry } from "./types"

const emptyTheme: AdminTheme = {
  sources: defaultAdminThemeSources,
  gradients: [],
}

const gradientsTheme: AdminTheme = {
  sources: defaultAdminThemeSources,
  gradients: [
    {
      id: "revenue",
      name: "Revenue",
      light: {
        angle: 135,
        from: "#0ea5e9",
        via: "#6366f1",
        viaPosition: 50,
        to: "#a855f7",
      },
      dark: {
        angle: 135,
        from: "#0b4a66",
        via: "#2c2f80",
        viaPosition: 50,
        to: "#5b1f86",
      },
    },
    {
      id: "orders",
      name: "Orders",
      light: { angle: 135, from: "#f97316", to: "#e11d48" },
      dark: { angle: 135, from: "#7c3a08", to: "#7a1027" },
    },
  ],
}

export const themeEditorEntry: ShowcaseEntry = {
  item: "theme-editor",
  title: "Theme editor",
  description:
    "A controlled form over an AdminTheme: six source colours, a radius, and a palette of named gradients. It stores nothing — value and onChange — so the same element is a runtime appearance screen in a panel and, with showCss, a globals.css generator here. Each gradient carries a light and a dark variant, the dark one suggested and then editable, and reports its contrast without blocking the choice.",
  views: [
    {
      id: "empty",
      name: "Sources only",
      render: () => <ThemeEditorView initialTheme={emptyTheme} />,
    },
    {
      id: "gradients",
      name: "With gradients",
      render: () => <ThemeEditorView initialTheme={gradientsTheme} />,
    },
  ],
}
