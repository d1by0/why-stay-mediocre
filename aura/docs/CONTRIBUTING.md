# Contributing Guidelines for Aura

Welcome, Engineer! Aura is engineered with production-grade reliability and high-speed monorepo standards. Follow these practices to contribute.

---

## 🛠️ Local Setup

1. **Clone & Workspace Entry**:
   ```bash
   git clone <repo-url> why-stay-mediocre
   cd why-stay-mediocre/aura
   ```
2. **Pnpm Workspaces**:
   Make sure you use `pnpm` exclusively (npm/yarn lockfiles are restricted).
   ```bash
   pnpm install
   ```
3. **Running the Pipeline**:
   Start development servers using Turborepo:
   ```bash
   pnpm dev
   ```

---

## 🚦 Branching & Commits

We follow standard Semantic Commits rules (`types: description`):
- `feat`: Unlocking a new capability (e.g., `feat(mobile): add healthkit listener`).
- `fix`: Patching an error (e.g., `fix(api): rate-limit headers missing`).
- `docs`: Modifying markdown (e.g., `docs(schema): describe indexing rules`).
- `chore`: Modifying build systems, lockfiles, package configurations.

---

## 🔒 Pull Request (PR) Quality Gates

Before merging, all PRs must successfully pass:
1. **Type Checking**:
   ```bash
   pnpm tscheck
   ```
2. **ESLint / Prettier Formatting**:
   ```bash
   pnpm lint
   ```
3. **Unit & Integration Tests**:
   ```bash
   pnpm test
   ```
4. **Code Review**: At least one Technical Architect approval is required.
