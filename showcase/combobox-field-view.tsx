"use client"

import { useState } from "react"

import {
  ComboboxField,
  type ComboboxFieldOption,
} from "@/registry/combobox-field/combobox-field"

const PRODUCTS: readonly ComboboxFieldOption[] = [
  { value: "nova-sneakers", label: "Nova Sneakers" },
  { value: "pulse-wireless-headphones", label: "Pulse Wireless Headphones" },
  { value: "city-commuter-backpack", label: "City Commuter Backpack" },
  { value: "basic-cotton-hoodie", label: "Basic Cotton Hoodie" },
  { value: "loop-insulated-travel-mug", label: "Loop Insulated Travel Mug" },
  { value: "classic-baseball-cap", label: "Classic Baseball Cap" },
  {
    value: "mechanic-pro-keyboard",
    label: "Mechanic Pro Low-Profile Wireless Keyboard",
  },
  {
    value: "expedition-travel-bottle",
    label: "Expedition Insulated Travel Bottle 1.2L",
  },
  {
    value: "aurora-throw-blanket",
    label:
      "Aurora Ultra-Soft Oversized Knit Throw Blanket for Reading Nooks",
  },
  { value: "zenith-running-shorts", label: "Zenith Running Shorts" },
  { value: "drift-canvas-tote-bag", label: "Drift Canvas Tote Bag" },
  { value: "halo-bluetooth-speaker", label: "Halo Bluetooth Speaker" },
  {
    value: "ember-coffee-mug-set",
    label: "Ember Ceramic Coffee Mug Set of Four",
  },
  {
    value: "vertex-trail-shoes",
    label: "Vertex Trail Running Shoes with Reinforced Toe Cap",
  },
  { value: "slate-leather-wallet", label: "Slate Leather Wallet" },
  { value: "crescent-night-light", label: "Crescent Moon Night Light" },
  { value: "tundra-rain-jacket", label: "Tundra Waterproof Rain Jacket" },
  { value: "pixel-gaming-mouse", label: "Pixel Mechanical Gaming Mouse" },
  {
    value: "willow-pillow-cover",
    label: "Willow Linen Throw Pillow Cover",
  },
  {
    value: "atlas-map-poster",
    label: "Atlas World Map Wall Poster, Large Format",
  },
  { value: "breeze-beach-towel", label: "Breeze Quick-Dry Beach Towel" },
  {
    value: "comet-kids-sneakers",
    label: "Comet Kids' Light-Up Sneakers",
  },
  { value: "juniper-soy-candle", label: "Juniper Scented Soy Candle" },
  {
    value: "horizon-standing-desk",
    label: "Horizon Adjustable Standing Desk",
  },
  {
    value: "ridge-laptop-sleeve",
    label: "Ridge Hardshell Laptop Sleeve for 13 to 16 Inch Laptops",
  },
  { value: "marble-plant-pot", label: "Marble Ceramic Plant Pot, Small" },
  { value: "fjord-wool-beanie", label: "Fjord Merino Wool Beanie" },
  {
    value: "solace-weighted-blanket",
    label: "Solace Weighted Blanket, 15 lb, Queen Size",
  },
  {
    value: "pinnacle-trekking-poles",
    label: "Pinnacle Carbon Fiber Trekking Poles, Pair",
  },
  {
    value: "meadow-bath-towel-set",
    label: "Meadow Organic Cotton Bath Towel Set",
  },
  { value: "cobalt-camping-mug", label: "Cobalt Enamel Camping Mug" },
  { value: "ranger-pocket-knife", label: "Ranger Multi-Tool Pocket Knife" },
  {
    value: "lumen-bike-headlight",
    label: "Lumen Rechargeable Bike Headlight",
  },
  {
    value: "drift-wireless-charger",
    label: "Drift Wireless Charging Pad",
  },
  {
    value: "basil-water-bottle",
    label: "Basil Stainless Steel Water Bottle, 750ml",
  },
  {
    value: "cascade-camping-chair",
    label:
      "Cascade Foldable Camping Chair with Cup Holder and Side Pocket",
  },
  { value: "ember-cast-iron-skillet", label: "Ember Cast Iron Skillet, 10 Inch" },
  {
    value: "northwind-comforter",
    label: "Northwind Down Alternative Comforter, Full/Queen",
  },
  { value: "terra-planter-trio", label: "Terra Ceramic Planter Trio" },
  {
    value: "sable-faux-fur-blanket",
    label: "Sable Faux Fur Throw Blanket",
  },
  {
    value: "quartz-kitchen-scale",
    label: "Quartz Digital Kitchen Scale",
  },
  { value: "alpine-ski-gloves", label: "Alpine Insulated Ski Gloves" },
  {
    value: "bramble-herb-kit",
    label: "Bramble Herb Garden Starter Kit",
  },
  { value: "onyx-card-holder", label: "Onyx Leather Card Holder" },
  {
    value: "willowbrook-storage-basket",
    label: "Willowbrook Handwoven Storage Basket, Set of Two",
  },
]

const PRODUCTS_BY_CATEGORY: readonly ComboboxFieldOption[] = [
  { value: "nova-sneakers", label: "Nova Sneakers", group: "Footwear" },
  {
    value: "vertex-trail-shoes",
    label: "Vertex Trail Running Shoes",
    group: "Footwear",
  },
  {
    value: "comet-kids-sneakers",
    label: "Comet Kids' Light-Up Sneakers",
    group: "Footwear",
  },
  {
    value: "pulse-wireless-headphones",
    label: "Pulse Wireless Headphones",
    group: "Electronics",
  },
  {
    value: "halo-bluetooth-speaker",
    label: "Halo Bluetooth Speaker",
    group: "Electronics",
  },
  {
    value: "mechanic-pro-keyboard",
    label: "Mechanic Pro Low-Profile Wireless Keyboard",
    group: "Electronics",
  },
  {
    value: "pixel-gaming-mouse",
    label: "Pixel Mechanical Gaming Mouse",
    group: "Electronics",
  },
  {
    value: "drift-wireless-charger",
    label: "Drift Wireless Charging Pad",
    group: "Electronics",
  },
  {
    value: "loop-insulated-travel-mug",
    label: "Loop Insulated Travel Mug",
    group: "Home",
  },
  {
    value: "crescent-night-light",
    label: "Crescent Moon Night Light",
    group: "Home",
  },
  {
    value: "solace-weighted-blanket",
    label: "Solace Weighted Blanket, 15 lb, Queen Size",
    group: "Home",
  },
  {
    value: "ember-cast-iron-skillet",
    label: "Ember Cast Iron Skillet, 10 Inch",
    group: "Home",
  },
  {
    value: "city-commuter-backpack",
    label: "City Commuter Backpack",
    group: "Accessories",
  },
  {
    value: "slate-leather-wallet",
    label: "Slate Leather Wallet",
    group: "Accessories",
  },
  {
    value: "fjord-wool-beanie",
    label: "Fjord Merino Wool Beanie",
    group: "Accessories",
  },
  {
    value: "onyx-card-holder",
    label: "Onyx Leather Card Holder",
    group: "Accessories",
  },
]

export function ComboboxFieldView({
  initialValue = "",
  options = PRODUCTS,
  label,
  placeholder,
  emptyLabel,
  hint,
  error,
  disabled = false,
}: {
  initialValue?: string
  options?: readonly ComboboxFieldOption[]
  label?: string
  placeholder?: string
  emptyLabel?: string
  hint?: string
  error?: string
  disabled?: boolean
}) {
  const [value, setValue] = useState(initialValue)

  return (
    <div className="max-w-xs">
      <ComboboxField
        value={value}
        onChange={setValue}
        options={options}
        label={label}
        placeholder={placeholder}
        emptyLabel={emptyLabel}
        hint={hint}
        error={error}
        disabled={disabled}
      />
    </div>
  )
}

export function ComboboxFieldGroupedView({
  initialValue = "",
  label = "Product",
  hint,
}: {
  initialValue?: string
  label?: string
  hint?: string
}) {
  const [value, setValue] = useState(initialValue)

  return (
    <div className="max-w-xs">
      <ComboboxField
        value={value}
        onChange={setValue}
        options={PRODUCTS_BY_CATEGORY}
        label={label}
        hint={hint}
      />
    </div>
  )
}
