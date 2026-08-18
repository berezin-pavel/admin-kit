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

### Letting the panel's owner change the look

The theme above is a build-time artifact: it lands in your CSS file and
only changes when you edit it. What the panel's administrator changes at
runtime is its **appearance**: an accent colour, a gradient for the
sidebar and the sign-in screen, a backdrop for every page and a gradient
(and heading treatment) for every block. All of it is picked from fixed
palettes — twenty gradients and twenty accents shipped by
`admin-appearance` — because every entry has passed the kit's contrast
tests, along the whole gradient and on hovered controls; there is no
colour input anywhere.

The appearance is one serializable value. Store it wherever you store
the rest of your settings, hand it to the provider and the stylesheet in
your layout, and put the menu in the shell's footer:

```tsx
<AppearanceStyle value={appearance} />
<AppearanceProvider value={appearance} onChange={save} editable={isAdmin}>
  <AdminShell
    sidebarGradient={appearance.sidebar ?? undefined}
    backdrop={resolvePageBackdrop(appearance, pageId)}
    sidebarFooter={<AppearanceMenu value={appearance} onChange={save} pages={pages} />}
  >
    …
  </AdminShell>
</AppearanceProvider>
```

Rendering the style on the server means the colours arrive in the first
HTML, so there is no flash of the installed palette. Every card in the
work area is a `Block` with an id — widgets, page sections and page
headers already are, through their `blockId` prop — and while
`editable` is on, hovering a block reveals a corner button with the
swatch grid, so a new block gets its colour by a click, not by a code
change. `admin-theme` stays installed either way: it is what the panel
falls back to before a stored appearance is read, and what every item's
tokens are named after.

An appearance read back from storage is untrusted: validate it with
`isAdminAppearance` and fall back to `defaultAdminAppearance` when it
fails. Two rules keep the result legible: never nest an opaque card
inside a block that has a gradient (it would inherit the gradient's
white text on its own white surface), and put nothing in the work area
outside a block — a page backdrop paints only the image and does not
recolour text.

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
| `admin-theme`        | `registry:theme`     | Colors and radii for the admin panel, for the light and dark schemes, including the `sidebar-active` pair that paints the current nav row and tab. Installed first — the other items rely on its tokens                                                                                                                                                                                                                                            |
| `admin-shell`        | `registry:block`     | A persistent full-height frame for the admin panel: an optional header, side navigation (on a wide screen a sidebar, or an icon rail with `collapsed`; on a narrow one no sidebar at all — a compact top bar with the burger, the logo, the app name and the account, and the panel behind the burger holds the sections), a `logo` slot before the app name, a `sidebarProfile` row under it for the account, a `sidebarActions` slot next to the app name, a `sidebarFooter` slot at the bottom, and a work area with its own scrolling. Every sidebar row shares one grid, so the logo, the avatar and the nav icons keep the same centre expanded or collapsed. Installed once per project |
| `admin-appearance`   | `registry:component` | The administrator's look from fixed palettes: twenty three-stop gradients and twenty accents, each measured for contrast along the gradient and on hovered controls. `AdminAppearance` is one value — accent, sidebar and sign-in gradients, page backdrops, per-block gradient and heading — that you store; `AppearanceStyle` emits the stylesheet that paints any `data-gradient` element and redefines its tokens, `AppearanceProvider` hands the value to blocks, `Block` is the card of the work area with a corner button in edit mode |
| `appearance-menu`    | `registry:component` | The footer control that edits the appearance: accent swatches, one select each for the sidebar, the sign-in screen and the default page backdrop with its soft-tint checkbox, and a row per page that inherits or overrides. Nothing is typed in; names of gradients and accents are props, so `locale-ru` localizes them |
| `theme-toggle`       | `registry:component` | A theme-switch button that doesn't store the theme itself: the `isDark` state and the `onToggle` handler arrive as props. Fits the shell's `sidebarFooter` slot or anywhere else on the page                                                                                                                                                                          |
| `sidebar-toggle`     | `registry:component` | A button that collapses the shell's sidebar into the icon rail, built the same way as `theme-toggle`: `collapsed` and `onToggle` arrive as props. Visible only on a wide screen — a narrow one has no sidebar to collapse. Its place is the `sidebarFooter` slot next to the theme toggle                                             |
| `language-toggle`    | `registry:component` | A locale-switch button built the same way as `theme-toggle`: `locale`, `locales`, and `onLocaleChange` arrive as props. Shows the current locale's short label, cycling to the next one in the list on click. Its place is the `sidebarFooter` slot next to the theme toggle                                                                                        |
| `user-menu`          | `registry:component` | An avatar icon button that opens a dropdown with the user's name, email, and a list of `items` (icon, label, and a `danger` tone for actions like sign-out). Without `avatarUrl` the trigger shows bare initials in the toggles' lettering. `variant="row"` fills the shell's `sidebarProfile` row — avatar, name, email and a chevron in one trigger, which is where identity belongs in a sidebar; `variant="icon"` (the default) suits `sidebarActions`, the header's `actions` slot or `sidebarFooter` |
| `locale-ru`          | `registry:component` | A Russian dictionary: one `localeRu` const sliced into the exact shapes the other items' `labels`/`locale` props expect, so a slice passes straight into a prop. Bundles `date-fns`'s `ru` locale for the date fields                                                                                                                                                 |
| `widget-metric`      | `registry:component` | A single-number card for a dashboard: a title, a value, optional trend (an arrow with its own separate color), and a caption; `trendValues`, given two or more points, adds a small sparkline under the caption                                                                                                                                                      |
| `widget-table`       | `registry:component` | A self-contained table card: the heading is optional, the header has a `toolbar` slot for filters, and the footer has a record count, pagination, and a page-size picker. A column with `sortable` gets a sort button and `aria-sort`; row order and slicing are set by the data owner, the table only reports the choice via `onSortChange` and `onPageChange`. Passing both `selectedKeys` and `onSelectionChange` adds a checkbox column — the header checkbox selects or clears the current page only — and swaps the header's left side for a selection bar with an N-selected count and `selectionActions`. `filtered` swaps the empty state for a filtered-results one with a clear-filters button; `hiddenColumnIds` plus a columns menu hide columns, except those marked `alwaysVisible` and those with no title; `stickyHeader` keeps the header in view while the body scrolls inside its own area, sized by `maxBodyHeight`; `totalCount` and `onSelectAllMatching` let the selection bar offer to extend a full-page selection to every matching record; export is a `selectionAction` the consumer wires up, with the exported `toCsv` helper for the usual case |
| `widget-chart`       | `registry:component` | A chart card: a shared `labels` axis and a `series` list each with its own `values`; the `kind` prop switches between a line and bars; series colors cycle through the `chart-1`…`chart-5` tokens, and a legend appears once there are two or more series; the header has a `toolbar` slot for a period picker; without `labels` or `series` it shows `state-empty`                                                       |
| `widget-list`        | `registry:component` | A list of rows: a name, an optional explanation, optional content on the right, and an icon; without rows and its own `empty`, it shows `state-empty`                                                                                                                                                                                                                  |
| `widget-activity`    | `registry:component` | A recent-activity feed card: entries grouped by calendar day, with the group header reading "Today"/"Yesterday" relative to the real current date and a `dayFormat` date otherwise; entries keep their given order inside a group. Without entries it shows `state-empty`                                                                                            |
| `widget-donut`       | `registry:component` | A donut-chart card: labeled slices drawn as a ring plus a legend list (color dot, label, `valueFormat(value, share)` right-aligned — a rounded percentage by default). Colors cycle through the `chart-1`…`chart-5` tokens; with no slices, or a zero total, it shows `state-empty`                                                                                  |
| `widget-quick-actions` | `registry:component` | A grid of shortcut buttons — `id`, `label`, an optional icon, `onSelect` — with `columns` switching between two (default) and three. No actions is a consumer mistake, not a data state, so it doesn't fall back to `state-empty`                                                                                                                                    |
| `widget-placeholder` | `registry:component` | A dashed-border placeholder in the work area where a widget hasn't been chosen yet — not about missing data, that's what `state-empty` is for                                                                                                                                                                                                                          |
| `state-loading`      | `registry:component` | A skeleton in place of content while data is loading                                                                                                                                                                                                                                                                                                                    |
| `state-empty`        | `registry:component` | A screen in place of content when there's no data: a title, an explanation, an actions slot; no icon — empty data is normal                                                                                                                                                                                                                                            |
| `state-error`        | `registry:component` | A screen for a load or request failure: a title, an explanation, an actions slot, a red error icon by default                                                                                                                                                                                                                                                          |
| `state-forbidden`    | `registry:component` | A forbidden screen: a title, an explanation, an actions slot, a muted lock icon — missing permissions is a denial, not a breakage                                                                                                                                                                                                                                       |
| `state-offline`      | `registry:component` | A connection-lost screen: a title, an explanation, an actions slot, a red network-outage icon by default                                                                                                                                                                                                                                                                |
| `page-entity`        | `registry:component` | A single-record page: a heading with actions and fields grouped into sections, with the field value being `ReactNode` rather than a string. A section's `columns` (1, 2 or 3) sets how densely its fields sit. The `status` prop swaps the fields for a loading, error, forbidden, or offline state, while the heading stays visible                                                                                                     |
| `page-header`        | `registry:component` | A page header as a block: a title, an explanation, an actions slot on the right and a breadcrumbs slot above — the first card of every page, not a dashboard widget                                                                                                                                                                                                                                                |
| `breadcrumbs`        | `registry:component` | A trail of section links above a page's heading: every entry but the last renders as a link when it has an `href` (through `renderLink`, or a plain `<a>` otherwise), and the last entry is always the current page, never a link. Server-compatible — no client state                                                                                              |
| `status-badge`       | `registry:component` | A record-status badge with tone `neutral`, `success`, `warning`, `danger`; the `success` and `warning` tones depend on admin-kit's theme tokens                                                                                                                                                                                                                        |
| `hint`               | `registry:component` | A tooltip hint next to a field label, column header, or metric: without `children` a question-mark icon, with `children` a wrapper around your own element; opens on hover and from the keyboard                                                                                                                                                                      |
| `date-field`         | `registry:component` | A date-picker field: a calendar in a popover, with the value a `YYYY-MM-DD` string with no `Date` object or time zone, so it doesn't drift by a day on serialization                                                                                                                                                                                                    |
| `date-time-field`    | `registry:component` | A date-and-time field: the value is a `YYYY-MM-DDTHH:mm` string; changing the date keeps the time, changing the time keeps the date, and the popover doesn't close on date selection                                                                                                                                                                                   |
| `date-range-field`   | `registry:component` | A range-picker field: the value is a `YYYY-MM-DD..YYYY-MM-DD` string; the popover has a preset column (Today, Yesterday, This week, This month, This year, Last week, Last month, Last year by default) next to a two-month range calendar. Presets take an explicit `today` argument so their ranges are deterministic. `page-list` wires it in as its `date-range` filter kind |
| `time-field`         | `registry:component` | A time field on a native `input type=time`: value `HH:mm`, `step` in minutes (5 by default), `min` and `max` bound the selection                                                                                                                                                                                                                                        |
| `color-field`        | `registry:component` | A color-picker field for a label, category, or kanban column: the value is HEX `#rrggbb`, with a `presets` palette in the popover, a native picker, and manual HEX entry                                                                                                                                                                                                |
| `text-field`         | `registry:component` | A single-line text input; the `type` prop switches between text, email, password, url and tel. Like every field: label, hint and an `error` that replaces the hint and sets `aria-invalid`                                                                                                                                                                              |
| `number-field`       | `registry:component` | A numeric input whose value is deliberately a string passed through unparsed — mid-typing states like `1.` can't live in a number; the consumer parses on submit. `min`/`max`/`step` forward to the native input                                                                                                                                                        |
| `textarea-field`     | `registry:component` | A multi-line text input with a `rows` prop, sharing the field anatomy: label, hint, error                                                                                                                                                                                                                                                                              |
| `combobox-field`    | `registry:component` | A single-choice select with type-ahead search over `options`: the input shows the selected label when closed and the query while typing, matching a case-insensitive substring anywhere in the label. Reach for it instead of `select-field` once the list outgrows a dropdown — picking a customer or a product out of hundreds. Options carrying a `group` render under group headings; clearing always reports `onChange("")`
| `select-field`       | `registry:component` | A single-choice select over `options` value/label pairs; an empty value shows the placeholder, and the popup is pinned to the trigger like the kit's other selects                                                                                                                                                                                                     |
| `checkbox-field`     | `registry:component` | A boolean checkbox with its label to the right and hint/error below the pair; controlled via `checked`/`onChange`                                                                                                                                                                                                                                                      |
| `file-field`         | `registry:component` | A file picker with the field anatomy — label, hint, error — but a deliberate exception to the string-value convention: `value` is `File \| null`, since a `File` can't round-trip through a string the way the others do. Drag-and-drop onto the zone or the native picker set the file; the name and size (`formatFileSize`) or `noFileLabel` show next to it        |
| `image-field`        | `registry:component` | A gallery of a record's images: thumbnails in a row with the drop zone stretching to the end of it, reordering by drag (plus move buttons, since drag never reaches a keyboard), a preview dialog that steps through the whole set and links to the original, and removal that applies at once. It uploads nothing itself — `onSelect` hands over the picked `File`s and the stored result comes back through `value` as `{id, url, name}`; an item with `progress`/`speed` draws an upload bar and one with `error` shows what the server said; `multiple={false}` and `maxItems` narrow the set
| `multi-select-field` | `registry:component` | Several choices out of a fixed `options` list, shown as removable chips inside the input — the closed-set counterpart to `tags-field`. Selected options stay listed so they can be unselected, Backspace on an empty input drops the last chip, and `maxItems` disables the rest rather than hiding it, so it is visible why nothing happens
| `tags-field`         | `registry:component` | A multi-value tag input: `value` is a string array, `onChange` replaces it wholesale. Enter or a comma commits the trimmed input as a new tag, Backspace on an empty input drops the last one, and each tag is a `Badge` with its own remove button. `suggestions` filters to matches in a popup as you type                                                          |
| `page-auth`          | `registry:component` | A sign-in screen outside the shell: a centered card on an empty page, `appName` above the title, the fields as children (the item ships none of its own). A real form whose `onSubmit` gets the raw event; `submitting` disables the button and every field through a wrapping fieldset, `error` announces a failed sign-in through `role="alert"`, and `aside` adds the second panel of a split layout from `lg` up
| `page-tabs`          | `registry:component` | Section navigation inside one page — Overview, History, Settings on a record screen. A tab is drawn like a sidebar nav item, not as a segmented control. Controlled through `value`/`onValueChange`, so the active tab can live in the URL and a tab can navigate instead of switching panels; only the active panel mounts, so a heavy table on a hidden tab never renders. `actions` sits beside the strip, which scrolls horizontally when the labels do not fit
| `page-form`          | `registry:component` | A create/edit record page: a heading, sections of consumer-laid-out fields inside a real `form`, and a footer with Cancel and Save. A section's `columns` (2 or 3) turns it into a responsive grid where each field is one cell, and a field asks for the full width with `col-span`. `submitting` disables the buttons and sets `aria-busy`; the `status` prop swaps sections for a state screen while the heading stays                                                                                                 |
| `confirm-dialog`     | `registry:component` | A controlled confirmation modal: `open` and `onOpenChange` are held by the consumer, `tone="danger"` colors the confirm button, `loading` disables the buttons and blocks closing while the operation is in progress                                                                                                                                                   |
| `form-dialog`        | `registry:component` | A modal with a real form for quick edits: fields as children, Cancel/Save in the footer, `submitting` disables the buttons and blocks closing while in progress. Controlled `open`/`onOpenChange`; for a full page use `page-form`                                                                                                                                       |
| `admin-toaster`      | `registry:component` | Toasts about an operation's outcome: `AdminToaster` is placed once, and they're shown by calling `notify.info`, `notify.success`, `notify.warning`, `notify.danger` from anywhere, including code outside React                                                                                                                                                        |
| `widget-progress`    | `registry:component` | A dashboard progress-bar card: the share as a percentage of `max` (100 by default), an out-of-range value doesn't break the layout; an optional `target` draws a tick mark on the bar and a right-aligned `targetLabel` caption                                                                                                                                       |
| `page-list`          | `registry:component` | A list page: a section heading outside and a `widget-table` card below it — filters in its header, pagination and a page-size picker in the footer. Every value is controlled, and pagination isn't rendered without `total`. A filter is `search`, `select`, or `date-range` (rendered via `date-range-field`). The `status` prop swaps the card's body for a state, while the heading and filters stay available. `selectedKeys`, `onSelectionChange`, and `selectionActions` forward straight through to `widget-table`, the same way sorting and pagination do                                     |

`widget-table`, `widget-chart`, `widget-list`, `widget-activity`, and
`widget-donut` — the widgets with data — show `state-empty` themselves
when there's no data: no rows, no series, no list items, no entries, or
slices that total zero, and the `empty`/`labels.emptyTitle` prop wasn't
passed. There's no need to wrap them in a state from outside.
`widget-quick-actions` is the one exception among the dashboard widgets:
no actions is a consumer mistake, not a data state, so it renders the
titled card with an empty grid instead of falling back to `state-empty`.
In `widget-chart` the length of each series' `values` should match the
length of `labels` — this isn't checked by types; on a mismatch, the
missing points simply aren't drawn.

`widget-chart` and `widget-donut` pull in `recharts`, the kit's one heavy
dependency — measured on a clean Vite project, it adds 354 KB to the
bundle (227 KB without it, 581 KB with, uncompressed). `widget-metric`
pulls in the same package too: `trendValues` is optional, but the
`recharts` import is static, so installing `widget-metric` carries the
same weight even for a consumer that never passes the prop. The rest of
the kit is lighter — most items pull in only `lucide-react` for icons or
`date-fns` for locale-aware date parsing (`widget-activity` among them),
and a good number don't pull in a single npm package. If a dashboard
needs a chart-based widget and not right away, it's worth loading it
dynamically.

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

Navigation lives in exactly one place per width. On a wide screen that is
the sidebar; below `md` the sidebar is gone entirely and the burger panel
is the navigation, so a phone gives the work area its full width instead
of a strip of unlabelled icons duplicating a panel. The brand and the
account are not repeated inside that panel — they sit on the narrow top
bar: the burger, the logo and the app name on the left, `sidebarActions`
and `sidebarProfile` on the right. With the header on, the same pair
reaches a narrow screen through the header's `narrowActions` slot.

Every row of the sidebar shares one grid, shipped as `admin-row.ts`: the
logo, the account avatar and the nav icons all sit in the same 24px box,
whose centre is 28px from the sidebar's edge whether the sidebar is
expanded or collapsed, and every label starts at 48px. That is what keeps
the icons from shifting sideways when the sidebar collapses.

The `sidebarFooter` prop sets a slot at the bottom of the sidebar, the
icon rail, and the burger panel — shared by the theme toggle
(`theme-toggle`), the sidebar toggle (`sidebar-toggle`), the user menu
(`user-menu`), or a build version; it works even with the header turned
off. It's the same slot in all three places: the same content is drawn in
a 240px sidebar, in a rail the width of a single button, and in the
expanded burger panel — large or multi-line content won't fit there
without a separate layout for the narrow width.

The shell itself dictates the layout of the slot's content, not whatever
is placed inside it: buttons go into `sidebarFooter` without their own
wrapper container — the shell arranges them in a row in the wide sidebar
and in the burger panel, and stacks them in the icon rail. A wrapper of
your own on top breaks this: the consumer's horizontal container won't
fit into the rail's width.

`admin-shell`'s header can be removed entirely with the `header={false}`
prop — then it's the sidebar on the left, the work area right after it,
and on a narrow screen the compact top bar carries the burger, the logo,
the app name and the account. Navigation links default to plain
`<a href>`, and the `renderLink` prop swaps their rendering for the
consumer's router (`next/link`, react-router, and others) — the same way
in the sidebar, the icon rail, and the burger panel.

The controlled `collapsed` prop (`false` by default) collapses the
sidebar on a wide screen down to an icon rail: the consumer holds the
state, the shell doesn't store it. No burger joins the rail — the control
that expands it again is already on screen, in the footer. `sidebar-toggle`
provides that button — built the same way as `theme-toggle`, it goes into
the same `sidebarFooter` slot and is visible only on a wide screen. The
sidebar and the icon rail are drawn as a card — a separate panel with
margin from the edges, rounded corners, a background, and a border like
the widgets have — and the work area gets the same margin from the edges.

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
A component with its own persistent state falls apart: a widget that
fetches its own data via an effect makes an independent request in every
instance, and a counter that stores its count in `useState` drifts out of
sync between instances the moment one of them updates. The content of
`sidebarFooter` and whatever `renderLink` renders must either have no
persistent state of its own or be controlled from outside — with state
and callbacks arriving as props from the shell or the parent, the way
`theme-toggle` does. A popup's own open/closed state is the one exception:
it's transient UI state scoped to whichever instance is actually visible
and clicked, the same way a native `<select>` doesn't need its open state
lifted either — `user-menu`'s dropdown works this way, and rendering two
mounted-but-hidden copies of it is no different from two mounted-but-hidden
`<select>` elements.

## Loading a dashboard card at a time

Pages take `status`, but on a dashboard each card usually fetches its own
data and they arrive at different moments. Every widget therefore takes
`loading`: it swaps the card's body for skeleton shapes of the same
height while the title and the header stay put, so the layout does not
jump when the data lands. `loading` wins over the empty state — a widget
that is still fetching never claims there is nothing to show — and while
it is on, nothing inside is operable: no sort buttons, no pagination, no
action buttons under a skeleton.

## Localization

Every hardcoded string in the kit — a fallback title, an `aria-label`, a
select's placeholder text — is also a prop, defaulting to the English
wording it replaced. Most of these props are grouped under a single
`labels` object rather than spread across the item's flat prop list:
`widget-table`'s `labels` (`emptyTitle`, `rowsPerPage`,
`noSorting`, `sorting`, `previousPage`, `nextPage`, `range`, `selectRow`,
`selectAllOnPage`, `selected`, `clearSelection`),
`sidebar-toggle`'s `labels` (`expand`, `collapse`), `theme-toggle`'s
`labels` (`toLight`, `toDark`), `admin-shell`'s `labels` (`openMenu`,
`sections`), `image-field`'s `labels` (`dropzone`, `dropzoneHint`,
`preview`, `openInNewTab`, `remove`, `moveEarlier`, `moveLater`,
`uploading`, `imageName`, `previous`, `next`, `counter`), and
`widget-activity`'s `labels` (`today`, `yesterday`, `emptyTitle`). `user-menu` and `breadcrumbs` each carry a single string as a
flat `label` prop rather than a `labels` object — the `aria-label` on the
avatar trigger and on the `nav`, defaulting to "Open user menu" and
"Breadcrumb". A handful of items already had a dedicated prop for their one
string before this convention existed — `widget-list`, `widget-chart`, and
`widget-donut` take `emptyTitle` directly, `state-loading` takes `label`,
`color-field` takes `placeholder` and `hexInputLabel`, `widget-progress`
takes `targetLabel`, `file-field` takes `buttonLabel`/`noFileLabel`/
`clearLabel`, and `tags-field` takes `placeholder` and a function prop
`removeLabel(tag)` — and stayed flat rather than being wrapped in a
single-key object. `date-field`, `date-time-field`, `date-range-field`, and
`widget-activity` also take `locale` (a `date-fns` `Locale`, `enUS` by
default) and a format string (`displayFormat` on the date fields,
`dayFormat`/`timeFormat` on `widget-activity`), so the calendar and the
formatted dates can move off English without a wrapper; `date-range-field`
additionally takes `presets`, an array the consumer can swap wholesale to
relabel or recompute the preset column. The form fields carry the same
convention: `select-field`'s `placeholder` defaults to "Select…",
`page-form`'s `submitLabel` and `cancelLabel` default to "Save" and
"Cancel", and the field-level `label`, `hint` and `error` texts are always
the consumer's own strings. Every one of these props is optional: an item
installed with no `labels` and no locale renders exactly as before.

`locale-ru` is a Russian dictionary for the whole set: a single
`localeRu` const, sliced into the exact shape each prop above expects, so
a slice passes straight in — `<WidgetTable labels={localeRu.widgetTable} />`,
`<DateField locale={localeRu.dateField.locale} displayFormat={localeRu.dateField.displayFormat} />`.
It bundles `date-fns`'s `ru` locale for the three date fields and
`widget-activity`, and
`localeRu.dateRangeField.presets` reuses `date-range-field`'s own default
presets — same ids, same range math — mapped over to swap in Russian
labels, so the two can't drift apart. It's a static
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

Whether an update is worth taking is answered by
[CHANGELOG.md](CHANGELOG.md): for every release it lists the new items, the
installed items that changed, and the prop or file changes that break on
overwrite.

## Rule

Registry items aren't edited in your own project: the next `add -o` will
wipe out the edits without warning. If you need behavior that isn't there
out of the box, wrap the item in your own component or copy its file
under a different name.
