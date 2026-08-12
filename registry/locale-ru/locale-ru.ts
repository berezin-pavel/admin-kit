import { ru } from "date-fns/locale"

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
  },
  widgetList: { emptyTitle: "Данных нет" },
  widgetChart: { emptyTitle: "Данных нет" },
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
  colorField: { placeholder: "Выберите цвет", hexInputLabel: "HEX-код цвета" },
  selectField: { placeholder: "Выберите…" },
  pageForm: { submitLabel: "Сохранить", cancelLabel: "Отмена" },
  sidebarToggle: { expand: "Развернуть сайдбар", collapse: "Свернуть сайдбар" },
  themeToggle: {
    toLight: "Переключить на светлую тему",
    toDark: "Переключить на тёмную тему",
  },
  adminShell: { openMenu: "Открыть меню навигации", sections: "Разделы" },
  languageToggle: { label: "Переключить язык" },
} as const

export type LocaleRu = typeof localeRu
