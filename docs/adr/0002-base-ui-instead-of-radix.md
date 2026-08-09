---
status: accepted
---

# Primitives are Base UI, not Radix

The builder preset `b1s91ncpc`, chosen as the theme's foundation, brings the Nova style and Base UI primitives (`-b, --base` in `shadcn init` accepts `base`, `radix`, `aria`). The alternative was to take only the theme and fonts from the preset (`shadcn apply --only theme,font`) and put the primitives on Radix with the new-york style. We chose the preset as a whole: the kit is written from scratch, there's nothing to rewrite for Base UI, and building a new set on the previous generation of primitives would be optimizing for the past.

## Consequences

Items in `registry/` don't hardcode Base UI directly — there's no direct `@base-ui/react` import there except in one place. `admin-menu.tsx` in `admin-shell` builds the burger menu via `<SheetTrigger render={<Button .../>}>`: `render` is Base UI's composition API, which shadcn used to replace Radix's `asChild` pattern. The Radix variant of `SheetTrigger` has no `render` prop in its type.

The risk from this is specific, not general: `sheet`, which `admin-shell` depends on, is installed by the CLI in whatever style the consumer has already chosen in `components.json`. In a project already initialized on Radix, that would be the Radix variant of `sheet` — and `admin-menu.tsx` wouldn't pass `tsc`. The kit's other four items (`widget-metric`, `widget-table`, `state-loading`, `state-empty`) don't use the `render`/`asChild` composition at all and install into any style without changes. This doesn't stop the two primitive sets from sitting side by side in one project — specifically `admin-shell` just won't install, and won't until the project moves its primitives to Base UI.

The flip side: blocks from the shadcn showcase ship in the Nova style on Base UI, meaning they drop into admin-kit without adaptation — while third-party component sets on Radix that use `asChild` aren't a fit for mixing with `admin-shell` without porting to `render`.
