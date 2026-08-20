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
    page: page === null ? null : { gradient: page, soft: true },
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
]
