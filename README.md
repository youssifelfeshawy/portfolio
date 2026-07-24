# Youssif Elfeshawy — Portfolio + Full Network Documentation

This version corrects the previous documentation page.

## Corrected items

- The focus strip has no top or bottom separator line.
- The complete DOCX content is included instead of a shortened summary.
- Every source paragraph, command, note, figure description, and table is rendered.
- STP is reordered as requested.
- The two IP/MAC statements are merged.
- OSPF is reordered, its duplicate Neighbor States block is removed, and the DR/BDR heading is shortened.
- The OSI model is a large clickable illustration.
- Clicking Layers 1–3 opens the full corresponding chapters.
- Clicking Layers 4–7 opens their original explanation sections on the same page.

## Main files

- `index.html` — portfolio
- `knowledge.html` — knowledge landing page
- `network.html` — complete network documentation
- `network.css` — documentation styling
- `network.js` — navigation and clickable-layer behavior
- `data/network-full.json` — complete revised document data

## Preview

```bash
cd youssif-portfolio-network-docs-full
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```
