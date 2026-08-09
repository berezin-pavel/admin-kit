import { adminShellEntry } from "./admin-shell"
import { stateEmptyEntry, stateLoadingEntry } from "./states"
import type { ShowcaseEntry } from "./types"
import { widgetMetricEntry } from "./widget-metric"
import { widgetTableEntry } from "./widget-table"

export const showcaseEntries: readonly ShowcaseEntry[] = [
  adminShellEntry,
  widgetMetricEntry,
  widgetTableEntry,
  stateLoadingEntry,
  stateEmptyEntry,
]
