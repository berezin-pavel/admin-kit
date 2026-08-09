import type { ComponentType } from "react"

export interface ShowcaseView {
  id: string
  name: string
  render: ComponentType
}

export interface ShowcaseEntry {
  item: string
  title: string
  description: string
  views: readonly ShowcaseView[]
}
