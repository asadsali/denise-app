# Denise Krohn — Investor Assessment App

Lead-generation web app for Denise Krohn, Mortgage Loan Originator at The Money Store (NMLS ID #318876).

## Local dev
```
npm install
npm run dev
```

## Deploy to Netlify (Git auto-deploy)
1. Push this folder to a GitHub repo.
2. In Netlify: **Add new site → Import an existing project → GitHub** and pick the repo.
3. Netlify reads `netlify.toml` automatically:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click **Deploy**. Every push to the main branch redeploys.
