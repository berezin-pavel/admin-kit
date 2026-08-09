# Deferred to the next iteration

A list of what the second iteration touched but didn't fully close. Each item: what's wrong, which scenario it hits the consumer with, and which direction to fix it in.

## Primitive compatibility

- **`admin-shell` doesn't install into a Radix project without edits.** `admin-menu.tsx` builds the burger menu via `<SheetTrigger render={<Button .../>}>` — `render` is Base UI's composition API, which shadcn used to replace Radix's `asChild` pattern. A project already initialized on Radix will get the `sheet` primitive in its Radix variant (the CLI installs it in whatever style the consumer has already chosen), and there `SheetTrigger` has no `render` prop in its type — `admin-menu.tsx` won't pass `tsc`, and the consumer's `pnpm build` will fail right after. The kit's other four items (`widget-metric`, `widget-table`, `state-loading`, `state-empty`) don't use this kind of composition and install into any style without changes. Covered in more detail in [ADR 0002](adr/0002-base-ui-instead-of-radix.md). Fix: either narrow the burger's composition down to a pattern that works on both `render` and `asChild`, or explicitly accept that `admin-shell` is Base-UI-only, and tell the consumer before they run into a red `tsc`.

## API consistency

- **`actions` on `AdminShell` and `action` on `StateEmpty` name the same role differently.** The other naming inconsistencies the review found before `v0.1.0` — `nav`/`items` between `AdminShell` and `AdminNav`, the missing exported `AdminHeaderProps`/`AdminNavProps` — resolved themselves over this iteration; the signatures are already brought in line. What's left is the action button's callback name. Fix: pick one name for the "actions slot" role and carry it through both items.
