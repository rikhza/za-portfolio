# za-portfolio

Portfolio website milik Muhammad Rikhza Maulana — system architect & backend developer.

## Tech Stack

- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **3D / WebGL**: React Three Fiber + Three.js + Drei
- **UI Components**: shadcn/ui (via components.json)
- **Package Manager**: Bun

## Project Structure

```
src/
  App.tsx              # Main app — intro screen, custom cursor, layout, project modal
  index.css            # Global styles, custom keyframes, fonts
  main.tsx             # Entry point
  components/
    InfiniteGallery.tsx  # Core 3D infinite tunnel gallery (WebGL, custom shader)
    ui/                  # shadcn/ui components (mostly unused, available if needed)
  hooks/
    use-mobile.ts
    use-toast.ts
  lib/
    utils.ts
public/
  *.webp               # Project screenshot images (1-rikhza to 6-cjdb)
```

## Dev Commands

```bash
bun run dev       # Start dev server
bun run build     # Production build
bun run preview   # Preview production build
```

## Key Components

### `IntroScreen`
Cinematic opening splash — renders "RIKHZA" letter-by-letter with stagger animation, then slides out after ~2.3s. Gallery loads in background during intro.

### `CustomCursor`
Custom cursor (desktop only): small dot at exact mouse position + lagging ring using `requestAnimationFrame` lerp. Uses `mix-blend-mode: difference`.

### `InfiniteGallery`
WebGL 3D tunnel with custom GLSL shader (`createClothMaterial`). Features:
- Infinite scroll (mouse wheel / touch / keyboard)
- Auto-play (resumes 3s after last interaction)
- Per-image hover: flag-wave vertex distortion + warm spotlight
- Parallax from mouse movement
- Responsive scale based on viewport width
- Fallback grid for non-WebGL environments

### Project Modal
Click any image → modal with project image, description, tech stack badges (icons from `cdn.simpleicons.org`), and links.

## Notes

- Fonts loaded via `@font-face` from Google Fonts: **Geist Mono** + **Instrument Serif**
- `mix-blend-mode: exclusion` on main text overlay for visual layering with gallery
- `cursor-none` applied on `md:` breakpoint (desktop) for custom cursor
- Images in `/public` are `.webp` named sequentially `1-` through `6-`
