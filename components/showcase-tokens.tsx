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

export function ShowcaseTokens() {
  const tokens = getThemeTokens()
  const background = tokens.find((token) => token.name === "background")

  if (!background) {
    throw new Error("The background token wasn't found in globals.css")
  }

  return (
    <section id="tokens" className="flex scroll-mt-20 flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Theme tokens</h2>
        <p className="max-w-2xl text-muted-foreground">
          A color swatch, the variable name, and its value — for the light
          and dark schemes at once. Values are read directly from{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm text-foreground">
            app/globals.css
          </code>{" "}
          (the{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm text-foreground">:root</code>{" "}
          and{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm text-foreground">.dark</code>
          {" "}blocks), so this section never drifts from the theme after the
          next edit.
        </p>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Four tokens —{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">success</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">
            success-foreground
          </code>
          , <code className="rounded bg-muted px-1 py-0.5 text-foreground">warning</code> and{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">
            warning-foreground
          </code>{" "}
          — on top of the standard shadcn set, added by the admin-kit theme
          (see{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">
            docs/adr/0003-success-and-warning-tokens.md
          </code>
          ) and shown here alongside the rest.
        </p>
      </header>
      <div className="flex flex-col gap-10">
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
      </div>
    </section>
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold">{title}</h3>
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
    </div>
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
