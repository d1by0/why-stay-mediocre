# Aura: Personal Growth OS (Monorepo)

Aura is a premium, AI-first, offline-first Personal Growth Operating System designed for iPhone, Desktop, and Mobile Web. This repository is built as a production-grade Turborepo monorepo using `pnpm` workspaces for speed, scalability, and code reuse.

---

## 📂 Folder Structure Explanation

We employ a unified codebase approach where the web app, mobile app, and shared configurations reside in a single repository.

```
aura/
├── .github/                   # CI/CD Workflows
│   └── workflows/             # GitHub Actions configurations for linting, testing, and deployment
├── apps/                      # Primary user-facing applications
│   ├── web/                   # Next.js web application (Desktop & Mobile Web)
│   ├── mobile/                # Expo/React Native native iOS application
│   └── docs/                  # Architectural and developer documentation website
├── packages/                  # Shared internal libraries and packages
│   ├── database/              # Drizzle ORM schemas, Supabase configurations, and migrations
│   ├── ui/                    # Base Design System tokens, raw styles, and primitives
│   ├── api/                   # Shared tRPC query definitions, Zod validation logic
│   ├── ai/                    # Custom AI modules, Whisper prompts, and LLM utilities
│   ├── tsconfig/              # Centralized TypeScript compile rules
│   └── eslint-config/         # Uniform code quality and formatting rules
├── package.json               # Monorepo root package definitions
├── turbo.json                 # Turborepo task pipeline configuration
└── pnpm-workspace.yaml        # pnpm workspaces definition file
```

### 1. `apps/` (Application Layer)
- **`apps/web/`**: Powered by Next.js 14+ with App Router. Serving as our primary SEO-optimized landing page, public marketing portal, desktop dashboard, and standalone Progressive Web App (PWA). It leverages React Server Components (RSC) for lightning-fast loads.
- **`apps/mobile/`**: Built on Expo React Native. Handles hardware-level utilities like CoreMotion (activity tracking), iOS HealthKit (biometric syncing), background sync processes, and rich iOS-native haptics/widgets.
- **`apps/docs/`**: Developer documentation workspace built on Mintlify or Nextra. Useful for onboarding new engineers and exposing internal API schema details.

### 2. `packages/` (Shared Modules Layer)
- **`packages/database/`**: Defines the single source of truth for the database schema using Drizzle ORM. Houses schema files, seed files, and migrations executed via Turborepo commands.
- **`packages/ui/`**: A unified styling system holding the design tokens (colors, animations, fonts, layouts). It enables sharing design rules between Next.js (web) and Expo (mobile).
- **`packages/api/`**: The tRPC api contract. Defines type-safe procedures and validation schemas (Zod). Both `apps/web` and `apps/mobile` consume this package directly to guarantee compile-time type-safety across requests.
- **`packages/ai/`**: Abstracted logic for AI-first features. Contains utility classes for vector search embedding creation, Whisper audio processing, and system prompts.

---

## 🚀 Getting Started

1. **Prerequisites**: Ensure you have [Node.js v18+](https://nodejs.org) and [pnpm](https://pnpm.io) installed.
2. **Install Dependencies**: Run `pnpm install` in the root directory.
3. **Local Development**: Spin up all workspaces simultaneously:
   ```bash
   pnpm dev
   ```
4. **Deploy Expo**: Go to `apps/mobile` and run `npx expo start` to test on devices.
