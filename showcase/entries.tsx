import { adminShellEntry } from "./admin-shell"
import { sidebarToggleEntry } from "./sidebar-toggle"
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
import { pageEntityEntry } from "./page-entity"
import { pageHeaderEntry } from "./page-header"
import { statusBadgeEntry } from "./status-badge"
import { widgetProgressEntry } from "./widget-progress"
import { widgetTableEntry } from "./widget-table"

export const showcaseEntries: readonly ShowcaseEntry[] = [
  adminShellEntry,
  themeToggleEntry,
  sidebarToggleEntry,
  widgetMetricEntry,
  widgetTableEntry,
  pageEntityEntry,
  pageHeaderEntry,
  statusBadgeEntry,
  widgetProgressEntry,
  widgetChartEntry,
  widgetListEntry,
  widgetPlaceholderEntry,
  stateLoadingEntry,
  stateEmptyEntry,
  stateErrorEntry,
  stateForbiddenEntry,
  stateOfflineEntry,
]
