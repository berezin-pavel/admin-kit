import { Boxes } from "lucide-react"

import { AppLogo } from "@/registry/app-logo/app-logo"

import type { ShowcaseEntry } from "./types"

export const appLogoEntry: ShowcaseEntry = {
  item: "app-logo",
  title: "App logo",
  description:
    "The brand mark for the shell's logo slot, so a freshly installed panel isn't nameless in the collapsed rail: a rounded accent square with a lucide icon, or the first letter of the app name when there's no icon yet. Decorative by design — the app name stands next to it, so the mark stays out of the accessibility tree.",
  views: [
    {
      id: "letter",
      name: "Letter mark (no icon supplied)",
      render: () => (
        <div className="flex items-center gap-2">
          <AppLogo name="Admin kit" />
          <span className="text-sm font-medium">Admin kit</span>
        </div>
      ),
    },
    {
      id: "icon",
      name: "Icon mark",
      render: () => (
        <div className="flex items-center gap-2">
          <AppLogo name="Admin kit" icon={Boxes} />
          <span className="text-sm font-medium">Admin kit</span>
        </div>
      ),
    },
  ],
}
