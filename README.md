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

### Edit with Console (local only)

The **console is only available when you run the app locally.** On Vercel, `/console` returns 404 so the admin UI is never exposed in production.

1. Run the app locally (`npm run dev`).
2. Open `http://localhost:3000/console`.
3. Edit sections and click **Save changes** (writes to `data/runtime-content.json`).
4. Commit `data/runtime-content.json` and deploy. The live site will use that content.

If `ADMIN_PASSWORD` is set in `.env.local`, the console (and save endpoint) require it.

## Contact Submissions Storage

Contact form submissions are saved to:

- **With KV:** When `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set, submissions go to the same Redis store as console content (key `contact-submissions`).
- **Without KV:** `data/contact-submissions.json` (e.g. local development).

## Console and saving

- **Locally:** The console is available at `/console`. Saving writes to `data/runtime-content.json` (and the contact form to `data/contact-submissions.json`). You can commit that file and deploy so the live site uses your edits—no KV needed.
- **On Vercel:** `/console` is **hidden** (404). The app detects `VERCEL` and only serves the console when running locally, so the admin UI is never exposed in production. If you later want to edit from production, add a Redis store (see env vars) and you’d need to change the layout to allow console on Vercel when KV is set; for most use cases, editing locally and committing is simpler and safer.

## Environment Variables

Create `.env.local` in the project root:

```bash
# Optional: secures PUT /api/content used by /console
ADMIN_PASSWORD=your-strong-password

# Optional: enables Google Analytics in layout
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Set automatically when you add a Redis store in Vercel (Storage/Integrations). Needed for console saving and contact form storage on Vercel.
# KV_REST_API_URL=
# KV_REST_API_TOKEN=
```

## Analytics

- Vercel Analytics is enabled in `app/layout.tsx`
- Google Analytics script loads only when `NEXT_PUBLIC_GA_ID` is provided

## Deployment (Vercel)

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Add environment variables (`ADMIN_PASSWORD`, `NEXT_PUBLIC_GA_ID`) in Vercel Project Settings.
4. (Optional) Add a Redis store (e.g. Upstash Redis) in Vercel so the console and contact form can save in production; Vercel will set `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
5. Deploy.

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
