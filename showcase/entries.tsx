import { adminShellEntry } from "./admin-shell"
import { stateEmptyEntry, stateLoadingEntry } from "./states"
import {
  stateErrorEntry,
  stateForbiddenEntry,
  stateOfflineEntry,
} from "./states-problem"
import { themeToggleEntry } from "./theme-toggle"
import type { ShowcaseEntry } from "./types"
import { widgetChartEntry } from "./widget-chart"
import { widgetListEntry } from "./widget-list"
import { widgetMetricEntry } from "./widget-metric"
import { widgetPlaceholderEntry } from "./widget-placeholder"
import { widgetTableEntry } from "./widget-table"

export const showcaseEntries: readonly ShowcaseEntry[] = [
  adminShellEntry,
  themeToggleEntry,
  widgetMetricEntry,
  widgetTableEntry,
  widgetChartEntry,
  widgetListEntry,
  widgetPlaceholderEntry,
  stateLoadingEntry,
  stateEmptyEntry,
  stateErrorEntry,
  stateForbiddenEntry,
  stateOfflineEntry,
]
