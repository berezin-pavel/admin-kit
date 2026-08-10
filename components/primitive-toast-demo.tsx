"use client"

import { Button } from "@/components/ui/button"
import { Toaster, toast } from "@/components/ui/toast"

export function PrimitiveToastDemo() {
  return (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: "Order saved",
            description: "Order #4187 added to the fulfillment queue",
            type: "success",
          })
        }
      >
        Show toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: "Save failed",
            description: "The server returned an error, please try again",
            type: "error",
          })
        }
      >
        Show error
      </Button>
      <Toaster />
    </>
  )
}
