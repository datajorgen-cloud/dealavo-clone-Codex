# PricePilot Inhouse

A self-hosted ecommerce price intelligence prototype inspired by Dealavo-style workflows: competitor price monitoring, availability and promotion tracking, rule-based repricing, AI-assisted recommendations, alerts, exports, and audit-friendly dashboards.

## What it includes

- Competitor price monitoring dashboard with market range comparisons.
- AI repricing recommendations that protect floor margin and react to inventory constraints.
- Alert inbox for low-stock and price-delta events.
- Automation rule catalog for repricing strategies.
- Inhouse architecture flow for catalog import, offer ingestion, matching, anomaly detection, repricing, and feed/API publishing.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Screenshot check

The repository includes a Playwright screenshot smoke test that targets the Vite dev server and writes `screenshots/pricepilot-home.png`. It first uses a local Chrome/Chromium executable when one is available, which avoids relying on Playwright CDN browser downloads in restricted environments.

```bash
npm run dev
# in another shell
npm run screenshot
```

If your machine does not already have Chrome or Chromium, install Playwright's managed browser once:

```bash
npx playwright install chromium
```
