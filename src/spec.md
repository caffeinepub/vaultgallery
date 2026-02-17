# Specification

## Summary
**Goal:** Fix Vault Gallery’s mobile header overflow and ensure pages render/scroll correctly beneath the header on small screens.

**Planned changes:**
- Update the top app header layout for narrow/mobile viewports so the navigation (Library/Albums/Vault/Settings) and Login/Logout control do not overflow or get clipped.
- Ensure navigation remains usable on mobile (e.g., by collapsing or otherwise adapting the nav) while keeping the existing desktop/tablet header layout consistent at >= 768px.
- Adjust the app shell/main content layout on mobile so active pages render below the header and remain visible/scrollable without large blank areas or hidden content after switching views.
- Verify the frontend production build succeeds and no new runtime console errors are introduced in header/navigation flows.

**User-visible outcome:** On mobile-sized screens, the header no longer pushes content off-screen, navigation and Login/Logout stay accessible, and Library/Albums/Vault/Settings pages display and scroll normally beneath the header without blank panels.
