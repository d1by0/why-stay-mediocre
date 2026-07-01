import SwiftUI

public struct AuraUIInterpolator {
    public static let tactileBounceSpring = Animation.spring(
        response: 0.28,
        dampingFraction: 0.62,
        blendDuration: 0.12
    )
    
    public static let panelPresentationSpring = Animation.spring(
        response: 0.48,
        dampingFraction: 0.84,
        blendDuration: 0.18
    )
    
    public static let gestureInteractiveSpring = Animation.interactiveSpring(
        response: 0.32,
        dampingFraction: 0.72,
        blendDuration: 0.08
    )
}
