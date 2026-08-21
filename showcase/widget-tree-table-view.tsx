"use client"

import { useState } from "react"
import { Footprints, Headphones, Pencil, Trash2 } from "lucide-react"

import { RowActions } from "@/registry/row-actions/row-actions"
import {
  WidgetTreeTable,
  type TreeTableColumn,
  type TreeTableSection,
} from "@/registry/widget-tree-table/widget-tree-table"

interface ProductRow {
  sku: string
  name: string
  price: string
  stock: number
}

function countRows(section: TreeTableSection<ProductRow>): number {
  const own = section.rows?.length ?? 0
  const nested =
    section.sections?.reduce((sum, child) => sum + countRows(child), 0) ?? 0
  return own + nested
}

const catalogue: readonly TreeTableSection<ProductRow>[] = [
  {
    id: "footwear",
    title: "Footwear",
    icon: Footprints,
    color: "#2563eb",
    sections: [
      {
        id: "sneakers",
        title: "Sneakers",
        color: "#7c3aed",
        rows: [
          { sku: "SN-100", name: "Trailrunner Low", price: "$89", stock: 42 },
          { sku: "SN-101", name: "Court Classic", price: "$74", stock: 18 },
        ],
      },
      {
        id: "boots",
        title: "Boots",
        color: "#ea580c",
        rows: [
          { sku: "BT-200", name: "Alpine Hiker", price: "$149", stock: 9 },
          { sku: "BT-201", name: "Rainwalker", price: "$118", stock: 27 },
          { sku: "BT-202", name: "Steel Toe Work", price: "$132", stock: 15 },
        ],
      },
    ],
  },
  {
    id: "electronics",
    title: "Electronics",
    icon: Headphones,
    color: "#16a34a",
    sections: [
      {
        id: "audio",
        title: "Audio",
        color: "#64748b",
        rows: [
          {
            sku: "AU-300",
            name: "Over-Ear Headphones",
            price: "$199",
            stock: 33,
          },
          { sku: "AU-301", name: "Wireless Earbuds", price: "$129", stock: 61 },
        ],
      },
    ],
  },
]

const columns: readonly TreeTableColumn<ProductRow>[] = [
  { id: "name", title: "Name", cell: (row) => row.name },
  { id: "sku", title: "SKU", cell: (row) => row.sku },
  { id: "price", title: "Price", align: "right", cell: (row) => row.price },
  {
    id: "stock",
    title: "Stock",
    align: "right",
    cell: (row) => row.stock,
    sectionCell: (section) => countRows(section),
  },
]

export interface WidgetTreeTableStoreViewProps {
  initialExpandedIds?: readonly string[]
  withActions?: boolean
  loading?: boolean
  empty?: boolean
}

export function WidgetTreeTableStoreView({
  initialExpandedIds = ["footwear", "electronics"],
  withActions = false,
  loading = false,
  empty = false,
}: WidgetTreeTableStoreViewProps) {
  const [expandedIds, setExpandedIds] = useState<readonly string[]>(
    initialExpandedIds
  )

  return (
    <WidgetTreeTable
      title="Store catalogue"
      columns={columns}
      sections={empty ? [] : catalogue}
      getRowKey={(row) => row.sku}
      expandedIds={expandedIds}
      onExpandedChange={setExpandedIds}
      loading={loading}
      rowActions={
        withActions
          ? () => (
              <RowActions
                actions={[
                  { id: "edit", label: "Edit", icon: Pencil, onSelect: () => {} },
                  {
                    id: "delete",
                    label: "Delete",
                    icon: Trash2,
                    tone: "danger",
                    onSelect: () => {},
                  },
                ]}
              />
            )
          : undefined
      }
      sectionActions={
        withActions
          ? () => (
              <RowActions
                actions={[
                  { id: "edit", label: "Edit", icon: Pencil, onSelect: () => {} },
                  {
                    id: "delete",
                    label: "Delete",
                    icon: Trash2,
                    tone: "danger",
                    onSelect: () => {},
                  },
                ]}
              />
            )
          : undefined
      }
    />
  )
}
