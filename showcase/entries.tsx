import { adminShellEntry } from "./admin-shell"
import { adminToasterEntry } from "./admin-toaster"
import { breadcrumbsEntry } from "./breadcrumbs"
import { checkboxFieldEntry } from "./checkbox-field"
import { colorFieldEntry } from "./color-field"
import { confirmDialogEntry } from "./confirm-dialog"
import { dateFieldEntry } from "./date-field"
import { dateRangeFieldEntry } from "./date-range-field"
import { dateTimeFieldEntry } from "./date-time-field"
import { hintEntry } from "./hint"
import { languageToggleEntry } from "./language-toggle"
import { localeRuEntry } from "./locale-ru"
import { numberFieldEntry } from "./number-field"
import { rowActionsEntry } from "./row-actions"
import { selectFieldEntry } from "./select-field"
import { sidebarToggleEntry } from "./sidebar-toggle"
import { textFieldEntry } from "./text-field"
import { textareaFieldEntry } from "./textarea-field"
import { timeFieldEntry } from "./time-field"
import { userMenuEntry } from "./user-menu"
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
import { pageFormEntry } from "./page-form"
import { pageListEntry } from "./page-list"
import { pageHeaderEntry } from "./page-header"
import { statusBadgeEntry } from "./status-badge"
import { widgetProgressEntry } from "./widget-progress"
import { widgetTableEntry } from "./widget-table"

export const showcaseEntries: readonly ShowcaseEntry[] = [
  adminShellEntry,
  themeToggleEntry,
  sidebarToggleEntry,
  userMenuEntry,
  languageToggleEntry,
  localeRuEntry,
  widgetMetricEntry,
  widgetTableEntry,
  pageEntityEntry,
  pageListEntry,
  pageFormEntry,
  pageHeaderEntry,
  statusBadgeEntry,
  hintEntry,
  rowActionsEntry,
  breadcrumbsEntry,
  dateFieldEntry,
  dateRangeFieldEntry,
  dateTimeFieldEntry,
  timeFieldEntry,
  colorFieldEntry,
  textFieldEntry,
  numberFieldEntry,
  textareaFieldEntry,
  selectFieldEntry,
  checkboxFieldEntry,
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
