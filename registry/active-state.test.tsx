import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AdminNav } from "./admin-shell/admin-nav"
import { PageTabs } from "./page-tabs/page-tabs"

describe("admin-nav paints only the active row", () => {
  it("carries the sidebar-active tokens on the active item and neither on the inactive one", () => {
    const { getByText } = render(
      <AdminNav
        nav={[
          { href: "/one", title: "One" },
          { href: "/two", title: "Two" },
        ]}
        activeHref="/one"
      />
    )

    const activeLink = getByText("One").closest("a")
    const inactiveLink = getByText("Two").closest("a")

    expect(activeLink?.className).toContain("bg-sidebar-active")
    expect(activeLink?.className).toContain("text-sidebar-active-foreground")
    expect(inactiveLink?.className).not.toContain("bg-sidebar-active")
    expect(inactiveLink?.className).not.toContain(
      "text-sidebar-active-foreground"
    )
  })
})

describe("page-tabs paints only the selected tab", () => {
  it("carries the same sidebar-active tokens as admin-nav and marks only the selected tab", () => {
    const { getByRole } = render(
      <PageTabs
        value="one"
        onValueChange={() => {}}
        items={[
          { id: "one", label: "One", content: <p>One content</p> },
          { id: "two", label: "Two", content: <p>Two content</p> },
        ]}
      />
    )

    const activeTab = getByRole("tab", { name: "One" })
    const inactiveTab = getByRole("tab", { name: "Two" })

    expect(activeTab.className).toContain("data-active:bg-sidebar-active")
    expect(activeTab.className).toContain(
      "data-active:text-sidebar-active-foreground"
    )
    expect(activeTab).toHaveAttribute("data-active")
    expect(inactiveTab).not.toHaveAttribute("data-active")
  })
})
