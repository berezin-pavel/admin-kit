# Admin panel on React + shadcn/ui: shell, theme, streams overview

Date: 2026-08-08
Status: agreed, ready for an implementation plan

## Why

The current admin panel (`apps/admin`, 1720 lines of vanilla TS) assembles markup as strings in `ui/layout/`, and wires up behavior by hand through `must<HTMLElement>(id)` in `bind/`. The link between markup and behavior rests on string identifiers, so every new control is an edit across three files. The panel keeps growing: ahead lie statistics, viewer moderation, stream management and balance edits, plus handling several streams at once.

This spec closes out the first of five subprojects: the shell, the theme, and the streams overview. The other four get their own specs separately.

## Scope

### In scope

- Porting `apps/admin` to React 19 + Vite + Tailwind + shadcn/ui. Exact versions are taken from live documentation via context7 at the install step, not from memory.
- Splitting the code into a logic layer (`core/`) and a presentation layer (`ui/`).
- The project theme on the "Northern lights" palette in shadcn variables.
- An "Overview" section — tiles for every stream with live metrics and control buttons.
- Porting the existing sections: Main, Stream, Debug, the participants table.
- A new protocol message for the stream list and its delivery on the server.
- The stream generator — one instance per room, with no DOM access.

### Out of scope

- The `adminStartRound` and `adminPauseRound` commands — the server doesn't have them. The "Start round" and "Pause" buttons render disabled with a "coming soon" label; no handlers are written. The server side is the second spec, "Stream management."
- Viewer moderation, statistics from Postgres, on-the-fly balance edits — subprojects 3–5.
- Changes to the overlay and the server's game logic.

## Architecture

Two layers with no feedback loop: `core/` doesn't import React, `ui/` doesn't know about WebSocket or timers.

```
apps/admin/src/
├── core/
│   ├── net/
│   │   ├── wsClient.ts          connection, reconnect, parsing incoming messages
│   │   └── actions.ts           typed commands to the server
│   ├── state/
│   │   ├── createStore.ts       primitive: subscribe / getSnapshot / set
│   │   ├── roomsStore.ts        stream list from roomsOverview
│   │   ├── roomStore.ts         snapshot of the selected room, participants, queue
│   │   ├── connectionStore.ts   ws status, errors
│   │   └── adminTokenStore.ts   admin token, localStorage
│   ├── stream/
│   │   ├── streamLoop.ts        stream generator, parameterized by roomId
│   │   ├── tiktokSim.ts         viewer profiles, nicknames, local avatars
│   │   └── streamRegistry.ts    generator registry: one per room
│   └── types.ts
└── ui/
    ├── App.tsx
    ├── theme.css                theme tokens
    ├── components/ui/           shadcn components (copied into the project)
    ├── blocks/
    │   ├── Card.tsx             one shared block: summary, stream tile, stub
    │   ├── StatsBlock.tsx       overall statistics
    │   └── RoomTile.tsx         stream tile
    ├── layout/
    │   ├── Header.tsx           logo, ws status, stream counter
    │   ├── BlocksZone.tsx       block grid up top
    │   └── Sidebar.tsx          sections
    ├── sections/
    │   ├── OverviewSection.tsx
    │   ├── CoreSection.tsx
    │   ├── StreamSection.tsx
    │   └── DebugSection.tsx
    └── hooks/
        └── useStore.ts          the useSyncExternalStore bridge
```

The bridge between the layers is the native `useSyncExternalStore`. Stores implement `subscribe(cb): () => void` and `getSnapshot(): T`. No external state libraries (Redux, Zustand) get pulled in: they solve exactly this problem at the cost of a dependency, and the stores are already written in a fitting shape.

`core/` logic is tested with plain vitest, no rendering. Once a real TikTok connector shows up, `stream/` gets switched off by swapping the event source — `ui/` never finds out.

## Protocol

Added to `packages/shared/src/protocol.ts`. The edit must be synchronous across server, admin, and overlay.

```ts
export type RoomOverviewRow = {
  roomId: RoomId;
  players: number;
  queued: number;
  phase: RoundPhase;
  roundSeq: number;
  remainingMs: number;
  lastActivityAt: number;
};
```

Client → server:

```ts
| { type: "adminSubscribeRooms"; adminToken: string }
```

Server → client:

```ts
| { type: "roomsOverview"; rooms: RoomOverviewRow[] }
```

Delivery rules:

- `roomsOverview` goes out once a second, and only to sockets that sent `adminSubscribeRooms` with a valid token. Token validation is the existing `isValidAdminToken`.
- The subscription is dropped when the socket closes; a separate `adminUnsubscribeRooms` isn't introduced.
- This data doesn't go into the 30 Hz `state` snapshot. The streams overview goes out as its own message at 1 Hz, otherwise the traffic that was removed by pulling `playersMeta` and `queue` out of the snapshot would come back.
- `queued` is taken from the already-cached `room.queuePreview`; the queue length in Redis isn't requeried.
- A `lastActivityAt` field is added to `RoomState` — the time of the last incoming message to the room. Needed to tell an idle stream apart from an active one.

## Theme

The "Northern lights" palette, pulled from the user's reference. A light background, no dark surfaces.

| Variable | Value | Role |
|---|---|---|
| `--background` | `#EDEEF5` | work area background |
| `--card`, `--popover` | `#FFFFFF` | cards, menus, dialogs |
| `--foreground` | `#2B2B2C` | main text |
| `--primary` | `#36795A` | anything filled under white text: buttons, badges, the active menu item |
| `--primary-bright` | `#42916D` | decorative fills without text: progress, bars |
| `--accent` | `#65B6B0` | round progress, likes, the "results" state |
| `--accent-dark` | `#2F7D78` | badges with white text |
| `--navy` | `#253D60` | headings, values, tooltips, toasts |
| `--secondary` | `#DFE3EC` | secondary buttons |
| `--muted` | `#E4E7F0` | backing surfaces, skeletons |
| `--muted-foreground` | `#5B6577` | secondary text |
| `--border` | `rgba(37,61,96,.11)` | card borders: should be barely visible on white |
| `--input` | `#D7DCE7` | input field borders: more contrast than card borders, the field needs to read clearly |
| `--destructive` | `#C0504A` | destructive actions, lost connection |
| `--warning` | `#B98A3C` | warnings (this token wasn't defined) |
| `--ring` | `#42916D` | focus |

Color rules:

- Text on a colored fill is always white, so badges use `--primary-dark` and `--accent-dark`. On plain teal `#65B6B0`, white text gives a contrast of about 2:1 and isn't readable.
- Cards stay white. Color carries meaning: stream state, progress, metric values.
- `--warning` was missing from the original palette and was added on purpose: without it, a "token not set" warning would look just as alarming as a lost connection.

The design system reference with every element in these tokens: `docs/design/admin-theme-showcase.html`. It defines the look of buttons, badges, fields, cards, tabs, the table, alerts, dialogs, menus, tooltips, toasts, progress, skeletons, and the spinner. New functionality is assembled from these pieces.

## Screens

**Header.** Logo, count of live streams, ws status.

**Block zone.** A card grid: on the left, an overall stats block (players, queue, likes, coins — summed across all streams), on the right, room for future blocks. A card is the same component as a stream tile.

**Sidebar.** Overview, Main, Stream, Debug. Sections for future subprojects (Moderation, Statistics, Balance) render disabled.

**Overview.** Stream tiles. On each: room name, phase badge, players, queue, time to round end, a progress bar. Buttons on a tile act on its own stream — there's no need to select it first:

| Button | Implementation | State |
|---|---|---|
| End round | `adminEndRound` with `roomId` and the token | active |
| Boost | `adminGlobalEvent` with the `boost` key | active |
| Generator on/off | this room's local generator | active |
| Pause, Start round | — | disabled, "coming soon" label |

**Main, Stream, Debug.** Ported from the current panel with no behavior changes. The participants table is the `Table` component from the showcase.

The current room is set by clicking a tile in "Overview" and is held in `roomStore`. The Main, Stream, and Debug sections work off it; its name is shown in the header. If no current room is selected, these sections show an empty state suggesting the user open a stream from "Overview."

**Stream generator.** Settings (frequency, jitter, the share of comments and gifts) are shared across all rooms and live in one store. The "on/off" state is per room, so the generator can be kept running in a test room without touching the live stream. The generator is off by default in every room: right now `createAdminStreamBundle` starts it on its own, and in a panel with several streams, that kind of autostart means an artificial stream in an arbitrary room. This decision was made at the spec stage, not inherited.

## Errors

- Ws disconnect: stream tiles show their last known state dimmed, all buttons get disabled, the header shows a `no connection` badge in `--destructive`, and auto-reconnect kicks in.
- Admin token missing or invalid: the server silently ignores commands, so the UI shows a `--warning`-level alert and disables the stream-control buttons. Without this, the buttons would look broken with no explanation.
- A room disappears from `roomsOverview`: the tile stays up for another 10 seconds with a note on the time of last activity, then gets removed.

## Testing

Unit tests on `core/`, no rendering:

- `createStore` — subscribe, unsubscribe, snapshot stability across calls (otherwise `useSyncExternalStore` goes into an infinite loop).
- `roomsStore` — applying `roomsOverview`, removing vanished rooms, sorting.
- `streamRegistry` — a generator is created per room, stopping one doesn't touch the others.
- `wsClient` — parsing incoming messages, behavior on disconnect.

On the server: subscribing to `roomsOverview` with no token or an invalid token sends no updates; a subscribed socket gets a message once a second. Tests go into new files; existing ones aren't extended.

Verification by running it: the panel comes up, connects to the server, shows streams, the "End round" and "Boost" buttons produce an observable effect in the overlay.

## Acceptance criteria

1. `pnpm run check` passes, `pnpm --filter @app/server test` is green.
2. Every section of the old panel works as before: gifts, comments, the stream generator, the participants table, admin events, debug.
3. The "Overview" section shows every room on the server, updating once a second.
4. Buttons on the tiles act on their own stream.
5. The look matches the `docs/design/admin-theme-showcase.html` reference.
6. No files remain in `apps/admin/src` from the old markup layer or manual string-identifier wiring.
7. The `state` snapshot hasn't grown in size.

## Order of work

1. Tailwind and shadcn/ui in `apps/admin`, the theme in `theme.css`, the component set from the showcase.
2. The `core/` layer: stores, ws client, porting the generator with DOM detached.
3. Protocol and server: `adminSubscribeRooms`, `roomsOverview`, `lastActivityAt`.
4. The `ui/` layer: shell, block zone, sidebar, "Overview."
5. Porting the Main, Stream, and Debug sections and the participants table.
6. Removing the old code, verification by running it.

Step 3 doesn't depend on steps 1, 2, 4, 5 and can run in parallel with a separate executor: it touches `packages/shared` and `apps/server`, while the rest touch only `apps/admin`.
