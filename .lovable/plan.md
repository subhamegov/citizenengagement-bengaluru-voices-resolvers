

# Migrate UI to UX4G Design System

This is a large visual refactoring task. The approach is to make centralized changes (config file, CSS tokens, component styles) rather than touching every page individually.

## Scope Analysis

**Files using NCC-specific classes**: 26 files across layouts, pages, and components
**Hardcoded "Nairobi" references**: ~50 files including pages, data files, layouts
**NCC custom CSS classes**: ~20 defined in `src/index.css` (ncc-hero, ncc-card, ncc-btn-*, ncc-action-tile-*, ncc-nav-item, ncc-footer, etc.)

## Plan

### 1. Create a central branding config file

Create `src/lib/brandConfig.ts` containing all configurable branding strings:
- Organization name, subtitle, portal names
- Contact info (phone, email, website)
- Logo/emblem alt text
- Taglines and CTA copy

This replaces all hardcoded "Nairobi City County", "Kenya Coat of Arms", contact details, etc. across layouts and pages.

### 2. Retheme CSS tokens to UX4G palette

Update `src/index.css` to replace the Nairobi green/gold palette with UX4G's India Gov palette:

**UX4G visual identity** (from screenshots):
- Top bar: Dark/black with Indian flag, "Government of India" branding
- Navbar: White background with dark text (not colored header)
- Primary accent: Deep blue/indigo (#3F51B5 or similar)
- Secondary: Warm orange/saffron (#FF6F00)
- Clean white cards with subtle borders
- Typography: System sans-serif, clean and neutral

Token changes in `:root`:
- `--primary`: from green (145 75% 28%) to blue (230 65% 45%)
- `--secondary`: from gold (38 95% 50%) to saffron (25 100% 50%)
- `--accent`: from deep blue to a lighter blue-gray
- `--header-gradient-start/end`: remove gradients, use solid dark (#1a1a2e or similar)
- Update dark mode tokens accordingly

### 3. Restyle NCC component classes to UX4G patterns

Rename and restyle all `ncc-*` classes in `src/index.css` to `gov-*` equivalents:

| Old Class | New Class | UX4G Style |
|-----------|-----------|------------|
| `ncc-header` | `gov-header` | White/light background, dark text, bottom border |
| `ncc-accent-bar` | `gov-accent-bar` | Tricolor strip (saffron-white-green) or solid dark bar |
| `ncc-hero` | `gov-hero` | Clean blue gradient, no rounded corners |
| `ncc-card` | `gov-card` | White card, subtle shadow, square-ish corners |
| `ncc-btn-primary` | `gov-btn-primary` | Solid blue button, no hover translate |
| `ncc-btn-secondary` | `gov-btn-secondary` | Orange/saffron button |
| `ncc-nav-item` | `gov-nav-item` | Dark text on white, underline active state |
| `ncc-footer` | `gov-footer` | Dark footer, cleaner layout |
| `ncc-section-header` | `gov-section-header` | Blue left bar instead of green |
| `ncc-action-tile-*` | `gov-action-tile-*` | Lighter gradients, less dramatic hover |

### 4. Update layout components

**AppLayout.tsx and ResolverLayout.tsx**:
- Import from `brandConfig` instead of hardcoded strings
- Change header from green gradient (`ncc-header`) to white/light background with dark text (`gov-header`)
- Add a top dark bar with flag + "Government of India" style branding
- Update nav item styling to dark-on-light instead of light-on-dark
- Update footer to use brand config

### 5. Update page-level branding references

Files with hardcoded "Nairobi" text that need to use `brandConfig`:
- `src/pages/Index.tsx` - hero title, CTA text
- `src/pages/AboutMyCity.tsx` - page title, FAQ answers
- `src/pages/resolver/ResolverTraining.tsx` - training description
- `src/pages/MyTickets.tsx` - hero section
- Other pages using `ncc-*` classes: bulk find-replace to `gov-*`

### 6. Update Tailwind config

In `tailwind.config.ts`:
- Change font family from Poppins/Open Sans to a neutral stack (e.g., "Inter" or just system-ui)
- Adjust border-radius defaults (UX4G uses more squared corners)
- Update shadow tokens to be subtler

### 7. Bulk class rename across all 26 files

Simple find-and-replace of `ncc-` to `gov-` across all `.tsx` files. Since the CSS class definitions are also renamed, this is safe and non-breaking.

## Files to Edit

| File | Change Type |
|------|------------|
| `src/lib/brandConfig.ts` | **New** - central branding config |
| `src/index.css` | Major - all tokens + all component classes |
| `tailwind.config.ts` | Medium - fonts, radius, shadows |
| `src/components/layout/AppLayout.tsx` | Major - header/footer restructure + brand config |
| `src/components/layout/ResolverLayout.tsx` | Major - same |
| `src/pages/Index.tsx` | Medium - brand config + class renames |
| `src/pages/AboutMyCity.tsx` | Medium - brand references |
| `src/pages/MyTickets.tsx` | Small - class renames |
| `index.html` | Small - title, meta, font preloads |
| 20+ other `.tsx` files | Small - `ncc-` → `gov-` class rename |

## What Does NOT Change
- Routing structure
- Component props/APIs
- Business logic
- Data files (nairobiAdminData.ts etc. keep their data, just branding strings change)
- shadcn UI component internals (button.tsx, card.tsx, etc.)

