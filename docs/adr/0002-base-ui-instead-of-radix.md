---
status: accepted
---

# Primitives are Base UI, not Radix

The builder preset `b1s91ncpc`, chosen as the theme's foundation, brings the Nova style and Base UI primitives. The alternative was to take only the theme and fonts from the preset (`shadcn apply --only theme,font`) and put the primitives on Radix with the new-york style, as in the already-written avatar-live admin panel. We chose the preset as a whole: admin-kit decided not to carry over code from avatar-live, so there's nothing to rewrite for Base UI, and building a new set on the previous generation of primitives for the sake of compatibility with one project would be optimizing for the past.

## Consequences

The bill comes due when the kit gets ported into avatar-live: it has eighteen primitives on Radix `^1.6.7` and the new-york style in `components.json`. There are two options, both unpleasant, and the choice belongs to that session, not this one: keep two primitive libraries in one app, or rewrite those eighteen for Base UI. The cost grows with however many registry items have piled up by then.

A smaller separate consequence: blocks from the shadcn showcase ship in the Nova style on Base UI, meaning they drop into admin-kit without adaptation — while third-party component sets written for Radix no longer fit.
