# Dealscan Brand Guide

The one source of truth for color and visual theme across the website, the
favicon/app icon, the share image, and the Remotion videos. If it ships with
the Dealscan name on it, it follows this.

## 1. The idea in one line
**Warm editorial luxury.** Bone paper, espresso ink, and a confident cognac-clay
accent say "considered, trustworthy, expensive" — the feel of high-end print and
brands like Aesop, not another cold tech-blue SaaS. Calm, warm, premium.

## 2. Core palette (locked)

| Role | Name | Hex | Use |
|---|---|---|---|
| Canvas | Warm Bone | `#FAF8F3` | Page background |
| Surface | Warm Paper | `#FFFCF6` | Cards, panels |
| Ink | Espresso | `#1C1A17` | Headlines, body, dark surfaces |
| Body | Warm Sepia | `#3A352D` | Long-form text |
| Muted | Taupe | `#8A8170` / `#6F685B` | Secondary text, captions |
| Primary accent | Cognac Clay | `#B7603A` | Buttons, links, focus, the icon |
| Secondary accent | Antique Brass | `#A98253` | Highlights, premium touches |
| Hairline | — | `rgba(28,26,23,0.14)` | Borders, dividers |

### Functional (status) colors
| Role | Hex | Use |
|---|---|---|
| Good / success | `#7E9472` (UI) · `#8FC78A` (on dark) | Good deal, green flags |
| Warning | `#C98A3C` | Caution, "proceed carefully" |
| Danger | `#C0492F` (UI) · `#D65A44` (on dark) | Red flags, "avoid", salvage |

Status colors are functional, used only on score/flag elements — never as brand
or layout color.

## 3. The two contexts
- **Light (the website, 95%):** bone/paper backgrounds, espresso text, cognac
  accents, brass for premium highlights. This is the brand.
- **Warm dark (icon, share image, footer, videos):** warm espresso ground
  (`#16130F`), cream text, cognac + amber accents. Never green, never cold —
  warm dark only.

## 4. Picture / visual theme
- **Shapes:** generous rounded corners (16–22px cards, full pills on buttons
  and nav). Soft, premium, never sharp.
- **Depth:** long, soft, warm-tinted shadows (`rgba(60,40,28,...)`), light from
  above. Never hard black drop shadows.
- **Motion:** slow, eased, organic — the scroll car, the ambient warm-light
  blooms, and video transitions all use long easings. Confident, never frantic.
- **Ambient background:** soft drifting clay/brass/amber light blooms with a
  whisper of filmic grain — present but barely-there, always moving.
- **Imagery (when used):** real used cars in honest daylight — driveways, lots,
  streets. Warm grade. Never glossy dealership stock or supercars.
- **Iconography:** single-weight cognac-on-espresso, one idea per icon. The
  magnifier ("scan") and checkmark ("verified deal") are the recurring motifs.
- **Type:** Geist (web) / Inter (video). Black weight headlines, tight display
  tracking, calm small body. High contrast between huge headers and quiet text.

## 5. Do / Don't
- DO pair cognac + brass on bone. DO keep big calm whitespace. DO use one accent
  per view.
- DON'T use green or teal as brand color (status-green only). DON'T use cold
  blues/purples. DON'T use pure black (`#000`) — use espresso. DON'T use glossy
  supercar imagery. DON'T let any surface read as "dark mode" except the
  intentional warm-dark footer/media.

## 6. Where it's enforced in code
- Website tokens: `src/app/globals.css` (`:root` and `:root[data-theme="dark"]`,
  the latter now a warm espresso dark).
- Video tokens: `src/remotion/components/theme.ts` (matched to this guide).
- Icons/share: `public/favicon.svg`, `public/dealscan-icon.svg`,
  `public/icon-*.png`, `src/app/opengraph-image.tsx`.
- Manifest: `public/manifest.json` (`theme_color` / `background_color` = bone).
