# Aura: Unified Ambient AI Gym, Habit, and P2P Social Ecosystem

Aura is a cohesive, premium iOS application designed to eliminate user experience friction in tracking physical and mental optimization metrics. By integrating ambient voice logging, smart progressive overload tracking, automated habit checks, and offline synchronization into a minimalist visual interface, Aura replaces manual spreadsheet tracking with a responsive mobile workspace.

---

## Ideation and Vision

The tracking of physical and mental optimization metrics suffers from severe friction, forcing dedicated athletes and wellness-focused individuals to toggle between complex, disconnected apps, notes, and spreadsheets. Aura resolves this by offering a premium, local-first ambient experience. 

Instead of typing numbers on a gym floor or checking off boxes in a calendar, users log their entire day simply by speaking naturally. The system handles voice overrides, calculates training fatigue, recommends the next steps in weight progression, and synchronizes with training partners.

---

## Target Audience: Who is this for?

Aura is designed for:
1. **Dedicated Athletes & Strength Trainers:** Who require structured progressive overload models, fatigue calculations (Muscular Load Coefficient), and automatic weight suggestions.
2. **Quantified-Self Enthusiasts:** Who track multiple daily biometrics (hydration, sleep, steps, reading habits, journaling) and want their metrics aggregated in one place.
3. **Privacy-Focused Individuals:** Who do not want their personal data, journals, or location information sent to external servers or cloud providers.
4. **Offline Collaborators:** Training partners and small groups who want to synchronize workouts and check-ins.

---

## Technical Stack & Architecture

Aura is built on a modern mobile development stack for Windows and iOS:

### 1. Framework & Core Technologies
- **React Native + Expo:** Cross-platform framework enabling native iOS runtime and fast Windows-based development loops.
- **TypeScript:** Enforces type safety across components and business logic.
- **Expo Router:** Structured file-based navigation flow.

### 2. State & Styling
- **Zustand:** Light and responsive global state management.
- **NativeWind (Tailwind):** Utility-first styling engine mapping Tailwind to native components.
- **React Native Reanimated & Moti:** Governs physics-based spring motions and transitions.

### 3. Database & Network Sync
- **Supabase & Supabase PostgreSQL:** Secure cloud authentication and database synchronization.
- **Victory Native XL:** Renders progressive overload volume charts and curves.

### 4. AI Transcription & Parser
- **OpenAI Whisper API:** Converts raw voice streams to text.
- **OpenAI GPT API:** Translates transcripts into structured JSON payloads, resolving corrections (for example: "hydration 2 liters, wait, correction, 3 liters").

---

## Versioning System

Aura follows strict semantic versioning practices:

- **v1.0 (Initial Release):** The complete React Native/Expo MVP. Implements local SQLite schemas, Zustand state containers, OpenAI transcription, Supabase synchronization, and the glassmorphic Tailwind dashboard.
- **v1.1 (Minor Updates):** Encompasses small UI improvements, haptic wave optimizations, minor bug fixes, or minor algorithm tweaks.
- **v2.0 (Major Upgrades):** Encompasses major architectural shifts, such as migrating to native Swift/SwiftUI for widgets, Live Activities, Dynamic Island, and Siri Shortcuts.
