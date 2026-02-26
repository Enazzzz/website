# Portfolio Hub Website

Dark, colorful, dynamic portfolio built with Next.js App Router and Tailwind CSS.

## Features

- Creative one-page portfolio sections: Hero, About, Projects, Skills, Experience, Awards, Contact
- Project filtering tabs (Code, Design, Writing, Other)
- Dedicated `Now` page with dated updates (newest first)
- Contact form with API-backed storage
- Admin `Console` page for runtime content updates without rebuilds
- Vercel Analytics and optional Google Analytics
- App icon generated from `app/icon.tsx`

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- `@vercel/analytics`

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Content Editing (No Rebuild Path)

The app reads content from two sources:

1. **Default content files** in `data/*.ts`
2. **Runtime override content** in `data/runtime-content.json` (written by the admin console)

If runtime content exists, it overrides matching default sections.

### Edit with Files

Update any of these files:

- `data/profile.ts`
- `data/projects.ts`
- `data/skills.ts`
- `data/experience.ts`
- `data/awards.ts`
- `data/now.ts`
- `data/links.ts`

### Edit with Console

- Visit `/console`
- Edit the JSON payload
- Save changes

If `ADMIN_PASSWORD` is set, the save endpoint requires it.

## Contact Submissions Storage

Contact form submissions are currently saved to:

- `data/contact-submissions.json`

This is the chosen storage backend for now. You can swap this to Vercel KV or Postgres later via `lib/content-store.ts`.

## Environment Variables

Create `.env.local` in the project root:

```bash
# Optional: secures PUT /api/content used by /console
ADMIN_PASSWORD=your-strong-password

# Optional: enables Google Analytics in layout
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Analytics

- Vercel Analytics is enabled in `app/layout.tsx`
- Google Analytics script loads only when `NEXT_PUBLIC_GA_ID` is provided

## Deployment (Vercel)

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Add environment variables (`ADMIN_PASSWORD`, `NEXT_PUBLIC_GA_ID`) in Vercel Project Settings.
4. Deploy.

## Custom Domain (Later)

When ready:

1. Open Vercel project settings.
2. Go to **Domains**.
3. Add your domain and follow DNS instructions.

## Phase 2 Console Notes

The `/console` route currently supports full JSON-based editing for:

- Profile
- GitHub block
- Projects
- Skills
- Experience
- Awards
- Now entries
- Links

You can later replace this with field-level forms and stronger auth (magic link or OAuth) without changing the public page structure.
