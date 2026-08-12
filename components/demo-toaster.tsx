"use client"

import { Button } from "@/components/ui/button"
import { notify } from "@/registry/admin-toaster/admin-toaster"

import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"

export function DemoToaster() {
  const locale = useDemoLocale()
  const strings = demoDictionary[locale].toaster

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() =>
          notify.info(strings.updateStatusTitle, {
            description: strings.updateStatusDescription,
          })
        }
      >
        {strings.updateStatusButton}
      </Button>
      <Button
        onClick={() =>
          notify.success(strings.saveOrderTitle, {
            description: strings.saveOrderDescription,
          })
        }
      >
        {strings.saveOrderButton}
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          notify.warning(strings.checkStockTitle, {
            description: strings.checkStockDescription,
          })
        }
      >
        {strings.checkStockButton}
      </Button>
      <Button
        variant="destructive"
        onClick={() =>
          notify.danger(strings.sendEmailTitle, {
            description: strings.sendEmailDescription,
          })
        }
      >
        {strings.sendEmailButton}
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          notify.warning(strings.removeProductTitle, {
            description: strings.removeProductDescription,
            actionLabel: strings.removeProductActionLabel,
            onAction: () =>
              notify.success(strings.restoreProductTitle, {
                description: strings.restoreProductDescription,
              }),
          })
        }
      >
        {strings.removeProductButton}
      </Button>
    </div>
  )
}
