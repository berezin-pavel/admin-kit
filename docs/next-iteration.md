# Deferred to the next iteration

The naming inconsistency this table had tracked since the first review is closed: in `state-empty` the `action` prop was renamed to `actions`, so the actions slot is now named the same way across every item in the kit. What follows is what got closed by a decision rather than by code, and what's still missing to spec out the next iteration.

## Closed by decision, not by code

- **`admin-shell` compatibility with Radix projects.** This point is dropped: the kit deliberately stays on Base UI, see [ADR 0002](adr/0002-base-ui-instead-of-radix.md). No need to revisit it — the condition for doing so is spelled out in the ADR itself.

## sidebarFooter: one item renders as two instances at once

`admin-shell` passes `sidebarFooter` into both places at once — `AdminRail` (the narrow icon rail) and the full sidebar (`registry/admin-shell/admin-shell.tsx`). Switching between them is pure CSS (`md:hidden` / `hidden md:flex`), and both nodes are always in the DOM. That means the slot's content mounts as two independent instances at the same time, rather than moving between the two.

For `theme-toggle` this isn't a problem: it's fully controlled from outside and has no state of its own. But `sidebarFooter`'s description in `registry.json` explicitly names a "user menu" too — and an item like that will almost certainly have its own open/closed state or a portal with a unique id. Only the instance that got clicked at the current screen width will end up open or focused, the other will stay in its initial state — and that will read as a bug, not as two separate things.

Not resolved: either explicitly restrict `sidebarFooter` in the README and `registry.json` to content that's fully controlled from outside (like `theme-toggle`), or change how the shell is built so the slot doesn't get duplicated between the rail and the sidebar. Work this out before an item with its own state shows up in the registry wanting this slot.

## Pages: a list with filters and an entity card

`docs/brief.md` names two pages for the next iteration but doesn't set a contract for them — without one, each implementation will turn into guesswork on the spot. Work this out before writing code, not while writing it.

- **The data contract isn't settled.** `widget-table` already sets the pattern for tabular data — `columns` with `cell`, `rows`, `getRowKey` (see `registry/widget-table/widget-table.tsx`) — but the entity card needs a different shape: not table rows, but a list of one record's fields, each with its own display type. Left unfixed ahead of time, the list and the card will each reinvent the data shape and drift from the pattern the widgets already settled on.

- **The filter setup isn't settled.** It isn't defined what condition types a filter is made of — text search, a single-value select, a date range — or who holds its state: the page itself as a controlled component (`value`/`onChange`, like the kit's other items) or the consumer on top of a `filters` prop. The answer decides whether the filter becomes its own reusable registry item or stays part of `page-list` as a whole.

- **Pagination isn't settled.** It isn't defined whether it's page-based or cursor-based, or whose job it is to count `totalCount`: the kit's widgets don't fetch their own data (see "Decisions made" in `CLAUDE.md`), so the page will get pagination handed to it ready-made through a prop too — but the shape of that prop (`page`/`pageSize`/`total` versus `cursor`/`hasMore`) hasn't been chosen.

- **Picking a failure state for the page isn't settled.** With this iteration the registry has five states instead of two, but `widget-table`, `widget-chart`, and `widget-list` only show `state-empty` themselves — they don't know about `state-loading`, `state-error`, `state-forbidden`, or `state-offline`; the calling code decides that on its own. For a dashboard widget that was a detail; for a page built around one request for the whole list or card, it's already an architectural question: does the page map the response code to a state itself (a `status`-shaped prop), or does a consumer wrapper outside the page do it.
