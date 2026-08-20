# admin-kit

The project's language: what the admin panel's parts are called and the mechanics of how they're distributed. Registry item names are a public interface — both humans and agents use them to decide what to install, so a mismatch in wording costs more than usual.

## Project and distribution

**admin-kit**:
A set of ready-made admin panel parts that admin panels for different projects are assembled from.
_Avoid_: base, kit, library, template

**Registry**:
The catalog the consumer installs admin-kit's parts from into their project and pulls their updates from.
_Avoid_: storage, repository, registry

**Registry item**:
The unit of installation: what gets installed and updated as one whole with a single command.
_Avoid_: registry component, resource, package

**Consumer**:
The project that has installed registry items and edits them on its own side.
_Avoid_: client, customer, target project

**Showcase**:
The application that shows every registry item alive — in all the views it's meant to have.
_Avoid_: demo, sandbox, documentation

**Preset**:
The set of choices from the shadcn builder — style, primitives, fonts, radius, colors — that admin-kit's theme starts from.
_Avoid_: starter theme, builder theme

## Parts of the admin panel

**Theme**:
A registry item that sets the colors and radii for both the light and dark scheme at once.
_Avoid_: color scheme, styling

**Shell**:
A registry item with the admin panel's persistent frame: an optional header, navigation — a sidebar on a wide screen, an icon rail and a burger panel on a narrow one — and an empty work area.
_Avoid_: layout, wrapper

**Control**:
A small self-contained shell control — not tied to the work area and doesn't show screen state. Its value and handler arrive as props, and storage stays with the consumer — the same reason widgets don't fetch their own data. Placed in the shell's `sidebarFooter` slot or anywhere else on the page.
_Avoid_: control widget, toggle, button

**Block**:
Any card in the work area, addressed by an id: a widget, a page section, a page header, a tab strip. A block carries its own appearance — a gradient and, where it has a title, a heading treatment — chosen by the administrator and stored by the consumer. Nothing in the work area sits outside a block.
_Avoid_: card, tile, panel

**Widget**:
A block that shows data — a metric, a table, a chart, a list. Gets its data from outside and never fetches it itself.
_Avoid_: card, tile

**Stub**:
An empty spot in the work area marking where a widget will go.
_Avoid_: placeholder, empty block

**State**:
A registry item showing what the user sees instead of content: loading, empty, error, no access, connection lost.
_Avoid_: stub, error screen, fallback

**Page**:
A registry item with the work area's content ready-made for a specific task — a list with filters, an entity card.
_Avoid_: screen, section, view

**Appearance**:
The administrator's global choice of an accent colour and surfaces — for the sidebar, the header bar, the sign-in screen, each page's backdrop and each block. Each surface is a gradient of the palette or a custom colour; the kit renders the choice and the consumer stores it.
_Avoid_: theme settings, customization, skin

**Custom colour**:
A single `#rrggbb` colour entered by the administrator instead of a palette gradient, in the accent or in any surface but a block's. The colour is the administrator's; the text colour on it is not — the kit derives it and measures it at 4.5:1, dropping to pure white or black where its near-white and near-black would miss. It also has two variants, one per scheme: the colour itself in the light scheme, and in the dark one either itself, when it is already dark, or the same hue moved into the dark chrome band. Only a validated colour reaches the stylesheet.
_Avoid_: hex, brand color, custom gradient

**Theme preset**:
A whole named appearance shipped with the kit (`appearanceThemes`), applied in one click and then editable like any other. Built out of custom colours, so renaming a gradient cannot break one. Applying one replaces the chrome and the accent and leaves the per-block and per-page choices alone: a preset has an opinion about the panel, not about the blocks in it.
_Avoid_: theme, skin, template

**Backdrop**:
A colour painted behind blocks — the work area of a page or the sign-in screen. Stored as a plain `SurfaceChoice`: a palette gradient is painted as its soft tint, a custom colour exactly as it was typed. The sign-in screen is the one place that paints a palette gradient in full. Never overrides text tokens, because no text sits on it.
_Avoid_: page background, wallpaper

**Palette**:
The fixed set of eighty-seven gradients — every one of them three stops of a single hue — grouped into ten families (neutral, earth, red, orange, yellow, green, cyan, blue, violet, pink), and twenty accents shipped with the kit, each measured for text contrast, including on hover. The first source of colour choices, and the only one for blocks; anywhere else a custom colour may be typed instead, and then the kit measures the text against it.
_Avoid_: presets, swatches, color list
