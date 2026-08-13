# Deferred to the next iteration

## The showcase "Primitives" section is gone — closed harder than planned

The original decision said: once the kit ships its own form fields, primitives
with kit-level counterparts lose their interactive demos. After the forms
iteration the owner tightened it: the showcase shows only the kit's own parts,
so the whole reference section was removed along with its demo components and
`lib/registry-primitives.ts`. Primitives remain what they always were for
consumers — bare-name `registryDependencies` installed by the CLI in the
consumer's own style, never shipped from this repository. The side effect worth
remembering: the section doubled as a drift watchdog (it warned when a
`components/ui/` primitive had no dependent registry item); that check is gone
with it.

The naming inconsistency this table had tracked since the first review is closed: in `state-empty` the `action` prop was renamed to `actions`, so the actions slot is now named the same way across every item in the kit. The pages from `docs/brief.md` — a list with filters and an entity card — are also done: `page-list` and `page-entity` are in the registry. What follows is what got closed by a decision rather than by code, and what's still unresolved after this iteration.

## Closed by decision, not by code

- **`admin-shell` compatibility with Radix projects.** This point is dropped: the kit deliberately stays on Base UI, see [ADR 0002](adr/0002-base-ui-instead-of-radix.md). No need to revisit it — the condition for doing so is spelled out in the ADR itself.

## sidebarFooter: the cause was removed

The shell used to draw navigation in three places, and the narrow icon rail and the full sidebar were **two nodes mounted in parallel** — only CSS switched between them. That's where the standing slot duplication came from, rather than it being a one-off.

Now it's a single node: the collapsed view comes from styling the same tree, and `admin-rail.tsx` was removed. The burger panel remains a second instance, but it's modal and remounts on every open.

The requirement on the slot's content has become an ordinary one for the kit as a result — **controlled from outside** — rather than the special caveat of "no state of its own." No need to revisit the topic.

## Remount churn and a dangling focus ref in the `calendar` primitive — not ours

`components/ui/calendar.tsx`, as shadcn ships it, defines `Root`, `Chevron` and `DayButton` as
inline arrows inside the `components` object passed to DayPicker — their identity changes every
render, so React remounts the whole calendar subtree whenever anything above it re-renders.
Separately, `CalendarDayButton` creates a focus ref it never attaches, so arrow-key navigation
moves DayPicker's internal focus while DOM focus stays put (affects `date-field` and
`date-time-field` keyboarding). Same reasoning as the pagination mismatch above: the consumer
gets their own copy of the primitive from shadcn, so we don't fork ours. `date-range-field`
sidesteps the remount locally by passing its own referentially stable `Root` and `DayButton` —
it needed that for its hover preview.

## Hydration mismatch in the `pagination` primitive — not ours

`components/ui/pagination.tsx`, which shadcn generates, produces a mismatch between server and client: `PaginationLink` sets `data-slot="pagination-link"`, and the `Button` nested inside it overwrites it with `data-slot="button"` — React reports the mismatch during hydration.

This doesn't affect us: `page-list` builds pagination directly from `Button` and doesn't use `PaginationLink`. It used to be visible in the showcase's "Primitives" section; with that section removed, it no longer surfaces anywhere in this repository.

It can't be fixed on our end: the consumer gets their own copy of the primitive from shadcn, our fix would never reach it, and our version would just drift from theirs. This is a question for shadcn, not for the kit.

## The kit has never been installed into a real admin panel

The v0.1.0 acceptance ran on two clean Vite projects created specifically for verification — one with its own theme, one with someone else's. Since then the registry has grown to nineteen items, but it has never gone into a real consumer project that lives its own life and keeps changing — only into disposable verification projects thrown away right after checking. Questions that only show up on a real consumer — how a repeated `add -o` behaves on an item file the consumer has already edited for themselves; how the registry feels as the catalog grows to the size a real admin panel needs; whether versions of items installed at different times end up diverging from one another — remain unanswered for now.

## `PageStatus` is declared twice — and that stays as is

`registry/page-list/page-list.tsx` and `registry/page-entity/page-entity.tsx` independently declare the same type: `PageStatus = "ready" | "loading" | "error" | "forbidden" | "offline"`. Instinct says to pull it out into a shared spot, but for a registry that copies files, that would be a mistake.

Items must be installable one at a time. A consumer who only needs the entity card has no reason to also get the list page — and a shared type would mean either one page depending on the other, or a third registry item made up of five string literals. Duplicating five literals costs less than either of those.

The risk of drift here is real, though: if the set of states grows, both files will need fixing. Hence the rule going forward — **the set of states only ever changes together in both pages** — and that's checked on review, not by types.
