# Changelog

This kit is delivered by copying files: `shadcn add` writes an item into your project and from
then on it is your file. Nothing updates itself, so every update is a decision you make. This
file exists to let you make it — for each release it says which items are new, which installed
items changed, and what breaks if you pull them.

**Install an item, pinned to a release:**

```bash
pnpm dlx shadcn@latest add berezin-pavel/admin-kit/widget-table#v0.29.0
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

## Unreleased

**Changed** — `admin-shell` takes a `variant` prop (`card` | `flush`, default `card`, and the
card look is unchanged). `flush` drops the shell's padding: the sidebar reaches the top, the
bottom and the left edge of the screen and is separated by a border instead of rounded corners
and a ring. With the header on, `flush` also lifts it out of the work column into a fixed
full-width bar whose left cell carries the brand above the sidebar and lines up with it — the
sidebar then starts with the account row. The work area stays the only thing that scrolls, and
narrow screens keep the burger panel they had. `admin-header` gained a `leading` slot rendered
before the section title (that is where the brand cell goes) and a `data-slot="admin-header"`
marker.

**Project** — the showcase gained two `admin-shell` views (`flush` and `flush-header`), and the
demo a layout toggle in the sidebar footer that cycles card → flush → flush with header and
remembers the choice in localStorage.

## 0.29.0 — 2026-08-19

**Changed** — the palette is 86 multi-stop (4–5 stops) gradients in eight families instead of
twenty three-stop ones. Every gradient's shipped stops are fitted from its design intent to keep
4.5:1 text and hover contrast (hue preserved, lightness moved only where legibility demands it, at
most 0.55), and the soft backdrops sweep hue and lightness across the stops rather than tinting a
single color. The hover check now covers the secondary button's hovered fill too — the exported
`hoverOverlayAlphas` (8 %, 16 %, 20.2 %) is the list both the fitter and the tests use. The block menu and the appearance menu now group gradient choices by family — a
captioned swatch grid in the block popover, a `SelectGroup`/`SelectLabel` per family in every
gradient select.

**Breaking** — `GradientStops` is `{ angle, stops }`; anyone reading the earlier
`from`/`via`/`to` shape needs to switch to `stops`.

**Project** — `locale-ru` names all 86 gradients and the eight families; `/palette` groups the
gradient section by family; `/palette2`, the scratch page used to pick the 86 candidates, is gone
now that its job is done.

## 0.28.0 — 2026-08-18

**Breaking** — the hand-driven theme editor is gone. `theme-editor` and `admin-theme-tokens` are
removed; the six-source derivation, `adminThemeToCss`, `suggestDarkStops` and hand-made gradients
with them. If you installed either, delete the files — nothing else in the kit imports them — and
move whatever theme value you stored to an `AdminAppearance` (below). The reason is in
`docs/adr/0004-appearance-from-fixed-palettes.md`: every hand-picked gradient needed a round of
contrast fixes found by eye, because no automated check sees text over `background-image`.

**Breaking** — nothing in the work area sits outside a card any more. `page-header` renders a card
(with a new `breadcrumbs` slot above the title); `page-list`, `page-entity` and `page-form` render
their heading through it, so the three headings now share `page-header`'s typography;
`page-form`'s Cancel/Save row is its own card at the bottom; `page-tabs`' strip and `actions` sit
in a card. If your layout relied on a bare heading above the first card, expect one more card.

**Breaking** — `gradient` on the seven widgets, the four states, `page-auth` and `sidebarGradient`
on `admin-shell` now take a palette id (`GradientId`: ember, sunset, peach, amber, copper, rose,
berry, grape, lavender, dusk, midnight, ocean, sky, lagoon, mint, meadow, forest, sand, slate,
graphite) instead of any string, and paint through `data-gradient` attributes and the stylesheet
`admin-appearance` emits — the thirteen inline `gradientSurfaceStyle` helpers are gone. Render
`<AppearanceStyle value={…} />` in your layout or no gradient paints. `widget-quick-actions` no
longer forces `bg-transparent` on its buttons and the shell's footer controls no longer need a
`bg-transparent` class on a gradient sidebar: the stylesheet redefines `--background`, `--muted`,
`--border`, `--ring` and the sidebar tokens on every gradient surface, so outline buttons, hover
tints, borders and focus rings stay visible.

**New** — `admin-appearance`: twenty three-stop gradients (each with a light and a dark variant and
a derived soft tint for page backdrops) and twenty accent colours, all measured in tests — text
against 33 points along the gradient, text on hovered controls (8 % and 16 % overlays), every
filled accent pair both through 8-bit hex and in continuous precision. `AdminAppearance` is one
value: `accent`, `sidebar`, `signIn`, `page` (a gradient id or null; backdrops are always the soft
tint), `pages` per page id, `blocks` per block id (`{ gradient, heading }`); `isAdminAppearance`
validates what you read back, `defaultAdminAppearance` is the shipped look, `resolvePageBackdrop`
picks a page's backdrop. `AppearanceProvider` (`value`/`onChange`/`editable`) hands it to `Block`,
the card of the work area: it resolves its gradient by id, and in edit mode shows a corner button
with the swatch grid and — on widgets — the heading choice (regular — 13.5 px semibold, large — 1.15 rem, or hidden). Every
widget, `widget-table`, `page-header`, page sections, the form's actions, the tab strip and
`page-auth`'s card take a `blockId`.

**New** — `appearance-menu`, the fourth footer control: accent swatches, one select each for the
sidebar, the sign-in screen and the default page backdrop, and a row per page. `admin-shell` gained
`backdrop={gradientId}` for the page backdrop; the burger panel now receives the sidebar gradient
(it never did). `locale-ru` gained `adminAppearance` and `appearanceMenu` slices with Russian names
for all forty palette entries.

**Changed** — a popup opened from a control on a gradient surface (a select, a dropdown, a popover,
a combobox) is painted with that surface's gradient through a `body:has(...)` rule, so the user
menu opened from a green sidebar stays green; the seven widgets' default title became the block's
"regular" heading (13.5 px, semibold, full-strength foreground) and section titles in
`page-entity`, `page-form` and `widget-table` follow it; `page-tabs` draws its tabs exactly like
the sidebar's nav rows (same height, icon box, hover tint) with no shadow; `page-list` spaces its
blocks like the overview (`gap-4`); `widget-table`'s sticky header and footer paint nothing on a
gradient block and the body is clipped at the footer line; chart tooltips sit on a frosted card
tint instead of a see-through box.

**Added** — `AppearanceThemeColor` in `admin-appearance`: two `theme-color` metas (light and dark)
taken from the backdrop's soft tint, so browsers that tint their chrome from the page — Safari's
toolbar, mobile status bars — follow the chosen backdrop; the stylesheet also clears the body's
background while a backdrop is on, so the document canvas shows the same gradient on overscroll.

**Project** — the showcase has a `/palette` page with every gradient and accent on live controls;
the demo stores one appearance in localStorage, edits it through the menu and the corner buttons,
and is painted by default; `e2e/gradient-contrast.spec.ts` now finds surfaces by attribute and
hovers every control on them in both schemes; the dev server heap is capped at 2 GB and vitest at
three workers.

## 0.27.0 — 2026-08-17

**New** — `admin-theme-tokens`, the theme as data rather than hand-written CSS. Six source values
(five `#rrggbb` colours and a corner radius) go into `deriveAdminTheme`, which computes every
token `admin-theme` declares for both schemes in OKLCH, and `adminThemeToCss` prints the result as
custom properties you render in a `<style>` element. Foreground colours are never chosen, they are
searched by contrast, and the surface itself is nudged when the text alone cannot clear 4.5:1 — so
no combination of sources produces unreadable text. The dark scheme is derived, never stored.
Gradients are a separate class of token, named by you and emitted as `--gradient-<id>` with a
matching `--gradient-<id>-foreground` taken from the gradient's worst stop, because a gradient
cannot live in a colour token that also feeds text, borders and `oklch()` algebra. Pure
TypeScript, no React, no dependencies.

**New** — `theme-editor`, a controlled form over that theme: the six sources and a palette of
named gradients, each carrying a light and a dark variant. The dark one is proposed on demand and
then stays editable, because recomputing it whenever the light variant changes would discard a
hand-tuned gradient. A gradient's id is derived from its name once, at add time, and never again,
so renaming a label cannot orphan the cards already pointing at it. Contrast is reported beside
each gradient and warns below 4.5:1 without blocking anything — refusing an owner their own brand
colour reads as a broken panel. With `showCss` the same element prints the CSS for your
`globals.css`, which is how it doubles as a generator for a developer; without it, it is an
appearance screen for whoever owns the panel.

**Changed** — thirteen items take an optional gradient. `widget-metric`, `widget-chart`,
`widget-list`, `widget-progress`, `widget-donut`, `widget-activity` and `widget-quick-actions`
take `gradient`; `admin-shell` takes `sidebarGradient`; `page-auth`, `state-empty`, `state-error`,
`state-forbidden` and `state-offline` take `gradient`. The value names a gradient from your theme
and is applied as an inline style rather than a Tailwind class, because a class name assembled at
runtime never reaches the bundle. Omit the prop and every one of these renders exactly as before.

**Changed** — the active navigation row and the active tab are now coloured rather than neutral
grey, so the current page is obvious at a glance. `admin-theme` gained a `sidebar-active` pair for
it: a tint of the brand behind a darker shade of the brand, since the brand colour over a tint of
itself never clears 4.5:1 at any tint strength. `admin-nav` and `page-tabs` share the pair, and a
test now keeps them from drifting apart. If you have overridden `sidebar-accent` to colour the
active row yourself, that override no longer reaches it — move it to `sidebar-active`.

**New** — `gradientPresets`, a small library of gradients that are known to work. Five named sets
spread across the hue circle, each with a light and a dark variant, each proved by test to clear
4.5:1 against its own computed foreground under two independent measurements — the hex-quantised
one the kit performs internally and the full-precision one a browser actually does. The worst of
them measures 5.68 and the best 8.73, so no preset sits near the threshold where the two methods
could disagree. The theme editor offers them as a row of swatches; picking one appends it to your
palette with a fresh id, and rolling your own by hand still works exactly as before.

**Changed** — the sidebar's navigation reads at a larger type scale: rows are 40px, labels 15px
at medium weight, and the active row is semibold in the tinted `sidebar-active` pair. Icons grew
to match. The row grid that keeps every sidebar item on one vertical line is unchanged.

**Changed** — a gradient on the shell's sidebar now recolours the active row instead of leaving
it as a pale tint from the light theme. The active row becomes a translucent overlay of the
gradient's own foreground, so it still reads as the current page without importing a palette that
does not belong on a painted surface, and the footer's toggles become outline controls on a
transparent surface rather than solid white squares.

**Fixed** — `admin-theme` shipped `sidebar-primary` at 3.47:1, below AA. The derivation had
already been corrected to darken that surface and keep white text, but the shipped token values
were never brought in line with it; they are now. Dark `sidebar-active` was nudged from 0.270 to
0.265 lightness for the same reason: it measured 4.5121 through the kit's own hex-based check and
4.4877 at the precision a browser uses, which is a pass and a fail of the same pair. Both now
clear the bar under either measurement, and a test asserts every derived pair does the same, so a
future edit cannot land in that gap again.

**Changed** — seven widget cards take a second heading treatment. `heading="large"` renders
the title large and in full-strength foreground instead of the small muted default, and `summary`
fills the opposite end of the header with muted content — a total, a period, a count. Both are
optional and default to today's look, so nothing changes unless you ask for it. `widget-table` is
deliberately not among them: its header's opposite end already carries pagination and its left
side swaps for a selection bar.

**Changed** — `locale-ru` gained a `themeEditor` slice matching `ThemeEditorLabels` exactly.

**Changed** — `page-tabs` now requires `admin-theme`, because its active tab uses the new
`sidebar-active` pair. The CLI pulls the theme in for you; an existing install that only ever had
`tabs` should re-pull the item so the dependency is recorded.

**Breaking** — every item now installs into `components/` rather than `components/admin/`. With a
subdirectory in the target the CLI wrote a file to one path and rewrote its imports to another, so
any item importing a sibling item resolved to a path that did not exist. Flattening the layout
makes both sides agree. A project that already has admin-kit files will end up holding them in two
places after pulling an update: the new copies under `components/` are the live ones, and the old
`components/admin/` directory can be deleted once nothing of your own imports from it.

**Project** — a showcase section for the editor with its CSS output on, a `/demo/appearance` page
that repaints the demo for real and persists across reloads, 42 end-to-end checks, and 371 unit
tests. Two CSS-injection holes were found and closed during the round: a gradient's `viaPosition`
and the theme's `radius` both reached the emitted CSS text without validation, and either could
close its declaration and open a sibling one. Both are now gated where the ids and colours already
were. Nothing here reaches your project, but the two fixes are the reason to prefer `0.27.0` over
building `admin-theme-tokens` yourself from an earlier tag.

## 0.26.0 — 2026-08-16

**Breaking** — `admin-shell` gives a narrow screen no sidebar at all. Below `md` the icon rail is
gone and the burger panel holds the navigation and `sidebarFooter`; the brand and the account are
not repeated inside it but stay on a compact top bar — burger, logo and app name on the left,
`sidebarActions` and `sidebarProfile` on the right — and the work area keeps the full width. With
`header` on, that same pair rides along in the header through its new `narrowActions` slot, shown
below `md` only. A wide screen is unchanged apart from one control: the collapsed rail no longer
shows a burger, because the sidebar toggle that expands it is already in the footer.
`admin-menu.tsx` lost `showOnDesktop`, `logo`, `actions` and `profile` (its title is now an
`sr-only` name for the panel), and `admin-nav.tsx` lost `responsive` — with the rail confined to
wide screens, `collapsed` is the only thing that decides the nav's shape.

**New** — `image-field`, a gallery field for a record's images. Thumbnails sit in a row and the
drop zone stretches to the end of it; a file can be dropped anywhere on the field or picked through
the native input; a thumbnail is dragged onto another to reorder, previewed full size in a dialog
that steps through the whole set (arrow keys included) and links to the original from its header,
or removed on the spot with a trash button — the field has no Apply button, because a form's Save
is the only one that should exist. It uploads nothing itself: `onSelect` hands the picked `File`
objects to the consumer and the stored result comes back through `value` as `{id, url, name}`, so
the same field works over S3, a REST endpoint or an object URL. An item carrying `progress` and
`speed` draws an upload bar over its thumbnail and one carrying `error` shows what the server said
— the field renders upload state without ever owning it, and `formatUploadSpeed` turns bytes per
second into that string. `moveImageFieldItem` and `limitImageFieldFiles` are exported and tested.
Reordering also works from a keyboard through move-earlier/move-later buttons, since HTML5 drag
never reaches one. `locale-ru` gained the matching slice.

**New** — `page-entity` and `page-form` sections take `columns` (1, 2 or 3). An entity section
already stacked two columns; it now goes up to three, and a form section that gets `columns`
becomes a responsive grid where every field is one cell instead of one tall stack. A field that
needs the full width says so itself (`className="sm:col-span-2 lg:col-span-3"`), which is also how
a checkbox lines up with the inputs beside it (`pt-7`). Both pages also tightened their vertical
rhythm: 1rem between cards instead of 1.5rem, and 0.75rem between an entity's rows.

**Changed** — `page-tabs` looks like the sidebar's navigation rather than a segmented control: the
grey track behind the strip is gone, a tab is a 36px row with the same padding, hover and active
fill as a nav item, and the strip sits at the height of the buttons beside it. The kit uses that
one shape for "pick a section" everywhere, and the segmented look was the only place it did not.

**Changed** — every row of the sidebar now sits on one grid, shipped as `admin-row.ts`: the logo,
the account avatar and the nav icons share a 24px box whose centre is 28px from the sidebar's
edge, expanded or collapsed, and every label starts at 48px. Before, the three rows carried three
different paddings, so the logo, the avatar and the icons each stood on their own vertical line
and shifted again when the sidebar collapsed. The account row also lost its extra top inset, which
had left it floating away from the brand row above it.

**Breaking** — `user-menu` no longer exports `getUserMenuInitials`, and the avatar falls back to a
person icon instead of initials. An avatar is a picture the app uploads; initials were standing in
for one, and a glyph reads as a placeholder while two letters read as data. `variant="row"` now
names its trigger with `aria-labelledby` pointing at the name and the email rather than leaning on
its visible text: in the collapsed rail that text is hidden, and with the initials gone the button
would have had no accessible name at all. A referenced element still counts when hidden, so the
button announces the same person at either width.

**Changed** — navigation items and breadcrumb links take `cursor-default`. The kit reads as an
application rather than a document, and a link in the chrome is a control like any other — the
hand cursor was the browser's default for `<a>`, not a choice the kit had made.

**Breaking** — `widget-table` renders no export button of its own: export becomes one of the
consumer's `selectionActions` (`onExport` and `toCsv` stay exported for it), so the `exportLabel`
label is gone and `selectAllMatchingLabel` joins the set. The columns control stays a dropdown
behind a columns icon — a dialog was tried and dropped, because one list of checkboxes does not
need a modal — but a column with an empty title no longer appears in it: an actions column has no
name to show and no business being hidden. `stickyHeader` always owns its scroll area now, sized
by `maxBodyHeight` (24rem by default) — sticking to a page-level scroller cannot be made correct
once that scroller has padding, because a row keeps showing above the stuck header in the padding
strip.

**New** — `totalCount` plus `onSelectAllMatching` let the selection bar offer "Select all N" once
the whole page is selected and more records match; the table never computes that selection
itself. `page-list` forwards both, and gained `onResetFilters`/`resetFiltersLabel`, an icon
button at the end of the filter bar shown only while a filter holds a value. `admin-shell` gained
a `logo` slot on the brand row and a `sidebarProfile` row beneath it, and `user-menu` gained
`variant="row"` to fill it — identity belongs at the top of a sidebar, not at the bottom, which
is where it went unnoticed.

**Changed** — selection actions and the settings control render as icon buttons with tooltips,
matching the row actions; `theme-toggle`, `sidebar-toggle` and `language-toggle` gained tooltips
too (they had accessible names but nothing visible on hover), which adds `hint` to their
dependencies. `select-field` and `date-range-field` take `width` (`"auto"` by default, `"full"`
to pin to the container), so a filter bar sizes to its content and stops wrapping onto a second
row while a form field still fills its column.

**Fixed** — `user-menu` draws the same fixed-size avatar in both variants instead of bare initials
when `avatarUrl` is missing, and its trigger carries `data-slot="user-menu"`. The initials used to
sit off-centre in the icon rail: the row trigger stayed left-aligned there because `admin-shell`
restyled it through `data-slot="button"`, which the dropdown primitive overwrites with
`data-slot="dropdown-menu-trigger"` — a selector that had silently matched nothing.

**Fixed** — `file-field`'s container is positioned, so its visually hidden native input can no
longer stretch the page into a second scrollbar on a long form. A select filter's unset state
must be an empty value: Base UI marks a select as showing a placeholder whenever its value is
empty, so a catch-all sentinel like `"all"` rendered as selected-but-greyed and kept the reset
button on screen forever. `widget-activity` lays its entries out in one left column — time, icon,
title, meta — instead of pushing the time to the far edge, and its day heading follows
`dayFormat`, which a non-English locale needs: Russian puts the day before the month, and the
English `"MMMM d"` reversed the two.

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
