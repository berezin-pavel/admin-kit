# admin-kit

Ready-made admin panel parts — a theme, a shell, widgets, and screen
states — that install into your project with the `shadcn` command
and update whenever you decide to. Distributed as its own shadcn registry
straight from this GitHub repository: no build, no hosting, no tokens.

## Requirements

The consumer project is already initialized for shadcn: Next or Vite, Tailwind
v4, `components.json` at the root. From there, plain `shadcn add` does the job.

The primitives items depend on (`card`, `table`, `skeleton`, `sheet`, and
others) are installed by the CLI in whatever style is already chosen in
the consumer project — admin-kit's items themselves don't require
specifically Base UI or Radix. The exception is `admin-shell`: its source
is built around Base UI's composition API, and it won't drop into a
project already initialized on Radix without edits — details and
reasoning in [ADR 0002](docs/adr/0002-base-ui-instead-of-radix.md).

## Installation

The theme is installed first, with its own separate command:

```bash
pnpm dlx shadcn@latest add berezin-pavel/admin-kit/admin-theme
```

Named explicitly on the command line, the theme is a `registry:theme`,
and the CLI overwrites the project's color variables with it: it'll ask
for confirmation if the project's CSS file — `app/globals.css` in Next,
`src/index.css` in Vite — already has its own values, and once you agree
it applies the admin-kit palette wholesale.

After that, any registry item installs with the same command and its name:

```bash
pnpm dlx shadcn@latest add berezin-pavel/admin-kit/admin-shell
```

The CLI pulls in whatever the item depends on by itself: shadcn
primitives (`card`, `table`, `skeleton`, and others), npm packages, and
the theme itself if it isn't in the project yet. But a theme that arrives
as a dependency behaves differently from one installed explicitly: it
only fills in missing variables and doesn't touch what's already in the
project. If you install an item without the theme as the first step, the
admin-kit colors won't be applied over the project's existing palette —
the files will arrive, but `--primary` and the other variables will stay
as they were.

## Registry items

| Name                 | Type                 | What it does |
| -------------------- | -------------------- | ------------- |
| `admin-theme`         | `registry:theme`     | Colors and radii for the admin panel, for the light and dark schemes. Installed first — the other items rely on its tokens |
| `admin-shell`         | `registry:block`     | A persistent frame for the admin panel: an optional header, side navigation (on a narrow screen — an icon rail and a burger menu), and a work area. Installed once per project |
| `widget-metric`       | `registry:component` | A single-number card for a dashboard: a title, a value, optional trend (an arrow with its own separate color), and a caption |
| `widget-table`        | `registry:component` | A table with a header and columns: each column pulls its own value from the row and aligns via the `align` prop; without data and its own `empty` it shows `state-empty` |
| `widget-chart`        | `registry:component` | A chart card: a single data series as `label`/`value` pairs, the `kind` prop switches between a line and bars; without data and its own `empty` it shows `state-empty` |
| `widget-list`         | `registry:component` | A list of rows: a name, an optional explanation, optional content on the right, and an icon; without rows and its own `empty`, it shows `state-empty` |
| `widget-placeholder`  | `registry:component` | A dashed-border placeholder in the work area where a widget hasn't been chosen yet — not about missing data, that's what `state-empty` is for |
| `state-loading`       | `registry:component` | A skeleton in place of content while data is loading |
| `state-empty`         | `registry:component` | A screen in place of content when there's no data: a title, an explanation, an actions slot; no icon — empty data is normal |
| `state-error`         | `registry:component` | A screen for a load or request failure: a title, an explanation, an actions slot, a red error icon by default |
| `state-forbidden`     | `registry:component` | A forbidden screen: a title, an explanation, an actions slot, a muted lock icon — missing permissions is a denial, not a breakage |
| `state-offline`       | `registry:component` | A connection-lost screen: a title, an explanation, an actions slot, a red network-outage icon by default |

`widget-table`, `widget-chart`, and `widget-list` — the widgets with
data — show `state-empty` themselves when there's no data: no rows, no
points, or no list items, and the `empty` prop wasn't passed. There's no
need to wrap them in a state from outside. `widget-chart` on its own is
limited to a single data series: a deliberate constraint of the first
version — comparing several series on one chart is something this item
can't do, it's not the right fit for that job.

`admin-shell`'s header can be removed entirely with the `header={false}`
prop — then it's the sidebar on the left, the work area right after it,
and on a narrow screen the menu button moves to the top of the icon rail.
Navigation links default to plain `<a href>`, and the `renderLink` prop
swaps their rendering for the consumer's router (`next/link`,
react-router, and others) — the same way in the sidebar, the icon rail,
and the burger panel.

## Versions

Installing without specifying a version installs the content of the
`main` branch. To pin to a specific version, append the tag after `#`:

```bash
pnpm dlx shadcn@latest add berezin-pavel/admin-kit/admin-shell#v0.1.0
```

## Updating

A repeated `add` without flags, in interactive mode, asks for
confirmation on every file that's already in the project — and doesn't
touch anything without a "yes". Without interactive mode (`--yes`, CI),
such a file is skipped silently.

```bash
pnpm dlx shadcn@latest add berezin-pavel/admin-kit/admin-shell --diff
```

shows the discrepancy between the version in the project and the version
in the registry, while

```bash
pnpm dlx shadcn@latest add berezin-pavel/admin-kit/admin-shell -o
```

overwrites the item's files with the new version.

## Rule

Registry items aren't edited in your own project: the next `add -o` will
wipe out the edits without warning. If you need behavior that isn't there
out of the box, wrap the item in your own component or copy its file
under a different name.
