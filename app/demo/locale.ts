import type { DemoLocale } from "./locale-store"

export interface DemoDictionary {
  appName: string
  nav: {
    overview: string
    orders: string
    products: string
    order: string
  }
  search: {
    button: string
    shortcut: string
    placeholder: string
    empty: string
    title: string
  }
  notifications: {
    button: string
    title: string
    empty: string
    markAllRead: string
    unreadLabel: (count: number) => string
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
    metricRefundsTitle: string
    paymentsDonutTitle: string
    topCustomersTitle: string
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
    exportToastTitle: string
    exportToastDescription: (rows: number) => string
    searchFilterLabel: string
    statusFilterLabel: string
    dateRangeFilterLabel: string
    resetFiltersLabel: string
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
    tabEditLabel: string
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
  products: {
    title: string
    description: string
    addSection: string
    emptyTitle: string
    actionsColumn: string
    tabTree: string
    tabCategories: string
    tabProducts: string
    searchPlaceholder: string
    resetFiltersLabel: string
    categoryLabel: string
    categoryFilterPlaceholder: string
    parentLabel: string
    noParent: string
    sortLabel: string
    iconLabel: string
    iconFieldLabels: {
      placeholder: string
      searchPlaceholder: string
      empty: string
      clear: string
      open: string
      showMore: (count: number) => string
      loading: string
    }
    columnName: string
    columnSku: string
    columnPrice: string
    columnStock: string
    columnCost: string
    columnMarkup: string
    columnHidden: string
    columnProducts: string
    yes: string
    no: string
    itemsCount: (count: number) => string
    editProductTitle: string
    addProductTitle: string
    editSectionTitle: string
    addSectionTitle: string
    nameLabel: string
    skuLabel: string
    priceLabel: string
    stockLabel: string
    costLabel: string
    hiddenLabel: string
    titleLabel: string
    colorLabel: string
    editAction: string
    deleteAction: string
    addProductAction: string
    deleteProductTitle: string
    deleteProductDescription: (name: string) => string
    deleteSectionTitle: string
    deleteSectionDescription: (title: string, count: number) => string
    savedToast: string
    deletedToast: string
    addedToast: string
    sortBySortAsc: string
    sortBySortDesc: string
    sortByTitleAsc: string
    sortByTitleDesc: string
    sortByNameAsc: string
    sortByNameDesc: string
    sortByPriceAsc: string
    sortByPriceDesc: string
    categorySelectionDeleteAction: string
    categorySelectionDeleteConfirmTitle: string
    categorySelectionDeleteConfirmDescription: (count: number) => string
    categorySelectionDeleteConfirmLabel: string
    categorySelectionDeleteToastTitle: string
    categorySelectionDeleteToastDescription: (count: number) => string
    productSelectionDeleteAction: string
    productSelectionDeleteConfirmTitle: string
    productSelectionDeleteConfirmDescription: (count: number) => string
    productSelectionDeleteConfirmLabel: string
    productSelectionDeleteToastTitle: string
    productSelectionDeleteToastDescription: (count: number) => string
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
    photosLabel: string
    photosHint: string
    photosErrorText: string
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
      products: "Products",
      order: "Order #4187",
    },
    search: {
      button: "Search",
      shortcut: "⌘K",
      placeholder: "Search pages and orders",
      empty: "Nothing found",
      title: "Search",
    },
    notifications: {
      button: "Notifications",
      title: "Notifications",
      empty: "No notifications yet",
      markAllRead: "Mark all as read",
      unreadLabel: (count) => `${count} unread`,
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
      metricRefundsTitle: "Refunds",
      paymentsDonutTitle: "Payment methods",
      topCustomersTitle: "Top customers",
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
      exportToastTitle: "Export started",
      exportToastDescription: (rows: number) =>
        `${rows} rows are ready as CSV`,
      searchFilterLabel: "Search",
      statusFilterLabel: "Status",
      dateRangeFilterLabel: "Order date",
      resetFiltersLabel: "Reset filters",
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
      tabEditLabel: "Edit",
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
      editButton: "Quick edit",
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
    products: {
      title: "Products",
      description: "The full storefront catalogue, grouped by category",
      addSection: "Add category",
      emptyTitle: "No products yet",
      actionsColumn: "Actions",
      tabTree: "Catalogue",
      tabCategories: "Categories",
      tabProducts: "Products",
      searchPlaceholder: "Search…",
      resetFiltersLabel: "Reset filters",
      categoryLabel: "Category",
      categoryFilterPlaceholder: "All categories",
      parentLabel: "Parent",
      noParent: "Top level",
      sortLabel: "Sort",
      iconLabel: "Icon",
      iconFieldLabels: {
        placeholder: "Choose an icon",
        searchPlaceholder: "Search icons",
        empty: "No icons found",
        clear: "Remove icon",
        open: "Open the icon list",
        showMore: (count) => `Show ${count} more`,
        loading: "Loading icons",
      },
      columnName: "Name",
      columnSku: "SKU",
      columnPrice: "Price",
      columnStock: "Stock",
      columnCost: "Cost",
      columnMarkup: "Markup",
      columnHidden: "Hidden",
      columnProducts: "Products",
      yes: "Yes",
      no: "No",
      itemsCount: (count) => `${count} items`,
      editProductTitle: "Edit product",
      addProductTitle: "Add product",
      editSectionTitle: "Edit category",
      addSectionTitle: "Add category",
      nameLabel: "Name",
      skuLabel: "SKU",
      priceLabel: "Base price",
      stockLabel: "Stock",
      costLabel: "Cost",
      hiddenLabel: "Hidden on site",
      titleLabel: "Title",
      colorLabel: "Stripe color",
      editAction: "Edit",
      deleteAction: "Delete",
      addProductAction: "Add product",
      deleteProductTitle: "Delete product?",
      deleteProductDescription: (name) =>
        `"${name}" will be removed from the catalogue with no way to restore it.`,
      deleteSectionTitle: "Delete category?",
      deleteSectionDescription: (title, count) =>
        `"${title}" and its ${count} products will be removed with no way to restore them.`,
      savedToast: "Saved",
      deletedToast: "Deleted",
      addedToast: "Added",
      sortBySortAsc: "By sort, ascending",
      sortBySortDesc: "By sort, descending",
      sortByTitleAsc: "By title, A–Z",
      sortByTitleDesc: "By title, Z–A",
      sortByNameAsc: "By name, A–Z",
      sortByNameDesc: "By name, Z–A",
      sortByPriceAsc: "By price, low to high",
      sortByPriceDesc: "By price, high to low",
      categorySelectionDeleteAction: "Delete",
      categorySelectionDeleteConfirmTitle: "Delete the selected categories?",
      categorySelectionDeleteConfirmDescription: (count) =>
        `${count} ${count === 1 ? "category" : "categories"} and everything in them will be removed with no way to restore them.`,
      categorySelectionDeleteConfirmLabel: "Delete",
      categorySelectionDeleteToastTitle: "Categories deleted",
      categorySelectionDeleteToastDescription: (count) =>
        `${count} ${count === 1 ? "category" : "categories"} removed`,
      productSelectionDeleteAction: "Delete",
      productSelectionDeleteConfirmTitle: "Delete the selected products?",
      productSelectionDeleteConfirmDescription: (count) =>
        `${count} ${count === 1 ? "product" : "products"} will be removed from the catalogue with no way to restore them.`,
      productSelectionDeleteConfirmLabel: "Delete",
      productSelectionDeleteToastTitle: "Products deleted",
      productSelectionDeleteToastDescription: (count) =>
        `${count} ${count === 1 ? "product" : "products"} removed`,
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
      photosLabel: "Images",
      photosHint: "The first image becomes the order cover; anything over 3 MB is rejected by the server",
      photosErrorText: "The server rejected the file: over 3 MB",
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
      products: "Товары",
      order: "Заказ №4187",
    },
    search: {
      button: "Поиск",
      shortcut: "⌘K",
      placeholder: "Поиск по страницам и заказам",
      empty: "Ничего не найдено",
      title: "Поиск",
    },
    notifications: {
      button: "Уведомления",
      title: "Уведомления",
      empty: "Уведомлений пока нет",
      markAllRead: "Отметить все прочитанными",
      unreadLabel: (count) => `${count} непрочитанных`,
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
      metricRefundsTitle: "Возвраты",
      paymentsDonutTitle: "Способы оплаты",
      topCustomersTitle: "Лучшие клиенты",
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
      exportToastTitle: "Экспорт запущен",
      exportToastDescription: (rows: number) =>
        `${rows} строк выгружено в CSV`,
      searchFilterLabel: "Поиск",
      statusFilterLabel: "Статус",
      dateRangeFilterLabel: "Дата заказа",
      resetFiltersLabel: "Сбросить фильтры",
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
      tabEditLabel: "Редактирование",
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
      editButton: "Быстрая правка",
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
    products: {
      title: "Товары",
      description: "Полный каталог витрины, сгруппированный по категориям",
      addSection: "Добавить категорию",
      emptyTitle: "Товаров пока нет",
      actionsColumn: "Действия",
      tabTree: "Каталог",
      tabCategories: "Категории",
      tabProducts: "Товары",
      searchPlaceholder: "Поиск…",
      resetFiltersLabel: "Сбросить фильтры",
      categoryLabel: "Категория",
      categoryFilterPlaceholder: "Все категории",
      parentLabel: "Родитель",
      noParent: "Верхний уровень",
      sortLabel: "Сортировка",
      iconLabel: "Иконка",
      iconFieldLabels: {
        placeholder: "Выберите иконку",
        searchPlaceholder: "Поиск иконок",
        empty: "Иконок не найдено",
        clear: "Убрать иконку",
        open: "Открыть список иконок",
        showMore: (count) => `Показать ещё ${count}`,
        loading: "Загрузка иконок",
      },
      columnName: "Название",
      columnSku: "Артикул",
      columnPrice: "Цена",
      columnStock: "Остаток",
      columnCost: "Себестоимость",
      columnMarkup: "Наценка",
      columnHidden: "Скрыт",
      columnProducts: "Товары",
      yes: "Да",
      no: "Нет",
      itemsCount: (count) => {
        const lastTwo = count % 100
        const last = count % 10
        const word =
          last === 1 && lastTwo !== 11
            ? "товар"
            : last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)
              ? "товара"
              : "товаров"
        return `${count} ${word}`
      },
      editProductTitle: "Редактирование товара",
      addProductTitle: "Добавление товара",
      editSectionTitle: "Редактирование категории",
      addSectionTitle: "Добавление категории",
      nameLabel: "Название",
      skuLabel: "Артикул",
      priceLabel: "Базовая цена",
      stockLabel: "Остаток",
      costLabel: "Себестоимость",
      hiddenLabel: "Скрыт на витрине",
      titleLabel: "Название",
      colorLabel: "Цвет полосы",
      editAction: "Редактировать",
      deleteAction: "Удалить",
      addProductAction: "Добавить товар",
      deleteProductTitle: "Удалить товар?",
      deleteProductDescription: (name) =>
        `Товар «${name}» будет удалён из каталога без возможности восстановить.`,
      deleteSectionTitle: "Удалить категорию?",
      deleteSectionDescription: (title, count) =>
        `Категория «${title}» и ${count} товаров в ней будут удалены без возможности восстановить.`,
      savedToast: "Сохранено",
      deletedToast: "Удалено",
      addedToast: "Добавлено",
      sortBySortAsc: "По сортировке, по возрастанию",
      sortBySortDesc: "По сортировке, по убыванию",
      sortByTitleAsc: "По названию, А–Я",
      sortByTitleDesc: "По названию, Я–А",
      sortByNameAsc: "По названию, А–Я",
      sortByNameDesc: "По названию, Я–А",
      sortByPriceAsc: "По цене, по возрастанию",
      sortByPriceDesc: "По цене, по убыванию",
      categorySelectionDeleteAction: "Удалить",
      categorySelectionDeleteConfirmTitle: "Удалить выбранные категории?",
      categorySelectionDeleteConfirmDescription: (count) => {
        const lastTwo = count % 100
        const last = count % 10
        const word =
          last === 1 && lastTwo !== 11
            ? "категория"
            : last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)
              ? "категории"
              : "категорий"
        return `${count} ${word} и всё их содержимое будут удалены без возможности восстановить.`
      },
      categorySelectionDeleteConfirmLabel: "Удалить",
      categorySelectionDeleteToastTitle: "Категории удалены",
      categorySelectionDeleteToastDescription: (count) => {
        const lastTwo = count % 100
        const last = count % 10
        const word =
          last === 1 && lastTwo !== 11
            ? "категория"
            : last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)
              ? "категории"
              : "категорий"
        return `Удалено: ${count} ${word}`
      },
      productSelectionDeleteAction: "Удалить",
      productSelectionDeleteConfirmTitle: "Удалить выбранные товары?",
      productSelectionDeleteConfirmDescription: (count) =>
        `${count} ${
          count % 10 === 1 && count % 100 !== 11
            ? "товар будет удалён"
            : "товаров будет удалено"
        } из каталога без возможности восстановить.`,
      productSelectionDeleteConfirmLabel: "Удалить",
      productSelectionDeleteToastTitle: "Товары удалены",
      productSelectionDeleteToastDescription: (count) =>
        `Удалено: ${count}`,
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
      photosLabel: "Изображения",
      photosHint: "Первое изображение идёт обложкой заказа; файл больше 3 МБ сервер отклонит",
      photosErrorText: "Сервер отклонил файл: больше 3 МБ",
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
