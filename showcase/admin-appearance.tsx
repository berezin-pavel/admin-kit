import {
  AdminAppearanceBlocksView,
  AdminAppearanceReadOnlyView,
  AppearanceMenuView,
} from "./admin-appearance-view"
import type { ShowcaseEntry } from "./types"

export const adminAppearanceEntry: ShowcaseEntry = {
  item: "admin-appearance",
  title: "Appearance",
  description:
    "The palette, provider, and Block that carry the administrator's colour choice: twenty gradients and twenty accents, each contrast-checked, nothing entered by hand. A block resolves its own gradient by id from AppearanceProvider's value, so giving a block a colour is a click in its corner rather than a code change. The provider is optional and editable defaults to false — a block with no provider around it, or a read-only one, still paints whatever gradient it was given directly.",
  views: [
    {
      id: "blocks",
      name: "Blocks in edit mode",
      render: () => <AdminAppearanceBlocksView />,
    },
    {
      id: "read-only",
      name: "Without edit mode",
      render: () => <AdminAppearanceReadOnlyView />,
    },
    {
      id: "menu",
      name: "Appearance menu",
      render: () => <AppearanceMenuView />,
    },
  ],
}
