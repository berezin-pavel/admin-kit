import { Button } from "@/components/ui/button"
import { StateError } from "@/registry/state-error/state-error"
import { StateForbidden } from "@/registry/state-forbidden/state-forbidden"
import { StateOffline } from "@/registry/state-offline/state-offline"

import type { ShowcaseEntry } from "./types"

export const stateErrorEntry: ShowcaseEntry = {
  item: "state-error",
  title: "Error state",
  description:
    "A load-failure screen: a title, an optional description, and an optional action. The default icon flags the failure before the text does.",
  views: [
    {
      id: "title-only",
      name: "Title only",
      render: () => <StateError />,
    },
    {
      id: "with-description",
      name: "With a description",
      render: () => (
        <StateError description="Failed to load data. Try again." />
      ),
    },
    {
      id: "with-action",
      name: "With an action",
      render: () => (
        <StateError
          description="Failed to load data. Try again."
          actions={<Button>Retry</Button>}
        />
      ),
    },
    {
      id: "gradient",
      name: "With a gradient backdrop",
      render: () => (
        <StateError
          description="Failed to load data. Try again."
          actions={<Button>Retry</Button>}
          gradient="ember"
        />
      ),
    },
  ],
}

export const stateForbiddenEntry: ShowcaseEntry = {
  item: "state-forbidden",
  title: "Forbidden state",
  description:
    "A denial screen: a title, an optional description, and an optional action. The icon is muted rather than alarming — it's a denial, not a breakage.",
  views: [
    {
      id: "title-only",
      name: "Title only",
      render: () => <StateForbidden />,
    },
    {
      id: "with-description",
      name: "With a description",
      render: () => (
        <StateForbidden description="Contact an administrator to get access to this section." />
      ),
    },
    {
      id: "with-action",
      name: "With an action",
      render: () => (
        <StateForbidden
          description="Contact an administrator to get access to this section."
          actions={<Button variant="outline">Request access</Button>}
        />
      ),
    },
    {
      id: "gradient",
      name: "With a gradient backdrop",
      render: () => (
        <StateForbidden
          description="Contact an administrator to get access to this section."
          actions={<Button variant="outline">Request access</Button>}
          gradient="dusk"
        />
      ),
    },
  ],
}

export const stateOfflineEntry: ShowcaseEntry = {
  item: "state-offline",
  title: "Offline state",
  description:
    "A lost-connection screen: a title, an optional description, and an optional action. The default icon flags the failure before the text does.",
  views: [
    {
      id: "title-only",
      name: "Title only",
      render: () => <StateOffline />,
    },
    {
      id: "with-description",
      name: "With a description",
      render: () => (
        <StateOffline description="Check your internet connection and try again." />
      ),
    },
    {
      id: "with-action",
      name: "With an action",
      render: () => (
        <StateOffline
          description="Check your internet connection and try again."
          actions={<Button>Retry</Button>}
        />
      ),
    },
    {
      id: "gradient",
      name: "With a gradient backdrop",
      render: () => (
        <StateOffline
          description="Check your internet connection and try again."
          actions={<Button>Retry</Button>}
          gradient="sky"
        />
      ),
    },
  ],
}
