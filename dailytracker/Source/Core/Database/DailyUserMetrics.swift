import Foundation
import SwiftData

@Model
public final class DailyUserMetrics {
    @Attribute(.unique) public var recordID: String
    public var dateTimestamp: Date
    
    public var targetWorkoutSplit: String 
    public var strengthExerciseLogs: [ExerciseLog]
    
    public var hydrationLiters: Double
    public var stepsActive: Int
    public var sleepDurationHours: Double
    public var readPagesCount: Int
    public var runningDistanceKilometers: Double
    public var journalingTextPayload: String
    public var junkFoodConsumed: Bool
    
    public var fieldModificationTimestamps: [String: Date]
    
    public init(recordID: String = UUID().uuidString, dateTimestamp: Date = Date()) {
        self.recordID = recordID
        self.dateTimestamp = dateTimestamp
        self.targetWorkoutSplit = "Push"
        self.strengthExerciseLogs = []
        self.hydrationLiters = 0.0
        self.stepsActive = 0
        self.sleepDurationHours = 0.0
        self.readPagesCount = 0
        self.runningDistanceKilometers = 0.0
        self.journalingTextPayload = ""
        self.junkFoodConsumed = false
        self.fieldModificationTimestamps = [:]
    }
    
    public func updateField<T>(_ key: String, value: T, timestamp: Date = Date()) {
        switch key {
        case "targetWorkoutSplit":
            if let v = value as? String { self.targetWorkoutSplit = v }
        case "hydrationLiters":
            if let v = value as? Double { self.hydrationLiters = v }
        case "stepsActive":
            if let v = value as? Int { self.stepsActive = v }
        case "sleepDurationHours":
            if let v = value as? Double { self.sleepDurationHours = v }
        case "readPagesCount":
            if let v = value as? Int { self.readPagesCount = v }
        case "runningDistanceKilometers":
            if let v = value as? Double { self.runningDistanceKilometers = v }
        case "journalingTextPayload":
            if let v = value as? String { self.journalingTextPayload = v }
        case "junkFoodConsumed":
            if let v = value as? Bool { self.junkFoodConsumed = v }
        default:
            break
        }
        self.fieldModificationTimestamps[key] = timestamp
    }
    
    public func merge(with incoming: DailyUserMetrics) {
        for (key, incomingTimestamp) in incoming.fieldModificationTimestamps {
            let localTimestamp = self.fieldModificationTimestamps[key] ?? Date.distantPast
            if incomingTimestamp > localTimestamp {
                switch key {
                case "targetWorkoutSplit":
                    self.updateField(key, value: incoming.targetWorkoutSplit, timestamp: incomingTimestamp)
                case "hydrationLiters":
                    self.updateField(key, value: incoming.hydrationLiters, timestamp: incomingTimestamp)
                case "stepsActive":
                    self.updateField(key, value: incoming.stepsActive, timestamp: incomingTimestamp)
                case "sleepDurationHours":
                    self.updateField(key, value: incoming.sleepDurationHours, timestamp: incomingTimestamp)
                case "readPagesCount":
                    self.updateField(key, value: incoming.readPagesCount, timestamp: incomingTimestamp)
                case "runningDistanceKilometers":
                    self.updateField(key, value: incoming.runningDistanceKilometers, timestamp: incomingTimestamp)
                case "journalingTextPayload":
                    self.updateField(key, value: incoming.journalingTextPayload, timestamp: incomingTimestamp)
                case "junkFoodConsumed":
                    self.updateField(key, value: incoming.junkFoodConsumed, timestamp: incomingTimestamp)
                default:
                    break
                }
            }
        }
    }
}

@Model
public final class ExerciseLog {
    public var exerciseName: String
    @Relationship(deleteRule: .cascade) public var loggedSets: [TrainingSet]
    
    public init(exerciseName: String) {
        self.exerciseName = exerciseName
        self.loggedSets = []
    }
}

@Model
public final class TrainingSet {
    public var setIndex: Int
    public var weightLoadKg: Double
    public var repetitionCount: Int
    public var rateOfPerceivedExertion: Double 
    
    public init(setIndex: Int, weightLoadKg: Double, repetitionCount: Int, rateOfPerceivedExertion: Double) {
        self.setIndex = setIndex
        self.weightLoadKg = weightLoadKg
        self.repetitionCount = repetitionCount
        self.rateOfPerceivedExertion = rateOfPerceivedExertion
    }
}
