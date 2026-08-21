import { describe, expect, it } from "vitest"

import {
  accentIds,
  gradientFamilies,
  gradientIds,
} from "@/registry/admin-appearance/appearance-palette"
import type { AppearanceLabels } from "@/registry/admin-appearance/appearance-provider"
import type { AppearanceMenuLabels } from "@/registry/appearance-menu/appearance-menu"
import type { GlobalSearchLabels } from "@/registry/global-search/global-search"
import type { IconFieldLabels } from "@/registry/icon-field/icon-field"
import type { IconName } from "@/registry/icon-field/icon-catalog"
import type { NotificationsMenuLabels } from "@/registry/notifications-menu/notifications-menu"
import { widgetTreeTableLabelDefaults } from "@/registry/widget-tree-table/widget-tree-table"

import { iconNamesRu } from "./icon-names-ru"
import { localeRu } from "./locale-ru"

const appearanceSlice: AppearanceLabels = localeRu.adminAppearance
const appearanceMenuSlice: AppearanceMenuLabels = localeRu.appearanceMenu
const globalSearchSlice: GlobalSearchLabels = localeRu.globalSearch
const notificationsSlice: NotificationsMenuLabels = localeRu.notificationsMenu
const iconFieldSlice: IconFieldLabels = localeRu.iconField
const iconNamesComplete: Readonly<Record<IconName, string>> = iconNamesRu

describe("localeRu slices keep the shapes of the items they localize", () => {
  it("type-checks against every labels interface", () => {
    expect([appearanceSlice, appearanceMenuSlice, globalSearchSlice, notificationsSlice, iconFieldSlice, iconNamesComplete]).toHaveLength(6)
  })
})

describe("localeRu gradient names", () => {
  it.each(gradientIds.map((id) => [id] as const))(
    "names %s in adminAppearance.gradients",
    (id) => {
      expect(localeRu.adminAppearance.gradients[id]).toBeTruthy()
    }
  )

  it.each(gradientIds.map((id) => [id] as const))(
    "names %s in appearanceMenu.gradients",
    (id) => {
      expect(localeRu.appearanceMenu.gradients[id]).toBeTruthy()
    }
  )
})

describe("localeRu family names", () => {
  it.each(gradientFamilies.map((id) => [id] as const))(
    "names %s in adminAppearance.families",
    (id) => {
      expect(localeRu.adminAppearance.families[id]).toBeTruthy()
    }
  )

  it.each(gradientFamilies.map((id) => [id] as const))(
    "names %s in appearanceMenu.families",
    (id) => {
      expect(localeRu.appearanceMenu.families[id]).toBeTruthy()
    }
  )
})

describe("localeRu control slices", () => {
  it.each([
    ["button"],
    ["shortcut"],
    ["placeholder"],
    ["empty"],
    ["title"],
  ] as const)("fills globalSearch.%s", (key) => {
    expect(localeRu.globalSearch[key]).toBeTruthy()
  })

  it.each([
    ["button"],
    ["title"],
    ["empty"],
    ["markAllRead"],
    ["unreadItem"],
  ] as const)("fills notificationsMenu.%s", (key) => {
    expect(localeRu.notificationsMenu[key]).toBeTruthy()
  })

  it("counts unread notifications in Russian", () => {
    expect(localeRu.notificationsMenu.unread(1)).toBe("1 непрочитанное")
    expect(localeRu.notificationsMenu.unread(2)).toBe("2 непрочитанных")
    expect(localeRu.notificationsMenu.unread(3)).toBe("3 непрочитанных")
    expect(localeRu.notificationsMenu.unread(11)).toBe("11 непрочитанных")
    expect(localeRu.notificationsMenu.unread(21)).toBe("21 непрочитанное")
    expect(localeRu.notificationsMenu.unread(31)).toBe("31 непрочитанное")
    expect(localeRu.notificationsMenu.unread(111)).toBe("111 непрочитанных")
  })

  it("fills widgetTable.region", () => {
    expect(localeRu.widgetTable.region).toBeTruthy()
  })

  it("fills every widgetTreeTable label", () => {
    for (const key of Object.keys(widgetTreeTableLabelDefaults) as (keyof typeof widgetTreeTableLabelDefaults)[]) {
      expect(localeRu.widgetTreeTable[key], key).toBeTruthy()
    }
    expect(localeRu.widgetTreeTable.showMore(3)).toContain("3")
  })

  it("fills pageList.resetFilters", () => {
    expect(localeRu.pageList.resetFilters).toBeTruthy()
  })

  it("fills colorField.customColorLabel", () => {
    expect(localeRu.colorField.customColorLabel).toBeTruthy()
  })
})

describe("localeRu accent names", () => {
  it.each(accentIds.map((id) => [id] as const))(
    "names %s in appearanceMenu.accents",
    (id) => {
      expect(localeRu.appearanceMenu.accents[id]).toBeTruthy()
    }
  )
})
