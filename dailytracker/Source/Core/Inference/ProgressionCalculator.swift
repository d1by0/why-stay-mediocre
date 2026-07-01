import Foundation

public final class ProgressionCalculator {
    
    public init() {}
    
    /// Calculates total training volume for a given set list: V = Sum(Weight * Reps)
    public func calculateVolume(weights: [Double], repetitions: [Int]) -> Double {
        guard weights.count == repetitions.count else { return 0.0 }
        var total = 0.0
        for i in 0..<weights.count {
            total += weights[i] * Double(repetitions[i])
        }
        return total
    }
    
    /// Computes the recommended target weight for the next session considering fatigue variables
    /// W_target = W_max_prev * (1 + alpha_perf * beta_recovery)
    public func computeTargetWeight(
        previousMaxWeight: Double,
        sleepHours: Double,
        hydrationLiters: Double,
        cardiovascularOutputScore: Double, // Normalized score where 1.0 is baseline
        completedRepetitionsTarget: Bool
    ) -> Double {
        guard completedRepetitionsTarget else {
            // If target reps were not completed, maintain previous load
            return previousMaxWeight
        }
        
        // Performance scaled multiplier (configured between 0.025 and 0.075)
        let alphaPerf = 0.05
        
        // Compute beta_recovery based on biometrics
        var betaRecovery = 1.0
        
        // Fatigue attenuation factors
        if sleepHours < 7.0 {
            let sleepDeficit = (7.0 - sleepHours) / 7.0
            betaRecovery -= sleepDeficit * 0.5
        }
        
        if hydrationLiters < 3.0 {
            let hydrationDeficit = (3.0 - hydrationLiters) / 3.0
            betaRecovery -= hydrationDeficit * 0.3
        }
        
        if cardiovascularOutputScore > 1.0 {
            let cardioFatigue = (cardiovascularOutputScore - 1.0) * 0.2
            betaRecovery -= cardioFatigue
        }
        
        // Bound recovery score between 0.0 and 1.2
        betaRecovery = max(0.0, min(1.2, betaRecovery))
        
        let targetWeight = previousMaxWeight * (1.0 + alphaPerf * betaRecovery)
        
        // Round to nearest 2.5 kg step
        return (targetWeight / 2.5).rounded(.toNearestOrAwayFromZero) * 2.5
    }
    
    /// Generates step selection list for UI display
    public func generateStepOptions(baseWeight: Double) -> [Double] {
        return [
            baseWeight,
            baseWeight + 2.5,
            baseWeight + 5.0,
            baseWeight + 7.5
        ]
    }
}
