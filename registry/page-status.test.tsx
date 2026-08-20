import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { localeRu } from "@/registry/locale-ru/locale-ru"
import { PageEntity } from "@/registry/page-entity/page-entity"
import { PageForm } from "@/registry/page-form/page-form"
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

describe("stateLabels localizes the status screens", () => {
  it("page-list shows the English defaults without stateLabels", () => {
    render(
      <PageList
        title="Orders"
        status="error"
        columns={[{ id: "number", title: "Number", cell: () => "cell" }]}
        rows={[]}
      />
    )

    expect(screen.getByText("Something went wrong")).toBeInTheDocument()
  })

  it("page-list shows the passed stateLabels", () => {
    render(
      <PageList
        title="Orders"
        status="error"
        stateLabels={{ error: { title: localeRu.stateError.title } }}
        columns={[{ id: "number", title: "Number", cell: () => "cell" }]}
        rows={[]}
      />
    )

    expect(screen.getByText(localeRu.stateError.title)).toBeInTheDocument()
  })

  it("page-entity shows the passed stateLabels", () => {
    render(
      <PageEntity
        title="Order 1024"
        status="offline"
        stateLabels={{ offline: { title: localeRu.stateOffline.title } }}
        sections={[
          { id: "main", fields: [{ id: "total", label: "Total", value: "$10" }] },
        ]}
      />
    )

    expect(screen.getByText(localeRu.stateOffline.title)).toBeInTheDocument()
  })

  it("page-entity shows the English default without stateLabels", () => {
    render(
      <PageEntity
        title="Order 1024"
        status="offline"
        sections={[
          { id: "main", fields: [{ id: "total", label: "Total", value: "$10" }] },
        ]}
      />
    )

    expect(screen.getByText("Connection lost")).toBeInTheDocument()
  })

  it("page-form shows the passed stateLabels", () => {
    render(
      <PageForm
        title="Edit order"
        status="forbidden"
        stateLabels={{ forbidden: { title: localeRu.stateForbidden.title } }}
        sections={[{ title: "Details", children: <p>Fields</p> }]}
      />
    )

    expect(screen.getByText(localeRu.stateForbidden.title)).toBeInTheDocument()
  })

  it("page-form shows the English default without stateLabels", () => {
    render(
      <PageForm
        title="Edit order"
        status="forbidden"
        sections={[{ title: "Details", children: <p>Fields</p> }]}
      />
    )

    expect(screen.getByText("No access")).toBeInTheDocument()
  })
})
