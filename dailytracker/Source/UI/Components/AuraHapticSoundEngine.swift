import Foundation
import CoreHaptics

public final class AuraHapticSoundEngine {
    private var hapticEngine: CHHapticEngine?
    
    public init() {
        guard CHHapticEngine.capabilitiesForHardware().supportsHaptics else { return }
        do {
            self.hapticEngine = try CHHapticEngine()
            try hapticEngine?.start()
            
            hapticEngine?.resetHandler = { [weak self] in
                do {
                    try self?.hapticEngine?.start()
                } catch {
                    print("Haptic Engine reset failed")
                }
            }
        } catch {
            print("Haptic Engine initialization failed: \(error.localizedDescription)")
        }
    }
    
    public func playHapticPattern(fromAHAPFile fileName: String) {
        guard let path = Bundle.main.path(forResource: fileName, ofType: "ahap") else { return }
        do {
            try hapticEngine?.start()
            try hapticEngine?.playPattern(from: URL(fileURLWithPath: path))
        } catch {
            print("Haptic playback error: \(error.localizedDescription)")
        }
    }
    
    public func playSuccessPulse() {
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(.success)
    }
    
    public func playMicroImpulsion() {
        let generator = UIImpactFeedbackGenerator(style: .light)
        generator.impactOccurred()
    }
}
