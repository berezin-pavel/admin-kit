import { adminShellEntry } from "./admin-shell"
import { adminToasterEntry } from "./admin-toaster"
import { colorFieldEntry } from "./color-field"
import { confirmDialogEntry } from "./confirm-dialog"
import { dateFieldEntry } from "./date-field"
import { dateTimeFieldEntry } from "./date-time-field"
import { hintEntry } from "./hint"
import { rowActionsEntry } from "./row-actions"
import { sidebarToggleEntry } from "./sidebar-toggle"
import { timeFieldEntry } from "./time-field"
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
import { pageListEntry } from "./page-list"
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
  pageListEntry,
  pageHeaderEntry,
  statusBadgeEntry,
  hintEntry,
  rowActionsEntry,
  dateFieldEntry,
  dateTimeFieldEntry,
  timeFieldEntry,
  colorFieldEntry,
  confirmDialogEntry,
  adminToasterEntry,
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
