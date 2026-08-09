import { SidebarToggleView } from "./sidebar-toggle-view"
import type { ShowcaseEntry } from "./types"

export const sidebarToggleEntry: ShowcaseEntry = {
  item: "sidebar-toggle",
  title: "Sidebar toggle",
  description:
    "A button for collapsing the shell's sidebar into an icon strip, structured like theme-toggle: collapsed and onToggle come in as props, with no state of its own. The icon shows the action that will happen on click. Visible only on a wide screen — on a narrow one the sidebar is already an icon strip with a burger.",
  views: [
    {
      id: "expanded",
      name: "Sidebar expanded (button visible from md — open on a wide screen)",
      render: () => <SidebarToggleView initialCollapsed={false} />,
    },
    {
      id: "collapsed",
      name: "Sidebar collapsed (button visible from md — open on a wide screen)",
      render: () => <SidebarToggleView initialCollapsed={true} />,
    },
  ],
}
