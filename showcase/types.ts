import type { ReactNode } from "react"

export interface ShowcaseView {
  name: string
  render: () => ReactNode
}

export interface ShowcaseEntry {
  item: string
  title: string
  description: string
  views: readonly ShowcaseView[]
}
