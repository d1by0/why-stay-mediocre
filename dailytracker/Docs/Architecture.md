# Aura Architecture

Aura is structured as a decentralized, local-first iOS application designed to operate with zero server maintenance costs and maximum user privacy.

## Architectural Layers

1. **User Interface (SwiftUI):**
   - Incorporates fluid spring physics with glassmorphic cards.
   - Leverages Apple CoreHaptics to map tactile interactions to system state changes.
   - Avoids negative design loops by utilizing warm gold-amber progress indicators.

2. **Local Storage (SwiftData & SQLCipher):**
   - Manages user metrics and workout databases.
   - Employs field-level Last-Write-Wins (LWW) conflict resolution logic.

3. **On-Device Inference (WhisperKit & llama.cpp):**
   - Transcribes audio locally on the Neural Engine.
   - Formats conversational voice inputs into structured JSON payloads.

4. **Mesh Networking (Multipeer Connectivity):**
   - Synchronizes databases directly between nearby devices using Bluetooth LE and Wi-Fi Direct.
   - Enforces AES-256-GCM encryption on local channels.
