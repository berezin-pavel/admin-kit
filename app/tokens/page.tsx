import { ShowcaseHeader } from "@/components/showcase-header"
import { ShowcaseNav } from "@/components/showcase-nav"
import { ShowcaseTokens } from "@/components/showcase-tokens"
import { showcaseEntries } from "@/showcase/entries"

export default function TokensPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8 md:py-12">
      <ShowcaseHeader
        title="Theme tokens"
        description="The colour and radius tokens admin-theme installs, in both schemes."
        backLink
      />
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
        <ShowcaseNav entries={showcaseEntries} activeId="tokens" />
        <div className="min-w-0 flex-1">
          <ShowcaseTokens />
        </div>
      </div>
    </main>
  )
}
