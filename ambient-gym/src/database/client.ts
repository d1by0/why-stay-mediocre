/**
 * Local SQLite Client & Schema Repository
 */
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

export interface Profile {
  id: string;
  fullName: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
}

export interface WorkoutSet {
  id: string;
  profileId: string;
  exerciseId: string;
  exerciseName?: string; // Joint helper
  weight: number;
  reps: number;
  rpe: number | null;
  isDirty: boolean;
  isDeleted: boolean;
  updatedAt: string;
}

// In-Memory fallback for web / non-native environments
class InMemoryDB {
  private profiles: Map<string, Profile> = new Map();
  private exercises: Map<string, Exercise> = new Map();
  private workoutSets: Map<string, WorkoutSet> = new Map();

  constructor() {
    // Seed default exercise catalog
    const defaultExercises: Exercise[] = [
      { id: 'ex-squat', name: 'Squat', category: 'Legs' },
      { id: 'ex-bench', name: 'Bench Press', category: 'Chest' },
      { id: 'ex-deadlift', name: 'Deadlift', category: 'Back' },
      { id: 'ex-ohp', name: 'Overhead Press', category: 'Shoulders' },
      { id: 'ex-curl', name: 'Bicep Curl', category: 'Arms' },
    ];
    defaultExercises.forEach(ex => this.exercises.set(ex.id, ex));

    // Seed default profile
    this.profiles.set('user-1', {
      id: 'user-1',
      fullName: 'Alex Carter',
      updatedAt: new Date().toISOString(),
    });

    // Seed some initial workout data
    const initialSets: WorkoutSet[] = [
      {
        id: 'set-1',
        profileId: 'user-1',
        exerciseId: 'ex-squat',
        weight: 315,
        reps: 5,
        rpe: 9,
        isDirty: false,
        isDeleted: false,
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      },
      {
        id: 'set-2',
        profileId: 'user-1',
        exerciseId: 'ex-bench',
        weight: 225,
        reps: 8,
        rpe: 8.5,
        isDirty: false,
        isDeleted: false,
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      }
    ];
    initialSets.forEach(set => this.workoutSets.set(set.id, set));
  }

  async getProfile(id: string): Promise<Profile | null> {
    return this.profiles.get(id) || null;
  }

  async saveProfile(profile: Profile): Promise<void> {
    this.profiles.set(profile.id, profile);
  }

  async getExercises(): Promise<Exercise[]> {
    return Array.from(this.exercises.values());
  }

  async addExercise(ex: Exercise): Promise<void> {
    this.exercises.set(ex.id, ex);
  }

  async getWorkoutSets(): Promise<WorkoutSet[]> {
    return Array.from(this.workoutSets.values())
      .filter(set => !set.isDeleted)
      .map(set => ({
        ...set,
        exerciseName: this.exercises.get(set.exerciseId)?.name || 'Unknown'
      }));
  }

  async getAllSetsIncludingDeleted(): Promise<WorkoutSet[]> {
    return Array.from(this.workoutSets.values());
  }

  async saveWorkoutSet(set: WorkoutSet): Promise<void> {
    this.workoutSets.set(set.id, set);
  }

  async clearAll(): Promise<void> {
    this.workoutSets.clear();
  }
}

const memDB = new InMemoryDB();

// Native SQLite management
let db: SQLite.SQLiteDatabase | null = null;

export async function initSQLiteDatabase(): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    db = await SQLite.openDatabaseAsync('ambient_gym.db');
    
    // Enable WAL mode & Foreign Keys
    await db.execAsync('PRAGMA journal_mode = WAL;');
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // Create tables
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS exercises (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS workout_sets (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL,
        exercise_id TEXT NOT NULL,
        weight REAL NOT NULL,
        reps INTEGER NOT NULL,
        rpe REAL,
        is_dirty INTEGER NOT NULL DEFAULT 0,
        is_deleted INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
        FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
      );
    `);

    // Seed exercises if empty
    const exercisesCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM exercises;');
    if (exercisesCount && exercisesCount.count === 0) {
      await db.runAsync("INSERT INTO exercises (id, name, category) VALUES ('ex-squat', 'Squat', 'Legs');");
      await db.runAsync("INSERT INTO exercises (id, name, category) VALUES ('ex-bench', 'Bench Press', 'Chest');");
      await db.runAsync("INSERT INTO exercises (id, name, category) VALUES ('ex-deadlift', 'Deadlift', 'Back');");
      await db.runAsync("INSERT INTO exercises (id, name, category) VALUES ('ex-ohp', 'Overhead Press', 'Shoulders');");
      await db.runAsync("INSERT INTO exercises (id, name, category) VALUES ('ex-curl', 'Bicep Curl', 'Arms');");
    }

    // Seed profile if empty
    const profileCount = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM profiles;');
    if (profileCount && profileCount.count === 0) {
      await db.runAsync(
        "INSERT INTO profiles (id, full_name, updated_at) VALUES ('user-1', 'Alex Carter', ?);",
        [new Date().toISOString()]
      );
    }
  } catch (error) {
    console.error("SQLite DB Initialization failed: ", error);
  }
}

// Database repository accessors that fall back to memory on web
export const DB = {
  async getProfile(id: string): Promise<Profile | null> {
    if (Platform.OS === 'web' || !db) {
      return memDB.getProfile(id);
    }
    const result = await db.getFirstAsync<any>('SELECT id, full_name as fullName, updated_at as updatedAt FROM profiles WHERE id = ?;', [id]);
    return result || null;
  },

  async saveProfile(profile: Profile): Promise<void> {
    if (Platform.OS === 'web' || !db) {
      return memDB.saveProfile(profile);
    }
    await db.runAsync(
      'INSERT INTO profiles (id, full_name, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET full_name=excluded.full_name, updated_at=excluded.updated_at;',
      [profile.id, profile.fullName, profile.updatedAt]
    );
  },

  async getExercises(): Promise<Exercise[]> {
    if (Platform.OS === 'web' || !db) {
      return memDB.getExercises();
    }
    return db.getAllAsync<Exercise>('SELECT id, name, category FROM exercises;');
  },

  async getWorkoutSets(): Promise<WorkoutSet[]> {
    if (Platform.OS === 'web' || !db) {
      return memDB.getWorkoutSets();
    }
    // Perform an inner/left join to fetch the exercise name
    const rows = await db.getAllAsync<any>(`
      SELECT w.id, w.profile_id as profileId, w.exercise_id as exerciseId, e.name as exerciseName,
             w.weight, w.reps, w.rpe, w.is_dirty as isDirty, w.is_deleted as isDeleted, w.updated_at as updatedAt
      FROM workout_sets w
      JOIN exercises e ON w.exercise_id = e.id
      WHERE w.is_deleted = 0
      ORDER BY w.updated_at DESC;
    `);
    return rows.map(r => ({
      ...r,
      isDirty: !!r.isDirty,
      isDeleted: !!r.isDeleted,
    }));
  },

  async getAllSetsIncludingDeleted(): Promise<WorkoutSet[]> {
    if (Platform.OS === 'web' || !db) {
      return memDB.getAllSetsIncludingDeleted();
    }
    const rows = await db.getAllAsync<any>(`
      SELECT id, profile_id as profileId, exercise_id as exerciseId,
             weight, reps, rpe, is_dirty as isDirty, is_deleted as isDeleted, updated_at as updatedAt
      FROM workout_sets;
    `);
    return rows.map(r => ({
      ...r,
      isDirty: !!r.isDirty,
      isDeleted: !!r.isDeleted,
    }));
  },

  async saveWorkoutSet(set: WorkoutSet): Promise<void> {
    if (Platform.OS === 'web' || !db) {
      return memDB.saveWorkoutSet(set);
    }
    await db.runAsync(
      `INSERT INTO workout_sets (id, profile_id, exercise_id, weight, reps, rpe, is_dirty, is_deleted, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET 
         weight=excluded.weight, 
         reps=excluded.reps, 
         rpe=excluded.rpe, 
         is_dirty=excluded.is_dirty, 
         is_deleted=excluded.is_deleted, 
         updated_at=excluded.updated_at;`,
      [
        set.id,
        set.profileId,
        set.exerciseId,
        set.weight,
        set.reps,
        set.rpe,
        set.isDirty ? 1 : 0,
        set.isDeleted ? 1 : 0,
        set.updatedAt,
      ]
    );
  },

  async clearAll(): Promise<void> {
    if (Platform.OS === 'web' || !db) {
      return memDB.clearAll();
    }
    await db.execAsync('DELETE FROM workout_sets;');
  }
};
