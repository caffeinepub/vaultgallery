# Specification

## Summary
**Goal:** Build a web-based photo/video gallery with per-user authentication, albums, basic photo editing, a PIN-locked Vault for hidden media, theming, performance optimizations, and import/export utilities.

**Planned changes:**
- Add Internet Identity sign-in/sign-out and scope all stored data per authenticated principal.
- Implement media upload (photos/videos), a smooth-scrolling thumbnail grid, and a detail viewer with basic metadata.
- Add album management: create/rename/delete, add/remove media, and reorder albums with persistent ordering.
- Provide basic image editing: crop, rotate, filters, brightness/contrast; save as copy and optionally replace original.
- Implement Hidden/Locked media and a Vault section protected by an app-specific PIN (unlock required; resets on reload; PIN change after unlock).
- Add light/dark theme toggle with persistent preference and consistent English UI.
- Optimize large-library performance via thumbnail generation, incremental loading, and deferred full-resolution loading.
- Add export/import of library metadata (and references) with a clear warning about storage limits and no third-party cloud backup.
- Include generated static frontend branding/empty-state assets and render them from static files.

**User-visible outcome:** After signing in, users can upload and browse photos/videos in a fast grid, manage albums, view details, edit images, hide/lock items inside a PIN-protected Vault, switch between light/dark mode, and import/export backups; branding and empty states display using bundled static images.
