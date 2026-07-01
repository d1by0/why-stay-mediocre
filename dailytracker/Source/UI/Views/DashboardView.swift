import SwiftUI

public struct DashboardView: View {
    @State private var hydrationLiters: Double = 1.5
    @State private var targetHydration: Double = 3.5
    @State private var stepsActive: Int = 5500
    @State private var targetSteps: Int = 10000
    @State private var isRecordingVoice = false
    
    private let hapticEngine = AuraHapticSoundEngine()
    
    public init() {}
    
    public var body: some View {
        ZStack {
            Color.black
                .ignoresSafeArea()
            
            LinearGradient(
                colors: [Color.purple.opacity(0.15), Color.blue.opacity(0.15)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 24) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("AURA")
                            .font(.system(.title, design: .monospaced))
                            .fontWeight(.black)
                            .tracking(8)
                            .foregroundColor(.white)
                        
                        Text("Unified Optimization Log")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal)
                    
                    VStack(spacing: 20) {
                        Text("Daily Progress")
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity, alignment: .leading)
                        
                        HStack(spacing: 40) {
                            ProgressRingView(
                                progress: hydrationLiters / targetHydration,
                                title: "Hydration",
                                subtitle: String(format: "%.1fL / %.1fL", hydrationLiters, targetHydration),
                                startColor: .yellow,
                                endColor: .orange
                            )
                            
                            ProgressRingView(
                                progress: Double(stepsActive) / Double(targetSteps),
                                title: "Steps",
                                subtitle: "\(stepsActive) / \(targetSteps)",
                                startColor: .yellow,
                                endColor: .orange
                            )
                        }
                    }
                    .padding()
                    .background(.ultraThinMaterial)
                    .cornerRadius(24)
                    .padding(.horizontal)
                    
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Momentum Tracker")
                            .font(.caption)
                            .fontWeight(.bold)
                            .foregroundColor(.yellow)
                        
                        Text("You have kept your momentum going today. Let us build on this progress tomorrow.")
                            .font(.body)
                            .foregroundColor(.white.opacity(0.9))
                            .lineSpacing(4)
                    }
                    .padding()
                    .background(Color.yellow.opacity(0.1))
                    .cornerRadius(20)
                    .overlay(
                        RoundedRectangle(cornerRadius: 20)
                            .stroke(Color.yellow.opacity(0.2), lineWidth: 1)
                    )
                    .padding(.horizontal)
                    
                    VStack(spacing: 12) {
                        Button(action: {
                            withAnimation(AuraUIInterpolator.tactileBounceSpring) {
                                isRecordingVoice.toggle()
                            }
                            hapticEngine.playMicroImpulsion()
                            
                            if !isRecordingVoice {
                                hapticEngine.playSuccessPulse()
                            }
                        }) {
                            ZStack {
                                Circle()
                                    .fill(isRecordingVoice ? Color.red.opacity(0.2) : Color.white.opacity(0.1))
                                    .frame(width: 80, height: 80)
                                
                                Image(systemName: isRecordingVoice ? "stop.fill" : "mic.fill")
                                    .font(.title)
                                    .foregroundColor(isRecordingVoice ? .red : .white)
                            }
                        }
                        
                        Text(isRecordingVoice ? "Listening..." : "Tap to Speak Log")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                    .padding(.vertical)
                }
                .padding(.vertical)
            }
        }
    }
}

struct ProgressRingView: View {
    let progress: Double
    let title: String
    let subtitle: String
    let startColor: Color
    let endColor: Color
    
    var body: some View {
        VStack(spacing: 12) {
            ZStack {
                Circle()
                    .stroke(Color.white.opacity(0.08), lineWidth: 12)
                    .frame(width: 100, height: 100)
                
                Circle()
                    .trim(from: 0.0, to: CGFloat(min(progress, 1.0)))
                    .stroke(
                        LinearGradient(
                            colors: [startColor, endColor],
                            startPoint: .top,
                            endPoint: .bottom
                        ),
                        style: StrokeStyle(lineWidth: 12, lineCap: .round)
                    )
                    .frame(width: 100, height: 100)
                    .rotationEffect(Angle(degrees: -90))
                
                Text(String(format: "%.0f%%", min(progress, 1.0) * 100))
                    .font(.system(.subheadline, design: .monospaced))
                    .fontWeight(.bold)
                    .foregroundColor(.white)
            }
            
            VStack(spacing: 2) {
                Text(title)
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundColor(.gray)
                
                Text(subtitle)
                    .font(.system(.caption2, design: .monospaced))
                    .foregroundColor(.white.opacity(0.7))
            }
        }
    }
}
