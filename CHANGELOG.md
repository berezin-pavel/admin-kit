# Changelog

This kit is delivered by copying files: `shadcn add` writes an item into your project and from
then on it is your file. Nothing updates itself, so every update is a decision you make. This
file exists to let you make it — for each release it says which items are new, which installed
items changed, and what breaks if you pull them.

**Install an item, pinned to a release:**

```bash
pnpm dlx shadcn@latest add berezin-pavel/admin-kit/widget-table#v0.24.0
```

**See what an update would change before taking it:**

```bash
pnpm dlx shadcn@latest add berezin-pavel/admin-kit/widget-table --diff
```

Without `-o` the CLI asks before touching a file you already have and leaves it alone unless you
say yes; `-o` overwrites deliberately. Items you have edited in place are yours — see the
"Boundaries" section of the README before overwriting them.

Sections used below: **New** (items you can now install), **Changed** (installed items worth
re-pulling), **Breaking** (props or files that changed shape — read before overwriting), and
**Project** (showcase, CI, docs — nothing that reaches your project).

## 0.25.0 — 2026-08-14

**Changed** — `widget-table` gained four capabilities, all forwarded by `page-list`:

- `filtered` + `onClearFilters` split "nothing matches this filter" from "there is nothing here
  yet" — different words, and a clear-filters button instead of a dead end.
- `hiddenColumnIds` + `onHiddenColumnIdsChange` hide columns and add a columns menu to the header;
  a column marked `alwaysVisible` cannot be hidden, so rows stay identifiable.
- `stickyHeader` (with `maxBodyHeight`, `24rem` by default) keeps the header row in view while the
  body scrolls; the scroll area is focusable and labelled, so the keyboard can reach it.
- `onExport` hands the current rows to a callback and the exported `toCsv` helper turns columns
  and rows into an RFC 4180 string. The table never builds a file itself — whether to export this
  page or the whole server-side result is the data owner's call.

`widget-table` gained `dropdown-menu` as a registry dependency and a second file
(`widget-table-columns-menu.tsx`), so a repeated `add` pulls both in.

**Fixed (accessibility)** — an axe sweep over every showcase preview found four defects, now
fixed: `combobox-field`'s icon-only trigger and clear button had no accessible name (they now take
`openLabel` and `clearLabel`), `widget-progress` announced an anonymous progress bar (it now takes
its name from `title`), `widget-placeholder`'s hint sat at 2.71:1, and `file-field`'s disabled
state was dimmed without being marked `aria-disabled`.

**Changed** — `locale-ru` gained the Russian strings for the table's new labels and for
`combobox-field`, `multi-select-field` and `page-auth`.

## 0.24.0 — 2026-08-14

**New** — `combobox-field` (single select with type-ahead search, for picking one record out of
hundreds where `select-field`'s dropdown stops scaling), `multi-select-field` (several values from
a fixed list, shown as removable chips, with `maxItems` disabling the rest rather than hiding it),
`page-auth` (the sign-in screen, outside the shell, shipping no fields of its own), `page-tabs`
(section navigation inside one page; only the active panel mounts).

**Changed** — all eight widgets — `widget-metric`, `widget-chart`, `widget-table`, `widget-list`,
`widget-progress`, `widget-activity`, `widget-donut`, `widget-quick-actions` — take `loading`. It
replaces the card body with skeletons of the same height while the title stays put, wins over the
empty state, and renders nothing operable. Each gained `skeleton` as a registry dependency, so a
repeated `add` pulls that primitive in. Nothing changes for a widget rendered without the prop.

**Project** — the test suite grew from 143 to 229 and now renders components in jsdom instead of
only exercising pure functions; browser checks moved into `e2e/` (`pnpm test:e2e`) rather than
being rewritten per session.

## 0.23.0 — 2026-08-13

**Changed** — `widget-progress` gained `tone` (`default` / `success` / `warning` / `danger`),
which recolors the bar so a target can read as on track or behind; `widget-table` widened the
padding on the selection column, which used to run into the first column.

**Project** — demo products now span short, medium and long names, so overflow shows up in the
showcase instead of in your project.

## 0.22.0 — 2026-08-13

**New** — `form-dialog`: a modal holding a real `<form>` for quick edits, with Cancel/Save in the
footer. `submitting` disables both buttons and blocks closing by Escape or an outside click while
the save runs. For a full create/edit screen `page-form` is still the right item.

**Changed** — `locale-ru` gained the matching dictionary slice.

## 0.21.1 — 2026-08-13

**Changed** — `select-field`, `widget-table` and `page-list`: select popups now size to their
content (`w-auto min-w-(--anchor-width)`) instead of being clipped to the trigger's width, so long
options are readable and no longer run under the checkmark.

## 0.21.0 — 2026-08-13

**Changed** — `admin-shell` gained the `sidebarActions` slot: content placed next to the app name
at the top of the sidebar, mirrored into the collapsed rail and the burger panel. It is where the
account menu belongs when the shell has no header. `widget-quick-actions` and `widget-table`
truncate overflowing labels with an ellipsis instead of wrapping.

**Project** — the demo overview became blocks-only, with a goals row at the top.

## 0.20.0 — 2026-08-13

**Breaking** — `admin-shell` lost `sidebarVariant`. The sidebar has one look now — the card — and
passing the prop is a type error. If you were on `flush`, the shell's outer padding changes.

**Changed** — `widget-donut` draws a full ring (recharts 3.8 needs explicit 90..450 angles;
without them the chart rendered as a half arc). `widget-metric` shows the exact point value on
sparkline hover via `trendTooltipFormat`. `widget-chart` gained a header `toolbar` slot for a
period picker or a series switch.

## 0.19.0 — 2026-08-13

**New** — `widget-activity` (an event feed with relative timestamps), `widget-donut` (a share
breakdown), `widget-quick-actions` (a card of primary actions), `file-field` (the kit's one
deliberate exception to string values: `File | null`), `tags-field` (free-form tags with
suggestions).

**Changed** — `date-range-field` gained one-gesture drag selection over the calendar alongside the
two-click flow. `user-menu` gained `side` and `align`, and its avatar-less fallback became flat
initials instead of a circle. `widget-metric` and `widget-progress` picked up minor display props.

## 0.18.0 — 2026-08-13

**New** — `date-range-field`: value is `"YYYY-MM-DD..YYYY-MM-DD"`, with presets (today, this week,
this month, last 30 days and so on) and strict parsing that refuses an impossible date rather than
rolling it over.

**Changed** — `page-list` gained a third filter kind, `date-range`, whose value passes through
untouched and reports the same way the other kinds do.

## 0.17.0 — 2026-08-12

**Project** — the showcase now shows only the kit's own items; the shadcn primitives reference
section is gone. Its drift-watchdog role moved into a test that checks `components/ui` against
`registryDependencies`. Nothing changed for consumers.

## 0.16.0 — 2026-08-12

**New** — `user-menu` (an avatar dropdown built for the sidebar footer) and `breadcrumbs`
(server-safe, no client boundary needed).

## 0.15.0 — 2026-08-12

**Changed** — `widget-table` gained controlled row selection: `selectedKeys`, `onSelectionChange`
and `selectionActions` render a checkbox column, a page-scoped select-all with an indeterminate
state, and a selection bar that replaces the header while rows are selected. `page-list` forwards
all three unchanged.

## 0.14.0 — 2026-08-12

**New** — `text-field`, `number-field`, `textarea-field`, `select-field`, `checkbox-field` and
`page-form` (sections, a real form element, Cancel/Save, `submitting` and `status`).

**Breaking** — the four existing fields (`date-field`, `date-time-field`, `time-field`,
`color-field`) were retrofitted onto the shared label/hint/error anatomy: they now render their
own `Label` when given `label`, wire `aria-invalid` and `aria-describedby`, and show `error` in
place of `hint`. If you wrapped them in your own label markup, you will get two labels.

Date parsing also became strict: `2026-02-30` now yields `undefined` instead of silently rolling
over to March 2.

## 0.13.0 — 2026-08-12

**New** — `locale-ru` (a Russian dictionary whose slices match the items' label props exactly,
carrying the date-fns `ru` locale), `language-toggle` (a controlled locale cycler),
`row-actions` (a per-row dropdown).

**Breaking** — every user-facing string became a prop with an English default. `widget-table`
takes a `labels` object, threaded through its subcomponents and forwarded by `page-list` as
`tableLabels`; the rest of the items take flat props. Nothing breaks by default, but any string
you were seeing come out of an item is now yours to pass.

**Project** — CI on GitHub Actions: install, typecheck, lint, tests, registry build, production
build, and a check that Cyrillic stays inside the locale dictionaries.

## 0.12.0 — 2026-08-11

**Breaking** — `page-list` shed `page-list-pagination.tsx`; that file moved into `widget-table`.
A project that installed `page-list` before this release keeps an orphaned file after an update.
`widget-table`'s `title` became optional.

**Changed** — the table became self-contained: filters live in its card header (the `toolbar`
slot), the record count, pagination and page-size picker in its footer. Sorting arrived —
`sortable` on a column renders a header button with `aria-sort`, cycling none → asc → desc → none.
Sorting and pagination are controlled: the item reports the choice and does not reorder or slice
the rows itself, so a server-paged list cannot end up sorting only the current page.

Mobile: smaller paddings in the shell and work area, action blocks wrap instead of being pushed
off screen, list meta moved below the row title.

## 0.11.0 — 2026-08-10

**Changed** — `admin-toaster`'s `info` tone went back to the primitive's neutral look; only
`success`, `warning` and `danger` are filled. The `danger` badge in `status-badge` fills the same
way the other tones do.

**Breaking (theme)** — `admin-theme` muted `--destructive` and added `--destructive-foreground`.
The theme ships as `cssVars`, so the CLI merges the new token into your stylesheet on a repeated
`add admin-theme`; without that step filled danger surfaces take their text color from
inheritance.

## 0.10.0 — 2026-08-10

**New** — `date-field` (`YYYY-MM-DD`), `date-time-field` (`YYYY-MM-DDTHH:mm`), `time-field`
(`HH:mm`) and `color-field` (`#rrggbb`). Values are strings, not `Date`, so they survive
serialization and never drift by a day across time zones.

**Breaking (theme)** — `success` and `warning` got white text and darker backgrounds to pass WCAG
AA, and the dark scheme was aligned with the light one. Existing badges and toasts change color.

## 0.9.0 — 2026-08-10

**New** — `hint` (a tooltip beside a label, column header or metric), `confirm-dialog` (a
controlled confirmation modal; `loading` blocks closing while the operation runs), `admin-toaster`
(placed once, then `notify.info/success/warning/danger` from anywhere, including outside React).

**Changed** — `page-entity`'s field label became `ReactNode` instead of `string`, so a hint can
sit next to it. Backward compatible.

## 0.8.0 — 2026-08-10

**Breaking** — `admin-shell`'s `sidebarVariant` default flipped from `flush` to `card`. Pass
`sidebarVariant="flush"` to keep the old look.

**Changed** — navigation items are pinned to the left edge again, and a collapsed sidebar on a
wide screen shows a burger at the top of the rail.

## 0.7.0 — 2026-08-10

**Changed** — `widget-chart` takes multiple series and draws a legend once there is more than one;
the chart palette became multicolored. `admin-shell` merged its icon rail and full sidebar into a
single element, so the `sidebarFooter` slot is no longer mounted twice.

## 0.6.0 — 2026-08-10

**New** — the kit's first pages: `page-list` (header, filter row, table, pagination — everything
controlled) and `page-entity` (a record's fields grouped into sections). Both pick their body from
`status` (`ready` / `loading` / `error` / `forbidden` / `offline`), keeping the heading — and, for
the list, the filters — visible under every status. Also `page-header`, `status-badge` and
`widget-progress`.

**Breaking (theme)** — `admin-theme` added `success`, `success-foreground`, `warning` and
`warning-foreground` on top of shadcn's standard set. Without them `status-badge` renders
correctly in only two of its four tones.

**Changed** — `admin-shell` now dictates the `sidebarFooter` layout itself rather than leaving it
to whatever container you put in the slot.

## 0.5.0 — 2026-08-09

**New** — `sidebar-toggle`, a controlled collapse button.

**Changed** — `admin-shell` gained `collapsed` (the sidebar shrinks to an icon rail on a wide
screen; you hold the state, the shell stays server-side) and `sidebarVariant`.

## 0.4.0 — 2026-08-09

**New** — `theme-toggle`, a controlled theme switch: `isDark` and `onToggle` are props, nothing is
stored inside.

**Changed** — `admin-shell` became a full application layout: full-screen height, only the work
area scrolls, and a `sidebarFooter` slot that works even without a header. `widget-chart` traded
`aspect-video` for a fixed `h-56`, which on a wide card used to eat half the screen.

## 0.3.0 — 2026-08-09

**New** — `widget-chart`, `widget-list`, `widget-placeholder`, `state-error`, `state-forbidden`,
`state-offline`.

**Breaking** — `state-empty`'s `action` prop became `actions`, so the slot is named the same way
across every item in the kit.

## 0.2.0 — 2026-08-09

**Breaking** — `admin-shell`'s `title` became `appName`, and `actions` is now only accepted
alongside a header (enforced by a discriminated union, so passing it without one is a type error).

**Changed** — navigation takes links and icons, narrow screens get an icon rail and a burger
panel, `widget-table` columns can render their own cell, and `widget-metric` separates the delta's
color from the arrow's direction.

## 0.1.0 — 2026-08-09

First release: `admin-theme`, `admin-shell`, `widget-metric`, `widget-table`, `state-loading`,
`state-empty`.
