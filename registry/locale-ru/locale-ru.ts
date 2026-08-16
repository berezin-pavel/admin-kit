import { ru } from "date-fns/locale"

import { defaultDateRangePresets } from "@/registry/date-range-field/date-range-field"

const dateRangePresetLabelsRu: Record<string, string> = {
  today: "Сегодня",
  yesterday: "Вчера",
  "this-week": "Эта неделя",
  "this-month": "Этот месяц",
  "this-year": "Этот год",
  "last-week": "Прошлая неделя",
  "last-month": "Прошлый месяц",
  "last-year": "Прошлый год",
}

export const localeRu = {
  widgetTable: {
    emptyTitle: "Данных нет",
    rowsPerPage: "Строк на странице",
    noSorting: "Без сортировки",
    sorting: "Сортировка",
    previousPage: "Предыдущая страница",
    nextPage: "Следующая страница",
    range: (rangeStart: number, rangeEnd: number, total: number) =>
      `${rangeStart}–${rangeEnd} из ${total}`,
    selectRow: "Выбрать строку",
    selectAllOnPage: "Выбрать всё на странице",
    selected: (count: number) => `Выбрано: ${count}`,
    clearSelection: "Снять выделение",
    filteredEmptyTitle: "Ничего не найдено",
    filteredEmptyDescription: "Под текущие фильтры не подходит ни одна запись",
    clearFiltersLabel: "Сбросить фильтры",
    columnsLabel: "Колонки",
    selectAllMatchingLabel: (count: number) => `Выбрать все: ${count}`,
  },
  comboboxField: {
    placeholder: "Поиск…",
    emptyLabel: "Ничего не найдено",
    openLabel: "Открыть список",
    clearLabel: "Очистить выбор",
  },
  multiSelectField: {
    placeholder: "Поиск…",
    emptyLabel: "Ничего не найдено",
    removeLabel: (label: string) => `Убрать ${label}`,
  },
  pageAuth: {
    submitLabel: "Войти",
  },
  widgetList: { emptyTitle: "Данных нет" },
  widgetChart: { emptyTitle: "Данных нет" },
  widgetActivity: {
    today: "Сегодня",
    yesterday: "Вчера",
    emptyTitle: "Активности нет",
    dayFormat: "d MMMM",
    timeFormat: "HH:mm",
    locale: ru,
  },
  widgetDonut: { emptyTitle: "Данных нет" },
  widgetProgress: { targetLabel: "Цель" },
  stateLoading: { label: "Загрузка" },
  stateError: { title: "Что-то пошло не так" },
  stateForbidden: { title: "Нет доступа" },
  stateOffline: { title: "Связь потеряна" },
  widgetPlaceholder: {
    title: "Здесь будет виджет",
    hint: "Место зарезервировано, виджет пока не выбран",
  },
  confirmDialog: { confirmLabel: "Подтвердить", cancelLabel: "Отмена" },
  dateField: {
    placeholder: "Выберите дату",
    displayFormat: "d MMMM yyyy",
    locale: ru,
  },
  dateTimeField: {
    placeholder: "Выберите дату и время",
    displayFormat: "d MMMM yyyy, HH:mm",
    locale: ru,
  },
  dateRangeField: {
    placeholder: "Выберите период",
    displayFormat: "dd.MM.yy",
    locale: ru,
    presets: defaultDateRangePresets.map((preset) => ({
      ...preset,
      label: dateRangePresetLabelsRu[preset.id] ?? preset.label,
    })),
  },
  colorField: { placeholder: "Выберите цвет", hexInputLabel: "HEX-код цвета" },
  selectField: { placeholder: "Выберите…" },
  fileField: {
    buttonLabel: "Выбрать файл",
    noFileLabel: "Файл не выбран",
    clearLabel: "Убрать файл",
  },
  tagsField: {
    placeholder: "Добавить тег…",
    removeLabel: (tag: string) => `Убрать ${tag}`,
  },
  pageForm: { submitLabel: "Сохранить", cancelLabel: "Отмена" },
  formDialog: { submitLabel: "Сохранить", cancelLabel: "Отмена" },
  sidebarToggle: { expand: "Развернуть сайдбар", collapse: "Свернуть сайдбар" },
  themeToggle: {
    toLight: "Переключить на светлую тему",
    toDark: "Переключить на тёмную тему",
  },
  adminShell: { openMenu: "Открыть меню навигации", sections: "Разделы" },
  languageToggle: { label: "Переключить язык" },
  userMenu: { label: "Открыть меню пользователя" },
  breadcrumbs: { label: "Хлебные крошки" },
} as const

export type LocaleRu = typeof localeRu
