"use client"

import { useMemo, useState } from "react"
import type { Key } from "react"
import {
  Check,
  FolderTree,
  ListTree,
  Package,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { notify } from "@/registry/admin-toaster/admin-toaster"
import { CheckboxField } from "@/registry/checkbox-field/checkbox-field"
import { ColorField } from "@/registry/color-field/color-field"
import { ComboboxField } from "@/registry/combobox-field/combobox-field"
import { ConfirmDialog } from "@/registry/confirm-dialog/confirm-dialog"
import { FormDialog } from "@/registry/form-dialog/form-dialog"
import { Hint } from "@/registry/hint/hint"
import { IconField, resolveIcon } from "@/registry/icon-field/icon-field"
import { localeRu } from "@/registry/locale-ru/locale-ru"
import { NumberField } from "@/registry/number-field/number-field"
import { PageList, type PageListFilter } from "@/registry/page-list/page-list"
import { PageListFilters } from "@/registry/page-list/page-list-filters"
import { PageTabs, type PageTabsItem } from "@/registry/page-tabs/page-tabs"
import { RowActions } from "@/registry/row-actions/row-actions"
import { TextField } from "@/registry/text-field/text-field"
import type {
  WidgetTableColumn,
  WidgetTableSelectionAction,
  WidgetTableSort,
  WidgetTableSortOption,
} from "@/registry/widget-table/widget-table"
import {
  collectSectionIds,
  WidgetTreeTable,
  type TreeTableColumn,
  type TreeTableSection,
} from "@/registry/widget-tree-table/widget-tree-table"

import {
  flattenDemoProducts,
  flattenDemoSections,
  formatDemoCurrency,
  formatDemoNumber,
  getDemoProductSections,
  loadDemoIconKeywordsRu,
  type DemoProduct,
  type DemoProductSection,
  type FlatDemoProduct,
  type FlatDemoSection,
} from "@/app/demo/data"
import { demoDictionary, type DemoDictionary } from "@/app/demo/locale"
import { useDemoLocale, type DemoLocale } from "@/app/demo/locale-store"

const SECTION_COLOR_PRESETS = [
  "#2563eb",
  "#7c3aed",
  "#ea580c",
  "#16a34a",
  "#64748b",
] as const

const CATEGORY_PAGE_SIZE_OPTIONS = [20, 50] as const
const PRODUCT_PAGE_SIZE_OPTIONS = [20, 50, 100] as const
const DEFAULT_PAGE_SIZE = 20
const SHOW_MORE_ROW_STEP = 25
const LOAD_MORE_DELAY_MS = 600
const SAVE_DELAY_MS = 700

function countSectionItems(section: TreeTableSection<DemoProduct>): number {
  const own = section.rowCount ?? section.rows?.length ?? 0
  const nested =
    section.sections?.reduce(
      (sum, child) => sum + countSectionItems(child),
      0
    ) ?? 0
  return own + nested
}

function findSectionById(
  sections: readonly DemoProductSection[],
  id: string
): DemoProductSection | undefined {
  for (const section of sections) {
    if (section.id === id) {
      return section
    }
    if (section.sections) {
      const found = findSectionById(section.sections, id)
      if (found) {
        return found
      }
    }
  }
  return undefined
}

function collectDescendantIds(section: DemoProductSection): readonly string[] {
  const ids: string[] = []
  for (const child of section.sections ?? []) {
    ids.push(child.id, ...collectDescendantIds(child))
  }
  return ids
}

function updateSectionTree(
  sections: readonly DemoProductSection[],
  id: string,
  updater: (section: DemoProductSection) => DemoProductSection
): readonly DemoProductSection[] {
  return sections.map((section) => {
    if (section.id === id) {
      return updater(section)
    }
    if (section.sections) {
      return {
        ...section,
        sections: updateSectionTree(section.sections, id, updater),
      }
    }
    return section
  })
}

function removeSectionFromTree(
  sections: readonly DemoProductSection[],
  id: string
): readonly DemoProductSection[] {
  return sections
    .filter((section) => section.id !== id)
    .map((section) =>
      section.sections
        ? { ...section, sections: removeSectionFromTree(section.sections, id) }
        : section
    )
}

function removeSectionsByIds(
  sections: readonly DemoProductSection[],
  ids: ReadonlySet<Key>
): readonly DemoProductSection[] {
  return sections
    .filter((section) => !ids.has(section.id))
    .map((section) =>
      section.sections
        ? { ...section, sections: removeSectionsByIds(section.sections, ids) }
        : section
    )
}

function removeProductsByIds(
  sections: readonly DemoProductSection[],
  ids: ReadonlySet<Key>
): readonly DemoProductSection[] {
  return sections.map((section) => ({
    ...section,
    rows: section.rows?.filter((row) => !ids.has(row.id)),
    sections: section.sections
      ? removeProductsByIds(section.sections, ids)
      : undefined,
  }))
}

function extractSectionSubtree(
  sections: readonly DemoProductSection[],
  id: string
): { tree: readonly DemoProductSection[]; removed: DemoProductSection | undefined } {
  let removed: DemoProductSection | undefined

  function walk(list: readonly DemoProductSection[]): readonly DemoProductSection[] {
    const next: DemoProductSection[] = []
    for (const section of list) {
      if (section.id === id) {
        removed = section
        continue
      }
      next.push(
        section.sections
          ? { ...section, sections: walk(section.sections) }
          : section
      )
    }
    return next
  }

  return { tree: walk(sections), removed }
}

function insertSectionAtParent(
  sections: readonly DemoProductSection[],
  parentId: string | null,
  section: DemoProductSection
): readonly DemoProductSection[] {
  if (parentId === null) {
    return [...sections, section]
  }
  return updateSectionTree(sections, parentId, (parent) => ({
    ...parent,
    sections: [...(parent.sections ?? []), section],
  }))
}

function withSectionMoved(
  sections: readonly DemoProductSection[],
  id: string,
  parentId: string | null
): readonly DemoProductSection[] {
  const { tree, removed } = extractSectionSubtree(sections, id)
  if (!removed) {
    return sections
  }
  return insertSectionAtParent(tree, parentId, removed)
}

function withProductAdded(
  sections: readonly DemoProductSection[],
  sectionId: string,
  product: DemoProduct
): readonly DemoProductSection[] {
  return updateSectionTree(sections, sectionId, (section) => ({
    ...section,
    rows: [...(section.rows ?? []), product],
  }))
}

function withProductUpdated(
  sections: readonly DemoProductSection[],
  sectionId: string,
  productId: string,
  patch: Omit<DemoProduct, "id">
): readonly DemoProductSection[] {
  return updateSectionTree(sections, sectionId, (section) => ({
    ...section,
    rows: (section.rows ?? []).map((row) =>
      row.id === productId ? { id: row.id, ...patch } : row
    ),
  }))
}

function withProductRemoved(
  sections: readonly DemoProductSection[],
  sectionId: string,
  productId: string
): readonly DemoProductSection[] {
  return updateSectionTree(sections, sectionId, (section) => ({
    ...section,
    rows: (section.rows ?? []).filter((row) => row.id !== productId),
  }))
}

function withSectionUpdated(
  sections: readonly DemoProductSection[],
  id: string,
  patch: {
    title: string
    color: string
    hidden: boolean
    iconId: string
    sort: number
  }
): readonly DemoProductSection[] {
  return updateSectionTree(sections, id, (section) => ({
    ...section,
    ...patch,
    icon: resolveIcon(patch.iconId),
  }))
}

function formatMarkup(price: number, cost: number): string {
  if (cost === 0) {
    return "—"
  }
  return `${(((price - cost) / cost) * 100).toFixed(1)}%`
}

function filterProductTree(
  sections: readonly DemoProductSection[],
  query: string
): readonly DemoProductSection[] {
  if (query === "") {
    return sections
  }

  const result: DemoProductSection[] = []

  for (const section of sections) {
    if (section.title.toLowerCase().includes(query)) {
      result.push(section)
      continue
    }

    const filteredChildren = section.sections
      ? filterProductTree(section.sections, query)
      : undefined
    const matchedRows = section.rows?.filter((row) =>
      row.name.toLowerCase().includes(query)
    )
    const keepChildren = Boolean(filteredChildren && filteredChildren.length > 0)
    const keepRows = Boolean(matchedRows && matchedRows.length > 0)

    if (keepChildren || keepRows) {
      result.push({ ...section, sections: filteredChildren, rows: matchedRows })
    }
  }

  return result
}

function applyRowLimits(
  sections: readonly DemoProductSection[],
  visibleRowCount: Readonly<Record<string, number>>
): readonly DemoProductSection[] {
  return sections.map((section) => {
    const rows = section.rows
    const limit = rows ? (visibleRowCount[section.id] ?? rows.length) : undefined

    return {
      ...section,
      rows: rows ? rows.slice(0, limit) : undefined,
      rowCount: rows ? rows.length : undefined,
      sections: section.sections
        ? applyRowLimits(section.sections, visibleRowCount)
        : undefined,
    }
  })
}

function sortCategoryRows(
  rows: readonly FlatDemoSection[],
  sort: WidgetTableSort | undefined
): readonly FlatDemoSection[] {
  if (!sort) {
    return rows
  }
  const direction = sort.direction === "asc" ? 1 : -1
  return [...rows].sort((a, b) => {
    if (sort.columnId === "title") {
      return a.section.title.localeCompare(b.section.title) * direction
    }
    return (a.section.sort - b.section.sort) * direction
  })
}

function sortProductRows(
  rows: readonly FlatDemoProduct[],
  sort: WidgetTableSort | undefined
): readonly FlatDemoProduct[] {
  if (!sort) {
    return rows
  }
  const direction = sort.direction === "asc" ? 1 : -1
  return [...rows].sort((a, b) => {
    if (sort.columnId === "name") {
      return a.product.name.localeCompare(b.product.name) * direction
    }
    if (sort.columnId === "price") {
      return (a.product.price - b.product.price) * direction
    }
    return (a.product.sort - b.product.sort) * direction
  })
}

interface ProductDraft {
  name: string
  sku: string
  price: string
  stock: string
  cost: string
  hidden: boolean
  categoryId: string
  sort: string
}

const EMPTY_PRODUCT_DRAFT: ProductDraft = {
  name: "",
  sku: "",
  price: "",
  stock: "",
  cost: "",
  hidden: false,
  categoryId: "",
  sort: "10",
}

interface SectionDraft {
  title: string
  color: string
  hidden: boolean
  parentId: string
  sort: string
  iconId: string
}

const EMPTY_SECTION_DRAFT: SectionDraft = {
  title: "",
  color: SECTION_COLOR_PRESETS[0],
  hidden: false,
  parentId: "",
  sort: "10",
  iconId: "package",
}

export function DemoProducts() {
  const locale = useDemoLocale()
  return <DemoProductsCatalogue key={locale} locale={locale} />
}

function DemoProductsCatalogue({ locale }: { locale: DemoLocale }) {
  const strings = demoDictionary[locale].products

  const [sections, setSections] = useState<readonly DemoProductSection[]>(
    () => getDemoProductSections(locale)
  )
  const [activeTab, setActiveTab] = useState("tree")

  const [expandedIds, setExpandedIds] = useState<readonly string[]>(() =>
    getDemoProductSections(locale).map((section) => section.id)
  )
  const [hiddenTreeColumnIds, setHiddenTreeColumnIds] = useState<
    readonly string[]
  >([])
  const [treeSearch, setTreeSearch] = useState("")
  const [visibleRowCount, setVisibleRowCount] = useState<
    Record<string, number>
  >(() => {
    const initial: Record<string, number> = {}
    for (const flat of flattenDemoSections(getDemoProductSections(locale))) {
      const count = flat.section.rows?.length ?? 0
      if (count > SHOW_MORE_ROW_STEP) {
        initial[flat.section.id] = SHOW_MORE_ROW_STEP
      }
    }
    return initial
  })
  const [loadingMoreSectionId, setLoadingMoreSectionId] = useState<
    string | null
  >(null)

  const [categorySearch, setCategorySearch] = useState("")
  const [categorySort, setCategorySort] = useState<WidgetTableSort | undefined>(
    undefined
  )
  const [categoryPage, setCategoryPage] = useState(1)
  const [categoryPageSize, setCategoryPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [categoryHiddenColumnIds, setCategoryHiddenColumnIds] = useState<
    readonly string[]
  >([])
  const [categorySelectedKeys, setCategorySelectedKeys] = useState<
    ReadonlySet<Key>
  >(new Set())
  const [categoryBulkDeleteOpen, setCategoryBulkDeleteOpen] = useState(false)
  const [categoryBulkDeleting, setCategoryBulkDeleting] = useState(false)

  const [productSearch, setProductSearch] = useState("")
  const [productCategoryFilter, setProductCategoryFilter] = useState("")
  const [productSort, setProductSort] = useState<WidgetTableSort | undefined>(
    undefined
  )
  const [productPage, setProductPage] = useState(1)
  const [productPageSize, setProductPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [productHiddenColumnIds, setProductHiddenColumnIds] = useState<
    readonly string[]
  >([])
  const [productSelectedKeys, setProductSelectedKeys] = useState<
    ReadonlySet<Key>
  >(new Set())
  const [productBulkDeleteOpen, setProductBulkDeleteOpen] = useState(false)
  const [productBulkDeleting, setProductBulkDeleting] = useState(false)

  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [productDialogMode, setProductDialogMode] = useState<"add" | "edit">(
    "add"
  )
  const [productDialogSectionId, setProductDialogSectionId] = useState("")
  const [productDialogProductId, setProductDialogProductId] = useState<
    string | undefined
  >(undefined)
  const [productDraft, setProductDraft] =
    useState<ProductDraft>(EMPTY_PRODUCT_DRAFT)
  const [savingProduct, setSavingProduct] = useState(false)

  const [sectionDialogOpen, setSectionDialogOpen] = useState(false)
  const [sectionDialogMode, setSectionDialogMode] = useState<"add" | "edit">(
    "add"
  )
  const [sectionDialogId, setSectionDialogId] = useState<string | undefined>(
    undefined
  )
  const [sectionDialogOriginalParentId, setSectionDialogOriginalParentId] =
    useState("")
  const [sectionDraft, setSectionDraft] =
    useState<SectionDraft>(EMPTY_SECTION_DRAFT)
  const [savingSection, setSavingSection] = useState(false)

  const [deleteProductTarget, setDeleteProductTarget] = useState<{
    sectionId: string
    product: DemoProduct
  } | null>(null)
  const [deletingProduct, setDeletingProduct] = useState(false)

  const [deleteSectionTarget, setDeleteSectionTarget] = useState<
    DemoProductSection | undefined
  >(undefined)
  const [deletingSection, setDeletingSection] = useState(false)

  const renderHiddenState = (
    hidden: boolean,
    strings: DemoDictionary["products"]
  ) =>
    hidden ? (
      <span className="inline-flex items-center gap-1.5">
        <Check aria-hidden="true" className="size-4" />
        <span className="sr-only">{strings.yes}</span>
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        <X aria-hidden="true" className="size-4" />
        <span className="sr-only">{strings.no}</span>
      </span>
    )

  const allCategoryOptions = useMemo(
    () =>
      flattenDemoSections(sections).map((flat) => ({
        value: flat.section.id,
        label: flat.path,
      })),
    [sections]
  )

  const parentOptions = useMemo(() => {
    const excluded = new Set<string>()
    if (sectionDialogMode === "edit" && sectionDialogId) {
      const current = findSectionById(sections, sectionDialogId)
      if (current) {
        excluded.add(current.id)
        for (const id of collectDescendantIds(current)) {
          excluded.add(id)
        }
      }
    }
    const options = flattenDemoSections(sections)
      .filter((flat) => !excluded.has(flat.section.id))
      .map((flat) => ({ value: flat.section.id, label: flat.path }))
    return [{ value: "", label: strings.noParent }, ...options]
  }, [sections, sectionDialogMode, sectionDialogId, strings.noParent])

  const openAddProduct = (sectionId?: string) => {
    setProductDialogMode("add")
    setProductDialogSectionId(sectionId ?? "")
    setProductDialogProductId(undefined)
    const siblingCount = sectionId
      ? (findSectionById(sections, sectionId)?.rows?.length ?? 0)
      : 0
    setProductDraft({
      ...EMPTY_PRODUCT_DRAFT,
      categoryId: sectionId ?? "",
      sort: String((siblingCount + 1) * 10),
    })
    setProductDialogOpen(true)
  }

  const openEditProduct = (sectionId: string, product: DemoProduct) => {
    setProductDialogMode("edit")
    setProductDialogSectionId(sectionId)
    setProductDialogProductId(product.id)
    setProductDraft({
      name: product.name,
      sku: product.sku,
      price: String(product.price),
      stock: String(product.stock),
      cost: String(product.cost),
      hidden: product.hidden,
      categoryId: sectionId,
      sort: String(product.sort),
    })
    setProductDialogOpen(true)
  }

  const submitProductDialog = () => {
    if (productDraft.categoryId === "") {
      return
    }

    setSavingProduct(true)

    window.setTimeout(() => {
      const patch = {
        name: productDraft.name,
        sku: productDraft.sku,
        price: Number(productDraft.price) || 0,
        stock: Number(productDraft.stock) || 0,
        cost: Number(productDraft.cost) || 0,
        hidden: productDraft.hidden,
        sort: Number(productDraft.sort) || 0,
      }

      if (productDialogMode === "edit" && productDialogProductId) {
        const categoryChanged = productDraft.categoryId !== productDialogSectionId
        setSections((current) => {
          if (!categoryChanged) {
            return withProductUpdated(
              current,
              productDialogSectionId,
              productDialogProductId,
              patch
            )
          }
          const withoutProduct = withProductRemoved(
            current,
            productDialogSectionId,
            productDialogProductId
          )
          return withProductAdded(withoutProduct, productDraft.categoryId, {
            id: productDialogProductId,
            ...patch,
          })
        })
        notify.success(strings.savedToast)
      } else {
        const id = `product-${Date.now()}`
        setSections((current) =>
          withProductAdded(current, productDraft.categoryId, { id, ...patch })
        )
        setExpandedIds((current) =>
          current.includes(productDraft.categoryId)
            ? current
            : [...current, productDraft.categoryId]
        )
        notify.success(strings.addedToast)
      }

      setSavingProduct(false)
      setProductDialogOpen(false)
    }, SAVE_DELAY_MS)
  }

  const openAddSection = (parentId: string = "") => {
    setSectionDialogMode("add")
    setSectionDialogId(undefined)
    setSectionDialogOriginalParentId("")
    const siblingCount = parentId
      ? (findSectionById(sections, parentId)?.sections?.length ?? 0)
      : sections.length
    setSectionDraft({
      ...EMPTY_SECTION_DRAFT,
      parentId,
      sort: String((siblingCount + 1) * 10),
    })
    setSectionDialogOpen(true)
  }

  const openEditSection = (sectionId: string) => {
    const section = findSectionById(sections, sectionId)
    if (!section) {
      return
    }
    const flat = flattenDemoSections(sections).find(
      (entry) => entry.section.id === sectionId
    )
    const parentId = flat?.parentId ?? ""
    setSectionDialogMode("edit")
    setSectionDialogId(sectionId)
    setSectionDialogOriginalParentId(parentId)
    setSectionDraft({
      title: section.title,
      color: section.color ?? SECTION_COLOR_PRESETS[0],
      hidden: section.hidden,
      parentId,
      sort: String(section.sort),
      iconId: section.iconId,
    })
    setSectionDialogOpen(true)
  }

  const submitSectionDialog = () => {
    setSavingSection(true)

    window.setTimeout(() => {
      const iconId = sectionDraft.iconId
      const sort = Number(sectionDraft.sort) || 0
      const targetParentId =
        sectionDraft.parentId === "" ? null : sectionDraft.parentId

      if (sectionDialogMode === "edit" && sectionDialogId) {
        setSections((current) => {
          const updated = withSectionUpdated(current, sectionDialogId, {
            title: sectionDraft.title,
            color: sectionDraft.color,
            hidden: sectionDraft.hidden,
            iconId,
            sort,
          })
          return sectionDraft.parentId !== sectionDialogOriginalParentId
            ? withSectionMoved(updated, sectionDialogId, targetParentId)
            : updated
        })
        notify.success(strings.savedToast)
      } else {
        const id = `section-${Date.now()}`
        const newSection: DemoProductSection = {
          id,
          title: sectionDraft.title,
          color: sectionDraft.color,
          hidden: sectionDraft.hidden,
          iconId,
          icon: resolveIcon(iconId),
          sort,
          rows: [],
        }
        setSections((current) =>
          insertSectionAtParent(current, targetParentId, newSection)
        )
        setExpandedIds((current) => [...current, id])
        notify.success(strings.addedToast)
      }

      setSavingSection(false)
      setSectionDialogOpen(false)
    }, SAVE_DELAY_MS)
  }

  const confirmDeleteProduct = () => {
    if (!deleteProductTarget) {
      return
    }
    setDeletingProduct(true)

    window.setTimeout(() => {
      setSections((current) =>
        withProductRemoved(
          current,
          deleteProductTarget.sectionId,
          deleteProductTarget.product.id
        )
      )
      setDeletingProduct(false)
      setDeleteProductTarget(null)
      notify.success(strings.deletedToast)
    }, SAVE_DELAY_MS)
  }

  const confirmDeleteSection = () => {
    if (!deleteSectionTarget) {
      return
    }
    setDeletingSection(true)

    window.setTimeout(() => {
      setSections((current) =>
        removeSectionFromTree(current, deleteSectionTarget.id)
      )
      setDeletingSection(false)
      setDeleteSectionTarget(undefined)
      notify.success(strings.deletedToast)
    }, SAVE_DELAY_MS)
  }

  const removeSelectedCategories = () => {
    setCategoryBulkDeleting(true)

    window.setTimeout(() => {
      const count = categorySelectedKeys.size
      setSections((current) => removeSectionsByIds(current, categorySelectedKeys))
      setCategorySelectedKeys(new Set())
      setCategoryBulkDeleting(false)
      setCategoryBulkDeleteOpen(false)
      notify.success(strings.categorySelectionDeleteToastTitle, {
        description: strings.categorySelectionDeleteToastDescription(count),
      })
    }, SAVE_DELAY_MS)
  }

  const removeSelectedProducts = () => {
    setProductBulkDeleting(true)

    window.setTimeout(() => {
      const count = productSelectedKeys.size
      setSections((current) => removeProductsByIds(current, productSelectedKeys))
      setProductSelectedKeys(new Set())
      setProductBulkDeleting(false)
      setProductBulkDeleteOpen(false)
      notify.success(strings.productSelectionDeleteToastTitle, {
        description: strings.productSelectionDeleteToastDescription(count),
      })
    }, SAVE_DELAY_MS)
  }

  const onLoadMoreRows = (section: TreeTableSection<DemoProduct>) => {
    if (loadingMoreSectionId) {
      return
    }
    setLoadingMoreSectionId(section.id)
    window.setTimeout(() => {
      setVisibleRowCount((current) => ({
        ...current,
        [section.id]: (current[section.id] ?? SHOW_MORE_ROW_STEP) + SHOW_MORE_ROW_STEP,
      }))
      setLoadingMoreSectionId(null)
    }, LOAD_MORE_DELAY_MS)
  }

  const treeColumns: readonly TreeTableColumn<DemoProduct>[] = [
    {
      id: "name",
      title: strings.columnName,
      grow: true,
      alwaysVisible: true,
      cell: (row) => row.name,
    },
    {
      id: "sku",
      title: strings.columnSku,
      cell: (row) => row.sku,
    },
    {
      id: "price",
      title: strings.columnPrice,
      align: "right",
      cell: (row) => formatDemoCurrency(row.price, locale),
    },
    {
      id: "stock",
      title: strings.columnStock,
      align: "right",
      cell: (row) => formatDemoNumber(row.stock, locale),
      sectionCell: (section) => strings.itemsCount(countSectionItems(section)),
    },
    {
      id: "cost",
      title: strings.columnCost,
      align: "right",
      cell: (row) => formatDemoCurrency(row.cost, locale),
    },
    {
      id: "markup",
      title: strings.columnMarkup,
      align: "right",
      cell: (row) => formatMarkup(row.price, row.cost),
    },
    {
      id: "hidden",
      title: strings.columnHidden,
      cell: (row) => renderHiddenState(row.hidden, strings),
      sectionCell: (section) =>
        renderHiddenState(
          findSectionById(sections, section.id)?.hidden ?? false,
          strings
        ),
    },
  ]

  const treeQuery = treeSearch.trim().toLowerCase()
  const filteredTree = useMemo(
    () => filterProductTree(sections, treeQuery),
    [sections, treeQuery]
  )
  const treeSections = useMemo(
    () =>
      applyRowLimits(
        treeQuery !== "" ? filteredTree : sections,
        visibleRowCount
      ),
    [treeQuery, filteredTree, sections, visibleRowCount]
  )
  const derivedExpandedIds = useMemo(
    () => collectSectionIds(filteredTree),
    [filteredTree]
  )

  const categoriesFlat = useMemo(() => flattenDemoSections(sections), [sections])
  const categoryQuery = categorySearch.trim().toLowerCase()
  const categoryFilteredList = categoriesFlat.filter(
    (flat) =>
      categoryQuery === "" || flat.section.title.toLowerCase().includes(categoryQuery)
  )
  const categorySortedList = sortCategoryRows(categoryFilteredList, categorySort)
  const categoryLastPage = Math.max(
    1,
    Math.ceil(categorySortedList.length / categoryPageSize)
  )
  const categoryCurrentPage = Math.min(categoryPage, categoryLastPage)
  const categoryPageRows = categorySortedList.slice(
    (categoryCurrentPage - 1) * categoryPageSize,
    categoryCurrentPage * categoryPageSize
  )

  const categoryColumns: readonly WidgetTableColumn<FlatDemoSection>[] = [
    {
      id: "title",
      title: strings.columnName,
      grow: true,
      cell: (flat) => flat.section.title,
    },
    {
      id: "parent",
      title: strings.parentLabel,
      cell: (flat) =>
        flat.parentId ? (findSectionById(sections, flat.parentId)?.title ?? "—") : "—",
    },
    {
      id: "products",
      title: strings.columnProducts,
      align: "right",
      cell: (flat) => formatDemoNumber(countSectionItems(flat.section), locale),
    },
    {
      id: "sort",
      title: strings.sortLabel,
      align: "right",
      sortable: true,
      cell: (flat) => flat.section.sort,
    },
    {
      id: "hidden",
      title: strings.columnHidden,
      cell: (flat) => renderHiddenState(flat.section.hidden, strings),
    },
    {
      id: "actions",
      title: "",
      align: "right",
      cell: (flat) => (
        <RowActions
          actions={[
            {
              id: "edit",
              label: strings.editAction,
              icon: Pencil,
              onSelect: () => openEditSection(flat.section.id),
            },
            {
              id: "delete",
              label: strings.deleteAction,
              icon: Trash2,
              tone: "danger",
              onSelect: () => setDeleteSectionTarget(flat.section),
            },
          ]}
        />
      ),
    },
  ]

  const categoryFilters: readonly PageListFilter[] = [
    { id: "search", label: strings.searchPlaceholder, kind: "search", value: categorySearch },
  ]

  const categorySortOptions: readonly WidgetTableSortOption[] = [
    { label: strings.sortBySortAsc, sort: { columnId: "sort", direction: "asc" } },
    { label: strings.sortBySortDesc, sort: { columnId: "sort", direction: "desc" } },
    { label: strings.sortByTitleAsc, sort: { columnId: "title", direction: "asc" } },
    { label: strings.sortByTitleDesc, sort: { columnId: "title", direction: "desc" } },
  ]

  const categorySelectionActions: readonly WidgetTableSelectionAction[] = [
    {
      id: "delete",
      label: strings.categorySelectionDeleteAction,
      icon: Trash2,
      tone: "danger",
      onSelect: () => setCategoryBulkDeleteOpen(true),
    },
  ]

  const productsFlat = useMemo(() => flattenDemoProducts(sections), [sections])
  const productQuery = productSearch.trim().toLowerCase()
  const productFilteredList = productsFlat.filter((flat) => {
    const byQuery =
      productQuery === "" ||
      flat.product.name.toLowerCase().includes(productQuery) ||
      flat.product.sku.toLowerCase().includes(productQuery)
    const byCategory =
      productCategoryFilter === "" || flat.section.id === productCategoryFilter
    return byQuery && byCategory
  })
  const productSortedList = sortProductRows(productFilteredList, productSort)
  const productLastPage = Math.max(
    1,
    Math.ceil(productSortedList.length / productPageSize)
  )
  const productCurrentPage = Math.min(productPage, productLastPage)
  const productPageRows = productSortedList.slice(
    (productCurrentPage - 1) * productPageSize,
    productCurrentPage * productPageSize
  )

  const productColumns: readonly WidgetTableColumn<FlatDemoProduct>[] = [
    {
      id: "name",
      title: strings.columnName,
      grow: true,
      cell: (flat) => flat.product.name,
    },
    {
      id: "category",
      title: strings.categoryLabel,
      cell: (flat) => flat.path,
    },
    {
      id: "sku",
      title: strings.columnSku,
      cell: (flat) => flat.product.sku,
    },
    {
      id: "price",
      title: strings.columnPrice,
      align: "right",
      sortable: true,
      cell: (flat) => formatDemoCurrency(flat.product.price, locale),
    },
    {
      id: "stock",
      title: strings.columnStock,
      align: "right",
      cell: (flat) => formatDemoNumber(flat.product.stock, locale),
    },
    {
      id: "sort",
      title: strings.sortLabel,
      align: "right",
      sortable: true,
      cell: (flat) => flat.product.sort,
    },
    {
      id: "hidden",
      title: strings.columnHidden,
      cell: (flat) => renderHiddenState(flat.product.hidden, strings),
    },
    {
      id: "actions",
      title: "",
      align: "right",
      cell: (flat) => (
        <RowActions
          actions={[
            {
              id: "edit",
              label: strings.editAction,
              icon: Pencil,
              onSelect: () => openEditProduct(flat.section.id, flat.product),
            },
            {
              id: "delete",
              label: strings.deleteAction,
              icon: Trash2,
              tone: "danger",
              onSelect: () =>
                setDeleteProductTarget({
                  sectionId: flat.section.id,
                  product: flat.product,
                }),
            },
          ]}
        />
      ),
    },
  ]

  const productFilters: readonly PageListFilter[] = [
    { id: "search", label: strings.searchPlaceholder, kind: "search", value: productSearch },
    {
      id: "category",
      label: strings.categoryFilterPlaceholder,
      kind: "select",
      value: productCategoryFilter,
      options: allCategoryOptions,
    },
  ]

  const productSortOptions: readonly WidgetTableSortOption[] = [
    { label: strings.sortBySortAsc, sort: { columnId: "sort", direction: "asc" } },
    { label: strings.sortBySortDesc, sort: { columnId: "sort", direction: "desc" } },
    { label: strings.sortByNameAsc, sort: { columnId: "name", direction: "asc" } },
    { label: strings.sortByNameDesc, sort: { columnId: "name", direction: "desc" } },
    { label: strings.sortByPriceAsc, sort: { columnId: "price", direction: "asc" } },
    { label: strings.sortByPriceDesc, sort: { columnId: "price", direction: "desc" } },
  ]

  const productSelectionActions: readonly WidgetTableSelectionAction[] = [
    {
      id: "delete",
      label: strings.productSelectionDeleteAction,
      icon: Trash2,
      tone: "danger",
      onSelect: () => setProductBulkDeleteOpen(true),
    },
  ]

  const tabItems: readonly PageTabsItem[] = [
    {
      id: "tree",
      label: strings.tabTree,
      icon: ListTree,
      content: (
        <WidgetTreeTable
          blockId="products.tree"
          fill
          columns={treeColumns}
          sections={treeSections}
          getRowKey={(row) => row.id}
          expandedIds={treeQuery !== "" ? derivedExpandedIds : expandedIds}
          onExpandedChange={treeQuery !== "" ? () => {} : setExpandedIds}
          toolbar={
            <PageListFilters
              filters={[
                {
                  id: "search",
                  label: strings.searchPlaceholder,
                  kind: "search",
                  value: treeSearch,
                },
              ]}
              onFilterChange={(_id, value) => setTreeSearch(value)}
              onResetFilters={() => setTreeSearch("")}
              resetFiltersLabel={strings.resetFiltersLabel}
            />
          }
          hiddenColumnIds={hiddenTreeColumnIds}
          onHiddenColumnIdsChange={setHiddenTreeColumnIds}
          filtered={treeQuery !== "" && filteredTree.length === 0}
          onClearFilters={() => setTreeSearch("")}
          onRowActivate={(row, section) => openEditProduct(section.id, row)}
          onLoadMoreRows={onLoadMoreRows}
          rowActions={(row, section) => (
            <RowActions
              actions={[
                {
                  id: "edit",
                  label: strings.editAction,
                  icon: Pencil,
                  onSelect: () => openEditProduct(section.id, row),
                },
                {
                  id: "delete",
                  label: strings.deleteAction,
                  icon: Trash2,
                  tone: "danger",
                  onSelect: () =>
                    setDeleteProductTarget({ sectionId: section.id, product: row }),
                },
              ]}
            />
          )}
          sectionActions={(section) => (
            <RowActions
              actions={[
                {
                  id: "edit",
                  label: strings.editAction,
                  icon: Pencil,
                  onSelect: () => openEditSection(section.id),
                },
                {
                  id: "add-product",
                  label: strings.addProductAction,
                  icon: Plus,
                  onSelect: () => openAddProduct(section.id),
                },
                {
                  id: "delete",
                  label: strings.deleteAction,
                  icon: Trash2,
                  tone: "danger",
                  onSelect: () =>
                    setDeleteSectionTarget(findSectionById(sections, section.id)),
                },
              ]}
            />
          )}
          labels={
            locale === "ru"
              ? localeRu.widgetTreeTable
              : undefined
          }
        />
      ),
    },
    {
      id: "categories",
      label: strings.tabCategories,
      icon: FolderTree,
      content: (
        <PageList
          blockId="products.categories"
          header={false}
          fill
          title={strings.tabCategories}
          filters={categoryFilters}
          onFilterChange={(id, value) => {
            if (id === "search") {
              setCategorySearch(value)
            }
            setCategoryPage(1)
          }}
          columns={categoryColumns}
          rows={categoryPageRows}
          getRowKey={(flat) => flat.section.id}
          page={categoryCurrentPage}
          pageSize={categoryPageSize}
          total={categorySortedList.length}
          onPageChange={setCategoryPage}
          pageSizeOptions={CATEGORY_PAGE_SIZE_OPTIONS}
          onPageSizeChange={(size) => {
            setCategoryPageSize(size)
            setCategoryPage(1)
          }}
          sort={categorySort}
          onSortChange={(sort) => {
            setCategorySort(sort)
            setCategoryPage(1)
          }}
          sortOptions={categorySortOptions}
          tableLabels={locale === "ru" ? localeRu.widgetTable : undefined}
          filtered={categorySearch.trim() !== ""}
          onClearFilters={() => {
            setCategorySearch("")
            setCategoryPage(1)
          }}
          hiddenColumnIds={categoryHiddenColumnIds}
          onHiddenColumnIdsChange={setCategoryHiddenColumnIds}
          onResetFilters={() => {
            setCategorySearch("")
            setCategoryPage(1)
          }}
          resetFiltersLabel={strings.resetFiltersLabel}
          selectedKeys={categorySelectedKeys}
          onSelectionChange={setCategorySelectedKeys}
          selectionActions={categorySelectionActions}
        />
      ),
    },
    {
      id: "products",
      label: strings.tabProducts,
      icon: Package,
      content: (
        <PageList
          blockId="products.products"
          header={false}
          fill
          title={strings.tabProducts}
          filters={productFilters}
          onFilterChange={(id, value) => {
            if (id === "search") {
              setProductSearch(value)
            } else if (id === "category") {
              setProductCategoryFilter(value)
            }
            setProductPage(1)
          }}
          columns={productColumns}
          rows={productPageRows}
          getRowKey={(flat) => flat.product.id}
          page={productCurrentPage}
          pageSize={productPageSize}
          total={productSortedList.length}
          onPageChange={setProductPage}
          pageSizeOptions={PRODUCT_PAGE_SIZE_OPTIONS}
          onPageSizeChange={(size) => {
            setProductPageSize(size)
            setProductPage(1)
          }}
          sort={productSort}
          onSortChange={(sort) => {
            setProductSort(sort)
            setProductPage(1)
          }}
          sortOptions={productSortOptions}
          tableLabels={locale === "ru" ? localeRu.widgetTable : undefined}
          filtered={
            productSearch.trim() !== "" || productCategoryFilter !== ""
          }
          onClearFilters={() => {
            setProductSearch("")
            setProductCategoryFilter("")
            setProductPage(1)
          }}
          hiddenColumnIds={productHiddenColumnIds}
          onHiddenColumnIdsChange={setProductHiddenColumnIds}
          onResetFilters={() => {
            setProductSearch("")
            setProductCategoryFilter("")
            setProductPage(1)
          }}
          resetFiltersLabel={strings.resetFiltersLabel}
          selectedKeys={productSelectedKeys}
          onSelectionChange={setProductSelectedKeys}
          selectionActions={productSelectionActions}
        />
      ),
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageTabs
        blockId="products"
        fill
        items={tabItems}
        value={activeTab}
        onValueChange={setActiveTab}
        actions={
          <>
            <Button size="sm" onClick={() => openAddSection()}>
              {strings.addSection}
            </Button>
            <Hint
              text={strings.addProductAction}
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label={strings.addProductAction}
                  onClick={() => openAddProduct(undefined)}
                >
                  <Plus />
                </Button>
              }
            />
          </>
        }
      />
      <FormDialog
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
        title={
          productDialogMode === "edit"
            ? strings.editProductTitle
            : strings.addProductTitle
        }
        submitting={savingProduct}
        submitLabel={
          locale === "ru" ? localeRu.formDialog.submitLabel : undefined
        }
        cancelLabel={
          locale === "ru" ? localeRu.formDialog.cancelLabel : undefined
        }
        onSubmit={submitProductDialog}
      >
        <TextField
          label={strings.nameLabel}
          value={productDraft.name}
          onChange={(name) => setProductDraft((draft) => ({ ...draft, name }))}
        />
        <TextField
          label={strings.skuLabel}
          value={productDraft.sku}
          onChange={(sku) => setProductDraft((draft) => ({ ...draft, sku }))}
        />
        <ComboboxField
          label={strings.categoryLabel}
          value={productDraft.categoryId}
          onChange={(categoryId) =>
            setProductDraft((draft) => ({ ...draft, categoryId }))
          }
          options={allCategoryOptions}
          placeholder={
            locale === "ru" ? localeRu.comboboxField.placeholder : undefined
          }
          emptyLabel={
            locale === "ru" ? localeRu.comboboxField.emptyLabel : undefined
          }
          openLabel={
            locale === "ru" ? localeRu.comboboxField.openLabel : undefined
          }
          clearLabel={
            locale === "ru" ? localeRu.comboboxField.clearLabel : undefined
          }
        />
        <NumberField
          label={strings.priceLabel}
          value={productDraft.price}
          onChange={(price) => setProductDraft((draft) => ({ ...draft, price }))}
          min={0}
        />
        <NumberField
          label={strings.stockLabel}
          value={productDraft.stock}
          onChange={(stock) => setProductDraft((draft) => ({ ...draft, stock }))}
          min={0}
        />
        <NumberField
          label={strings.costLabel}
          value={productDraft.cost}
          onChange={(cost) => setProductDraft((draft) => ({ ...draft, cost }))}
          min={0}
        />
        <NumberField
          label={strings.sortLabel}
          value={productDraft.sort}
          onChange={(sort) => setProductDraft((draft) => ({ ...draft, sort }))}
          min={0}
        />
        <CheckboxField
          label={strings.hiddenLabel}
          checked={productDraft.hidden}
          onChange={(hidden) =>
            setProductDraft((draft) => ({ ...draft, hidden }))
          }
        />
      </FormDialog>
      <FormDialog
        open={sectionDialogOpen}
        onOpenChange={setSectionDialogOpen}
        title={
          sectionDialogMode === "edit"
            ? strings.editSectionTitle
            : strings.addSectionTitle
        }
        submitting={savingSection}
        submitLabel={
          locale === "ru" ? localeRu.formDialog.submitLabel : undefined
        }
        cancelLabel={
          locale === "ru" ? localeRu.formDialog.cancelLabel : undefined
        }
        onSubmit={submitSectionDialog}
      >
        <TextField
          label={strings.titleLabel}
          value={sectionDraft.title}
          onChange={(title) =>
            setSectionDraft((draft) => ({ ...draft, title }))
          }
        />
        <ComboboxField
          label={strings.parentLabel}
          value={sectionDraft.parentId}
          onChange={(parentId) =>
            setSectionDraft((draft) => ({ ...draft, parentId }))
          }
          options={parentOptions}
          placeholder={
            locale === "ru" ? localeRu.comboboxField.placeholder : undefined
          }
          emptyLabel={
            locale === "ru" ? localeRu.comboboxField.emptyLabel : undefined
          }
          openLabel={
            locale === "ru" ? localeRu.comboboxField.openLabel : undefined
          }
          clearLabel={
            locale === "ru" ? localeRu.comboboxField.clearLabel : undefined
          }
        />
        <IconField
          label={strings.iconLabel}
          value={sectionDraft.iconId}
          onChange={(iconId) =>
            setSectionDraft((draft) => ({ ...draft, iconId: iconId ?? "" }))
          }
          labels={locale === "ru" ? strings.iconFieldLabels : undefined}
          loadKeywords={locale === "ru" ? loadDemoIconKeywordsRu : undefined}
        />
        <ColorField
          label={strings.colorLabel}
          value={sectionDraft.color}
          onChange={(color) =>
            setSectionDraft((draft) => ({ ...draft, color }))
          }
          presets={SECTION_COLOR_PRESETS}
          placeholder={
            locale === "ru" ? localeRu.colorField.placeholder : undefined
          }
          hexInputLabel={
            locale === "ru" ? localeRu.colorField.hexInputLabel : undefined
          }
        />
        <NumberField
          label={strings.sortLabel}
          value={sectionDraft.sort}
          onChange={(sort) => setSectionDraft((draft) => ({ ...draft, sort }))}
          min={0}
        />
        <CheckboxField
          label={strings.hiddenLabel}
          checked={sectionDraft.hidden}
          onChange={(hidden) =>
            setSectionDraft((draft) => ({ ...draft, hidden }))
          }
        />
      </FormDialog>
      <ConfirmDialog
        open={deleteProductTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteProductTarget(null)
          }
        }}
        title={strings.deleteProductTitle}
        description={
          deleteProductTarget
            ? strings.deleteProductDescription(deleteProductTarget.product.name)
            : undefined
        }
        confirmLabel={strings.deleteAction}
        cancelLabel={
          locale === "ru" ? localeRu.confirmDialog.cancelLabel : undefined
        }
        tone="danger"
        loading={deletingProduct}
        onConfirm={confirmDeleteProduct}
      />
      <ConfirmDialog
        open={deleteSectionTarget !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteSectionTarget(undefined)
          }
        }}
        title={strings.deleteSectionTitle}
        description={
          deleteSectionTarget
            ? strings.deleteSectionDescription(
                deleteSectionTarget.title,
                countSectionItems(deleteSectionTarget)
              )
            : undefined
        }
        confirmLabel={strings.deleteAction}
        cancelLabel={
          locale === "ru" ? localeRu.confirmDialog.cancelLabel : undefined
        }
        tone="danger"
        loading={deletingSection}
        onConfirm={confirmDeleteSection}
      />
      <ConfirmDialog
        open={categoryBulkDeleteOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCategoryBulkDeleteOpen(false)
          }
        }}
        title={strings.categorySelectionDeleteConfirmTitle}
        description={strings.categorySelectionDeleteConfirmDescription(
          categorySelectedKeys.size
        )}
        confirmLabel={strings.categorySelectionDeleteConfirmLabel}
        cancelLabel={
          locale === "ru" ? localeRu.confirmDialog.cancelLabel : undefined
        }
        tone="danger"
        loading={categoryBulkDeleting}
        onConfirm={removeSelectedCategories}
      />
      <ConfirmDialog
        open={productBulkDeleteOpen}
        onOpenChange={(open) => {
          if (!open) {
            setProductBulkDeleteOpen(false)
          }
        }}
        title={strings.productSelectionDeleteConfirmTitle}
        description={strings.productSelectionDeleteConfirmDescription(
          productSelectedKeys.size
        )}
        confirmLabel={strings.productSelectionDeleteConfirmLabel}
        cancelLabel={
          locale === "ru" ? localeRu.confirmDialog.cancelLabel : undefined
        }
        tone="danger"
        loading={productBulkDeleting}
        onConfirm={removeSelectedProducts}
      />
    </div>
  )
}
