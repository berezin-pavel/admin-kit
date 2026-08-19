import { notFound } from "next/navigation"

import { ShowcaseGallery } from "@/components/showcase-gallery"
import { ShowcaseHeader } from "@/components/showcase-header"
import { ShowcaseNav } from "@/components/showcase-nav"
import { resolveShowcaseGroups } from "@/lib/showcase-groups"
import { showcaseEntries } from "@/showcase/entries"

export function generateStaticParams() {
  return resolveShowcaseGroups(showcaseEntries).map((group) => ({
    section: group.id,
  }))
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>
}) {
  const { section } = await params
  const group = resolveShowcaseGroups(showcaseEntries).find(
    (candidate) => candidate.id === section
  )
  if (!group) {
    notFound()
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8 md:py-12">
      <ShowcaseHeader
        title={group.title}
        description={`${group.entries.length} ${group.entries.length === 1 ? "item" : "items"} of admin-kit, every view rendered from the files the CLI installs.`}
        backLink
      />
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
        <ShowcaseNav entries={showcaseEntries} activeId={group.id} />
        <div className="min-w-0 flex-1">
          <ShowcaseGallery group={group} />
        </div>
      </div>
    </main>
  )
}
