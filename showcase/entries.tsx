import { adminShellEntry } from "./admin-shell"
import { adminToasterEntry } from "./admin-toaster"
import { breadcrumbsEntry } from "./breadcrumbs"
import { checkboxFieldEntry } from "./checkbox-field"
import { colorFieldEntry } from "./color-field"
import { comboboxFieldEntry } from "./combobox-field"
import { confirmDialogEntry } from "./confirm-dialog"
import { formDialogEntry } from "./form-dialog"
import { dateFieldEntry } from "./date-field"
import { dateRangeFieldEntry } from "./date-range-field"
import { dateTimeFieldEntry } from "./date-time-field"
import { fileFieldEntry } from "./file-field"
import { hintEntry } from "./hint"
import { imageFieldEntry } from "./image-field"
import { languageToggleEntry } from "./language-toggle"
import { localeRuEntry } from "./locale-ru"
import { multiSelectFieldEntry } from "./multi-select-field"
import { numberFieldEntry } from "./number-field"
import { rowActionsEntry } from "./row-actions"
import { selectFieldEntry } from "./select-field"
import { sidebarToggleEntry } from "./sidebar-toggle"
import { tagsFieldEntry } from "./tags-field"
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
import { themeEditorEntry } from "./theme-editor"
import { themeToggleEntry } from "./theme-toggle"
import type { ShowcaseEntry } from "./types"
import { widgetActivityEntry } from "./widget-activity"
import { widgetChartEntry } from "./widget-chart"
import { widgetDonutEntry } from "./widget-donut"
import { widgetListEntry } from "./widget-list"
import { widgetMetricEntry } from "./widget-metric"
import { widgetPlaceholderEntry } from "./widget-placeholder"
import { widgetQuickActionsEntry } from "./widget-quick-actions"
import { pageAuthEntry } from "./page-auth"
import { pageEntityEntry } from "./page-entity"
import { pageTabsEntry } from "./page-tabs"
import { pageFormEntry } from "./page-form"
import { pageListEntry } from "./page-list"
import { pageHeaderEntry } from "./page-header"
import { statusBadgeEntry } from "./status-badge"
import { widgetProgressEntry } from "./widget-progress"
import { widgetTableEntry } from "./widget-table"

export const showcaseEntries: readonly ShowcaseEntry[] = [
  adminShellEntry,
  themeToggleEntry,
  themeEditorEntry,
  sidebarToggleEntry,
  userMenuEntry,
  languageToggleEntry,
  localeRuEntry,
  widgetMetricEntry,
  widgetTableEntry,
  widgetActivityEntry,
  widgetDonutEntry,
  widgetQuickActionsEntry,
  pageEntityEntry,
  pageListEntry,
  pageFormEntry,
  pageAuthEntry,
  pageTabsEntry,
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
  comboboxFieldEntry,
  multiSelectFieldEntry,
  checkboxFieldEntry,
  fileFieldEntry,
  imageFieldEntry,
  tagsFieldEntry,
  confirmDialogEntry,
  formDialogEntry,
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
