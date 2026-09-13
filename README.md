# Violin Portfolio

Next.js portfolio based on `violin-portfolio-mockup.html`.

## Setup

Use Node 20+ (`nvm use`).

```bash
npm install
npm run compress:violin
npm run dev
```

## Audio

Add recordings to `public/audio/` and keep the filenames in `lib/works.ts`. Until those files exist, play controls stay wired but will not fake playback.

## Email

Copy `.env.example` to `.env.local` and set `RESEND_API_KEY`, `CONTACT_TO`, and `CONTACT_FROM`.

The violin model is by [BlakkMato / Sketchfab](https://sketchfab.com/3d-models/violin-fed2fac6be1a4e0ea225bd9001e88a79), CC-BY-4.0. Keep `assets/violin.glb` as the uncompressed source.
