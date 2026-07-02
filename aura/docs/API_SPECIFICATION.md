# Aura: API Specifications

This document defines the type-safe tRPC routers and edge endpoints exposed by the Aura backend. Both the web client and native iOS application consume these contracts.

---

## 🔗 Endpoint Routing Index

| Endpoint Path | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `trpc.auth.migrateGuestData` | MUTATION | Clerk JWT | Merges offline guest metrics into synced user profile. |
| `trpc.profile.checkUsername` | QUERY | None | Checks if username is unique. |
| `trpc.profile.avatarUploadUrl` | MUTATION | Clerk JWT | Returns presigned PUT upload URL for avatars. |
| `trpc.habits.list` | QUERY | Clerk JWT | Returns user habits & current streaks. |
| `trpc.habits.log` | MUTATION | Clerk JWT | Logs a habit completion event. |
| `trpc.workouts.create` | MUTATION | Clerk JWT | Initializes a new active workout session. |
| `trpc.workouts.logSet` | MUTATION | Clerk JWT | Commits a set metric (weight, reps, RPE). |
| `trpc.ai.processVoice` | MUTATION | Clerk JWT | Streams voice audio path to Whisper and processes intent. |

---

## 📬 Payload Contracts

### 1. `trpc.profile.checkUsername`
- **Request Query**: `{ username: string }`
- **Response**:
  ```json
  {
    "available": true,
    "suggested": []
  }
  ```

### 2. `trpc.habits.log`
- **Request Mutation**:
  ```typescript
  {
    habitId: string, // UUID
    completedAt: string // ISO Timestamp
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "streakCount": 5,
    "unlockedAchievement": null
  }
  ```

### 3. `trpc.ai.processVoice`
- **Request Mutation**:
  ```typescript
  {
    audioUrl: string // Cloudflare R2 path
  }
  ```
- **Response**:
  ```json
  {
    "intent": "workout" | "water" | "sleep" | "journal",
    "transcription": "Did 3 sets of 10 bench press at 225 pounds",
    "result": {
      "exerciseName": "Bench Press",
      "sets": [
        { "reps": 10, "weightKg": 102.0, "setNumber": 1 },
        { "reps": 10, "weightKg": 102.0, "setNumber": 2 },
        { "reps": 10, "weightKg": 102.0, "setNumber": 3 }
      ]
    }
  }
  ```
