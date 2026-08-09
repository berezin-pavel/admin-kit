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
_Avoid_: palette, color scheme, styling

**Shell**:
A registry item with the admin panel's persistent frame: an optional header, navigation — a sidebar on a wide screen, an icon rail and a burger panel on a narrow one — and an empty work area.
_Avoid_: layout, wrapper

**Control**:
A small self-contained shell control — not tied to the work area and doesn't show screen state. Its value and handler arrive as props, and storage stays with the consumer — the same reason widgets don't fetch their own data. Placed in the shell's `sidebarFooter` slot or anywhere else on the page.
_Avoid_: control widget, toggle, button

**Widget**:
A self-contained card in the work area — a metric, a table, a chart, a list. Gets its data from outside and never fetches it itself.
_Avoid_: block, card, tile

**Stub**:
An empty spot in the work area marking where a widget will go.
_Avoid_: placeholder, empty block

**State**:
A registry item showing what the user sees instead of content: loading, empty, error, no access, connection lost.
_Avoid_: stub, error screen, fallback

**Page**:
A registry item with the work area's content ready-made for a specific task — a list with filters, an entity card.
_Avoid_: screen, section, view
