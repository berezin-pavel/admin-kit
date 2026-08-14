import { StateEmpty } from "@/registry/state-empty/state-empty"
import {
  WidgetTable,
  type WidgetTableColumn,
} from "@/registry/widget-table/widget-table"

import type { ShowcaseEntry } from "./types"
import { WidgetTableShowcaseView } from "./widget-table-view"

interface OrderRow {
  number: string
  customer: string
  total: string
}

const columns: readonly WidgetTableColumn<OrderRow>[] = [
  { id: "number", title: "Number", cell: (row) => row.number },
  { id: "customer", title: "Customer", cell: (row) => row.customer },
  {
    id: "total",
    title: "Amount",
    align: "right",
    cell: (row) => row.total,
  },
]

const rows: readonly OrderRow[] = [
  { number: "1043", customer: "Bennett A.", total: "$4,200" },
  { number: "1042", customer: "Peters S.", total: "$1,750" },
  { number: "1041", customer: "Sanders M.", total: "$12,400" },
]

interface OrderWithDateRow {
  number: string
  customer: string
  createdAt: Date
}

const columnsWithDate: readonly WidgetTableColumn<OrderWithDateRow>[] = [
  { id: "number", title: "Number", cell: (row) => row.number },
  { id: "customer", title: "Customer", cell: (row) => row.customer },
  {
    id: "createdAt",
    title: "Date",
    align: "right",
    cell: (row) => row.createdAt.toLocaleDateString("en-US"),
  },
]

const rowsWithDate: readonly OrderWithDateRow[] = [
  {
    number: "1043",
    customer: "Bennett A.",
    createdAt: new Date("2026-08-09"),
  },
  {
    number: "1042",
    customer: "Peters S.",
    createdAt: new Date("2026-08-08"),
  },
]

export const widgetTableEntry: ShowcaseEntry = {
  item: "widget-table",
  title: "Table widget",
  description:
    "A self-contained table for a dashboard: columns and rows come in via props, and each column pulls its value from a row through cell. The title is optional — without it the toolbar panel sits as the card's first row. The toolbar prop (the consumer's filters) sits in the header on the left, with the record count, page size picker, and sort select on the right of the same header; the card's footer is reserved for pagination alone, with page buttons centered, their count depending on the total number of pages. Sorting is controlled: a column with sortable reports a click through onSortChange, but the table doesn't reorder rows — whoever owns the data does that. The sortOptions prop adds the same choice as a select: each option has its own sort, which doesn't have to reference a visible column — that's how sorting by a hidden or composite field is set up. The select and the column-header buttons share the same sort, so they show a consistent state. Pagination can offer a page-size choice via pageSizeOptions and onPageSizeChange. Without rows and without the empty prop it shows a default state.",
  views: [
    {
      id: "multiple-rows",
      name: "Multiple rows",
      render: () => (
        <WidgetTable title="Recent orders" columns={columns} rows={rows} />
      ),
    },
    {
      id: "single-row",
      name: "One row",
      render: () => (
        <WidgetTable
          title="Recent orders"
          columns={columns}
          rows={rows.slice(0, 1)}
        />
      ),
    },
    {
      id: "stable-row-key",
      name: "With a stable row key",
      render: () => (
        <WidgetTable
          title="Recent orders"
          columns={columns}
          rows={rows}
          getRowKey={(row) => row.number}
        />
      ),
    },
    {
      id: "derived-cell",
      name: "A row with a field that isn't shown directly",
      render: () => (
        <WidgetTable
          title="Recent orders"
          columns={columnsWithDate}
          rows={rowsWithDate}
          getRowKey={(row) => row.number}
        />
      ),
    },
    {
      id: "empty-custom",
      name: "No rows",
      render: () => (
        <WidgetTable
          title="Recent orders"
          columns={columns}
          rows={[]}
          empty={<StateEmpty title="No orders yet" />}
        />
      ),
    },
    {
      id: "empty-default",
      name: "No rows, default state",
      render: () => (
        <WidgetTable title="Recent orders" columns={columns} rows={[]} />
      ),
    },
    {
      id: "with-header-toolbar",
      name: "With a title and a header panel",
      render: () => (
        <WidgetTableShowcaseView title="Recent orders" withToolbar />
      ),
    },
    {
      id: "without-header",
      name: "Without a title",
      render: () => <WidgetTableShowcaseView withToolbar />,
    },
    {
      id: "with-pagination",
      name: "With pagination",
      render: () => (
        <WidgetTableShowcaseView title="Recent orders" withPagination />
      ),
    },
    {
      id: "with-toolbar-and-pagination",
      name: "With a panel and pagination together",
      render: () => (
        <WidgetTableShowcaseView
          title="Recent orders"
          withToolbar
          withPagination
        />
      ),
    },
    {
      id: "with-sort",
      name: "With sortable columns",
      render: () => <WidgetTableShowcaseView title="Recent orders" withSort />,
    },
    {
      id: "with-page-size",
      name: "With a page size picker",
      render: () => (
        <WidgetTableShowcaseView
          title="Recent orders"
          withPagination
          withPageSizeOptions
        />
      ),
    },
    {
      id: "with-sort-select",
      name: "With a sort select, including by a hidden field",
      render: () => (
        <WidgetTableShowcaseView
          title="Recent orders"
          withSort
          withSortSelect
        />
      ),
    },
    {
      id: "with-row-actions",
      name: "With row icon-button actions",
      render: () => (
        <WidgetTableShowcaseView title="Recent orders" withRowActions />
      ),
    },
    {
      id: "with-row-selection",
      name: "With row selection",
      render: () => (
        <WidgetTableShowcaseView title="Recent orders" withSelection />
      ),
    },
    {
      id: "loading",
      name: "Loading",
      render: () => (
        <WidgetTable
          title="Recent orders"
          columns={columns}
          rows={rows}
          loading
        />
      ),
    },
  ],
}
