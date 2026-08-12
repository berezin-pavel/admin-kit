# admin-kit

Ready-made admin panel parts — a theme, a shell, widgets, pages, and
screen states — that install into your project with the `shadcn` command
and update whenever you decide to. Distributed as its own shadcn registry
straight from this GitHub repository: no build, no hosting, no tokens.

## Requirements

The consumer project is already initialized for shadcn: Next or Vite,
Tailwind v4, `components.json` at the root. From there, plain `shadcn add`
does the job.

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

| Name                  | Type                  | What it does                                                                                                                                                                                                                                                                                                                                                           |
| --------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `admin-theme`        | `registry:theme`     | Colors and radii for the admin panel, for the light and dark schemes. Installed first — the other items rely on its tokens                                                                                                                                                                                                                                            |
| `admin-shell`        | `registry:block`     | A persistent full-height frame for the admin panel: an optional header, side navigation (on a narrow screen — always an icon rail and a burger menu; on a wide one — a sidebar, or with `collapsed`, that same rail and burger menu), a `sidebarFooter` slot at the bottom, and a work area with its own scrolling. The `sidebarVariant` prop switches the sidebar's look between `flush` and `card` (default). Installed once per project |
| `theme-toggle`       | `registry:component` | A theme-switch button that doesn't store the theme itself: the `isDark` state and the `onToggle` handler arrive as props. Fits the shell's `sidebarFooter` slot or anywhere else on the page                                                                                                                                                                          |
| `sidebar-toggle`     | `registry:component` | A button that collapses the shell's sidebar into the icon rail, built the same way as `theme-toggle`: `collapsed` and `onToggle` arrive as props. Visible only on a wide screen — on a narrow one the sidebar is already an icon rail with a burger menu. Its place is the `sidebarFooter` slot next to the theme toggle                                             |
| `language-toggle`    | `registry:component` | A locale-switch button built the same way as `theme-toggle`: `locale`, `locales`, and `onLocaleChange` arrive as props. Shows the current locale's short label, cycling to the next one in the list on click. Its place is the `sidebarFooter` slot next to the theme toggle                                                                                        |
| `locale-ru`          | `registry:component` | A Russian dictionary: one `localeRu` const sliced into the exact shapes the other items' `labels`/`locale` props expect, so a slice passes straight into a prop. Bundles `date-fns`'s `ru` locale for the date fields                                                                                                                                                 |
| `widget-metric`      | `registry:component` | A single-number card for a dashboard: a title, a value, optional trend (an arrow with its own separate color), and a caption                                                                                                                                                                                                                                          |
| `widget-table`       | `registry:component` | A self-contained table card: the heading is optional, the header has a `toolbar` slot for filters, and the footer has a record count, pagination, and a page-size picker. A column with `sortable` gets a sort button and `aria-sort`; row order and slicing are set by the data owner, the table only reports the choice via `onSortChange` and `onPageChange`. Passing both `selectedKeys` and `onSelectionChange` adds a checkbox column — the header checkbox selects or clears the current page only — and swaps the header's left side for a selection bar with an N-selected count and `selectionActions`      |
| `widget-chart`       | `registry:component` | A chart card: a shared `labels` axis and a `series` list each with its own `values`; the `kind` prop switches between a line and bars; series colors cycle through the `chart-1`…`chart-5` tokens, and a legend appears once there are two or more series; without `labels` or `series` it shows `state-empty`                                                       |
| `widget-list`        | `registry:component` | A list of rows: a name, an optional explanation, optional content on the right, and an icon; without rows and its own `empty`, it shows `state-empty`                                                                                                                                                                                                                  |
| `widget-placeholder` | `registry:component` | A dashed-border placeholder in the work area where a widget hasn't been chosen yet — not about missing data, that's what `state-empty` is for                                                                                                                                                                                                                          |
| `state-loading`      | `registry:component` | A skeleton in place of content while data is loading                                                                                                                                                                                                                                                                                                                    |
| `state-empty`        | `registry:component` | A screen in place of content when there's no data: a title, an explanation, an actions slot; no icon — empty data is normal                                                                                                                                                                                                                                            |
| `state-error`        | `registry:component` | A screen for a load or request failure: a title, an explanation, an actions slot, a red error icon by default                                                                                                                                                                                                                                                          |
| `state-forbidden`    | `registry:component` | A forbidden screen: a title, an explanation, an actions slot, a muted lock icon — missing permissions is a denial, not a breakage                                                                                                                                                                                                                                       |
| `state-offline`      | `registry:component` | A connection-lost screen: a title, an explanation, an actions slot, a red network-outage icon by default                                                                                                                                                                                                                                                                |
| `page-entity`        | `registry:component` | A single-record page: a heading with actions and fields grouped into sections, with the field value being `ReactNode` rather than a string. The `status` prop swaps the fields for a loading, error, forbidden, or offline state, while the heading stays visible                                                                                                     |
| `page-header`        | `registry:component` | A section header: a title, an explanation, an actions slot on the right — a page building block, not a dashboard widget                                                                                                                                                                                                                                                |
| `status-badge`       | `registry:component` | A record-status badge with tone `neutral`, `success`, `warning`, `danger`; the `success` and `warning` tones depend on admin-kit's theme tokens                                                                                                                                                                                                                        |
| `hint`               | `registry:component` | A tooltip hint next to a field label, column header, or metric: without `children` a question-mark icon, with `children` a wrapper around your own element; opens on hover and from the keyboard                                                                                                                                                                      |
| `date-field`         | `registry:component` | A date-picker field: a calendar in a popover, with the value a `YYYY-MM-DD` string with no `Date` object or time zone, so it doesn't drift by a day on serialization                                                                                                                                                                                                    |
| `date-time-field`    | `registry:component` | A date-and-time field: the value is a `YYYY-MM-DDTHH:mm` string; changing the date keeps the time, changing the time keeps the date, and the popover doesn't close on date selection                                                                                                                                                                                   |
| `time-field`         | `registry:component` | A time field on a native `input type=time`: value `HH:mm`, `step` in minutes (5 by default), `min` and `max` bound the selection                                                                                                                                                                                                                                        |
| `color-field`        | `registry:component` | A color-picker field for a label, category, or kanban column: the value is HEX `#rrggbb`, with a `presets` palette in the popover, a native picker, and manual HEX entry                                                                                                                                                                                                |
| `text-field`         | `registry:component` | A single-line text input; the `type` prop switches between text, email, password, url and tel. Like every field: label, hint and an `error` that replaces the hint and sets `aria-invalid`                                                                                                                                                                              |
| `number-field`       | `registry:component` | A numeric input whose value is deliberately a string passed through unparsed — mid-typing states like `1.` can't live in a number; the consumer parses on submit. `min`/`max`/`step` forward to the native input                                                                                                                                                        |
| `textarea-field`     | `registry:component` | A multi-line text input with a `rows` prop, sharing the field anatomy: label, hint, error                                                                                                                                                                                                                                                                              |
| `select-field`       | `registry:component` | A single-choice select over `options` value/label pairs; an empty value shows the placeholder, and the popup is pinned to the trigger like the kit's other selects                                                                                                                                                                                                     |
| `checkbox-field`     | `registry:component` | A boolean checkbox with its label to the right and hint/error below the pair; controlled via `checked`/`onChange`                                                                                                                                                                                                                                                      |
| `page-form`          | `registry:component` | A create/edit record page: a heading, sections of consumer-laid-out fields inside a real `form`, and a footer with Cancel and Save. `submitting` disables the buttons and sets `aria-busy`; the `status` prop swaps sections for a state screen while the heading stays                                                                                                 |
| `confirm-dialog`     | `registry:component` | A controlled confirmation modal: `open` and `onOpenChange` are held by the consumer, `tone="danger"` colors the confirm button, `loading` disables the buttons and blocks closing while the operation is in progress                                                                                                                                                   |
| `admin-toaster`      | `registry:component` | Toasts about an operation's outcome: `AdminToaster` is placed once, and they're shown by calling `notify.info`, `notify.success`, `notify.warning`, `notify.danger` from anywhere, including code outside React                                                                                                                                                        |
| `widget-progress`    | `registry:component` | A dashboard progress-bar card: the share as a percentage of `max` (100 by default), an out-of-range value doesn't break the layout                                                                                                                                                                                                                                      |
| `page-list`          | `registry:component` | A list page: a section heading outside and a `widget-table` card below it — filters in its header, pagination and a page-size picker in the footer. Every value is controlled, and pagination isn't rendered without `total`. The `status` prop swaps the card's body for a state, while the heading and filters stay available. `selectedKeys`, `onSelectionChange`, and `selectionActions` forward straight through to `widget-table`, the same way sorting and pagination do                                     |

`widget-table`, `widget-chart`, and `widget-list` — the widgets with
data — show `state-empty` themselves when there's no data: no rows, no
series, or no list items, and the `empty` prop wasn't passed. There's no
need to wrap them in a state from outside. In `widget-chart` the length of
each series' `values` should match the length of `labels` — this isn't
checked by types; on a mismatch, the missing points simply aren't drawn.

`widget-chart` is noticeably heavier than the rest: it pulls in
`recharts`, adding 354 KB to the consumer's bundle (measured on a clean
Vite project: 227 KB without the chart versus 581 KB with it,
uncompressed). It's the only item with a heavy dependency: eight others
pull in `lucide-react` for icons, and the remaining ten don't pull in a
single npm package. If a dashboard needs just one chart and not right
away, it's worth loading it dynamically.

`page-list` and `page-entity` decide for themselves what to show based on
the `status` prop: `loading`, `error`, `forbidden`, and `offline` swap the
page's body for the matching state, and `ready` (the default) shows the
data. The heading stays put at any `status`, and for `page-list` the
filter row stays with it too — so a query can be retried with a different
filter without waiting for the page to reload.

`status-badge` and `admin-toaster` color the `success`, `warning`, and
`danger` tones with admin-kit theme tokens `--success`, `--warning`, and
`--destructive-foreground` — the first two aren't in shadcn's standard set
at all, and `--destructive` there has no matching text color
([ADR 0003](docs/adr/0003-success-and-warning-tokens.md)). Without the
admin-kit theme, three of the four tones render incorrectly; `neutral`
rests on the standard tokens and doesn't depend on the theme.
`--destructive` itself is overridden by the theme with a muted color: the
standard red stands out of line when it fills an entire toast.

`admin-shell` is the layout for the whole application, not a chunk of
markup inside a page: the shell takes up the full screen height (`h-svh`)
and doesn't scroll itself — only the work area scrolls, while the
sidebar, the icon rail, and the `sidebarFooter` slot stay in place.
Before, the whole page used to scroll and the navigation would drift
upward with long content.

The `sidebarFooter` prop sets a slot at the bottom of the sidebar, the
icon rail on a narrow screen, and the burger panel — shared by the theme
toggle (`theme-toggle`), the sidebar toggle (`sidebar-toggle`), a user
menu, or a build version; it works even with the header turned off. It's
the same slot in all three places: the same content is drawn in a 240px
sidebar, in a rail the width of a single button, and in the expanded
burger panel — large or multi-line content won't fit there without a
separate layout for the narrow width.

The shell itself dictates the layout of the slot's content, not whatever
is placed inside it: buttons go into `sidebarFooter` without their own
wrapper container — the shell arranges them in a row in the wide sidebar
and in the burger panel, and stacks them in the narrow icon rail. A
wrapper of your own on top breaks this: the consumer's horizontal
container won't fit into the narrow icon rail's width.

`admin-shell`'s header can be removed entirely with the `header={false}`
prop — then it's the sidebar on the left, the work area right after it,
and on a narrow screen the menu button moves to the top of the icon rail.
Navigation links default to plain `<a href>`, and the `renderLink` prop
swaps their rendering for the consumer's router (`next/link`,
react-router, and others) — the same way in the sidebar, the icon rail,
and the burger panel.

The controlled `collapsed` prop (`false` by default) collapses the
sidebar on a wide screen down to the same icon rail already shown on a
narrow one: the consumer holds the state, the shell doesn't store it. In
the collapsed view a burger menu also appears next to the icons, opening
a panel with section names — the same behavior as on a narrow screen,
where the sidebar is always collapsed. `sidebar-toggle` provides the
collapse button — built the same way as `theme-toggle`, it goes into the
same `sidebarFooter` slot and is visible only on a wide screen, hidden
right inside the item itself on a narrow one. The `sidebarVariant` prop
switches the look of the sidebar and the icon rail: `flush` — pinned to
the screen edge and separated by a line; `card` (default) — a separate
panel with margin from the edges, rounded corners, a background, and a
border like the widgets have; in this variant the work area also gets
margin from the edges.

**Contract for the `sidebarFooter` and `renderLink` slots: the content is
drawn as several independent instances at once, rather than moving
between the icon rail, the sidebar, and the burger panel.** The icon rail
and the wide sidebar are always mounted in the tree, and switching
between them is pure CSS (`md:hidden` / `hidden md:flex`); the burger
panel remounts on every open. That means two instances of the slot live
in the DOM at the same time at any screen width, and three while the
panel is open. A component with no state of its own — like `theme-toggle`
and `sidebar-toggle`, which get their state and handler as props —
renders identically in every instance and never notices the difference.
A component with its own state falls apart: a user menu that stores its
own open/closed state opens only in the instance that was clicked, while
the rest stay closed; a counter that fetches its own data via an effect
makes an independent request in every instance. The content of
`sidebarFooter` and whatever `renderLink` renders must either have no
state of its own or be controlled from outside — with state and
callbacks arriving as props from the shell or the parent, the way
`theme-toggle` does.

## Localization

Every hardcoded string in the kit — a fallback title, an `aria-label`, a
select's placeholder text — is also a prop, defaulting to the English
wording it replaced. Most of these props are grouped under a single
`labels` object rather than spread across the item's flat prop list:
`widget-table`'s `labels` (`emptyTitle`, `rowsPerPage`,
`noSorting`, `sorting`, `previousPage`, `nextPage`, `range`, `selectRow`,
`selectAllOnPage`, `selected`, `clearSelection`),
`sidebar-toggle`'s `labels` (`expand`, `collapse`), `theme-toggle`'s
`labels` (`toLight`, `toDark`), and `admin-shell`'s `labels` (`openMenu`,
`sections`). A handful of items already had a dedicated prop for their one
string before this convention existed — `widget-list` and `widget-chart`
take `emptyTitle` directly, `state-loading` takes `label`, `color-field`
takes `placeholder` and `hexInputLabel` — and stayed flat rather than being
wrapped in a single-key object. `date-field` and `date-time-field` also
gained `locale` (a `date-fns` `Locale`, `enUS` by default) and
`displayFormat`, so the calendar and the formatted date can move off
English without a wrapper. The form fields carry the same convention:
`select-field`'s `placeholder` defaults to "Select…", `page-form`'s
`submitLabel` and `cancelLabel` default to "Save" and "Cancel", and the
field-level `label`, `hint` and `error` texts are always the consumer's
own strings. Every one of these props is optional: an item installed
with no `labels` and no locale renders exactly as before.

`locale-ru` is a Russian dictionary for the whole set: a single
`localeRu` const, sliced into the exact shape each prop above expects, so
a slice passes straight in — `<WidgetTable labels={localeRu.widgetTable} />`,
`<DateField locale={localeRu.dateField.locale} displayFormat={localeRu.dateField.displayFormat} />`.
It bundles `date-fns`'s `ru` locale for the two date fields. It's a static
object, not a runtime i18n system: it doesn't watch a locale setting or
re-render anything itself, it just holds the words. Install it like any
other item:

```bash
pnpm dlx shadcn@latest add berezin-pavel/admin-kit/locale-ru
```

`language-toggle` is a locale-switch button for the moving part
`locale-ru` doesn't cover — actually changing the locale at runtime. Built
the same way as `theme-toggle`: `locale`, `locales`, and `onLocaleChange`
arrive as props, and the consumer decides where the current locale is
held and persisted. A click cycles to the next locale in the `locales`
list, wrapping back to the first; the button shows the current locale's
short label. Its place is the shell's `sidebarFooter` slot next to
`theme-toggle`, and — like every `sidebarFooter` candidate — it carries no
state of its own, so it renders identically in every instance of the slot.

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
