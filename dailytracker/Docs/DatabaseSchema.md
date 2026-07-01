# Database Schema Details

Aura uses SwiftData for on-device persistence. The primary entities are:

## DailyUserMetrics

- `recordID`: String (Unique Attribute)
- `dateTimestamp`: Date
- `targetWorkoutSplit`: String (e.g., Push, Pull, Legs)
- `strengthExerciseLogs`: Relationship to array of `ExerciseLog` (Cascade delete)
- `hydrationLiters`: Double
- `stepsActive`: Int
- `sleepDurationHours`: Double
- `readPagesCount`: Int
- `runningDistanceKilometers`: Double
- `journalingTextPayload`: String
- `junkFoodConsumed`: Bool
- `fieldModificationTimestamps`: Dictionary [String: Date]

## ExerciseLog

- `exerciseName`: String
- `loggedSets`: Relationship to array of `TrainingSet` (Cascade delete)

## TrainingSet

- `setIndex`: Int
- `weightLoadKg`: Double
- `repetitionCount`: Int
- `rateOfPerceivedExertion`: Double
