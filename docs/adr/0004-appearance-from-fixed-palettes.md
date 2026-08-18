---
status: accepted
---

# Appearance comes from fixed palettes, applied through a provider and data attributes

The first take on colour customization (v0.27.0) was an editor: six source colours, hand-made gradients with free stops, a suggested dark variant, a `globals.css` generator. Every gradient the owner tried needed a round of contrast fixes, and every fix was found by looking at a picture — axe declines to judge text over `background-image`, so no automated check stood between a hand-picked stop and an illegible title.

The decision that replaced it: **nothing is entered by hand**. The kit ships twenty three-stop gradients and twenty accents; each is measured in tests for text contrast along the whole gradient, for the hover overlays the kit paints on it, and, for accents, for every filled pair the derivation produces — measured both through 8-bit hex and in continuous precision, because the two disagree near the threshold. The administrator picks; the palette guarantees.

## How the choice reaches the parts

Two things changed in the mechanics, and both follow from "everything is a block".

**A provider instead of per-widget props.** Every card in the work area is a `Block` with an id. `AppearanceProvider` holds the administrator's choice (`value`/`onChange`, stored by the consumer — the same rule as every control), and a block resolves its own gradient by id. Widgets still accept `gradient` directly, and work without a provider; the provider is what makes "give this block a colour" a click in the corner of the block rather than a code change. Threading a per-block prop through every page item would have meant a new prop for every card a page renders and a wiring change in the consumer for every new block.

**Data attributes instead of inline styles.** A surface says `data-gradient="ocean"`; one generic stylesheet rule paints the gradient and redefines the tokens the primitives read — `--foreground`, `--muted`, `--background`, `--border`, `--ring`, the sidebar tokens — so hover, focus and borders stay visible on any gradient without a per-component workaround. Backdrops (`data-backdrop`) paint only the image: nothing sits on them but blocks, and a block is opaque unless it has its own gradient. Thirteen byte-identical `gradientSurfaceStyle` helpers went away with this, and so did the rule that an item must not touch tokens: the stylesheet is emitted from the palette by `appearanceCss` and is part of `admin-appearance`, which every gradient-capable item depends on.

## Alternatives considered

- **Keep the editor, add validation.** Validation can refuse a gradient, but it cannot make a nicer one; the owner would still be picking stops. Rejected.
- **Static CSS in the theme item for all forty entries.** No runtime at all, but the same values maintained by hand in `registry.json` and `app/globals.css`, which already drift. The runtime stylesheet is one function of one palette module and is tested against it.
- **Per-block gradient props on every page item.** Explicit, but every new card means a new prop and a wiring change; the corner button on the block is the feature the owner asked for.

## Consequences

- `theme-editor` and `admin-theme-tokens` are gone; `admin-appearance` and `appearance-menu` replace them. `page-header` is a card, `page-form`'s actions and `page-tabs`' strip are blocks: nothing in the work area is outside a block.
- An opaque `Card` must not be nested inside a block with a gradient — it would inherit the gradient's white text on its own white surface. The kit has no such nesting; a test guards it.
- The consumer keeps the appearance value on the server and renders `AppearanceStyle` in the root layout, so the choice is on the first paint. The demo uses localStorage and accepts a flash of the default.
- Adding a gradient means adding an entry to the palette and passing the tests, not typing stops into a form.
