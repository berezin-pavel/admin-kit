import type { AdminAppearance, CustomColor } from "./appearance-palette"

export interface AppearanceTheme {
  id: string
  name: string
  appearance: AdminAppearance
}

function preset(
  chrome: CustomColor,
  accent: CustomColor,
  page: CustomColor | null,
  signIn: CustomColor
): AdminAppearance {
  return {
    accent,
    sidebar: chrome,
    header: chrome,
    signIn,
    page,
    pages: {},
    blocks: {},
  }
}

export const appearanceThemes: readonly AppearanceTheme[] = [
  {
    id: "slate",
    name: "Slate",
    appearance: preset("#334155", "#2563eb", "#e2e8f0", "#0f172a"),
  },
  {
    id: "mist",
    name: "Mist",
    appearance: preset("#eceff3", "#6366f1", null, "#334155"),
  },
  {
    id: "sage",
    name: "Sage",
    appearance: preset("#3f4f44", "#0d9488", "#eef1ec", "#1f2a23"),
  },
  {
    id: "ivory",
    name: "Ivory",
    appearance: preset("#f5f2ea", "#a16207", "#faf8f2", "#171717"),
  },
  {
    id: "dune",
    name: "Dune",
    appearance: preset("#4a3f33", "#b45309", "#f1ece3", "#2a231b"),
  },
  {
    id: "graphite",
    name: "Graphite",
    appearance: preset("#1f2937", "#4b5563", "#e5e7eb", "#111827"),
  },
  {
    id: "zinc",
    name: "Zinc",
    appearance: preset("#18181b", "#52525b", "#e4e4e7", "#09090b"),
  },
  {
    id: "paper",
    name: "Paper",
    appearance: preset("#ffffff", "#171717", null, "#171717"),
  },
  {
    id: "snow",
    name: "Snow",
    appearance: preset("#f8fafc", "#0f172a", "#eef2f6", "#1e293b"),
  },
  {
    id: "stone",
    name: "Stone",
    appearance: preset("#292524", "#57534e", "#e7e5e4", "#1c1917"),
  },
  {
    id: "frost",
    name: "Frost",
    appearance: preset("#e8edf2", "#0284c7", "#f0f4f8", "#0c4a6e"),
  },
  {
    id: "ash",
    name: "Ash",
    appearance: preset("#3f3f46", "#6366f1", "#e4e4e7", "#27272a"),
  },
  {
    id: "pearl",
    name: "Pearl",
    appearance: preset("#f4f4f5", "#0891b2", "#fafafa", "#164e63"),
  },
  {
    id: "charcoal",
    name: "Charcoal",
    appearance: preset("#1c1c1e", "#737373", "#e5e5e5", "#171717"),
  },
  {
    id: "linen",
    name: "Linen",
    appearance: preset("#f7f4ef", "#9a3412", "#f5f0e8", "#292524"),
  },
  {
    id: "fog",
    name: "Fog",
    appearance: preset("#d9dde3", "#475569", "#e9edf1", "#334155"),
  },
  {
    id: "night",
    name: "Night",
    appearance: preset("#0f172a", "#38bdf8", "#dbe4ee", "#020617"),
  },
  {
    id: "moss",
    name: "Moss",
    appearance: preset("#565c50", "#4d7c0f", "#eceee8", "#2a2e26"),
  },
  {
    id: "porcelain",
    name: "Porcelain",
    appearance: preset("#eef1f4", "#64748b", null, "#475569"),
  },
  {
    id: "ink",
    name: "Ink",
    appearance: preset("#111111", "#2563eb", "#e5e7eb", "#000000"),
  },
  {
    id: "pine",
    name: "Pine",
    appearance: preset("#1f3a2e", "#0d9488", "#e8efe9", "#12241c"),
  },
  {
    id: "fern",
    name: "Fern",
    appearance: preset("#eef3ec", "#15803d", "#f3f7f1", "#1f3a2e"),
  },
  {
    id: "navy",
    name: "Navy",
    appearance: preset("#1e2a44", "#3b82f6", "#e6eaf2", "#101a30"),
  },
  {
    id: "denim",
    name: "Denim",
    appearance: preset("#33415e", "#2563eb", "#e8ecf3", "#1c2740"),
  },
  {
    id: "arctic",
    name: "Arctic",
    appearance: preset("#e7eef5", "#0369a1", "#f0f5fa", "#123a56"),
  },
  {
    id: "indigo-night",
    name: "Indigo",
    appearance: preset("#272b55", "#6366f1", "#e9eaf5", "#161936"),
  },
  {
    id: "evergreen",
    name: "Evergreen",
    appearance: preset("#14332a", "#268a68", "#e7efe9", "#0d241d"),
  },
  {
    id: "laurel",
    name: "Laurel",
    appearance: preset("#45564a", "#4f7f5c", "#edf1ec", "#2b3a2f"),
  },
  {
    id: "jade",
    name: "Jade",
    appearance: preset("#24473d", "#12876f", "#e6efeb", "#16302a"),
  },
  {
    id: "meadow",
    name: "Meadow",
    appearance: preset("#eaf2e8", "#3f7d4e", "#f2f7f0", "#23402b"),
  },
  {
    id: "willow",
    name: "Willow",
    appearance: preset("#58685a", "#55855a", "#eef2ed", "#333f34"),
  },
  {
    id: "ocean",
    name: "Ocean",
    appearance: preset("#16405c", "#2b7cb3", "#e6eef4", "#0e2a3d"),
  },
  {
    id: "steel",
    name: "Steel",
    appearance: preset("#3d4c60", "#4f7ca8", "#e9edf2", "#263140"),
  },
  {
    id: "cobalt",
    name: "Cobalt",
    appearance: preset("#263c6e", "#3b62c4", "#e7ebf5", "#16244a"),
  },
  {
    id: "sky",
    name: "Sky",
    appearance: preset("#e9f1f8", "#1f6f9c", "#f2f7fb", "#143a52"),
  },
  {
    id: "harbor",
    name: "Harbor",
    appearance: preset("#2c4257", "#35839c", "#e8eef2", "#1b2b3a"),
  },
]
