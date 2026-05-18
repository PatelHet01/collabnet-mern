# CollabNet

Influencer marketing platform — brands post campaigns, creators apply, brands review pitches.

## Stack

- Next.js 15 (App Router, JavaScript)
- Tailwind CSS + shadcn-style components
- Supabase (Auth, Postgres, RLS)

The old Vite prototype lives in `legacy-vite/` for reference.

## Setup

1. Create a [Supabase](https://supabase.com) project.
2. Copy `.env.example` to `.env.local` and fill in your URL + anon key.
3. In the Supabase SQL editor, run migrations in order:
   - `supabase/migrations/001_initial.sql`
   - `supabase/migrations/002_phase2.sql` (messages, payouts, shortlist, roster)
   - `supabase/migrations/003_calendar_chat_pricing.sql` (calendar, scheduler, realtime chat, pricing, social metrics)

Enable **Realtime** for `messages` in Supabase → Database → Replication.
4. Under Authentication → Providers, enable Email. Turn off “Confirm email” for local dev if you want instant sign-in.
5. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo logins

Password for all: **password123**

| Role | Email |
|------|-------|
| Brand | brand@collabnet.com |
| Creator | creator@collabnet.com |
| Agency | agency@collabnet.com |
| Admin | admin@collabnet.com |

## Roles

| Role | What they can do in the MVP |
|------|-----------------------------|
| **brand** | Create campaigns, publish, review applications |
| **creator** | Browse open campaigns, apply with a pitch |
| **agency** | Dashboard shell (roster/clients stubbed) |
| **admin** | View users and platform stats |

Create an admin by signing up via SQL or setting `role` in `raw_user_meta_data` before the trigger runs — easiest path: register as brand, then update `profiles.role` to `admin` in the Supabase table editor.

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm start` — run production build
