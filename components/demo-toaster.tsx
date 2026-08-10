"use client"

import { Button } from "@/components/ui/button"
import { notify } from "@/registry/admin-toaster/admin-toaster"

export function DemoToaster() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() =>
          notify.info("Delivery status updated", {
            description: "Courier is on the way for order #10482",
          })
        }
      >
        Update delivery status
      </Button>
      <Button
        onClick={() =>
          notify.success("Order saved", {
            description: "Order #10482 added to the fulfillment queue",
          })
        }
      >
        Save order
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          notify.warning("Stock is running low", {
            description: "SKU 4410 has 3 units left",
          })
        }
      >
        Check stock
      </Button>
      <Button
        variant="destructive"
        onClick={() =>
          notify.danger("Failed to send the email", {
            description: "Check the customer's address and resend",
          })
        }
      >
        Email the customer
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          notify.warning("Product removed from the catalog", {
            description: "\"Aroma 12 Coffee Machine\" is hidden from the storefront",
            actionLabel: "Restore",
            onAction: () =>
              notify.success("Product restored to the catalog", {
                description: "\"Aroma 12 Coffee Machine\" is visible on the storefront again",
              }),
          })
        }
      >
        Remove product from catalog
      </Button>
    </div>
  )
}
