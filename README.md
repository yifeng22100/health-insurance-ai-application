<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Health Insurance AI Application

A Data Science workbench that generates a 1000-record synthetic dataset with 25+ statistical features for healthcare insurance risk prediction, with AI-powered model comparison, feature selection, risk/premium prediction, and executive report generation via the Gemini API.

## Run Locally

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
