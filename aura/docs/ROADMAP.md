# Aura: Phased Development Roadmap

This document outlines the multi-stage implementation strategy for Aura. To keep speed high and risk low, each milestone represents an independently testable and deployable release phase.

---

## 🗺️ Milestone Summary

```mermaid
gantt
    title Aura OS Release Schedule
    dateFormat  YYYY-MM-DD
    section Backend & Core
    M1: Core Identity Setup :active, m1, 2026-07-03, 10d
    M2: DB & API Workspace : m2, after m1, 14d
    section Core Features
    M3: Growth Foundations : m3, after m2, 14d
    M4: Workout Engine & HealthKit : m4, after m3, 21d
    section AI & Social
    M5: AI Hub & Community Sync : m5, after m4, 21d
```

---

## 📌 Milestones Specification

### 🚀 Milestone 1: Core Foundation & Identity Sync
Setup the monorepo scaffold, absolute styling primitives, and Clerk Auth synchronization.
- **Scope**:
  - Root workspace configuration (Turborepo + pnpm workspaces).
  - Web landing page setup (Next.js scaffold) + App Router layout.
  - Native Mobile application scaffold (Expo).
  - Clerk Authentication setup (Web OAuth, native sign-in hooks, Guest Mode local storage).
  - Clerk synchronization webhook (`/api/webhooks/clerk`).
- **Complexity**: Low (5 Story Points).
- **Dependencies**: None.
- **Deployability**: Independently deployable to Vercel (Web) and Expo EAS (Mobile) to test sign-ins on staging.

### 🗄️ Milestone 2: Database Layer & tRPC API
Instantiate the schema tables, migrations runner, database connection pooling, and the type-safe tRPC client queries.
- **Scope**:
  - Supabase database configuration and connection.
  - Drizzle ORM setup inside `packages/database`, migration files generation.
  - Setup unified tRPC route handlers (`packages/api`) with Zod schemas.
  - Enforce PostgreSQL Row Level Security (RLS) policies.
  - Verification endpoint integration tests.
- **Complexity**: Medium (8 Story Points).
- **Dependencies**: Milestone 1.
- **Deployability**: Migration files run on Supabase staging; API endpoints tested using Vitest runner in CI/CD pipeline.

### ⚡ Milestone 3: Personal Growth Core (Habits, Water, Sleep)
Build out the primary biometrics recording screens, habit checking, and circadian rhythm inputs.
- **Scope**:
  - Dashboard screen layout (Daily Aura Score calculation).
  - Habits log interface (Checkmark triggers, swipe actions, streak counts calculations).
  - Circadian rhythm sleep dial & water intake filling animation (Design System components).
  - Local sync pipeline (persist metrics in SQLite / LocalStorage, sync to Postgres in background via TanStack Query).
- **Complexity**: High (13 Story Points).
- **Dependencies**: Milestone 2.
- **Deployability**: Unlocked on production web & native apps as a beta habit-tracker app.

### 🏋️ Milestone 4: Strong-style Workout Logger & Native Sensors
Implement the physical set logger, custom exercises directories, rest timers, and iOS HealthKit sync.
- **Scope**:
  - Exercises library database search & filter.
  - Workout logging sheet (weight, reps, RPE checkmarks).
  - Rest timer (SF Pro Mono tabular-nums counting down) with native background alarms.
  - iOS HealthKit integration module inside `apps/mobile` (submitting active steps, calories, heart rate).
  - Custom SVG Victory charts showing workout volume progress.
- **Complexity**: Very High (21 Story Points).
- **Dependencies**: Milestone 3.
- **Deployability**: Released to Apple TestFlight for user beta workout tracking.

### 🧠 Milestone 5: Voice Recognition Engine & Social Feeds
Inject AI-first capabilities (speech transcription, intent extraction, semantic search history) and community integrations.
- **Scope**:
  - Whisper audio streaming API integration (Cloudflare R2 presigned uploads).
  - Vercel AI SDK intent extraction pipeline (Structured LLM queries).
  - Vector embeddings generation (`pgvector` hnsw cosine search).
  - Community stream feed (real-time high-fives via WebSockets).
  - AI Weekly Growth Coach reports compilation.
- **Complexity**: Very High (21 Story Points).
- **Dependencies**: Milestone 4.
- **Deployability**: Complete product launch. Premium paywall testing enabled via Stripe webhooks.
