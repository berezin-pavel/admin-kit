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
The administrator's global choice of an accent colour and gradients — for the sidebar, the sign-in screen, each page's backdrop and each block. Picked from fixed, contrast-checked palettes; the kit renders it and the consumer stores it.
_Avoid_: theme settings, customization, skin

**Backdrop**:
A gradient painted behind blocks — the work area of a page or the sign-in screen. Stored as a pair of a gradient and a `soft` flag: soft by default, a light or dark tint of the gradient, and vivid when the flag is off (the appearance menu's soften checkbox). Never overrides text tokens, because no text sits on it.
_Avoid_: page background, wallpaper

**Palette**:
The fixed set of eighty-six gradients, grouped into eight families, and twenty accents shipped with the kit, each measured for text contrast, including on hover. The only source of colour choices; nothing is entered by hand.
_Avoid_: presets, swatches, color list
