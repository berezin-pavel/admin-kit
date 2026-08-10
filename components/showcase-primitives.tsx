import type { ReactNode } from "react"

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
import { getRequiredPrimitives } from "@/lib/registry-primitives"

interface PrimitiveDemo {
  name: string
  title: string
  description: string
  demo: ReactNode
}

const PRIMITIVE_DEMOS: readonly PrimitiveDemo[] = [
  {
    name: "badge",
    title: "Badge",
    description: "A compact label for status, count, or a tag.",
    demo: (
      <>
        <Badge>New</Badge>
        <Badge variant="destructive">Error</Badge>
      </>
    ),
  },
  {
    name: "button",
    title: "Button",
    description: "An action button: filled and outline variants.",
    demo: (
      <>
        <Button>Save</Button>
        <Button variant="outline">Cancel</Button>
      </>
    ),
  },
  {
    name: "card",
    title: "Card",
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
    name: "chart",
    title: "Chart",
    description:
      "A wrapper around recharts: a container with theme colors and a tooltip. Line and bar are the same primitive.",
    demo: <PrimitiveChartDemo />,
  },
  {
    name: "input",
    title: "Input",
    description: "A text field: regular and disabled.",
    demo: (
      <>
        <Input placeholder="Product name" className="w-56" />
        <Input placeholder="Unavailable" disabled className="w-56" />
      </>
    ),
  },
  {
    name: "label",
    title: "Label",
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
    name: "pagination",
    title: "Pagination",
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
    name: "progress",
    title: "Progress",
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
    name: "select",
    title: "Select",
    description: "A dropdown list: with a selected value and without.",
    demo: (
      <>
        <Select defaultValue="week">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Period">Week</SelectValue>
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
    name: "sheet",
    title: "Sheet",
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
    name: "skeleton",
    title: "Skeleton",
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
    name: "table",
    title: "Table",
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

export function ShowcasePrimitives() {
  const required = getRequiredPrimitives()
  const demoByName = new Map(
    PRIMITIVE_DEMOS.map((primitive) => [primitive.name, primitive])
  )

  return (
    <section id="primitives" className="flex scroll-mt-20 flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Primitives</h2>
        <p className="max-w-2xl text-muted-foreground">
          The primitives admin-kit items depend on — entries from{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
            registryDependencies
          </code>{" "}
          in{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
            registry.json
          </code>
          , which are not items of admin-kit itself. The CLI installs them
          for the consumer automatically as a dependency of the chosen item,
          they aren’t distributed by a separate command. The list is built
          from the registry, not from the contents of{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
            components/ui/
          </code>
          , so it won’t drift from the kit when the set of primitives
          changes. Each one shows which kit items depend on it.
        </p>
      </header>
      <div className="flex flex-col gap-12">
        {required.map((primitive) => {
          const demo = demoByName.get(primitive.name)

          if (!demo) {
            return (
              <div
                key={primitive.name}
                className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-foreground"
              >
                No demo for this primitive{" "}
                <code className="rounded bg-muted px-1 py-0.5">
                  {primitive.name}
                </code>
                , even though the kit depends on it. Required by:{" "}
                {primitive.requiredBy.join(", ")}.
              </div>
            )
          }

          return (
            <PrimitiveSection
              key={primitive.name}
              file={`${primitive.name}.tsx`}
              name={demo.title}
              description={demo.description}
              requiredBy={primitive.requiredBy}
            >
              {demo.demo}
            </PrimitiveSection>
          )
        })}
      </div>
    </section>
  )
}
