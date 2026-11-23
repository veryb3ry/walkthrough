# Walkthrough

Mobile-first virtual tabletop foundation. The current build contains the functional Phase 1 and Phase 2 client: a Konva.js tabletop with touch-friendly selection, dragging, zooming, panning, image uploads, local persistence, asset library, and editable layers.

## Run

Open `index.html` in a modern browser, or serve the folder with any static server (for example `python3 -m http.server`). Konva is loaded from its public CDN; no build step or API key is required.

## Controls

- Drag library cards onto the canvas, or tap them to place an item.
- Use Select/Pan, mouse-wheel or the zoom buttons, and the Grid toggle.
- Select an item to resize or rotate it. Delete and duplicate are in the bottom toolbar.
- Use the Layers panel to add, hide, lock, and delete custom layers.
- Uploaded PNG, JPEG, and WebP files remain in the current browser session and are placed on the Objects layer.
- Board state is saved in `localStorage`; multiplayer/Supabase is intentionally reserved for Phase 3.
