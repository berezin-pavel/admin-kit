import { adminShellEntry } from "./admin-shell"
import type { ShowcaseEntry } from "./types"
import { widgetMetricEntry } from "./widget-metric"

export const showcaseEntries: readonly ShowcaseEntry[] = [
  adminShellEntry,
  widgetMetricEntry,
]
