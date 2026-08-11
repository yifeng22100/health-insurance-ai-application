# 🛡️ HealthInsureAI

**AI-powered underwriting intelligence** — a data science workbench for exploring how machine learning and
generative AI can support health insurance underwriting. Generate a synthetic patient portfolio, benchmark
ML/DL models against it, and get AI-generated risk classifications, premium forecasts, and underwriting
reports via the Gemini API.

Part of the same toolkit as [Healthcare Intelligence](https://yifeng22100.github.io/hospital-intelligence-my/#/),
a companion project for hospital discovery and health knowledge.

## What's inside

| Page | What it does |
|---|---|
| **Dataset Explorer** | Generates a synthetic portfolio (1k–10k records, 25+ statistical features) and lets you browse, search, and filter it. |
| **Visual Insights** | Portfolio KPIs, a 3D risk-cluster plot, a feature correlation matrix, a premium hierarchy sunburst, and condition cost impact. |
| **AutoML Lab** | Benchmarks 8 ML/DL algorithms against the dataset and surfaces the most predictive features, via Gemini. |
| **Risk Predictor** | Real-time High/Low risk classification with AI-generated reasoning for a single patient profile. |
| **Cost Forecaster** | Actuarial premium estimation with a 5-year cost projection. |
| **Report Generator** | Combines risk + cost analysis into a print-ready underwriting report. |
| **Health Tips** | Original guides on how premiums are priced, what BMI/lab values mean, and how to read the AI outputs above. |

All AI features are clearly labelled as AI-generated estimates on synthetic data — see the **About** page in
the app for the full disclaimer.

## Run locally

**Prerequisites:** Node.js 20+

1. Install dependencies:
   ```
   npm install
   ```
2. Copy [.env.local.example](.env.local.example) to `.env.local` and set `GEMINI_API_KEY` to your Gemini API key ([get one here](https://ai.google.dev/gemini-api/docs/api-key)):
   ```
   cp .env.local.example .env.local
   ```
3. Run the app:
   ```
   npm run dev
   ```

## Build

```
npm run build
```

The production build is output to `dist/`. Preview it locally with `npm run preview`.

## Deploying on GitHub

This repo includes a [GitHub Actions workflow](.github/workflows/deploy.yml) that builds the app and publishes it to **GitHub Pages** on every push to `main`.

To enable it:

1. In the repository settings, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. In **Settings → Secrets and variables → Actions**, add a repository secret named `GEMINI_API_KEY` with your Gemini API key.
3. Push to `main` (or run the workflow manually from the **Actions** tab). The app will be published at `https://<owner>.github.io/<repo>/`.

Because this is a client-side-only app, the `GEMINI_API_KEY` ends up bundled into the built JavaScript that ships to the browser. Don't deploy this app publicly with a key that has billing enabled unless you're comfortable with that exposure — for a production deployment, proxy Gemini API calls through a backend instead.

Alternatively, you can deploy the contents of `dist/` (after running `npm run build`) to any static host, such as Vercel, Netlify, or Cloudflare Pages.

## Stack

React 19 + TypeScript + Vite, Tailwind CSS, Recharts + Plotly for visualization, React Router (hash-based, so
it works on static hosts like GitHub Pages without server rewrites), and the Gemini API for every AI-generated
feature.
