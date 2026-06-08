# DealScan Remotion Promo

Composition:
- `DealScanPromo`
- 3840x2160
- 60 FPS
- 3600 frames, 60 seconds

Commands:
- `npm run remotion:studio` opens Remotion Studio.
- `npm run remotion:preview` renders a 25% scale preview to `out/dealscan-promo-preview.mp4`.
- `npm run remotion:render` renders the final 4K video to `out/dealscan-promo-4k.mp4`.

Audio:
- The video renders silently by default.
- To add local music later, place a file under `public/remotion-assets/` and pass a `musicFile` prop such as `remotion-assets/music.mp3`.
