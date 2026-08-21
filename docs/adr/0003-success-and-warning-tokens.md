---
status: accepted
---

# The theme adds two tokens beyond shadcn's standard set: success and warning

shadcn's standard token set carries exactly one semantic color — `destructive`. There's no success and no warning: there's `primary`, but that's the project's brand color, not "all is well." `status-badge`, an item that exists precisely to show a record's state through color, is missing this: an order isn't just cancelled — it can also be paid or awaiting payment.

So `admin-theme` declares `--success`, `--success-foreground`, `--warning`, `--warning-foreground` for both schemes, and `status-badge` is colored with them.

## How this differs from the cancelled `--navy`

The "standard token set only" rule appeared in the first iteration for a specific reason: an item that references a variable not declared in any theme breaks silently for the consumer — the color falls back to inheritance, with no error at all.

That reason doesn't apply here. `status-badge` declares `admin-theme` as its dependency, and the README requires the theme to be installed first, as its own separate command. That means the tokens are guaranteed to be declared by the time the item renders. This isn't a reference into the void, but an extension of our own theme, used only by items from that same theme.

## Alternatives considered

- **Leave it as is** — `success` through `primary`, `warning` through `outline`. Rejected: the consumer's `primary` could be blue or red, so "success" would be colored the brand color instead of green; `outline` carries no color at all, meaning a warning wouldn't warn about anything. The item would promise something it doesn't deliver.
- **Drop `warning` and `success` from the tone set**, keeping only neutral and dangerous. Honest toward the palette, but it leaves a real gap: "awaiting payment" and "paid" statuses show up in every admin panel, and every consumer would end up writing them on their own.
- **Take colors from `chart-1…chart-5`.** These tokens are standard, but by meaning they're a chart palette — in our theme, a cyan gradient. There's no green or amber in it, and tying status semantics to chart colors would fall apart the moment the chart palette changes.

## Consequences

The rule's boundary shifted and now reads: **custom tokens are allowed if the kit's theme declares them and the item declares the theme as its dependency.** Introducing a variable inside an item without requiring the theme is still off-limits.

A consumer who installs `status-badge` and swaps our theme for their own will get badges with no color in two of the four tones. This is spelled out in the item's `description`, so it surfaces before installation, not after.

## Addendum from 10.08.2026: `--destructive-foreground`

A fifth token was added alongside the same four — `--destructive-foreground`. The reason has the same shape but a different substance.

`--destructive` exists in the standard set, but there's no matching text color for it in `base-nova`: the `Badge` and `Button` primitives color a dangerous action softly (`bg-destructive/10 text-destructive`) and don't need a pairing. Our items needed one once the state badge and the toast started being filled entirely with the tone's color: a filled background needs contrasting text, and it differs by scheme — in the light theme `--destructive` is dark and the text on it is white, in the dark theme `--destructive` is light and the text needs to be dark. This can't be captured with a class: `text-white` in the dark scheme gives a 2.8:1 contrast.

At the same time, `--destructive` itself was toned down in the theme: the standard `oklch(0.577 0.245 27.325)` is a pure red that shouts when it fills an entire toast and stands out of line against `success` and `warning` (chroma 0.12–0.14). Our value is `oklch(0.55 0.19 27)` in the light scheme and `oklch(0.65 0.19 25)` in the dark one: white text on the first gives 5.1:1, dark text on the second gives 5.1:1.

## Addendum from 21.08.2026: `--destructive-mark`

A sixth token pair — `--destructive-mark` and `--destructive-mark-foreground`. Same boundary, a third substance: the appearance engine derives `--destructive` per surface so that destructive *text* keeps 4.5:1 along the whole gradient and under hover tints. On a dark chrome in the green–blue range that is only satisfiable by a light salmon, and the notifications menu's unread dot, icon and counter inherited it — red marks that read as pale pink. Those marks are not text: the title next to them carries the meaning (plus an sr-only "Unread"), so the non-text minimum of 3:1 applies. `--destructive-mark` is the most saturated red that keeps 3:1 against the surface at rest, with a foreground of its own that keeps 4.5:1 for the counter's digits; in the base theme both alias the destructive pair. It is not guaranteed under hover tints and must not be used for text.
