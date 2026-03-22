# Design System Strategy: The Elevated Concierge

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Atelier."** 

In a luxury hospitality context like Muong Thanh, the interface must mirror the physical experience of a high-end lobby: expansive, quiet, and meticulously curated. We are moving away from the "busy" SaaS template characterized by cluttered grids and harsh borders. Instead, we use **Atmospheric Depth** and **Editorial Spacing** to create a sense of calm authority. This system breaks the mold by treating the dashboard not as a data dump, but as a series of sophisticated, layered surfaces that guide the eye through intentional asymmetry and tonal transitions.

## 2. Colors & The Surface Philosophy
The palette is grounded in a "Quiet Luxury" aesthetic, using a spectrum of greys to define space, while using Navy (`secondary`) for stability and Orange (`primary`) for high-intent energy.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to section off content. 
Structure is defined through background shifts. A `surface-container-low` (#f3f4f5) section should sit on a `background` (#f8f9fa) to create a soft, edge-less boundary. This mimics the way natural light hits a physical surface.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper. Use the following logic for nesting:
*   **Base Level:** `background` (#f8f9fa).
*   **Section Level:** `surface-container-low` (#f3f4f5).
*   **Card/Interactive Level:** `surface-container-lowest` (#ffffff).
*   **Active/Pop-over Level:** `surface-container-high` (#e7e8e9).

### The "Glass & Gradient" Rule
To inject "soul" into the admin experience:
*   **Glassmorphism:** Use `surface-container-lowest` at 80% opacity with a 20px `backdrop-blur` for floating navigation bars or filter drawers. 
*   **Signature Textures:** Main Action CTAs should not be flat. Apply a subtle linear gradient from `primary` (#904d00) to `primary_container` (#ff8c00) at a 135-degree angle to provide a tactile, "clickable" depth.

## 3. Typography: The Editorial Voice
We use a dual-font strategy to balance character with utility.

*   **Display & Headlines (Manrope):** This geometric sans-serif acts as our "Host." Use `display-md` and `headline-lg` for page titles and key metrics. The wide apertures of Manrope feel modern and welcoming.
*   **Body & Labels (Inter):** The "Workhorse." Inter provides maximum legibility for staff management tables and form fields.
*   **Hierarchy Tip:** Contrast a `headline-sm` title in `on_surface` (#191c1d) with a `label-md` description in `on_tertiary_container` (#3d3f41) to create an immediate visual "hook."

## 4. Elevation & Depth
We eschew traditional "box-shadow" presets in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by placing a `surface-container-lowest` card on a `surface-container` background. The slight delta in hex value creates enough contrast for the human eye without the "muddy" look of heavy shadows.
*   **Ambient Shadows:** For "Floating" elements (Modals/Dropdowns), use a shadow: `0px 12px 32px rgba(25, 28, 29, 0.04)`. The color is a tinted version of `on_surface` to mimic real-world ambient occlusion.
*   **The "Ghost Border":** If a separation is absolutely required for accessibility, use the `outline_variant` (#ddc1ae) at **15% opacity**. It should be felt, not seen.

## 5. Components & Primitives

### Buttons (The Interaction Core)
*   **Primary:** Gradient of `primary` to `primary_container`. Corner radius: `full`. These are for "Add Staff" or "Confirm."
*   **Secondary:** `secondary` (#435b9f) with `on_secondary` (#ffffff) text. Use for navigational actions.
*   **Tertiary:** Transparent background with `secondary` text. Used for "Cancel" or "Dismiss."

### Cards & Staff Profiles
*   **Rule:** Forbid divider lines within cards. 
*   **Layout:** Use the Spacing Scale `spacing-6` (1.5rem) to separate content blocks. If you need to group data, use a subtle background fill of `surface-container-lowest` against the card's `surface-container-low`.

### Inputs & Form Fields
*   **Surface:** `surface_container_highest` (#e1e3e4).
*   **Shape:** `rounded-md` (0.75rem).
*   **Active State:** Instead of a thick border, use a 2px outer glow of `primary_fixed` (#ffdcc3) to indicate focus.

### Additional Luxury Components
*   **Status Orbs:** Instead of "Active/Inactive" text labels, use a glowing soft-pill with a 10% opacity background of the status color (e.g., `primary_container` for "On Duty") and a solid 6px dot.
*   **Metric Marquees:** For hotel occupancy or staff KPIs, use `display-sm` type with `spacing-px` letter spacing to create a high-fashion, editorial feel.

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins. A wider left margin on a page title creates an "editorial" entry point.
*   **Do** use `rounded-xl` (1.5rem) for large container elements to soften the SaaS "enterprise" feel.
*   **Do** leverage the `on_surface_variant` (#564334) for secondary metadata to keep the interface from looking too heavy.

### Don't
*   **Don't** use pure black (#000000) for text. Always use `on_surface` (#191c1d).
*   **Don't** use 1px dividers to separate list items. Use 12px of vertical `spacing-3` and a hover state transition to `surface_bright`.
*   **Don't** cram data. If a table has more than 8 columns, use a horizontal "peek" and a subtle `surface_dim` gradient on the right edge to indicate more content.