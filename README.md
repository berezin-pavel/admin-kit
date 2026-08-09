# admin-kit

Ready-made admin panel parts — a theme, a shell, widgets, and screen
states — that install into your project with the `shadcn` command
and update whenever you decide to. Distributed as its own shadcn registry
straight from this GitHub repository: no build, no hosting, no tokens.

## Requirements

The consumer project is already initialized for shadcn: Next or Vite, Tailwind
v4, `components.json` at the root. From there, plain `shadcn add` does the job.

## Installation

Any registry item installs with one command:

```bash
pnpm dlx shadcn@latest add berezin-pavel/admin-kit/<item-name>
```

For example, the admin shell:

```bash
pnpm dlx shadcn@latest add berezin-pavel/admin-kit/admin-shell
```

The CLI pulls in everything the item depends on by itself: the `admin-theme`
theme, shadcn primitives (`card`, `table`, `skeleton`, and others), and npm packages.

## Registry items

| Name             | Type                  | What it does                                                                                                          |
| --------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `admin-theme`   | `registry:theme`     | Colors and radii for the admin panel, for the light and dark schemes. Installed first — the other items rely on its tokens  |
| `admin-shell`   | `registry:block`     | A persistent frame for the admin panel: a header, side navigation, and a work area. Installed once per project              |
| `widget-metric` | `registry:component` | A single-number card for a dashboard: a title, a value, optional trend, and a caption                        |
| `widget-table`  | `registry:component` | A table with a header and columns: numeric columns align right, and it takes its own state for empty data |
| `state-loading` | `registry:component` | A skeleton in place of content while data is loading                                                                       |
| `state-empty`   | `registry:component` | A screen in place of content when there's no data: a title, an explanation, an action button                                   |

## Versions

Installing without specifying a version installs the content of the
`main` branch. To pin to a specific version, append the tag after `#`:

```bash
pnpm dlx shadcn@latest add berezin-pavel/admin-kit/admin-shell#v0.1.0
```

## Updating

A repeated `add` without flags doesn't overwrite anything: the CLI doesn't
touch files that are already in the project.

```bash
pnpm dlx shadcn@latest add berezin-pavel/admin-kit/admin-shell --diff
```

shows the discrepancy between the version in the project and the version
in the registry, while

```bash
pnpm dlx shadcn@latest add berezin-pavel/admin-kit/admin-shell -o
```

overwrites the item's files with the new version.

## Rule

Registry items aren't edited in your own project: the next `add -o` will
wipe out the edits without warning. If you need behavior that isn't there
out of the box, wrap the item in your own component or copy its file
under a different name.
