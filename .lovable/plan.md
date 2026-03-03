

## Header Responsiveness Fix

**The Problem**: Both the citizen and resolver headers have 9-10 navigation items displayed horizontally. At the `lg` breakpoint (1024px), these items overflow or get cramped because there is too much content for the available width. The nav items use `px-4 py-2.5` padding with both icons and text labels, which takes up significant horizontal space.

**Proposed Solution**: A multi-pronged approach to make the header navigation fit cleanly at all desktop widths.

### Changes

**1. Increase the desktop nav breakpoint from `lg` (1024px) to `xl` (1280px)**
- In both `AppLayout.tsx` and `ResolverLayout.tsx`, change `hidden lg:flex` to `hidden xl:flex` for the desktop nav, and `lg:hidden` to `xl:hidden` for the mobile menu button and mobile nav panel.
- This ensures the horizontal nav only appears when there is enough room.

**2. Reduce nav item padding and font size for tighter fit**
- In `src/index.css`, reduce `.ncc-nav-item` padding from `px-4 py-2.5` to `px-2.5 py-2` and add `text-sm` for a more compact layout.

**3. Hide nav item text labels at the `xl` breakpoint, show at `2xl`**
- Wrap nav text `<span>` elements with responsive classes: `hidden 2xl:inline` so that at the `xl` breakpoint only icons show, and at `2xl`+ both icon and text show.
- This gives the nav a compact icon-only mode at narrower desktop widths and full labels on wider screens.

### Files to Edit
- `src/components/layout/AppLayout.tsx` -- breakpoint changes + responsive text visibility
- `src/components/layout/ResolverLayout.tsx` -- same changes
- `src/index.css` -- reduce `.ncc-nav-item` padding

### Technical Detail

The key CSS change in `index.css`:
```css
.ncc-nav-item {
  @apply flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium;
}
```

Nav item spans get: `<span className="hidden 2xl:inline">Home</span>`

Breakpoints change from `lg:` to `xl:` for showing/hiding desktop vs mobile nav.

