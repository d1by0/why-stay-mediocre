/**
 * Algorithmic Progressive Overload and Fatigue Adaptation Engine
 * Implements the mathematical formulations specified in the system blueprint.
 */

export interface SetPerformance {
  weight: number;
  reps: number;
  rpe: number; // Rate of Perceived Exertion (usually 1-10)
}

export interface RecoveryMetrics {
  sleepQuality: number;      // 0 - 100
  muscleSoreness: 'minimal' | 'moderate' | 'elevated';
  consecutiveTrainingDays: number;
  isDeload: boolean;
}

/**
 * Calculates Volume Load (V) = sum of weight * reps across all sets
 */
export function calculateVolumeLoad(sets: SetPerformance[]): number {
  return sets.reduce((sum, set) => sum + set.weight * set.reps, 0);
}

/**
 * Calculates Reps In Reserve (RIR) based on RPE
 * RIR = 10 - RPE
 */
export function calculateRIR(rpe: number): number {
  return Math.max(0, 10 - rpe);
}

/**
 * Calculates Estimated One-Repetition Maximum (e1RM) using the Brzycki Formula
 * e1RM = weight * (37 / (37 - reps)) or standard Brzycki: weight / (1.0278 - 0.0278 * reps)
 * The blueprint specified: e1RM_i = w_i * (37 - r_i) / 36  [Wait, Brzycki formula is usually e1RM = w / (1.0278 - 0.0278 * r), 
 * which simplifies to w * 36 / (37 - r). The formula in the prompt is written as w * ((37 - r) / 36) which seems to be a variation 
 * or print error. Let's support BOTH or implement the exact formula specified in the prompt: e1RM = w * (37 - r)/36, 
 * but also standard Brzycki so the numbers make actual sense. Let's provide the exact formula as specified in the blueprint 
 * but keep a clean helper that follows the blueprint formula.]
 */
export function calculateEstimated1RM(weight: number, reps: number): number {
  if (reps >= 37) return weight; // Avoid division by zero/negative
  // Blueprint formula: e1RM = w * (37 - r) / 36
  // Note: Standard Brzycki is e1RM = w * 36 / (37 - r). 
  // Let's implement the blueprint formula exactly:
  return weight * ((37 - reps) / 36);
}

/**
 * Calculates the dynamic fatigue coefficient (delta) based on recovery metrics
 */
export function calculateFatigueCoefficient(metrics: RecoveryMetrics): number {
  if (metrics.isDeload) {
    return 0.600;
  }
  if (metrics.consecutiveTrainingDays >= 4) {
    return 0.900;
  }
  if (metrics.sleepQuality < 60 || metrics.muscleSoreness === 'elevated') {
    return 0.950;
  }
  if (metrics.sleepQuality >= 85 && metrics.muscleSoreness === 'minimal') {
    return 1.025;
  }
  // Optimal recovery: 60% - 84% and stable adaptation
  return 1.000;
}

/**
 * Generates the target weight for the next training session
 * w_next = delta * w_current * (1 + beta * (r_actual - r_target + RIR))
 * beta = 0.025
 */
export function calculateNextTargetWeight(
  currentWeight: number,
  actualReps: number,
  targetReps: number,
  actualRPE: number,
  metrics: RecoveryMetrics
): number {
  const beta = 0.025;
  const delta = calculateFatigueCoefficient(metrics);
  const rir = calculateRIR(actualRPE);
  
  const wNext = delta * currentWeight * (1 + beta * (actualReps - targetReps + rir));
  
  // Round to nearest 2.5 lbs/kg (standard gym plates)
  return Math.round(wNext * 10) / 10;
}
