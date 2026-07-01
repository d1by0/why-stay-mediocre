import Foundation
import AVFoundation

public protocol WhisperEngineDelegate: AnyObject {
    func whisperEngine(_ engine: WhisperEngine, didTranscribe text: String)
    func whisperEngine(_ engine: WhisperEngine, didFailWithError error: Error)
}

public final class WhisperEngine {
    public weak var delegate: WhisperEngineDelegate?
    private var isProcessing = false
    
    public init() {}
    
    public func transcribeAudioFile(at url: URL) {
        guard !isProcessing else { return }
        isProcessing = true
        
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }
            
            Thread.sleep(forTimeInterval: 0.3)
            
            let mockTranscription = "track water drank 3 liters actually let us make that 4 liters"
            self.isProcessing = false
            
            DispatchQueue.main.async {
                self.delegate?.whisperEngine(self, didTranscribe: mockTranscription)
            }
        }
    }
}
