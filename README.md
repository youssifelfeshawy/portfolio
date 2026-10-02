# Youssef Wael Elfeshawy — Portfolio

A scroll-driven 3D portfolio. Scrolling flies the camera from the server rack to the laptop screen
(Journey, Qualifications, Documentation, Projects), then tilts down onto the keyboard, whose keys are the contact links.
`network.html` is the full networking guide (opened from the Documentation page).

## Run locally
```bash
python -m http.server 8000
# open http://localhost:8000
```
(Open it through a local server, not by double-clicking the file, so the 3D model can load.)

## Files
- `index.html`, `style.css`, `script.js` — the portfolio
- `network.html`, `documentation.css`, `network.js` — the networking guide
- `assets/models/Server.glb` — 3D model (textures compressed)
- `assets/console-keyboard.jpg` — keyboard texture (the key positions in `script.js` match this image)
- `assets/vendor/` — three.js, GLTFLoader, GSAP + ScrollTrigger (local copies)

## Editing content
All text lives at the top of `script.js` (`C`, `ABOUT`, `CARDS`, `TIMELINE`, `PROJECTS`).
