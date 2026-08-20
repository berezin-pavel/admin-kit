import type { AdminAppearance } from "./appearance-palette"

export interface AppearanceTheme {
  id: string
  name: string
  appearance: AdminAppearance
}

export const appearanceThemes: readonly AppearanceTheme[] = [
  {
    id: "slate",
    name: "Slate",
    appearance: {
      accent: "#2563eb",
      sidebar: "#334155",
      header: "#334155",
      signIn: "#0f172a",
      page: { gradient: "#e2e8f0", soft: true },
      pages: {},
      blocks: {},
    },
  },
  {
    id: "mist",
    name: "Mist",
    appearance: {
      accent: "#6366f1",
      sidebar: "#eceff3",
      header: "#eceff3",
      signIn: "#334155",
      page: null,
      pages: {},
      blocks: {},
    },
  },
  {
    id: "sage",
    name: "Sage",
    appearance: {
      accent: "#0d9488",
      sidebar: "#3f4f44",
      header: "#3f4f44",
      signIn: "#1f2a23",
      page: { gradient: "#eef1ec", soft: true },
      pages: {},
      blocks: {},
    },
  },
  {
    id: "ivory",
    name: "Ivory",
    appearance: {
      accent: "#a16207",
      sidebar: "#f5f2ea",
      header: "#f5f2ea",
      signIn: "#171717",
      page: { gradient: "#faf8f2", soft: true },
      pages: {},
      blocks: {},
    },
  },
  {
    id: "dune",
    name: "Dune",
    appearance: {
      accent: "#b45309",
      sidebar: "#4a3f33",
      header: "#4a3f33",
      signIn: "#2a231b",
      page: { gradient: "#f1ece3", soft: true },
      pages: {},
      blocks: {},
    },
  },
]
