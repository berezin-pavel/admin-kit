import type { DemoLocale } from "./locale-store"

export interface DemoDictionary {
  appName: string
  nav: {
    overview: string
    orders: string
    order: string
  }
  overview: {
    title: string
    metricOrdersTitle: string
    metricRevenueTitle: string
    metricAverageOrderTitle: string
    metricHint: string
    financeChartTitle: string
    financeChartHint: string
    ordersByChannelChartTitle: string
    newCustomersChartTitle: string
    productsTitle: string
    donutTitle: string
    activityTitle: string
    progressTitle: string
    progressOrdersTitle: string
    progressHint: (value: string, max: string) => string
    progressOrdersHint: (value: string, max: string) => string
    quickActionsTitle: string
    quickActionLabels: {
      createOrder: string
      exportCsv: string
      inviteUser: string
      openReports: string
    }
    quickActionToastTitle: (label: string) => string
    reloadButton: string
  }
  standaloneTable: {
    title: string
    searchPlaceholder: string
  }
  colorField: {
    label: string
    previewLabel: string
    badgeText: string
  }
  dateField: {
    label: string
  }
  dateTimeField: {
    label: string
  }
  timeField: {
    label: string
  }
  hint: {
    metricLabel: string
    metricHint: string
    discountLabel: string
    discountHint: string
    discountPlaceholder: string
  }
  confirmDialogDemo: {
    triggerLabel: string
    title: string
    description: string
    confirmLabel: string
  }
  toaster: {
    updateStatusButton: string
    updateStatusTitle: string
    updateStatusDescription: string
    saveOrderButton: string
    saveOrderTitle: string
    saveOrderDescription: string
    checkStockButton: string
    checkStockTitle: string
    checkStockDescription: string
    sendEmailButton: string
    sendEmailTitle: string
    sendEmailDescription: string
    removeProductButton: string
    removeProductTitle: string
    removeProductDescription: string
    removeProductActionLabel: string
    restoreProductTitle: string
    restoreProductDescription: string
  }
  orders: {
    title: string
    description: string
    exportButton: string
    exportToastTitle: string
    exportToastDescription: string
    searchFilterLabel: string
    statusFilterLabel: string
    dateRangeFilterLabel: string
    statusAll: string
    columnNumber: string
    columnCustomer: string
    columnProduct: string
    columnStatus: string
    columnTotal: string
    sortNumberDesc: string
    sortNumberAsc: string
    sortTotalDesc: string
    sortTotalAsc: string
    sortNewestFirst: string
    sortOldestFirst: string
    viewOrderAction: string
    editOrderAction: string
    deleteOrderAction: string
    deleteConfirmTitle: string
    deleteConfirmDescription: (orderNumber: string, customer: string) => string
    deleteConfirmLabel: string
    deleteToastTitle: string
    deleteToastDescription: (orderNumber: string) => string
    selectionExportAction: string
    selectionExportToastTitle: (count: number) => string
    selectionDeleteAction: string
    selectionDeleteConfirmTitle: string
    selectionDeleteConfirmDescription: (count: number) => string
    selectionDeleteConfirmLabel: string
    selectionDeleteToastTitle: string
    selectionDeleteToastDescription: (count: number) => string
    reloadButton: string
  }
  orderEntity: {
    title: string
    description: string
    tabOverviewLabel: string
    tabHistoryLabel: string
    tabRelatedLabel: string
    historyTitle: string
    relatedTitle: string
    reloadButton: string
    sectionOrder: string
    fieldStatus: string
    fieldPlaced: string
    fieldPlacedValue: string
    fieldChannel: string
    fieldChannelValue: string
    fieldTotal: string
    fieldTotalHint: string
    fieldTotalValue: string
    editButton: string
    editDialogTitle: string
    editDialogDescription: string
    editTotalLabel: string
    editChannelLabel: string
    editChannelOptions: readonly { value: string; label: string }[]
    editToastTitle: string
    sectionCustomer: string
    fieldName: string
    fieldNameValue: string
    fieldEmail: string
    fieldEmailValue: string
    fieldPhone: string
    fieldPhoneValue: string
    sectionDelivery: string
    fieldAddress: string
    fieldAddressValue: string
    fieldCarrier: string
    fieldCarrierValue: string
    fieldDelivered: string
    fieldDeliveredValue: string
    sendReceiptButton: string
    sendReceiptToastTitle: string
    sendReceiptToastDescription: string
    cancelOrderButton: string
    cancelConfirmTitle: string
    cancelConfirmDescription: string
    cancelConfirmLabel: string
    cancelConfirmCancelLabel: string
    cancelToastTitle: string
    cancelToastDescription: string
  }
  orderEdit: {
    title: string
    description: string
    sectionTitle: string
    customerLabel: string
    customerPlaceholder: string
    customerEmptyLabel: string
    productLabel: string
    amountLabel: string
    dateLabel: string
    paidLabel: string
    commentLabel: string
    commentPlaceholder: string
    tagsLabel: string
    tagsPlaceholder: string
    tagsEmptyLabel: string
    tagsOptions: readonly { value: string; label: string }[]
    channelsLabel: string
    channelsPlaceholder: string
    channelsEmptyLabel: string
    channelsHint: string
    channelsOptions: readonly { value: string; label: string }[]
    removeItemLabel: (label: string) => string
    attachmentLabel: string
    pickupLabel: string
    deliveryTimeLabel: string
    labelColorLabel: string
    supplierDiscountLabel: string
    supplierDiscountHint: string
    supplierDiscountPlaceholder: string
    saveToastTitle: string
    saveToastDescription: string
  }
  userMenu: {
    profileAction: string
    signOutAction: string
    profileToastTitle: string
  }
  breadcrumbs: {
    editLabel: string
  }
  signIn: {
    title: string
    description: string
    emailLabel: string
    emailPlaceholder: string
    passwordLabel: string
    rememberLabel: string
    submitLabel: string
    errorMessage: string
    backToDemoLabel: string
  }
}

export const demoDictionary: Record<DemoLocale, DemoDictionary> = {
  en: {
    appName: "My Store",
    nav: {
      overview: "Overview",
      orders: "Orders",
      order: "Order #4187",
    },
    overview: {
      title: "Overview",
      metricOrdersTitle: "Orders",
      metricRevenueTitle: "Revenue",
      metricAverageOrderTitle: "Average order",
      metricHint: "for the selected period",
      financeChartTitle: "Finance by day",
      financeChartHint: "for the selected period",
      ordersByChannelChartTitle: "Orders by channel",
      newCustomersChartTitle: "New customers by month",
      productsTitle: "Products",
      donutTitle: "Orders by status",
      activityTitle: "Recent activity",
      progressTitle: "Monthly revenue goal",
      progressOrdersTitle: "Monthly orders goal",
      progressHint: (value, max) => `${value} of ${max}`,
      progressOrdersHint: (value, max) => `${value} of ${max} orders`,
      quickActionsTitle: "Quick actions",
      quickActionLabels: {
        createOrder: "Create order",
        exportCsv: "Export to CSV",
        inviteUser: "Invite user",
        openReports: "Open reports",
      },
      quickActionToastTitle: (label) => `${label} — demo action`,
      reloadButton: "Reload",
    },
    standaloneTable: {
      title: "Recent orders",
      searchPlaceholder: "Search orders",
    },
    colorField: {
      label: "Category tag color",
      previewLabel: "Storefront tag",
      badgeText: "Seasonal",
    },
    dateField: {
      label: "Delivery date",
    },
    dateTimeField: {
      label: "Pick up order",
    },
    timeField: {
      label: "Delivery time",
    },
    hint: {
      metricLabel: "Average order value",
      metricHint:
        "The sum of all paid orders for the period, divided by their count. Refunds and cancelled orders are excluded.",
      discountLabel: "Supplier discount",
      discountHint:
        "Applied before tax and reflected in the purchase price, not the retail price",
      discountPlaceholder: "e.g. 12%",
    },
    confirmDialogDemo: {
      triggerLabel: "Delete order",
      title: "Delete order #1042?",
      description:
        "The order and its related data will be deleted with no way to restore them. The customer will receive a cancellation email.",
      confirmLabel: "Delete",
    },
    toaster: {
      updateStatusButton: "Update delivery status",
      updateStatusTitle: "Delivery status updated",
      updateStatusDescription: "Courier is on the way for order #10482",
      saveOrderButton: "Save order",
      saveOrderTitle: "Order saved",
      saveOrderDescription: "Order #10482 added to the fulfillment queue",
      checkStockButton: "Check stock",
      checkStockTitle: "Stock is running low",
      checkStockDescription: "SKU 4410 has 3 units left",
      sendEmailButton: "Email the customer",
      sendEmailTitle: "Failed to send the email",
      sendEmailDescription: "Check the customer's address and resend",
      removeProductButton: "Remove product from catalog",
      removeProductTitle: "Product removed from the catalog",
      removeProductDescription: "\"Aroma 12 Coffee Machine\" is hidden from the storefront",
      removeProductActionLabel: "Restore",
      restoreProductTitle: "Product restored to the catalog",
      restoreProductDescription:
        "\"Aroma 12 Coffee Machine\" is visible on the storefront again",
    },
    orders: {
      title: "Orders",
      description: "All store orders from the last 30 days",
      exportButton: "Export to CSV",
      exportToastTitle: "Export started",
      exportToastDescription: "The file will arrive by email in a couple of minutes",
      searchFilterLabel: "Search",
      statusFilterLabel: "Status",
      dateRangeFilterLabel: "Order date",
      statusAll: "All statuses",
      columnNumber: "Number",
      columnCustomer: "Customer",
      columnProduct: "Product",
      columnStatus: "Status",
      columnTotal: "Total",
      sortNumberDesc: "Number: descending",
      sortNumberAsc: "Number: ascending",
      sortTotalDesc: "Total: descending",
      sortTotalAsc: "Total: ascending",
      sortNewestFirst: "Newest first",
      sortOldestFirst: "Oldest first",
      viewOrderAction: "View order",
      editOrderAction: "Edit order",
      deleteOrderAction: "Delete order",
      deleteConfirmTitle: "Delete order?",
      deleteConfirmDescription: (orderNumber, customer) =>
        `Order #${orderNumber} from ${customer} will be deleted with no way to restore it.`,
      deleteConfirmLabel: "Delete",
      deleteToastTitle: "Order deleted",
      deleteToastDescription: (orderNumber) =>
        `Order #${orderNumber} removed from the list`,
      selectionExportAction: "Export",
      selectionExportToastTitle: (count) => `Exporting ${count} orders`,
      selectionDeleteAction: "Delete",
      selectionDeleteConfirmTitle: "Delete selected orders?",
      selectionDeleteConfirmDescription: (count) =>
        `${count} orders will be deleted with no way to restore them.`,
      selectionDeleteConfirmLabel: "Delete",
      selectionDeleteToastTitle: "Orders deleted",
      selectionDeleteToastDescription: (count) =>
        `${count} orders removed from the list`,
      reloadButton: "Reload",
    },
    orderEntity: {
      title: "Order #4187",
      description: "Nova sneakers, delivery in Austin",
      tabOverviewLabel: "Overview",
      tabHistoryLabel: "History",
      tabRelatedLabel: "Items",
      historyTitle: "Order timeline",
      relatedTitle: "Items in this order",
      reloadButton: "Reload",
      sectionOrder: "Order",
      fieldStatus: "Status",
      fieldPlaced: "Placed",
      fieldPlacedValue: "August 3, 2026, 2:12 PM",
      fieldChannel: "Channel",
      fieldChannelValue: "Online storefront",
      fieldTotal: "Total",
      fieldTotalHint: "Item total after discount, delivery is calculated separately",
      fieldTotalValue: "$2,340",
      editButton: "Edit",
      editDialogTitle: "Edit order",
      editDialogDescription: "Quick edits without leaving the page",
      editTotalLabel: "Total",
      editChannelLabel: "Channel",
      editChannelOptions: [
        { value: "online", label: "Online store" },
        { value: "retail", label: "Retail" },
      ],
      editToastTitle: "Order updated",
      sectionCustomer: "Customer",
      fieldName: "Name",
      fieldNameValue: "Emily Carter",
      fieldEmail: "Email",
      fieldEmailValue: "emily.carter@example.com",
      fieldPhone: "Phone",
      fieldPhoneValue: "+1 512 555-0142",
      sectionDelivery: "Delivery",
      fieldAddress: "Address",
      fieldAddressValue: "Austin, TX, 214 Congress Ave",
      fieldCarrier: "Carrier",
      fieldCarrierValue: "In-house courier",
      fieldDelivered: "Delivered",
      fieldDeliveredValue: "August 5, 2026, 11:40 AM",
      sendReceiptButton: "Send receipt",
      sendReceiptToastTitle: "Receipt sent",
      sendReceiptToastDescription: "The email went to emily.carter@example.com",
      cancelOrderButton: "Cancel order",
      cancelConfirmTitle: "Cancel order #4187?",
      cancelConfirmDescription:
        "The customer will get a cancellation email, and the refund will reach their card within three days.",
      cancelConfirmLabel: "Cancel order",
      cancelConfirmCancelLabel: "Keep it",
      cancelToastTitle: "Order cancelled",
      cancelToastDescription: "The refund will reach the customer within three days",
    },
    orderEdit: {
      title: "Edit order #4187",
      description: "Update the order and save the changes",
      sectionTitle: "Order",
      customerLabel: "Customer",
      customerPlaceholder: "Search customers…",
      customerEmptyLabel: "No customer found",
      productLabel: "Product",
      amountLabel: "Amount",
      dateLabel: "Delivery date",
      paidLabel: "Paid",
      commentLabel: "Comment",
      commentPlaceholder: "Add a note for the fulfillment team",
      tagsLabel: "Tags",
      tagsPlaceholder: "Search tags…",
      tagsEmptyLabel: "No tags found",
      tagsOptions: [
        { value: "gift", label: "Gift" },
        { value: "priority", label: "Priority" },
        { value: "fragile", label: "Fragile" },
        { value: "wholesale", label: "Wholesale" },
        { value: "repeat-customer", label: "Repeat customer" },
      ],
      channelsLabel: "Channels",
      channelsPlaceholder: "Search channels…",
      channelsEmptyLabel: "No channel found",
      channelsHint: "Up to 3 channels this order touched",
      channelsOptions: [
        { value: "online", label: "Online store" },
        { value: "retail", label: "Retail" },
        { value: "marketplace", label: "Marketplace" },
        { value: "phone", label: "Phone" },
        { value: "social", label: "Social media" },
      ],
      removeItemLabel: (label) => `Remove ${label}`,
      attachmentLabel: "Attachment",
      pickupLabel: "Pickup",
      deliveryTimeLabel: "Delivery time",
      labelColorLabel: "Category label color",
      supplierDiscountLabel: "Supplier discount",
      supplierDiscountHint: "Applied to purchase prices in reports",
      supplierDiscountPlaceholder: "For example, 12",
      saveToastTitle: "Order saved",
      saveToastDescription: "Order #4187 updated",
    },
    userMenu: {
      profileAction: "Profile",
      signOutAction: "Sign out",
      profileToastTitle: "Opened profile",
    },
    breadcrumbs: {
      editLabel: "Edit",
    },
    signIn: {
      title: "Sign in",
      description:
        "Use owner@example.com with the password demo to explore the panel.",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Password",
      rememberLabel: "Remember me",
      submitLabel: "Sign in",
      errorMessage: "Incorrect email or password",
      backToDemoLabel: "Back to the demo",
    },
  },
  ru: {
    appName: "Мой магазин",
    nav: {
      overview: "Обзор",
      orders: "Заказы",
      order: "Заказ №4187",
    },
    overview: {
      title: "Обзор",
      metricOrdersTitle: "Заказы",
      metricRevenueTitle: "Выручка",
      metricAverageOrderTitle: "Средний чек",
      metricHint: "за выбранный период",
      financeChartTitle: "Финансы по дням",
      financeChartHint: "за выбранный период",
      ordersByChannelChartTitle: "Заказы по каналам",
      newCustomersChartTitle: "Новые клиенты по месяцам",
      productsTitle: "Товары",
      donutTitle: "Заказы по статусам",
      activityTitle: "Последняя активность",
      progressTitle: "Цель по выручке за месяц",
      progressOrdersTitle: "Цель по заказам за месяц",
      progressHint: (value, max) => `${value} из ${max}`,
      progressOrdersHint: (value, max) => `${value} из ${max} заказов`,
      quickActionsTitle: "Быстрые действия",
      quickActionLabels: {
        createOrder: "Создать заказ",
        exportCsv: "Выгрузить в CSV",
        inviteUser: "Пригласить пользователя",
        openReports: "Открыть отчёты",
      },
      quickActionToastTitle: (label) => `${label} — демо-действие`,
      reloadButton: "Обновить",
    },
    standaloneTable: {
      title: "Последние заказы",
      searchPlaceholder: "Поиск по заказам",
    },
    colorField: {
      label: "Цвет метки категории",
      previewLabel: "Метка на витрине",
      badgeText: "Сезонное",
    },
    dateField: {
      label: "Дата доставки",
    },
    dateTimeField: {
      label: "Забрать заказ",
    },
    timeField: {
      label: "Время доставки",
    },
    hint: {
      metricLabel: "Средний чек",
      metricHint:
        "Сумма всех оплаченных заказов за период, делённая на их количество. Возвраты и отменённые заказы не учитываются.",
      discountLabel: "Скидка поставщика",
      discountHint: "Применяется до налога и отражается в закупочной цене, а не в розничной",
      discountPlaceholder: "Например, 12%",
    },
    confirmDialogDemo: {
      triggerLabel: "Удалить заказ",
      title: "Удалить заказ №1042?",
      description:
        "Заказ и связанные с ним данные будут удалены без возможности восстановления. Покупателю уйдёт письмо об отмене.",
      confirmLabel: "Удалить",
    },
    toaster: {
      updateStatusButton: "Обновить статус доставки",
      updateStatusTitle: "Статус доставки обновлён",
      updateStatusDescription: "Курьер выехал по заказу №10482",
      saveOrderButton: "Сохранить заказ",
      saveOrderTitle: "Заказ сохранён",
      saveOrderDescription: "Заказ №10482 добавлен в очередь на сборку",
      checkStockButton: "Проверить остатки",
      checkStockTitle: "Заканчивается остаток на складе",
      checkStockDescription: "По артикулу 4410 осталось 3 штуки",
      sendEmailButton: "Отправить письмо покупателю",
      sendEmailTitle: "Не удалось отправить письмо",
      sendEmailDescription: "Проверьте адрес покупателя и повторите отправку",
      removeProductButton: "Удалить товар из каталога",
      removeProductTitle: "Товар удалён из каталога",
      removeProductDescription: "«Кофемашина Aroma 12» скрыта из витрины",
      removeProductActionLabel: "Вернуть",
      restoreProductTitle: "Товар возвращён в каталог",
      restoreProductDescription: "«Кофемашина Aroma 12» снова видна в витрине",
    },
    orders: {
      title: "Заказы",
      description: "Все заказы магазина за последние 30 дней",
      exportButton: "Выгрузить в CSV",
      exportToastTitle: "Экспорт запущен",
      exportToastDescription: "Файл придёт на почту через пару минут",
      searchFilterLabel: "Поиск",
      statusFilterLabel: "Статус",
      dateRangeFilterLabel: "Дата заказа",
      statusAll: "Все статусы",
      columnNumber: "Номер",
      columnCustomer: "Покупатель",
      columnProduct: "Товар",
      columnStatus: "Статус",
      columnTotal: "Сумма",
      sortNumberDesc: "Номер: по убыванию",
      sortNumberAsc: "Номер: по возрастанию",
      sortTotalDesc: "Сумма: по убыванию",
      sortTotalAsc: "Сумма: по возрастанию",
      sortNewestFirst: "Сначала новые",
      sortOldestFirst: "Сначала старые",
      viewOrderAction: "Просмотреть заказ",
      editOrderAction: "Редактировать заказ",
      deleteOrderAction: "Удалить заказ",
      deleteConfirmTitle: "Удалить заказ?",
      deleteConfirmDescription: (orderNumber, customer) =>
        `Заказ №${orderNumber} покупателя ${customer} будет удалён без возможности восстановить.`,
      deleteConfirmLabel: "Удалить",
      deleteToastTitle: "Заказ удалён",
      deleteToastDescription: (orderNumber) => `Заказ №${orderNumber} убран из списка`,
      selectionExportAction: "Экспорт",
      selectionExportToastTitle: (count) => `Экспортируется заказов: ${count}`,
      selectionDeleteAction: "Удалить",
      selectionDeleteConfirmTitle: "Удалить выбранные заказы?",
      selectionDeleteConfirmDescription: (count) =>
        `Будет удалено заказов: ${count}, без возможности восстановить.`,
      selectionDeleteConfirmLabel: "Удалить",
      selectionDeleteToastTitle: "Заказы удалены",
      selectionDeleteToastDescription: (count) =>
        `Убрано из списка заказов: ${count}`,
      reloadButton: "Обновить",
    },
    orderEntity: {
      title: "Заказ №4187",
      description: "Кроссовки Nova, доставка по Казани",
      tabOverviewLabel: "Обзор",
      tabHistoryLabel: "История",
      tabRelatedLabel: "Состав",
      historyTitle: "Хронология заказа",
      relatedTitle: "Состав заказа",
      reloadButton: "Обновить",
      sectionOrder: "Заказ",
      fieldStatus: "Статус",
      fieldPlaced: "Оформлен",
      fieldPlacedValue: "3 августа 2026, 14:12",
      fieldChannel: "Канал",
      fieldChannelValue: "Онлайн-витрина",
      fieldTotal: "Сумма",
      fieldTotalHint: "Сумма товаров со скидкой, доставка считается отдельно",
      fieldTotalValue: "₽ 2 340",
      editButton: "Редактировать",
      editDialogTitle: "Редактирование заказа",
      editDialogDescription: "Быстрые правки, не уходя со страницы",
      editTotalLabel: "Сумма",
      editChannelLabel: "Канал",
      editChannelOptions: [
        { value: "online", label: "Онлайн-магазин" },
        { value: "retail", label: "Розница" },
      ],
      editToastTitle: "Заказ обновлён",
      sectionCustomer: "Покупатель",
      fieldName: "Имя",
      fieldNameValue: "Смирнова Екатерина",
      fieldEmail: "Почта",
      fieldEmailValue: "smirnova@example.com",
      fieldPhone: "Телефон",
      fieldPhoneValue: "+7 900 123-45-67",
      sectionDelivery: "Доставка",
      fieldAddress: "Адрес",
      fieldAddressValue: "Казань, ул. Баумана, 12",
      fieldCarrier: "Служба",
      fieldCarrierValue: "Своя курьерская",
      fieldDelivered: "Доставлен",
      fieldDeliveredValue: "5 августа 2026, 11:40",
      sendReceiptButton: "Отправить чек",
      sendReceiptToastTitle: "Чек отправлен",
      sendReceiptToastDescription: "Письмо ушло на smirnova@example.com",
      cancelOrderButton: "Отменить заказ",
      cancelConfirmTitle: "Отменить заказ №4187?",
      cancelConfirmDescription:
        "Покупатель получит письмо об отмене, а деньги вернутся на карту в течение трёх дней.",
      cancelConfirmLabel: "Отменить заказ",
      cancelConfirmCancelLabel: "Оставить",
      cancelToastTitle: "Заказ отменён",
      cancelToastDescription: "Деньги вернутся покупателю в течение трёх дней",
    },
    orderEdit: {
      title: "Редактирование заказа №4187",
      description: "Обновите заказ и сохраните изменения",
      sectionTitle: "Заказ",
      customerLabel: "Покупатель",
      customerPlaceholder: "Поиск покупателя…",
      customerEmptyLabel: "Покупатель не найден",
      productLabel: "Товар",
      amountLabel: "Сумма",
      dateLabel: "Дата доставки",
      paidLabel: "Оплачен",
      commentLabel: "Комментарий",
      commentPlaceholder: "Добавьте заметку для сборщиков заказа",
      tagsLabel: "Теги",
      tagsPlaceholder: "Поиск тегов…",
      tagsEmptyLabel: "Теги не найдены",
      tagsOptions: [
        { value: "gift", label: "Подарок" },
        { value: "priority", label: "Срочно" },
        { value: "fragile", label: "Хрупкое" },
        { value: "wholesale", label: "Опт" },
        { value: "repeat-customer", label: "Постоянный клиент" },
      ],
      channelsLabel: "Каналы",
      channelsPlaceholder: "Поиск каналов…",
      channelsEmptyLabel: "Канал не найден",
      channelsHint: "До 3 каналов, через которые пришёл заказ",
      channelsOptions: [
        { value: "online", label: "Онлайн-магазин" },
        { value: "retail", label: "Розница" },
        { value: "marketplace", label: "Маркетплейс" },
        { value: "phone", label: "Телефон" },
        { value: "social", label: "Соцсети" },
      ],
      removeItemLabel: (label) => `Убрать ${label}`,
      attachmentLabel: "Вложение",
      pickupLabel: "Забрать заказ",
      deliveryTimeLabel: "Время доставки",
      labelColorLabel: "Цвет метки категории",
      supplierDiscountLabel: "Скидка поставщика",
      supplierDiscountHint: "Применяется к закупочным ценам в отчётах",
      supplierDiscountPlaceholder: "Например, 12",
      saveToastTitle: "Заказ сохранён",
      saveToastDescription: "Заказ №4187 обновлён",
    },
    userMenu: {
      profileAction: "Профиль",
      signOutAction: "Выйти",
      profileToastTitle: "Открыт профиль",
    },
    breadcrumbs: {
      editLabel: "Редактирование",
    },
    signIn: {
      title: "Вход",
      description:
        "Используйте owner@example.com и пароль demo, чтобы посмотреть панель.",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Пароль",
      rememberLabel: "Запомнить меня",
      submitLabel: "Войти",
      errorMessage: "Неверный email или пароль",
      backToDemoLabel: "Вернуться в демо",
    },
  },
}
