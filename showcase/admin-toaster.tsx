import {
  DangerView,
  InfoView,
  SuccessView,
  WarningView,
  WithActionView,
} from "./admin-toaster-view"
import type { ShowcaseEntry } from "./types"

export const adminToasterEntry: ShowcaseEntry = {
  item: "admin-toaster",
  title: "Notification toasts",
  description:
    "Toasts about an operation's outcome — an order was saved, an email failed to send, stock is running low. Mounted once (in the root layout or the shell) via <AdminToaster />, which renders nothing itself; calls to notify.info/success/warning/danger from anywhere in the code show the toasts, with no state or context of their own — the whole toast queue lives in the @/components/ui/toast primitive's manager. Tone sets the color and icon; the optional description and actionLabel/onAction add an explanation and an action button to the toast.",
  views: [
    {
      id: "info",
      name: "Info",
      render: () => <InfoView />,
    },
    {
      id: "success",
      name: "Success",
      render: () => <SuccessView />,
    },
    {
      id: "warning",
      name: "Warning",
      render: () => <WarningView />,
    },
    {
      id: "danger",
      name: "Danger",
      render: () => <DangerView />,
    },
    {
      id: "with-action",
      name: "With an action",
      render: () => <WithActionView />,
    },
  ],
}
