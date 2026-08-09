# Deferred to the next iteration

A list of what the second iteration touched but didn't fully close. Each item: what's wrong, which scenario it hits the consumer with, and which direction to fix it in.

## API consistency

- **`actions` on `AdminShell` and `action` on `StateEmpty` name the same role differently.** The other naming inconsistencies the review found before `v0.1.0` — `nav`/`items` between `AdminShell` and `AdminNav`, the missing exported `AdminHeaderProps`/`AdminNavProps` — resolved themselves over this iteration; the signatures are already brought in line. What's left is the action button's callback name. Fix: pick one name for the "actions slot" role and carry it through both items.

## Closed by decision, not by code

- **`admin-shell` compatibility with Radix projects.** This point is dropped: the kit deliberately stays on Base UI, see [ADR 0002](adr/0002-base-ui-instead-of-radix.md). No need to revisit it — the condition for doing so is spelled out in the ADR itself.
