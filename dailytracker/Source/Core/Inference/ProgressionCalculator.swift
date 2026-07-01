import Foundation

public final class ProgressionCalculator {
    
    public init() {}
    
    public func calculateVolume(weights: [Double], repetitions: [Int]) -> Double {
        guard weights.count == repetitions.count else { return 0.0 }
        var total = 0.0
        for i in 0..<weights.count {
            total += weights[i] * Double(repetitions[i])
        }
        return total
    }
    
    public func computeTargetWeight(
        previousMaxWeight: Double,
        sleepHours: Double,
        hydrationLiters: Double,
        cardiovascularOutputScore: Double, 
        completedRepetitionsTarget: Bool
    ) -> Double {
        guard completedRepetitionsTarget else {
            return previousMaxWeight
        }
        
        let alphaPerf = 0.05
        var betaRecovery = 1.0
        
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
        
        betaRecovery = max(0.0, min(1.2, betaRecovery))
        
        let targetWeight = previousMaxWeight * (1.0 + alphaPerf * betaRecovery)
        
        return (targetWeight / 2.5).rounded(.toNearestOrAwayFromZero) * 2.5
    }
    
    public func generateStepOptions(baseWeight: Double) -> [Double] {
        return [
            baseWeight,
            baseWeight + 2.5,
            baseWeight + 5.0,
            baseWeight + 7.5
        ]
    }
}
