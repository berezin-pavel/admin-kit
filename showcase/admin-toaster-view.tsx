"use client"

import { Button } from "@/components/ui/button"
import { AdminToaster, notify } from "@/registry/admin-toaster/admin-toaster"

export function InfoView() {
  return (
    <div>
      <Button
        onClick={() =>
          notify.info("Delivery status updated", {
            description: "Courier is on the way for order #10482",
          })
        }
      >
        Update delivery status
      </Button>
      <AdminToaster />
    </div>
  )
}

export function SuccessView() {
  return (
    <div>
      <Button
        onClick={() =>
          notify.success("Order saved", {
            description: "Order #10482 added to the fulfillment queue",
          })
        }
      >
        Save order
      </Button>
      <AdminToaster />
    </div>
  )
}

export function WarningView() {
  return (
    <div>
      <Button
        onClick={() =>
          notify.warning("Stock is running low", {
            description: "SKU 4410 has 3 units left",
          })
        }
      >
        Check stock
      </Button>
      <AdminToaster />
    </div>
  )
}

export function DangerView() {
  return (
    <div>
      <Button
        onClick={() =>
          notify.danger("Failed to send the email", {
            description: "Check the customer's address and try again",
          })
        }
      >
        Email the customer
      </Button>
      <AdminToaster />
    </div>
  )
}

export function WithActionView() {
  return (
    <div>
      <Button
        onClick={() =>
          notify.warning("Product removed from catalog", {
            description: "“Aroma 12 Coffee Maker” is hidden from the storefront",
            actionLabel: "Undo",
            onAction: () =>
              notify.success("Product restored to catalog", {
                description: "“Aroma 12 Coffee Maker” is visible in the storefront again",
              }),
          })
        }
      >
        Remove product from catalog
      </Button>
      <AdminToaster />
    </div>
  )
}
