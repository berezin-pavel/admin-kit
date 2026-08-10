import { readdirSync } from "node:fs"
import path from "node:path"
import type { ReactNode } from "react"

import Link from "next/link"

import { PrimitiveChartDemo } from "@/components/primitive-chart-demo"
import { PrimitiveSection } from "@/components/primitive-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface PrimitiveDemo {
  file: string
  name: string
  description: string
  demo: ReactNode
}

const PRIMITIVES: readonly PrimitiveDemo[] = [
  {
    file: "badge.tsx",
    name: "Badge",
    description: "A compact label for status, count, or a tag.",
    demo: (
      <>
        <Badge>New</Badge>
        <Badge variant="destructive">Error</Badge>
      </>
    ),
  },
  {
    file: "button.tsx",
    name: "Button",
    description: "An action button: filled and outline variants.",
    demo: (
      <>
        <Button>Save</Button>
        <Button variant="outline">Cancel</Button>
      </>
    ),
  },
  {
    file: "card.tsx",
    name: "Card",
    description: 'A container card, regular size and compact size="sm".',
    demo: (
      <>
        <Card className="w-64">
          <CardHeader>
            <CardTitle>Order #1042</CardTitle>
            <CardDescription>Paid, awaiting shipment</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Regular size</p>
          </CardContent>
        </Card>
        <Card size="sm" className="w-64">
          <CardHeader>
            <CardTitle>Order #1043</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Compact, size=&quot;sm&quot;
            </p>
          </CardContent>
        </Card>
      </>
    ),
  },
  {
    file: "chart.tsx",
    name: "Chart",
    description:
      "A wrapper around recharts: a container with theme colors and a tooltip. Line and bar are the same primitive.",
    demo: <PrimitiveChartDemo />,
  },
  {
    file: "input.tsx",
    name: "Input",
    description: "A text field: regular and disabled.",
    demo: (
      <>
        <Input placeholder="Product name" className="w-56" />
        <Input placeholder="Unavailable" disabled className="w-56" />
      </>
    ),
  },
  {
    file: "label.tsx",
    name: "Label",
    description:
      "A form field caption. Dims along with the field when it's disabled.",
    demo: (
      <>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="primitive-label-active">Name</Label>
          <Input
            id="primitive-label-active"
            placeholder="Jane Doe"
            className="w-56"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="primitive-label-disabled">Name</Label>
          <Input
            id="primitive-label-disabled"
            placeholder="Unavailable"
            disabled
            className="w-56"
          />
        </div>
      </>
    ),
  },
  {
    file: "pagination.tsx",
    name: "Pagination",
    description: "Paginated navigation with an active link and regular ones.",
    demo: (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    ),
  },
  {
    file: "progress.tsx",
    name: "Progress",
    description: "A progress bar with a label and a value, two states.",
    demo: (
      <>
        <Progress value={32} className="w-56">
          <div className="flex w-full items-center justify-between">
            <ProgressLabel>Catalog import</ProgressLabel>
            <ProgressValue />
          </div>
        </Progress>
        <Progress value={78} className="w-56">
          <div className="flex w-full items-center justify-between">
            <ProgressLabel>Stock sync</ProgressLabel>
            <ProgressValue />
          </div>
        </Progress>
      </>
    ),
  },
  {
    file: "select.tsx",
    name: "Select",
    description: "A dropdown list: with a selected value and without.",
    demo: (
      <>
        <Select defaultValue="week">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Not selected" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </>
    ),
  },
  {
    file: "sheet.tsx",
    name: "Sheet",
    description: "A side panel that slides in from the right or left. Click it.",
    demo: (
      <>
        <Sheet>
          <SheetTrigger render={<Button variant="outline" />}>
            Open from the right
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Order details</SheetTitle>
              <SheetDescription>
                Slides in from the side without covering the whole page.
              </SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose render={<Button variant="outline" />}>
                Close
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger render={<Button variant="outline" />}>
            Open from the left
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
              <SheetDescription>
                The same primitive, side=&quot;left&quot;.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </>
    ),
  },
  {
    file: "skeleton.tsx",
    name: "Skeleton",
    description: "A loading placeholder: text lines and a round avatar.",
    demo: (
      <>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="size-10 rounded-full" />
      </>
    ),
  },
  {
    file: "table.tsx",
    name: "Table",
    description: "A table with rows: regular and selected (data-state).",
    demo: (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>#1042</TableCell>
            <TableCell>Paid</TableCell>
          </TableRow>
          <TableRow data-state="selected">
            <TableCell>#1043</TableCell>
            <TableCell>In fulfillment</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ),
  },
]

function findUndocumentedPrimitives() {
  const uiDirectory = path.join(process.cwd(), "components/ui")
  const files = readdirSync(uiDirectory)
    .filter((file) => file.endsWith(".tsx"))
    .sort()
  const documented = new Set(PRIMITIVES.map((primitive) => primitive.file))

  return files.filter((file) => !documented.has(file))
}

export default function PrimitivesPage() {
  const undocumented = findUndocumentedPrimitives()

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-3">
        <Link
          href="/"
          className="w-fit text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          ← Showcase
        </Link>
        <h1 className="text-3xl font-semibold">shadcn primitives</h1>
        <p className="max-w-2xl text-muted-foreground">
          These aren&apos;t admin-kit registry items — they&apos;re shadcn
          primitives (
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
            components/ui/
          </code>
          ) the kit is built on. The CLI installs them for the consumer
          automatically as dependencies of the chosen items; they aren&apos;t
          distributed by a separate command. Below is what&apos;s here and how
          it looks in the admin-kit theme, with a couple of characteristic
          states per primitive.
        </p>
      </header>
      {undocumented.length > 0 ? (
        <div className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-foreground">
          No demo on this page for: {undocumented.join(", ")}.
        </div>
      ) : null}
      <div className="flex flex-col gap-12">
        {PRIMITIVES.map((primitive) => (
          <PrimitiveSection
            key={primitive.file}
            file={primitive.file}
            name={primitive.name}
            description={primitive.description}
          >
            {primitive.demo}
          </PrimitiveSection>
        ))}
      </div>
    </main>
  )
}
