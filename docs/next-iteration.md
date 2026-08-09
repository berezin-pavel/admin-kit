# Deferred to the next iteration

The naming inconsistency this table had tracked since the first review is closed: in `state-empty` the `action` prop was renamed to `actions`, so the actions slot is now named the same way across every item in the kit. What follows is what got closed by a decision rather than by code, and what's still missing to spec out the next iteration.

## Closed by decision, not by code

- **`admin-shell` compatibility with Radix projects.** This point is dropped: the kit deliberately stays on Base UI, see [ADR 0002](adr/0002-base-ui-instead-of-radix.md). No need to revisit it — the condition for doing so is spelled out in the ADR itself.

## Pages: a list with filters and an entity card

`docs/brief.md` names two pages for the next iteration but doesn't set a contract for them — without one, each implementation will turn into guesswork on the spot. Work this out before writing code, not while writing it.

- **The data contract isn't settled.** `widget-table` already sets the pattern for tabular data — `columns` with `cell`, `rows`, `getRowKey` (see `registry/widget-table/widget-table.tsx`) — but the entity card needs a different shape: not table rows, but a list of one record's fields, each with its own display type. Left unfixed ahead of time, the list and the card will each reinvent the data shape and drift from the pattern the widgets already settled on.

- **The filter setup isn't settled.** It isn't defined what condition types a filter is made of — text search, a single-value select, a date range — or who holds its state: the page itself as a controlled component (`value`/`onChange`, like the kit's other items) or the consumer on top of a `filters` prop. The answer decides whether the filter becomes its own reusable registry item or stays part of `page-list` as a whole.

- **Pagination isn't settled.** It isn't defined whether it's page-based or cursor-based, or whose job it is to count `totalCount`: the kit's widgets don't fetch their own data (see "Decisions made" in `CLAUDE.md`), so the page will get pagination handed to it ready-made through a prop too — but the shape of that prop (`page`/`pageSize`/`total` versus `cursor`/`hasMore`) hasn't been chosen.

- **Picking a failure state for the page isn't settled.** With this iteration the registry has five states instead of two, but `widget-table`, `widget-chart`, and `widget-list` only show `state-empty` themselves — they don't know about `state-loading`, `state-error`, `state-forbidden`, or `state-offline`; the calling code decides that on its own. For a dashboard widget that was a detail; for a page built around one request for the whole list or card, it's already an architectural question: does the page map the response code to a state itself (a `status`-shaped prop), or does a consumer wrapper outside the page do it.
