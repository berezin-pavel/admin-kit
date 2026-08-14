import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { PageEntity } from "@/registry/page-entity/page-entity"
import { PageList } from "@/registry/page-list/page-list"

const statuses = ["ready", "loading", "error", "forbidden", "offline"] as const

describe("a page keeps its heading under every status", () => {
  it.each(statuses)("page-list keeps the title when status is %s", (status) => {
    render(
      <PageList
        title="Orders"
        status={status}
        columns={[{ id: "number", title: "Number", cell: () => "cell" }]}
        rows={[]}
      />
    )

    expect(
      screen.getByRole("heading", { name: "Orders" })
    ).toBeInTheDocument()
  })

  it.each(statuses)(
    "page-list keeps its filters when status is %s, so the query can be retried",
    (status) => {
      render(
        <PageList
          title="Orders"
          status={status}
          filters={[
            { id: "search", kind: "search", label: "Search", value: "" },
          ]}
          columns={[{ id: "number", title: "Number", cell: () => "cell" }]}
          rows={[]}
        />
      )

      expect(screen.getByLabelText("Search")).toBeInTheDocument()
    }
  )

  it.each(statuses)(
    "page-entity keeps the title when status is %s",
    (status) => {
      render(
        <PageEntity
          title="Order 1024"
          status={status}
          sections={[
            { id: "main", fields: [{ id: "total", label: "Total", value: "$10" }] },
          ]}
        />
      )

      expect(
        screen.getByRole("heading", { name: "Order 1024" })
      ).toBeInTheDocument()
    }
  )
})
