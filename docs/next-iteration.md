# Deferred to the next iteration

A list of what the final review before `v0.1.0` found, but that's deliberately not being fixed in this release. Each item: what's wrong, which scenario it hits the consumer with, and which direction to fix it in.

## Shell and navigation

- **No mobile navigation.** At narrow widths, `AdminNav` in `admin-shell.tsx` hides behind the `hidden md:block` class, and there's no replacement — no burger, no slide-out panel. Open the admin panel from a phone and the only way to switch sections is typing in the address bar by hand. Fix: add an open state and a panel for narrow widths, hide the panel itself rather than replacing it with nothing.

- **Navigation on bare `<a href>`.** `AdminNav` in `admin-nav.tsx` renders items as plain links. In a Next or react-router admin panel, clicking an item reloads the whole document: client state and open sockets are lost, and there's no prefetching. There's no workaround — the item's rendering is baked into the component. Fix: an optional prop of the form `renderItem?: (item: AdminNavItem, isActive: boolean) => ReactNode` that keeps `AdminNav` independent of the consumer's router.

## Table widget

- **`Row extends Record<string, ReactNode>` rejects the whole row.** `WidgetTableProps` in `widget-table.tsx` requires every field of a row to be `ReactNode`. A row with a `Date` field or a function doesn't typecheck, even if no one meant to show that field in the table at all. Fix: a column-level `render?: (row: Row) => ReactNode` instead of constraining the type of the whole row.

- **No default state for empty data.** `WidgetTable`, when the `empty` prop isn't passed and there are zero rows, draws the column header with nothing underneath it. Fix: fall back to `StateEmpty` by default when `empty` isn't passed.

## Metric widget

- **Trend direction is hard-wired to color.** In `widget-metric.tsx`, `trend.direction === "down"` is always red, `up` is always green. For metrics where a decrease is an improvement (bounces, response time, errors), the dashboard raises an alarm exactly when everything's fine. The showcase (`showcase/widget-metric.tsx`) has exactly this wrong example sitting in it: "Bounces 27 −4%" is shown in red, even though a drop in bounces is good news. Fix: set the color through a separate prop (e.g. `tone: "positive" | "negative"`) or explicit sign semantics, rather than coinciding with the arrow's direction.

## API consistency

- **Inconsistent prop naming across items.** `AdminShellProps` names the actions callback `actions`, `StateEmptyProps` calls it `action`; `AdminShell` accepts the navigation list as `nav`, while `AdminNav` takes the same list as `items`. On top of that, `AdminHeader` and `AdminNav` have their props set as an anonymous inline type right in the function signature, while the other five items have an exported `*Props`. Fix: settle on one name per role and add `AdminHeaderProps`/`AdminNavProps` following the other items' example.

## Showcase

- **`view.render()` gets called as a function instead of rendered as a component.** `components/showcase-gallery.tsx` does `{view.render()}` instead of `<view.render />`. It works for now because the views are stateless, but the moment a view gets a `useState`, the hook will end up inside `ShowcaseGallery`'s own body — and hook order will drift whenever the number of views changes between renders. Fix: type `ShowcaseView.render` as `ComponentType`, call it as `<view.render />`.

- **The view container doesn't cap height.** In `components/showcase-gallery.tsx`, the view wrapper (`<div className="rounded-lg border border-border p-6">`) has no height limit — the full-screen `admin-shell` (with its `min-h-svh`) stretches the whole gallery to screen height. Fix: cap the container's height (`max-h-*` with scrolling), at least for shell views.

## Documentation

- **README and ADR 0002 disagree about Radix.** The README asks the consumer for only "shadcn and Tailwind v4," while `docs/adr/0002-base-ui-instead-of-radix.md` states that a project on Radix with the new-york style "won't just accept" admin-kit's items. No actual breakage was found in this release: `registry/` has no Radix `data-*` selectors and no Base UI imports, the items are style-neutral. The gap between the two documents needs to be closed explicitly — either a note in the README about Base UI as the theme's dependency, or narrowing the ADR's wording down to the specific risk (two primitive sets conflicting in one project) instead of a blanket ban.
