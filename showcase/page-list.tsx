import { Button } from "@/components/ui/button"
import { PageList, type PageListFilter } from "@/registry/page-list/page-list"

import { roleFilterOptions, userColumns, userRows } from "./page-list-data"
import { PageListLive, PageListRowActivateView } from "./page-list-live"
import type { ShowcaseEntry } from "./types"

const userFilters: readonly PageListFilter[] = [
  { id: "search", label: "Filter", kind: "search", value: "" },
  {
    id: "role",
    label: "Role",
    kind: "select",
    value: "",
    options: roleFilterOptions,
  },
]

const emptySearchFilters: readonly PageListFilter[] = [
  { id: "search", label: "Filter", kind: "search", value: "zzz" },
  {
    id: "role",
    label: "Role",
    kind: "select",
    value: "",
    options: roleFilterOptions,
  },
]

export const pageListEntry: ShowcaseEntry = {
  item: "page-list",
  title: "List page",
  description:
    "A list page: a section title outside and a self-contained WidgetTable card below it — a filter bar in the card's header, and the table and pagination in its footer. Every value is controlled by props — the page keeps no state of its own for the current page number, filter values, or sort order; changes go out through the onFilterChange, onPageChange, onSortChange, and onPageSizeChange callbacks. Sorting is controlled: the page only forwards sort and onSortChange to the table and doesn't reorder rows — that's the responsibility of whoever owns the data. The status prop selects the content: the page title and filter bar stay available in any status, only the card body changes. Pagination is drawn only when total is passed — there's no honest way to build it without the total record count, and the page size picker appears only when pageSizeOptions and onPageSizeChange are passed. filtered, onClearFilters, hiddenColumnIds, and onHiddenColumnIdsChange forward straight through to widget-table, unchanged: passing filtered swaps the ordinary empty state for a filtered one once a search or a select filter narrows the rows to zero, and the column-visibility menu lives in the table's own header. There is no built-in export button or file-writing code anywhere in the kit: export is wired up the same way row selection is — selectedKeys, onSelectionChange, and selectionActions forward through to the table, and the consumer adds an 'Export' selectionAction whose onSelect calls the exported toCsv helper on the selected rows and does whatever it wants with the resulting string (the live example below just shows it in a pre). Under server-side pagination, selection needs a stable getRowKey — without one the row key is the row's index within the current page, so a selection made on one page silently lands on whatever rows occupy those same indexes after paging.",
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
    {
      id: "with-toolbar",
      name: "With a custom toolbar item next to the filters",
      render: () => (
        <PageList
          title="Users"
          filters={userFilters}
          toolbar={
            <Button variant="outline" size="sm" disabled>
              Export
            </Button>
          }
          columns={userColumns}
          rows={userRows}
        />
      ),
    },
    {
      id: "offline-keeps-rows",
      name: "Offline while keeping the rows on screen",
      render: () => (
        <PageList
          title="Users"
          columns={userColumns}
          rows={userRows}
          status="offline"
          keepRows
          stateActions={{
            offline: (
              <Button variant="outline" size="sm">
                Retry
              </Button>
            ),
          }}
        />
      ),
    },
    {
      id: "row-activate",
      name: "Rows activate on click or Enter",
      render: () => <PageListRowActivateView />,
    },
  ],
}
