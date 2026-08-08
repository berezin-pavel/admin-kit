# admin-kit: brief

Date: 2026-08-09. Drawn up from a discussion in the avatar-live project session.

## Why

A reusable foundation for React admin panels. One for all of the owner's projects: the avatar-live game's admin panel, admin panels for other apps and sites. The requirement is a living foundation that gets updated and maintained centrally, not a one-off template.

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

## What moves over from avatar-live

Ready-made, proven code from the `feature/admin-react` branch of the avatar-live project. Paths are relative to `apps/admin/src`:

| From | What it is | To |
|---|---|---|
| `core/state/createStore.ts` | a store primitive with immutable snapshots for `useSyncExternalStore` | packages/core |
| `core/state/adminTokenStore.ts` | the admin token in localStorage | packages/core |
| `core/state/connectionStore.ts` | connection status | packages/core |
| `core/net/wsClient.ts` | the ws client, routing incoming messages | packages/core |
| `ui/hooks/useStore.ts` | a bridge to the stores | packages/core |
| `ui/layout/Header.tsx`, `Sidebar.tsx`, `BlocksZone.tsx` | the page shell | registry: admin-shell |
| `ui/blocks/Card.tsx`, `StatsBlock.tsx` | a card and a metrics block | registry: blocks |
| `ui/sections/ParticipantsTable.tsx` | a table with search | registry: data-table |
| `ui/theme.css` | theme tokens | registry: theme |

Game-specific things — the streams overview, the viewer generator, the stream tile — stay in avatar-live.

An important lesson from experience: `packages/shared/src/ws.ts` in avatar-live returns a typed connection status `WsStatus = "connecting" | "open" | "closed" | "error"` as the second argument to `onStatus`. Parsing message text to determine status is off-limits — renaming a string silently breaks the indicator, and tests don't catch it.

## "Northern lights" palette (light theme)

Current values from avatar-live. In admin-kit they'll become one of several palettes, not the only one.

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
