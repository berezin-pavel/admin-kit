import { PageAuthAside, PageAuthView } from "./page-auth-view"
import type { ShowcaseEntry } from "./types"

export const pageAuthEntry: ShowcaseEntry = {
  item: "page-auth",
  title: "Auth page",
  description:
    "The sign-in screen a consumer builds first: a centered card on an empty page, outside the shell — no sidebar, no navigation. appName sits above the card's title, the only place the product is named here. The item ships no email or password field of its own — the kit already has fields for whatever a sign-in needs (email, phone, one-time code, tenant picker), and children hold them. It's a real form — onSubmit receives the event, and the item never calls preventDefault for you. submitting disables the fieldset and the full-width submit button together, so a second submit can't race the first; error renders above the button as an assertive live region. footer sits under the card for a forgot-password or sign-up link; aside renders a second panel beside the card from lg upward — the marketing half of a split screen — and is hidden below that.",
  views: [
    {
      id: "default",
      name: "Sign in",
      render: () => <PageAuthView />,
    },
    {
      id: "error",
      name: "Failed sign-in",
      render: () => <PageAuthView simulateError />,
    },
    {
      id: "split",
      name: "Split with an aside panel",
      render: () => <PageAuthView aside={<PageAuthAside />} />,
    },
    {
      id: "gradient",
      name: "With a gradient backdrop",
      render: () => <PageAuthView gradient="dusk" />,
    },
  ],
}
