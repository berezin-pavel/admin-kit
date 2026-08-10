import Link from "next/link"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  getThemeTokens,
  type ThemeToken,
  type ThemeTokenGroup,
} from "@/lib/theme-tokens"

const GROUPS: {
  key: ThemeTokenGroup
  title: string
  description: string
}[] = [
  {
    key: "core",
    title: "Theme",
    description: "Background, text, surfaces, and status colors — the core set.",
  },
  {
    key: "chart",
    title: "Charts",
    description: "The data-series palette for widget charts.",
  },
  {
    key: "sidebar",
    title: "Sidebar",
    description: "A separate palette for the shell's navigation.",
  },
]

export default function TokensPage() {
  const tokens = getThemeTokens()
  const background = tokens.find((token) => token.name === "background")

  if (!background) {
    throw new Error("The background token wasn't found in globals.css")
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-3">
        <Link
          href="/"
          className="w-fit text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          ← Showcase
        </Link>
        <h1 className="text-3xl font-semibold">Theme tokens</h1>
        <p className="max-w-2xl text-muted-foreground">
          A color swatch, the variable name, and its value — for the light
          and dark schemes at once. Values are read directly from{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
            app/globals.css
          </code>{" "}
          (the{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">:root</code>{" "}
          and{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">.dark</code>
          {" "}blocks), so the page never drifts from the theme after the
          next edit.
        </p>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Four tokens —{" "}
          <code className="rounded bg-muted px-1 py-0.5">success</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5">
            success-foreground
          </code>
          , <code className="rounded bg-muted px-1 py-0.5">warning</code> and{" "}
          <code className="rounded bg-muted px-1 py-0.5">
            warning-foreground
          </code>{" "}
          — on top of the standard shadcn set, added by the admin-kit theme
          (see{" "}
          <code className="rounded bg-muted px-1 py-0.5">
            docs/adr/0003-success-and-warning-tokens.md
          </code>
          ) and shown here alongside the rest.
        </p>
      </header>
      {GROUPS.map((group) => (
        <TokenGroup
          key={group.key}
          title={group.title}
          description={group.description}
          tokens={tokens.filter((token) => token.group === group.key)}
          lightBackdrop={background.light}
          darkBackdrop={background.dark}
        />
      ))}
    </main>
  )
}

function TokenGroup({
  title,
  description,
  tokens,
  lightBackdrop,
  darkBackdrop,
}: {
  title: string
  description: string
  tokens: readonly ThemeToken[]
  lightBackdrop: string
  darkBackdrop: string
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Light scheme</TableHead>
              <TableHead>Dark scheme</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((token) => (
              <TableRow key={token.name}>
                <TableCell>
                  <code className="text-sm">--{token.name}</code>
                </TableCell>
                <TableCell>
                  <TokenSwatch value={token.light} backdrop={lightBackdrop} />
                </TableCell>
                <TableCell>
                  <TokenSwatch value={token.dark} backdrop={darkBackdrop} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

function TokenSwatch({ value, backdrop }: { value: string; backdrop: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="block size-6 shrink-0 overflow-hidden rounded-md ring-1 ring-foreground/10"
        style={{ backgroundColor: backdrop }}
      >
        <span className="block size-full" style={{ backgroundColor: value }} />
      </span>
      <code className="text-xs whitespace-nowrap text-muted-foreground">
        {value}
      </code>
    </div>
  )
}
