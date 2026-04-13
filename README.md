# Empathic Memory Bench — Webapp

Interactive showcase site for the Empathic Memory Bench.

## Development

```bash
npm install
python3 scripts/prepare-data.py  # Generate data from bench results
npm run dev
```

## Build

```bash
npm run build
```

Static export goes to `out/`. Deploy anywhere that serves static files.

## Deploy to Vercel

```bash
npx vercel
```

Or connect the repo to Vercel dashboard for auto-deploy.

## Data Pipeline

`scripts/prepare-data.py` reads bench results from `../results/` and generates:
- `public/data/meta.json` — systems, judges, tests metadata
- `public/data/variance-{lang}.json` — mean +/- std across runs
- `public/data/corpus.json` — the 30-event corpus
- `public/data/runs/{lang}-{N}.json` — individual run results

Run it before building whenever bench results change.

---

Built by Nikita Shilov & Elle
