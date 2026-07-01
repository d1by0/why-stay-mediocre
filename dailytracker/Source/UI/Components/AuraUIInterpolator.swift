import SwiftUI

public struct AuraUIInterpolator {
    // Spring preset for micro feedback
    public static let tactileBounceSpring = Animation.spring(
        response: 0.28,
        dampingFraction: 0.62,
        blendDuration: 0.12
    )
    
    // Spring preset for cards or sheets
    public static let panelPresentationSpring = Animation.spring(
        response: 0.48,
        dampingFraction: 0.84,
        blendDuration: 0.18
    )
    
    // Spring preset for active gestures
    public static let gestureInteractiveSpring = Animation.interactiveSpring(
        response: 0.32,
        dampingFraction: 0.72,
        blendDuration: 0.08
    )
}
