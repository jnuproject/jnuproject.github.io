# Frame files

Put full-resolution PNG frame overlays in this folder. Each photo opening should be fully transparent and enclosed by opaque frame pixels. The deployed GitHub Pages app discovers PNG files added directly to `docs/juntoism/frames`. Starting or building the source app also discovers every PNG automatically.

No configuration is required for an ordinary frame. Use `frames.json` only to set a custom name, hide the built-in frames, add a separate thumbnail, or override automatic detection:

```json
{
  "includeDefaults": false,
  "frames": [
    {
      "id": "nuolxjnu-01",
      "name": "NUOLXJNU 01",
      "file": "nuolxjnu-01.png"
    }
  ]
}
```

The app automatically creates `frame-catalog.json`, detects the four transparent photo areas, and uses the PNG dimensions as the final output size. Do not edit `frame-catalog.json` directly.

For a frame that cannot be detected, add explicit `width`, `height`, and `slots`:

```json
{
  "id": "nuolxjnu-02",
  "name": "NUOLXJNU 02",
  "file": "nuolxjnu-02.png",
  "width": 2400,
  "height": 3600,
  "slots": [
    { "x": 120, "y": 180, "width": 1020, "height": 1450 },
    { "x": 1260, "y": 180, "width": 1020, "height": 1450 },
    { "x": 120, "y": 1810, "width": 1020, "height": 1450 },
    { "x": 1260, "y": 1810, "width": 1020, "height": 1450 }
  ]
}
```
