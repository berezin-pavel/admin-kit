import { Button } from "@/components/ui/button"
import { PageEntity } from "@/registry/page-entity/page-entity"

import type { ShowcaseEntry } from "./types"

export const pageEntityEntry: ShowcaseEntry = {
  item: "page-entity",
  title: "Entity page",
  description:
    "A card for a single record: a title, actions on the right, and fields grouped into sections. A field's value is a ReactNode, so a link or a badge can sit next to the text. A section lays its fields out in two columns by default; columns takes 1, 2 or 3, and three columns is what keeps a record with short values from spreading over a screen of empty space. The status prop swaps the fields for a state screen while keeping the title in place.",
  views: [
    {
      id: "three-columns",
      name: "Sections in three columns",
      render: () => (
        <PageEntity
          title="Order #4187"
          description="Nova sneakers, delivery in Austin"
          sections={[
            {
              id: "order",
              title: "Order",
              columns: 3,
              fields: [
                { id: "status", label: "Status", value: "Delivered" },
                {
                  id: "placed",
                  label: "Placed",
                  value: "August 3, 2026, 2:12 PM",
                },
                { id: "channel", label: "Channel", value: "Online store" },
                { id: "total", label: "Total", value: "$2,340" },
                { id: "payment", label: "Payment", value: "Card •• 4412" },
                { id: "manager", label: "Manager", value: "Alex Morgan" },
              ],
            },
            {
              id: "customer",
              title: "Customer",
              columns: 3,
              fields: [
                { id: "name", label: "Name", value: "Emily Carter" },
                {
                  id: "email",
                  label: "Email",
                  value: "emily.carter@example.com",
                },
                { id: "phone", label: "Phone", value: "+1 512 555-0142" },
              ],
            },
          ]}
        />
      ),
    },
    {
      id: "order-three-sections",
      name: "Order card, three sections",
      render: () => (
        <PageEntity
          title="Order #1043"
          description="Created August 9, 2026, 14:32"
          actions={
            <>
              <Button size="sm">Edit</Button>
              <Button size="sm" variant="outline">
                Cancel
              </Button>
            </>
          }
          sections={[
            {
              id: "main",
              title: "General",
              fields: [
                {
                  id: "status",
                  label: "Status",
                  value: (
                    <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      Paid
                    </span>
                  ),
                },
                { id: "customer", label: "Customer", value: "Bennett A." },
                { id: "total", label: "Amount", value: "$4,200" },
              ],
            },
            {
              id: "delivery",
              title: "Shipping",
              fields: [
                {
                  id: "address",
                  label: "Address",
                  value: "New York, 5th Avenue, 12",
                },
                { id: "method", label: "Method", value: "Courier" },
                {
                  id: "tracking",
                  label: "Tracking number",
                  value: (
                    <a href="#" className="text-primary underline">
                      US1043920156
                    </a>
                  ),
                },
              ],
            },
            {
              id: "payment",
              title: "Payment",
              fields: [
                {
                  id: "method",
                  label: "Payment method",
                  value: "Card •• 4412",
                },
                { id: "paidAt", label: "Payment date", value: "08/09/2026" },
              ],
            },
          ]}
        />
      ),
    },
    {
      id: "user-untitled-first-section",
      name: "Card with an untitled first section",
      render: () => (
        <PageEntity
          title="Anna Bennett"
          description="User since 2024"
          actions={
            <Button size="sm" variant="outline">
              Block
            </Button>
          }
          sections={[
            {
              id: "main",
              fields: [
                {
                  id: "fullName",
                  label: "Full name",
                  value: "Anna S. Bennett",
                },
                {
                  id: "email",
                  label: "Email",
                  value: (
                    <a
                      href="mailto:a.bennett@example.com"
                      className="text-primary underline"
                    >
                      a.bennett@example.com
                    </a>
                  ),
                },
                { id: "phone", label: "Phone", value: "+1 900 123-4567" },
              ],
            },
            {
              id: "access",
              title: "Access rights",
              fields: [
                { id: "role", label: "Role", value: "Administrator" },
                {
                  id: "accessStatus",
                  label: "Status",
                  value: (
                    <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      Active
                    </span>
                  ),
                },
              ],
            },
          ]}
        />
      ),
    },
    {
      id: "status-loading",
      name: "State: loading",
      render: () => (
        <PageEntity title="Order #1043" status="loading" sections={[]} />
      ),
    },
    {
      id: "status-error",
      name: "State: error",
      render: () => (
        <PageEntity title="Order #1043" status="error" sections={[]} />
      ),
    },
    {
      id: "status-forbidden",
      name: "State: forbidden",
      render: () => (
        <PageEntity title="Order #1043" status="forbidden" sections={[]} />
      ),
    },
    {
      id: "status-offline",
      name: "State: offline",
      render: () => (
        <PageEntity title="Order #1043" status="offline" sections={[]} />
      ),
    },
  ],
}
