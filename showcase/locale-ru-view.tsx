"use client"

import { useState } from "react"

import { DateField } from "@/registry/date-field/date-field"
import { localeRu } from "@/registry/locale-ru/locale-ru"
import {
  WidgetTable,
  type WidgetTableColumn,
} from "@/registry/widget-table/widget-table"

interface OrderRow {
  number: string
  customer: string
  total: string
}

const columns: readonly WidgetTableColumn<OrderRow>[] = [
  { id: "number", title: "Номер", cell: (row) => row.number },
  { id: "customer", title: "Покупатель", cell: (row) => row.customer },
  { id: "total", title: "Сумма", align: "right", cell: (row) => row.total },
]

const rows: readonly OrderRow[] = [
  { number: "1043", customer: "Смирнова Е.", total: "₽ 4 200" },
  { number: "1042", customer: "Петров С.", total: "₽ 1 750" },
  { number: "1041", customer: "Сидорова М.", total: "₽ 12 400" },
]

export function LocaleRuView() {
  const [value, setValue] = useState("2026-08-14")

  return (
    <div className="flex flex-col gap-4">
      <WidgetTable
        title="Последние заказы"
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.number}
        labels={localeRu.widgetTable}
      />
      <div className="max-w-xs">
        <DateField
          label="Дата доставки"
          value={value}
          onChange={setValue}
          locale={localeRu.dateField.locale}
          displayFormat={localeRu.dateField.displayFormat}
        />
      </div>
    </div>
  )
}
