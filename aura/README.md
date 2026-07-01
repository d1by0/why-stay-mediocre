# Aura: Unified Ambient AI Gym, Habit, and P2P Social Ecosystem

Aura is a cohesive, premium iOS ecosystem designed to eliminate user experience friction in tracking physical and mental optimization metrics. By integrating ambient voice logging, smart progressive overload tracking, automated habit checks, and offline peer-to-peer (P2P) synchronization into a minimalist visual interface, Aura replaces manual spreadsheet tracking with a responsive mobile workspace operating with zero external running costs.

---

## Ideation and Vision

The tracking of physical and mental optimization metrics suffers from severe friction, forcing dedicated athletes and wellness-focused individuals to toggle between complex, disconnected apps, notes, and spreadsheets. Aura resolves this by offering a premium, local-first ambient experience. 

Instead of typing numbers on a gym floor or checking off boxes in a calendar, users log their entire day simply by speaking naturally. The system handles voice overrides, calculates training fatigue, recommends the next steps in weight progression, and synchronizes directly with training partners nearby.

---

## Target Audience: Who is this for?

Aura is designed for:
1. **Dedicated Athletes & Strength Trainers:** Who require structured progressive overload models, fatigue calculations (Muscular Load Coefficient), and automatic weight suggestions.
2. **Quantified-Self Enthusiasts:** Who track multiple daily biometrics (hydration, sleep, steps, reading habits, journaling) and want their metrics aggregated in one place.
3. **Privacy-Focused Individuals:** Who do not want their personal data, journals, or location information sent to external servers or cloud providers.
4. **Offline Collaborators:** Training partners and small groups who want to synchronize workouts and check-ins without cellular network dependency.

---

## Technical Architecture

The application is structured into the following decoupled modules:

### 1. Core Data Models (SwiftData)
- Handles on-device storage with SQLCipher AES-256 database encryption.
- Uses a field-level Last-Write-Wins (LWW) conflict resolution policy to merge updates across a user's devices without losing data.

### 2. On-Device Voice Transcription & Local LLM Parsing
- Captures raw audio PCM using AVFoundation and Core Audio.
- Decodes speech locally via WhisperKit CoreML.
- Parses unstructured text to structured JSON using llama.swift (with quantized Qwen-3 GGUF models) running on the Apple Neural Engine.
- Resolves conversational self-corrections (for example: "drank 2 liters, wait, make that 3 liters") using a sliding token window.

### 3. Local P2P Synchronization Mesh
- Utilizes the Multipeer Connectivity framework to discover and connect with nearby devices using Bluetooth LE and Wi-Fi Direct.
- Encrypts mesh data payloads with AES-256-GCM.

### 4. Training Progression Engine
- Suggests progressive overload steps based on RPE, volume history, and daily fatigue.
- Automatically discounts lower-body target weights if high daily steps or cardiovascular fatigue is detected.

---

## Versioning System

Aura follows strict semantic versioning practices:

- **v1.0 (Initial Release):** The complete offline-first MVP. Implements core SwiftData models, local WhisperKit and llama.cpp parsing pipelines, multipeer networking, progressive calculations, and the glassmorphic SwiftUI dashboard.
- **v1.1 (Minor Updates):** Encompasses small UI improvements, haptic wave optimizations, minor bug fixes, or minor algorithm tweaks.
- **v2.0 (Major Upgrades):** Encompasses major architectural shifts, such as migrating core models, adding full watchOS synchronization support, or upgrading to a different local inference backend.
