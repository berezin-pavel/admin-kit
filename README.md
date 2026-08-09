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
| `admin-shell`         | `registry:block`     | A persistent full-height frame for the admin panel: an optional header, side navigation (on a narrow screen — an icon rail and a burger menu), a `sidebarFooter` slot at the bottom, and a work area with its own scrolling. Installed once per project |
| `theme-toggle`        | `registry:component` | A theme-switch button that doesn't store the theme itself: the `isDark` state and the `onToggle` handler arrive as props. Fits the shell's `sidebarFooter` slot or anywhere else on the page |
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

`widget-chart` is noticeably heavier than the rest: it pulls in
`recharts`, adding 354 KB to the consumer's bundle (measured on a clean
Vite project: 227 KB without the chart versus 581 KB with it,
uncompressed). The other eleven items don't pull in any npm packages at
all, except `lucide-react` for icons. If a dashboard needs just one chart
and not right away, it's worth loading it dynamically.

`admin-shell` is the layout for the whole application, not a chunk of
markup inside a page: the shell takes up the full screen height (`h-svh`)
and doesn't scroll itself — only the work area scrolls, while the
sidebar, the icon rail, and the `sidebarFooter` slot stay in place.
Before, the whole page used to scroll and the navigation would drift
upward with long content.

The `sidebarFooter` prop sets a slot at the bottom of the sidebar, the
icon rail on a narrow screen, and the burger panel — shared by the theme
toggle (`theme-toggle`), a user menu, or a build version; it works even
with the header turned off. It's the same slot in all three places: the
same content is drawn in a 240px sidebar, in a rail the width of a single
button, and in the expanded burger panel — large or multi-line content
won't fit there without a separate layout for the narrow width.

`admin-shell`'s header can be removed entirely with the `header={false}`
prop — then it's the sidebar on the left, the work area right after it,
and on a narrow screen the menu button moves to the top of the icon rail.
Navigation links default to plain `<a href>`, and the `renderLink` prop
swaps their rendering for the consumer's router (`next/link`,
react-router, and others) — the same way in the sidebar, the icon rail,
and the burger panel.

**Contract for the `sidebarFooter` and `renderLink` slots: the content is
drawn as several independent instances at once, rather than moving
between the icon rail, the sidebar, and the burger panel.** The icon rail
and the wide sidebar are always mounted in the tree, and switching
between them is pure CSS (`md:hidden` / `hidden md:flex`); the burger
panel remounts on every open. That means two instances of the slot live
in the DOM at the same time at any screen width, and three while the
panel is open. A component with no state of its own — like `theme-toggle`,
which gets its `isDark` and `onToggle` as props — renders identically in
every instance and never notices the difference. A component with its
own state falls apart: a user menu that stores its own open/closed state
opens only in the instance that was clicked, while the rest stay closed;
a counter that fetches its own data via an effect makes an independent
request in every instance. The content of `sidebarFooter` and whatever
`renderLink` renders must either have no state of its own or be
controlled from outside — with state and callbacks arriving as props
from the shell or the parent, the way `theme-toggle` does.

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
