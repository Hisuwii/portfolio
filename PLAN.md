# Portfolio + Chat System — Implementation Plan

## Overview

A personal portfolio website with a real-time chat system for client interaction. When the owner is inactive/offline, an AI (Gemini) automatically replies on their behalf using a personalized system prompt. Entire stack is free to host and run.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 14 (App Router) + TypeScript | SSR/SEO, API routes, React Server Components |
| Styling | Tailwind CSS + shadcn/ui | Utility-first design system, owned components |
| Animations | Framer Motion | Page transitions, scroll reveals, hover effects |
| Real-time | Supabase Realtime | Built-in WebSocket subscriptions — no extra service needed |
| Database | Supabase (PostgreSQL) | Messages, contacts, owner presence storage |
| AI Auto-Reply | Google Gemini API (gemini-1.5-flash) | Free tier, fast, capable enough for chat auto-replies |
| Admin Auth | NextAuth.js v5 (credentials) | Protects /admin dashboard — single owner, no OAuth needed |
| Hosting | Vercel (Hobby plan) | Zero-config Next.js deployment, free tier sufficient |

### Why this is $0

| Service | Free Tier Limit | Portfolio Usage |
|---|---|---|
| Vercel Hobby | 100GB bandwidth, 100k function calls/month | Well within limits |
| Supabase | 500MB DB, 2GB bandwidth, 50k Realtime messages/month | Well within limits |
| Gemini 1.5 Flash | 15 RPM, 1M tokens/day, 1500 req/day | More than enough |
| NextAuth | Free (open source) | — |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│                                                         │
│   Portfolio Pages    Chat Widget    Admin Dashboard     │
│   (/, /about, etc.)  (floating)     (/admin)            │
└──────────┬───────────────┬─────────────┬────────────────┘
           │               │             │
           ▼               ▼             ▼
┌──────────────────────────────────────────────────────────┐
│                   Next.js (Vercel)                       │
│                                                          │
│  App Router Pages    API Routes                          │
│  - Static portfolio  - /api/chat/send                    │
│  - RSC data fetch    - /api/chat/history                 │
│  - Admin UI          - /api/presence/heartbeat           │
│                      - /api/contact                      │
│                      - /api/health                       │
└──────────────────────┬───────────────────────────────────┘
                       │
              ┌────────▼────────┐
              │    Supabase     │
              │                 │
              │  messages       │◄──── Realtime subscriptions
              │  contacts       │      (replaces Pusher)
              │  owner_presence │
              │                 │
              └────────┬────────┘
                       │ (owner offline check)
                       ▼
              ┌────────────────┐
              │  Gemini API    │
              │  (1.5 Flash)   │
              │  Auto-reply    │
              └────────────────┘
```

---

## Chat + AI Message Flow

```
Visitor sends message
        │
        ▼
 /api/chat/send
        │
        ├── 1. Save message to Supabase
        │
        ├── 2. Supabase Realtime broadcasts to all subscribers automatically
        │
        ├── 3. Check owner_presence table
        │
        ├─ ONLINE ──► Owner sees message in /admin via Realtime subscription
        │              Owner replies ──► saved to Supabase ──► Realtime ──► Visitor
        │
        └─ OFFLINE ──► Gemini API (system prompt = owner persona)
                           │
                           └──► AI reply saved to Supabase
                                    │
                                    └──► Supabase Realtime ──► Visitor sees reply
```

**Owner presence** is tracked via a heartbeat component mounted on `/admin`. Every 60 seconds it pings `/api/presence/heartbeat`. If no heartbeat is received for 2 minutes (`PRESENCE_TIMEOUT_MS=120000`), the owner is marked offline and Gemini auto-reply activates.

---

## Project File Structure

```
web-port/
├── app/
│   ├── (portfolio)/
│   │   ├── page.tsx                    # Hero / landing section
│   │   ├── about/page.tsx              # About me
│   │   ├── projects/page.tsx           # Project showcase
│   │   ├── skills/page.tsx             # Skills section
│   │   └── contact/page.tsx            # Contact form
│   ├── admin/
│   │   ├── page.tsx                    # Owner real-time chat dashboard
│   │   └── layout.tsx                  # Auth-protected layout
│   ├── api/
│   │   ├── chat/
│   │   │   ├── send/route.ts           # POST: save msg → presence check → Gemini if offline
│   │   │   └── history/route.ts        # GET: fetch message history for a session
│   │   ├── presence/
│   │   │   └── heartbeat/route.ts      # POST: update owner online timestamp
│   │   ├── contact/route.ts            # POST: save contact form submission
│   │   └── health/route.ts             # GET: keepalive ping for Supabase (Vercel cron)
│   ├── layout.tsx                      # Root layout — fonts, metadata, global providers
│   └── globals.css
│
├── components/
│   ├── ui/                             # shadcn/ui components (copied into repo, not a dep)
│   ├── portfolio/
│   │   ├── Hero.tsx                    # Animated hero section
│   │   ├── ProjectCard.tsx             # Individual project card with hover effects
│   │   ├── SkillBadge.tsx              # Skill pill/badge component
│   │   └── ContactForm.tsx             # Contact form with validation
│   ├── chat/
│   │   ├── ChatWidget.tsx              # Floating chat bubble (visitor-facing)
│   │   ├── ChatWindow.tsx              # Expanded message thread UI
│   │   ├── MessageBubble.tsx           # Individual message (visitor vs owner/AI styled differently)
│   │   └── TypingIndicator.tsx         # Animated dots while AI or owner is typing
│   └── admin/
│       ├── AdminChatPanel.tsx          # Owner's real-time inbox — all visitor sessions
│       └── PresenceHeartbeat.tsx       # Client component — pings heartbeat API every 60s
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # Browser Supabase client (anon key)
│   │   └── server.ts                   # Server Supabase client (service role key)
│   ├── gemini.ts                       # Google Generative AI SDK wrapper + owner persona system prompt
│   └── presence.ts                     # Helper: check if owner is online based on last heartbeat
│
├── hooks/
│   ├── useChat.ts                      # Supabase Realtime subscription + message state
│   └── usePresence.ts                  # Reactive owner online/offline status
│
├── types/
│   └── index.ts                        # Shared types: Message, Presence, Project, Skill, Contact
│
├── content/
│   ├── projects.ts                     # Your project data (static, type-safe array)
│   └── skills.ts                       # Your skills data (static, type-safe array)
│
├── public/
│   ├── images/                         # Profile photo, project screenshots
│   └── og-image.png                    # Open Graph preview image for social sharing
│
├── .env.local                          # All secrets — never committed to git
├── .env.example                        # Template showing required env var names (no values)
├── middleware.ts                       # NextAuth middleware — protects /admin route
├── auth.ts                             # NextAuth config (credentials provider)
├── vercel.json                         # Vercel cron job config for Supabase keepalive
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── PLAN.md                             # This file
└── package.json
```

> **Note:** `lib/pusher/` is removed entirely. Supabase Realtime handles all live updates — no extra SDK or service needed.

---

## Supabase Database Schema

```sql
-- Stores all chat messages (visitor and owner/AI replies)
create table messages (
  id uuid default gen_random_uuid() primary key,
  session_id text not null,           -- groups messages by visitor session
  role text not null,                 -- 'visitor' | 'owner' | 'ai'
  content text not null,
  created_at timestamptz default now()
);

-- Enable Realtime on the messages table
alter publication supabase_realtime add table messages;

-- Tracks owner online/offline status via heartbeat
create table owner_presence (
  id int primary key default 1,       -- single row, always id=1
  status text not null default 'offline',   -- 'online' | 'away' | 'offline'
  last_seen timestamptz default now()
);

-- Stores contact form submissions
create table contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

-- Seed the owner_presence row
insert into owner_presence (id, status) values (1, 'offline');
```

---

## Environment Variables

All go in `.env.local` — never commit this file.

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Google Gemini
GEMINI_API_KEY=              # Get from https://aistudio.google.com/apikey (free)

# NextAuth
NEXTAUTH_SECRET=             # generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
ADMIN_PASSWORD=              # your hashed password for /admin login

# Presence config
PRESENCE_TIMEOUT_MS=120000   # 2 minutes before marked offline
```

---

## Vercel Cron (Supabase Keepalive)

Supabase free tier pauses after 7 days of inactivity. Add this to `vercel.json` to ping it every 3 days:

```json
{
  "crons": [
    {
      "path": "/api/health",
      "schedule": "0 0 */3 * *"
    }
  ]
}
```

The `/api/health` route does a simple Supabase query to keep the project active.

---

## Implementation Phases

### Phase 1 — Foundation
- [ ] `npx create-next-app@latest . --typescript --tailwind --app`
- [ ] Install shadcn/ui (`npx shadcn@latest init`)
- [ ] Install Framer Motion (`npm install framer-motion`)
- [ ] Install Supabase JS (`npm install @supabase/supabase-js`)
- [ ] Install Google Generative AI SDK (`npm install @google/generative-ai`)
- [ ] Set up Supabase project → run schema SQL above
- [ ] Get Gemini API key from Google AI Studio (free, no card needed)
- [ ] Configure `.env.local`

### Phase 2 — Portfolio Pages
- [ ] Build Hero section with Framer Motion entrance animation
- [ ] Build Projects page with `ProjectCard` components
- [ ] Build About and Skills pages
- [ ] Build Contact page with form → `/api/contact`
- [ ] Ensure fully responsive (mobile-first)

### Phase 3 — Chat Core
- [ ] Build `ChatWidget` floating button + `ChatWindow` UI
- [ ] Build `/api/chat/send` and `/api/chat/history` API routes
- [ ] Build `useChat` hook with Supabase Realtime subscription
- [ ] Test: visitor sends message → saved to Supabase → Realtime delivers to subscriber

### Phase 4 — Admin Panel
- [ ] Configure NextAuth with credentials provider in `auth.ts`
- [ ] Add `middleware.ts` to protect `/admin`
- [ ] Build `AdminChatPanel` — lists sessions, shows messages, reply input
- [ ] Build `PresenceHeartbeat` — client component pinging heartbeat every 60s
- [ ] Test: owner logs in → marked online → receives visitor message in real time

### Phase 5 — AI Auto-Reply
- [ ] Build `lib/gemini.ts` — Google Generative AI SDK + system prompt defining owner persona
- [ ] Add offline detection logic to `/api/chat/send`
- [ ] Add typing indicator delay (~1.5s before AI reply for natural UX)
- [ ] Test end-to-end: visitor messages → owner offline → Gemini replies
- [ ] Tune the system prompt

### Phase 6 — Polish + Deploy
- [ ] SEO metadata (title, description, Open Graph) in `app/layout.tsx`
- [ ] Generate og-image.png
- [ ] Add `vercel.json` with cron job for Supabase keepalive
- [ ] Deploy to Vercel → set all environment variables
- [ ] Lighthouse audit — target 90+ on all metrics
- [ ] Test on mobile devices

---

## Key Design Decisions & Trade-offs

| Decision | Why | Trade-off |
|---|---|---|
| Supabase Realtime over Pusher | Already included in Supabase free tier — one less service | 50k messages/month limit, but plenty for a portfolio |
| Gemini 1.5 Flash over Claude/GPT | Free tier with no credit card required | Rate limited to 15 RPM — fine for a portfolio, not for high traffic |
| Next.js over plain React | SSR is critical for portfolio SEO | Slightly more setup than Vite+React, but Vercel makes deployment trivial |
| Supabase over Firebase | SQL is more flexible, Realtime is built-in, free tier is more generous | Pauses after 7 days inactivity — mitigated by keepalive cron |
| Credentials auth, not OAuth | Single owner, OAuth adds unnecessary complexity | Less secure than OAuth if password is weak — use a strong one |
| shadcn/ui over MUI/Chakra | No runtime library overhead, components live in your repo | More setup upfront, but fully customizable |
| Content in `.ts` files | Type-safe, no CMS needed for a portfolio | Requires a redeploy to update project/skill data |

---

## Gemini System Prompt Template (lib/gemini.ts)

The system prompt defines how Gemini represents you when you're offline. Customize thoroughly.

```
You are an AI assistant representing [YOUR NAME], a [YOUR ROLE/TITLE].
You are responding to potential clients and collaborators who have reached out via the portfolio chat.

About [YOUR NAME]:
- [Brief bio — 2-3 sentences]
- Skills: [list your main skills]
- Currently available for: [freelance / full-time / specific project types]
- Based in: [your location/timezone]
- Typical response time when online: [e.g., within a few hours]

Your behavior:
- Be warm, professional, and conversational
- Answer questions about skills, availability, and past work accurately
- For specific project quotes or detailed requirements, encourage them to email [YOUR EMAIL] or leave their contact info
- Never make commitments on behalf of [YOUR NAME] (pricing, deadlines, etc.)
- If you don't know something, say so and suggest they wait for a direct reply
- Keep replies concise — 2-4 sentences unless more detail is clearly needed
- Always mention that [YOUR NAME] will follow up personally when they're back online
```

---

## Notes

- The `/admin` page is the owner's command center — keep it open in a browser tab while working to stay marked "online"
- Chat sessions are identified by a `session_id` (UUID generated client-side on first message, stored in `localStorage`)
- The `TypingIndicator` component should show for ~1.5s before the AI reply appears (more natural UX)
- Supabase Realtime channel: subscribe to `messages` table filtered by `session_id` so each visitor only gets their own messages
- Gemini API key is obtained free from Google AI Studio — no credit card required
