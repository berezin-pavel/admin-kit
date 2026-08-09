# admin-kit: brief

Date: 2026-08-09.

## Why

A reusable foundation for React admin panels. One for all of the owner's projects: admin panels for apps and sites. The requirement is a living foundation that gets updated and maintained centrally, not a one-off template.

## Key decision: how to deliver it

A starter template (Next / react-router / Vite) can't be the foundation's base: it'll differ between admin panels — a game needs no more than Vite, while a site's admin panel might need Next with a server side. The foundation has to sit on top of any starter.

The content splits by nature into two parts, each with its own delivery method.

| What | How | Why |
|---|---|---|
| Theme, blocks, admin shell, standard pages and states | its own shadcn registry | The code is copied into the project and edited for the specific admin panel. A game needs a "Live streams overview," a store needs "Orders" |
| Wrapper code: stores, the ws client, token-based auth, hooks, utilities | an npm package | This code isn't edited in projects, and updates should be a single command |

Custom registries are an official shadcn mechanism, not a homegrown one: namespaces (`@pavel/...`), private access with an authorization header, and the `registry:theme` type for distributing palettes are all supported. Verified against the docs via context7 on 09.08.2026.

Installing into a consumer project looks like this: the registry is added to `components.json`, then `pnpm dlx shadcn add @pavel/admin-shell`.

## Owner's decisions

- **Scope**: build all four parts at once — the registry with a showcase, the wrapper npm package, blocks and themes, starter templates.
- **Distribution**: local only for now, no hosting, no tokens. Publishing gets added once a second consumer project shows up.
- **Location**: a separate `~/Projects/Personal/admin-kit` directory, its own git repository, `main` branch.
- **Theme foundation**: a preset from the shadcn builder — `b1s91ncpc`.

Commands from the builder:

```bash
pnpm dlx shadcn@latest init --preset b1s91ncpc --template next
pnpm dlx shadcn@latest init --preset b1s91ncpc --template react-router
```

Preset link: https://ui.shadcn.com/create?preset=b1s91ncpc

## Proposed structure

```
admin-kit/
├── apps/registry/     Next.js: the live component showcase and JSON registry distribution
├── packages/core/     npm package: stores, ws client, token, hooks
├── registry/          sources: themes, blocks, shell, pages, states
├── templates/         ready-made starters for Vite and Next
└── registry.json
```

The showcase replaces a static HTML reference: it's both the documentation and the source of the code.

## Registry units

- **Palettes** — type `registry:theme`, light and dark set as `cssVars.light` and `cssVars.dark`. Installed and updated separately from the blocks.
- **Admin shell** — header, sidebar, a full-width block zone up top.
- **Standard blocks** — a metric, a metric with a trend, a chart block, a list, a table block, a stub.
- **States** — loading, empty, error, no access, connection lost.
- **Pages** — a list with filters, an entity card.

## "Northern lights" palette (light theme)

Cancelled by the 09.08.2026 grilling: the theme is taken from the preset as a whole, and the token set is shadcn's standard one. The table is kept as a reference for picking colors; it isn't used in the code.

| Variable | Value | Role |
|---|---|---|
| `--background` | `#EDEEF5` | work area background |
| `--card`, `--popover` | `#FFFFFF` | cards, menus, dialogs |
| `--foreground` | `#2B2B2C` | main text |
| `--primary` | `#36795A` | anything filled under white text |
| `--primary-bright` | `#42916D` | decorative fills without text |
| `--accent` | `#65B6B0` | progress, secondary accents |
| `--accent-dark` | `#2F7D78` | badges with white text |
| `--navy` | `#253D60` | headings, values, tooltips |
| `--secondary` | `#DFE3EC` | secondary buttons |
| `--muted` | `#E4E7F0` | backing surfaces, skeletons |
| `--muted-foreground` | `#5B6577` | secondary text |
| `--border` | `rgba(37,61,96,.11)` | internal dividers |
| `--input` | `#D7DCE7` | borders of input fields and tables |
| `--destructive` | `#C0504A` | destructive actions, lost connection |
| `--warning` | `#B98A3C` | warnings |
| `--ring` | `#42916D` | focus |

Rules drawn from practice:

- Text on a colored fill is always white, so fills use darkened variants: white on `#42916D` gives a 3.65:1 contrast, below the 4.5:1 norm for small text.
- Cards and blocks have no borders or shadows: a white surface separates itself from the background on its own. Borders remain on input fields, tables, and the dashed stub.
- The border token in shadcn's base `Card` is set with no color variable and draws with `currentColor`. If the border isn't wanted, it has to be removed from the component — a token edit won't achieve that.

## Open questions

1. No dark palette has been chosen yet. A second palette and a theme toggle are needed.
2. Which starter templates to build: Vite, Next, or both.
3. Block update policy. A repeated `shadcn add` overwrites the file: if a block was edited in the project, the edits get wiped. One option is to agree that registry blocks aren't edited, only wrapped or copied under their own name.
4. The contents of the `b1s91ncpc` preset haven't been studied — that'll surface at the first `init`.

## Code constraints

The same ones as in the owner's other projects:

- No comments in code, except to explain a non-obvious "why."
- `any`, `as` casts to work around types, `@ts-ignore`, `eslint-disable`, and lowering config strictness are all forbidden. The root cause gets fixed, not suppressed.
- Interface text and commit messages are in Russian; file and identifier names are in English, kebab-case for files.
- Commit heading: one line, up to 72 characters, about the result, not imperative, doesn't start with a verb, no `feat:`/`fix:` prefixes.
- The ws connection status arrives as a separate typed value rather than being derived by parsing message text: renaming a string silently breaks the indicator, and tests don't catch it.
