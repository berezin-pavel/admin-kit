# Deferred to the next iteration

The naming inconsistency this table had tracked since the first review is closed: in `state-empty` the `action` prop was renamed to `actions`, so the actions slot is now named the same way across every item in the kit. The pages from `docs/brief.md` — a list with filters and an entity card — are also done: `page-list` and `page-entity` are in the registry. What follows is what got closed by a decision rather than by code, and what's still unresolved after this iteration.

## Closed by decision, not by code

- **`admin-shell` compatibility with Radix projects.** This point is dropped: the kit deliberately stays on Base UI, see [ADR 0002](adr/0002-base-ui-instead-of-radix.md). No need to revisit it — the condition for doing so is spelled out in the ADR itself.

## sidebarFooter: the cause was removed

The shell used to draw navigation in three places, and the narrow icon rail and the full sidebar were **two nodes mounted in parallel** — only CSS switched between them. That's where the standing slot duplication came from, rather than it being a one-off.

Now it's a single node: the collapsed view comes from styling the same tree, and `admin-rail.tsx` was removed. The burger panel remains a second instance, but it's modal and remounts on every open.

The requirement on the slot's content has become an ordinary one for the kit as a result — **controlled from outside** — rather than the special caveat of "no state of its own." No need to revisit the topic.

## Hydration mismatch in the `pagination` primitive — not ours

`components/ui/pagination.tsx`, which shadcn generates, produces a mismatch between server and client: `PaginationLink` sets `data-slot="pagination-link"`, and the `Button` nested inside it overwrites it with `data-slot="button"` — React reports the mismatch during hydration.

This doesn't affect us: `page-list` builds pagination directly from `Button` and doesn't use `PaginationLink`. The mismatch is only visible on the `/primitives` page, where the primitive is shown exactly as shadcn ships it.

It can't be fixed on our end: the consumer gets their own copy of the primitive from shadcn, our fix would never reach it, and our version would just drift from theirs. This is a question for shadcn, not for the kit.

## The kit has never been installed into a real admin panel

The v0.1.0 acceptance ran on two clean Vite projects created specifically for verification — one with its own theme, one with someone else's. Since then the registry has grown to nineteen items, but it has never gone into a real consumer project that lives its own life and keeps changing — only into disposable verification projects thrown away right after checking. Questions that only show up on a real consumer — how a repeated `add -o` behaves on an item file the consumer has already edited for themselves; how the registry feels as the catalog grows to the size a real admin panel needs; whether versions of items installed at different times end up diverging from one another — remain unanswered for now.

## `PageStatus` is declared twice — and that stays as is

`registry/page-list/page-list.tsx` and `registry/page-entity/page-entity.tsx` independently declare the same type: `PageStatus = "ready" | "loading" | "error" | "forbidden" | "offline"`. Instinct says to pull it out into a shared spot, but for a registry that copies files, that would be a mistake.

Items must be installable one at a time. A consumer who only needs the entity card has no reason to also get the list page — and a shared type would mean either one page depending on the other, or a third registry item made up of five string literals. Duplicating five literals costs less than either of those.

The risk of drift here is real, though: if the set of states grows, both files will need fixing. Hence the rule going forward — **the set of states only ever changes together in both pages** — and that's checked on review, not by types.
