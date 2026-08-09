---
status: accepted
---

# Primitives are Base UI, not Radix

The builder preset `b1s91ncpc`, chosen as the theme's foundation, brings the Nova style and Base UI primitives (`-b, --base` in `shadcn init` accepts `base`, `radix`, `aria`). The alternative was to take only the theme and fonts from the preset (`shadcn apply --only theme,font`) and put the primitives on Radix with the new-york style. We chose the preset as a whole: the kit is written from scratch, there's nothing to rewrite for Base UI, and building a new set on the previous generation of primitives would be optimizing for the past.

## Consequences

Items in `registry/` don't hardcode Base UI directly — there's no direct `@base-ui/react` import there except in one place. `admin-menu.tsx` in `admin-shell` builds the burger menu via `<SheetTrigger render={<Button .../>}>`: `render` is Base UI's composition API, which shadcn used to replace Radix's `asChild` pattern. The Radix variant of `SheetTrigger` has no `render` prop in its type.

The risk from this is specific, not general: `sheet`, which `admin-shell` depends on, is installed by the CLI in whatever style the consumer has already chosen in `components.json`. In a project already initialized on Radix, that would be the Radix variant of `sheet` — and `admin-menu.tsx` wouldn't pass `tsc`. The kit's other four items (`widget-metric`, `widget-table`, `state-loading`, `state-empty`) don't use the `render`/`asChild` composition at all and install into any style without changes. This doesn't stop the two primitive sets from sitting side by side in one project — specifically `admin-shell` just won't install, and won't until the project moves its primitives to Base UI.

The flip side: blocks from the shadcn showcase ship in the Nova style on Base UI, meaning they drop into admin-kit without adaptation — while third-party component sets on Radix that use `asChild` aren't a fit for mixing with `admin-shell` without porting to `render`.

## The decision was reconfirmed when the catalog expanded

The question came back after the second iteration: should the kit be made neutral to the primitives library by dropping the composition? The answer is no, and the reason is what the catalog will keep growing from. Filters, row actions, confirmations, hints, date picking — all of these are built the same way: there's a trigger element that needs to be drawn with your own button. Composition won't be needed once — it'll be needed in every other new item.

That flips the costs around. Neutrality costs four ARIA attributes in one file today, but at twenty items it would mean manually wiring the trigger to the popup in each one: `aria-expanded`, `aria-controls`, focus return, closing on Escape. That's a standing tax, and every forgotten detail becomes an accessibility defect that surfaces from a complaint rather than a check. The cost of betting on Base UI, by contrast, doesn't grow — it shrinks: only projects started on shadcn's earlier styles are left out, and new ones start on `base-nova`.

The condition worth revisiting this under: **when composition is needed in a second and a third item.** At that point it's worth pulling into one small kit file that the rest of the items go through — and Radix compatibility becomes a one-file fix for the consumer instead of twenty. Until then the abstraction is premature: there's exactly one composition in the kit.
