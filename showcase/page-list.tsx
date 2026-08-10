import { PageList, type PageListFilter } from "@/registry/page-list/page-list"

import { roleFilterOptions, userColumns } from "./page-list-data"
import { PageListLive } from "./page-list-live"
import type { ShowcaseEntry } from "./types"

const userFilters: readonly PageListFilter[] = [
  { id: "search", label: "Search", kind: "search", value: "" },
  {
    id: "role",
    label: "Role",
    kind: "select",
    value: "all",
    options: roleFilterOptions,
  },
]

const emptySearchFilters: readonly PageListFilter[] = [
  { id: "search", label: "Search", kind: "search", value: "zzz" },
  {
    id: "role",
    label: "Role",
    kind: "select",
    value: "all",
    options: roleFilterOptions,
  },
]

export const pageListEntry: ShowcaseEntry = {
  item: "page-list",
  title: "List page",
  description:
    "A list page: a section title outside and a self-contained WidgetTable card below it — a filter bar in the card's header, and the table and pagination in its footer. Every value is controlled by props — the page keeps no state of its own for the current page number, filter values, or sort order; changes go out through the onFilterChange, onPageChange, onSortChange, and onPageSizeChange callbacks. Sorting is controlled: the page only forwards sort and onSortChange to the table and doesn't reorder rows — that's the responsibility of whoever owns the data. The status prop selects the content: the page title and filter bar stay available in any status, only the card body changes. Pagination is drawn only when total is passed — there's no honest way to build it without the total record count, and the page size picker appears only when pageSizeOptions and onPageSizeChange are passed.",
  views: [
    {
      id: "with-filters-and-pagination",
      name: "List with filters and pagination (state held by the showcase)",
      render: () => <PageListLive />,
    },
    {
      id: "empty-search",
      name: "Empty search result",
      render: () => (
        <PageList
          title="Users"
          filters={emptySearchFilters}
          columns={userColumns}
          rows={[]}
        />
      ),
    },
    {
      id: "loading",
      name: "Loading state",
      render: () => (
        <PageList
          title="Users"
          filters={userFilters}
          columns={userColumns}
          rows={[]}
          status="loading"
        />
      ),
    },
    {
      id: "error",
      name: "Error state",
      render: () => (
        <PageList
          title="Users"
          filters={userFilters}
          columns={userColumns}
          rows={[]}
          status="error"
        />
      ),
    },
    {
      id: "forbidden",
      name: "Forbidden state",
      render: () => (
        <PageList
          title="Users"
          filters={userFilters}
          columns={userColumns}
          rows={[]}
          status="forbidden"
        />
      ),
    },
    {
      id: "offline",
      name: "Offline state",
      render: () => (
        <PageList
          title="Users"
          filters={userFilters}
          columns={userColumns}
          rows={[]}
          status="offline"
        />
      ),
    },
  ],
}
