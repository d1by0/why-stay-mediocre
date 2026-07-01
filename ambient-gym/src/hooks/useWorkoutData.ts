/**
 * Workout Data Management & SQLite LiveQuery simulation hook
 */
import { useState, useEffect, useCallback } from 'react';
import { DB, WorkoutSet, Exercise, initSQLiteDatabase } from '../database/client';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function useWorkoutData() {
  const [workoutSets, setWorkoutSets] = useState<WorkoutSet[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [dbReady, setDbReady] = useState(false);

  // Initialize DB on mount
  useEffect(() => {
    async function setup() {
      await initSQLiteDatabase();
      setDbReady(true);
    }
    setup();
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const sets = await DB.getWorkoutSets();
      const exList = await DB.getExercises();
      setWorkoutSets(sets);
      setExercises(exList);
    } catch (err) {
      console.error("Failed to refresh workout sets:", err);
    }
  }, []);

  useEffect(() => {
    if (dbReady) {
      refreshData();
    }
  }, [dbReady, refreshData]);

  const addWorkoutSet = async (exerciseName: string, weight: number, reps: number, rpe: number | null) => {
    try {
      // Find or create exercise ID
      const exList = await DB.getExercises();
      let exercise = exList.find(e => e.name.toLowerCase() === exerciseName.toLowerCase());
      
      if (!exercise) {
        // Create new exercise category
        const newId = `ex-${Date.now()}`;
        exercise = { id: newId, name: exerciseName, category: 'Custom' };
        await DB.addExercise(exercise);
      }

      const newSet: WorkoutSet = {
        id: `set-${Date.now()}`,
        profileId: 'user-1',
        exerciseId: exercise.id,
        weight,
        reps,
        rpe,
        isDirty: true,
        isDeleted: false,
        updatedAt: new Date().toISOString(),
      };

      await DB.saveWorkoutSet(newSet);
      
      // Trigger Haptic feedback for Completing a Workout Set
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      await refreshData();
    } catch (err) {
      console.error("Failed to add workout set:", err);
    }
  };

  const deleteWorkoutSet = async (id: string) => {
    try {
      // Soft delete: mark is_deleted = 1 and is_dirty = 1
      const allSets = await DB.getAllSetsIncludingDeleted();
      const existing = allSets.find(s => s.id === id);
      if (existing) {
        const updated: WorkoutSet = {
          ...existing,
          isDeleted: true,
          isDirty: true,
          updatedAt: new Date().toISOString(),
        };
        await DB.saveWorkoutSet(updated);

        // Trigger Haptic feedback for boundaries/warnings
        if (Platform.OS !== 'web') {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }

        await refreshData();
      }
    } catch (err) {
      console.error("Failed to delete workout set:", err);
    }
  };

  const clearAllSets = async () => {
    try {
      await DB.clearAll();
      if (Platform.OS !== 'web') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
      await refreshData();
    } catch (err) {
      console.error("Failed to clear sets:", err);
    }
  };

  return {
    workoutSets,
    exercises,
    addWorkoutSet,
    deleteWorkoutSet,
    clearAllSets,
    refreshData,
  };
}
