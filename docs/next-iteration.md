# Deferred to the next iteration

The naming inconsistency this table had tracked since the first review is closed: in `state-empty` the `action` prop was renamed to `actions`, so the actions slot is now named the same way across every item in the kit. The pages from `docs/brief.md` — a list with filters and an entity card — are also done: `page-list` and `page-entity` are in the registry. What follows is what got closed by a decision rather than by code, and what's still unresolved after this iteration.

## Closed by decision, not by code

- **`admin-shell` compatibility with Radix projects.** This point is dropped: the kit deliberately stays on Base UI, see [ADR 0002](adr/0002-base-ui-instead-of-radix.md). No need to revisit it — the condition for doing so is spelled out in the ADR itself.

## sidebarFooter: the content renders in several places at once

`admin-shell` passes `sidebarFooter` into three places: `AdminRail` (the narrow icon rail), the full sidebar (`registry/admin-shell/admin-shell.tsx`), and the burger panel (`registry/admin-shell/admin-menu.tsx`, where the slot showed up in v0.5.0). The rail and the full sidebar are always mounted in the tree — switching between them is pure CSS (`md:hidden` / `hidden md:flex`); the burger panel remounts every time it opens. At any screen width, two instances of the slot live in the DOM at once, and three while the panel is open.

Before, this was an undocumented trap. Now the constraint is spelled out directly, both in `registry.json` (the `admin-shell` description) and in the README: `sidebarFooter`'s content must have no state of its own, or be controlled from outside, like `theme-toggle` and `sidebar-toggle`. But this is still only a description of the constraint, not a fix for the cause — the render duplication itself hasn't gone anywhere, and the registry still doesn't have a single item with its own state that would go into this slot and show that the warning actually holds up in practice, not just on paper. Open question — leave this as a permanent boundary of the contract, or change how the shell is built so the slot stops duplicating.

## The kit has never been installed into a real admin panel

The v0.1.0 acceptance ran on two clean Vite projects created specifically for verification — one with its own theme, one with someone else's. Since then the registry has grown to nineteen items, but it has never gone into a real consumer project that lives its own life and keeps changing — only into disposable verification projects thrown away right after checking. Questions that only show up on a real consumer — how a repeated `add -o` behaves on an item file the consumer has already edited for themselves; how the registry feels as the catalog grows to the size a real admin panel needs; whether versions of items installed at different times end up diverging from one another — remain unanswered for now.

## `PageStatus` is declared twice

`registry/page-list/page-list.tsx` and `registry/page-entity/page-entity.tsx` independently declare the same type: `PageStatus = "ready" | "loading" | "error" | "forbidden" | "offline"`. There's no naming conflict — these are different files belonging to different registry items — but separate declarations of one contract will drift the moment the set of states changes: someone fixes the list of values in one file and forgets the other. Worth deciding whether to pull the type out into a shared spot — the pages already share `state-loading` and the other states through `registryDependencies` — or explicitly accept the duplication as the price of keeping items independent of each other.
