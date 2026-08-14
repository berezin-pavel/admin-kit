"use client"

import { useState } from "react"

import {
  MultiSelectField,
  type MultiSelectFieldOption,
} from "@/registry/multi-select-field/multi-select-field"

const DEFAULT_OPTIONS: readonly MultiSelectFieldOption[] = [
  { value: "nyc-01", label: "NYC-01" },
  { value: "lax-02", label: "LAX-02" },
  { value: "ord-03", label: "ORD-03" },
  { value: "dfw-04", label: "DFW-04" },
  { value: "sea-05", label: "SEA-05" },
  { value: "mia-06", label: "MIA-06" },
  { value: "den-07", label: "DEN-07" },
  { value: "atl-08", label: "ATL-08" },
  {
    value: "nyc-distribution",
    label: "New York Metro Regional Distribution Center",
  },
  {
    value: "lax-distribution",
    label: "Los Angeles Harbor Fulfillment Complex — Building C",
  },
  {
    value: "ord-distribution",
    label: "Chicago O'Hare Air Cargo Transfer Facility",
  },
  {
    value: "dfw-distribution",
    label: "Dallas–Fort Worth Regional Warehouse and Cross-Dock",
  },
  { value: "sea-cold", label: "Seattle Waterfront Cold Storage Annex" },
  {
    value: "mia-perishables",
    label: "Miami International Perishables Handling Center",
  },
  { value: "den-mountain", label: "Denver Mountain Region Overflow Depot" },
  {
    value: "atl-southeast",
    label: "Atlanta Southeast Regional Consolidation Hub",
  },
  { value: "phx-09", label: "PHX-09" },
  { value: "bos-10", label: "BOS-10" },
  { value: "sfo-11", label: "SFO-11" },
  { value: "por-12", label: "POR-12" },
  { value: "min-13", label: "MIN-13" },
  { value: "det-14", label: "DET-14" },
  { value: "hou-15", label: "HOU-15" },
  { value: "phl-16", label: "PHL-16" },
  {
    value: "phx-returns",
    label: "Phoenix Returns Processing and Refurbishment Center",
  },
  {
    value: "bos-lastmile",
    label: "Boston Last-Mile Delivery Staging Facility",
  },
  {
    value: "sfo-tech",
    label: "San Francisco Bay Area Electronics Handling Vault",
  },
  { value: "por-timber", label: "Portland Timber District Bulk Yard" },
  { value: "min-14th", label: "Minneapolis 14th Avenue Cross-Dock" },
  { value: "det-motor", label: "Detroit Motor City Parts Depot" },
  { value: "hou-gulf", label: "Houston Gulf Coast Import Terminal" },
  { value: "phl-northeast", label: "Philadelphia Northeast Corridor Hub" },
  { value: "slc-17", label: "SLC-17" },
  { value: "stl-18", label: "STL-18" },
]

export function MultiSelectFieldView({
  initialValue = [],
  label,
  options = DEFAULT_OPTIONS,
  placeholder,
  emptyLabel,
  maxItems,
  hint,
  error,
  disabled = false,
}: {
  initialValue?: readonly string[]
  label?: string
  options?: readonly MultiSelectFieldOption[]
  placeholder?: string
  emptyLabel?: string
  maxItems?: number
  hint?: string
  error?: string
  disabled?: boolean
}) {
  const [value, setValue] = useState<readonly string[]>(initialValue)

  return (
    <div className="max-w-sm">
      <MultiSelectField
        value={value}
        onChange={setValue}
        options={options}
        label={label}
        placeholder={placeholder}
        emptyLabel={emptyLabel}
        maxItems={maxItems}
        hint={hint}
        error={error}
        disabled={disabled}
      />
    </div>
  )
}
