import { notFound } from "next/navigation"

import { showcaseEntries } from "@/showcase/entries"

interface PreviewPageProps {
  params: Promise<{ entry: string; view: string }>
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { entry: entrySlug, view: viewSlug } = await params
  const entry = showcaseEntries.find(
    (candidate) => candidate.item === entrySlug
  )
  const view = entry?.views.find((candidate) => candidate.id === viewSlug)

  if (!view) {
    notFound()
  }

  return <view.render />
}
