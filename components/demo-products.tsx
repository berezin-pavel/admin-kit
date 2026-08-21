"use client"

import { useState } from "react"
import {
  Check,
  ChevronsDownUp,
  ChevronsUpDown,
  FolderPlus,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { notify } from "@/registry/admin-toaster/admin-toaster"
import { CheckboxField } from "@/registry/checkbox-field/checkbox-field"
import { ColorField } from "@/registry/color-field/color-field"
import { ConfirmDialog } from "@/registry/confirm-dialog/confirm-dialog"
import { FormDialog } from "@/registry/form-dialog/form-dialog"
import { localeRu } from "@/registry/locale-ru/locale-ru"
import { NumberField } from "@/registry/number-field/number-field"
import { PageHeader } from "@/registry/page-header/page-header"
import { RowActions } from "@/registry/row-actions/row-actions"
import { TextField } from "@/registry/text-field/text-field"
import {
  collectSectionIds,
  WidgetTreeTable,
  type TreeTableColumn,
  type TreeTableSection,
} from "@/registry/widget-tree-table/widget-tree-table"

import {
  formatDemoCurrency,
  formatDemoNumber,
  getDemoProductSections,
  type DemoProduct,
  type DemoProductSection,
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

function countSectionItems(section: TreeTableSection<DemoProduct>): number {
  const own = section.rows?.length ?? 0
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
  patch: { title: string; color: string; hidden: boolean }
): readonly DemoProductSection[] {
  return updateSectionTree(sections, id, (section) => ({
    ...section,
    ...patch,
  }))
}

function formatMarkup(price: number, cost: number): string {
  if (cost === 0) {
    return "—"
  }
  return `${(((price - cost) / cost) * 100).toFixed(1)}%`
}

interface ProductDraft {
  name: string
  sku: string
  price: string
  stock: string
  cost: string
  hidden: boolean
}

const EMPTY_PRODUCT_DRAFT: ProductDraft = {
  name: "",
  sku: "",
  price: "",
  stock: "",
  cost: "",
  hidden: false,
}

interface SectionDraft {
  title: string
  color: string
  hidden: boolean
}

const EMPTY_SECTION_DRAFT: SectionDraft = {
  title: "",
  color: SECTION_COLOR_PRESETS[0],
  hidden: false,
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
  const [expandedIds, setExpandedIds] = useState<readonly string[]>(() =>
    getDemoProductSections(locale).map((section) => section.id)
  )

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

  const renderHiddenState = (hidden: boolean, strings: DemoDictionary["products"]) =>
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

  const openAddProduct = (sectionId: string) => {
    setProductDialogMode("add")
    setProductDialogSectionId(sectionId)
    setProductDialogProductId(undefined)
    setProductDraft(EMPTY_PRODUCT_DRAFT)
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
    })
    setProductDialogOpen(true)
  }

  const submitProductDialog = () => {
    setSavingProduct(true)

    window.setTimeout(() => {
      const patch = {
        name: productDraft.name,
        sku: productDraft.sku,
        price: Number(productDraft.price) || 0,
        stock: Number(productDraft.stock) || 0,
        cost: Number(productDraft.cost) || 0,
        hidden: productDraft.hidden,
      }

      if (productDialogMode === "edit" && productDialogProductId) {
        setSections((current) =>
          withProductUpdated(
            current,
            productDialogSectionId,
            productDialogProductId,
            patch
          )
        )
        notify.success(strings.savedToast)
      } else {
        const id = `product-${Date.now()}`
        setSections((current) =>
          withProductAdded(current, productDialogSectionId, {
            id,
            ...patch,
          })
        )
        setExpandedIds((current) =>
          current.includes(productDialogSectionId)
            ? current
            : [...current, productDialogSectionId]
        )
        notify.success(strings.addedToast)
      }

      setSavingProduct(false)
      setProductDialogOpen(false)
    }, 700)
  }

  const openAddSection = () => {
    setSectionDialogMode("add")
    setSectionDialogId(undefined)
    setSectionDraft(EMPTY_SECTION_DRAFT)
    setSectionDialogOpen(true)
  }

  const openEditSection = (sectionId: string) => {
    const section = findSectionById(sections, sectionId)
    if (!section) {
      return
    }
    setSectionDialogMode("edit")
    setSectionDialogId(sectionId)
    setSectionDraft({
      title: section.title,
      color: section.color ?? SECTION_COLOR_PRESETS[0],
      hidden: section.hidden,
    })
    setSectionDialogOpen(true)
  }

  const submitSectionDialog = () => {
    setSavingSection(true)

    window.setTimeout(() => {
      if (sectionDialogMode === "edit" && sectionDialogId) {
        setSections((current) =>
          withSectionUpdated(current, sectionDialogId, {
            title: sectionDraft.title,
            color: sectionDraft.color,
            hidden: sectionDraft.hidden,
          })
        )
        notify.success(strings.savedToast)
      } else {
        const id = `section-${Date.now()}`
        setSections((current) => [
          ...current,
          {
            id,
            title: sectionDraft.title,
            color: sectionDraft.color,
            hidden: sectionDraft.hidden,
            rows: [],
          },
        ])
        setExpandedIds((current) => [...current, id])
        notify.success(strings.addedToast)
      }

      setSavingSection(false)
      setSectionDialogOpen(false)
    }, 700)
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
    }, 700)
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
    }, 700)
  }

  const columns: readonly TreeTableColumn<DemoProduct>[] = [
    {
      id: "name",
      title: strings.columnName,
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

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        blockId="products.header"
        title={strings.title}
        description={strings.description}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedIds(collectSectionIds(sections))}
            >
              <ChevronsUpDown className="size-4" />
              {strings.expandAll}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedIds([])}
            >
              <ChevronsDownUp className="size-4" />
              {strings.collapseAll}
            </Button>
            <Button variant="outline" size="sm" onClick={openAddSection}>
              <FolderPlus className="size-4" />
              {strings.addSection}
            </Button>
          </>
        }
      />
      <WidgetTreeTable
        blockId="products.table"
        columns={columns}
        sections={sections}
        getRowKey={(row) => row.id}
        expandedIds={expandedIds}
        onExpandedChange={setExpandedIds}
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
            ? { emptyTitle: strings.emptyTitle, actions: strings.actionsColumn }
            : undefined
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
        cancelLabel={
          locale === "ru" ? localeRu.confirmDialog.cancelLabel : undefined
        }
        tone="danger"
        loading={deletingSection}
        onConfirm={confirmDeleteSection}
      />
    </div>
  )
}
