import Foundation

public struct ParsedAction: Codable {
    public var domain: String
    public var metric: String
    public var unit: String
    public var value: Double
    public var extraInfo: String?
}

public struct LLMParseResponse: Codable {
    public var timestamp: Date
    public var actions: [ParsedAction]
}

public final class LLMEngine {
    
    public init() {}
    
    public func parseSpeechText(_ text: String, completion: @escaping (Result<LLMParseResponse, Error>) -> Void) {
        // Quantized GGUF execution mock running locally via llama.cpp context
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }
            
            // Clean text and handle self-corrections programmatically
            let processedText = self.resolveSelfCorrections(text)
            
            // Generate structured actions from processed text
            let actions = self.extractActions(from: processedText)
            
            let response = LLMParseResponse(
                timestamp: Date(),
                actions: actions
            )
            
            DispatchQueue.main.async {
                completion(.success(response))
            }
        }
    }
    
    public func resolveSelfCorrections(_ text: String) -> String {
        // Sliding window approach scanning for correction cues
        // e.g. "actually", "correction", "wait", "no wait"
        let lowercased = text.lowercased()
        let tokens = lowercased.components(separatedBy: .whitespacesAndNewlines).filter { !$0.isEmpty }
        
        var resolvedTokens: [String] = []
        var index = 0
        
        let correctionCues = ["actually", "correction", "wait", "no-wait"]
        
        while index < tokens.count {
            let token = tokens[index]
            
            if correctionCues.contains(token) {
                // If it is a correction cue, backtrack the state
                // e.g. remove last logged metric value to replace with the next token
                if !resolvedTokens.isEmpty {
                    resolvedTokens.removeLast()
                }
            } else {
                resolvedTokens.append(token)
            }
            index += 1
        }
        
        return resolvedTokens.joined(separator: " ")
    }
    
    private func extractActions(from text: String) -> [ParsedAction] {
        var actions: [ParsedAction] = []
        
        // Match hydration metric
        if text.contains("water") || text.contains("hydration") {
            let value = extractValue(from: text, targetWord: "liter") ?? 1.0
            actions.append(ParsedAction(
                domain: "habit",
                metric: "hydration",
                unit: "liters",
                value: value
            ))
        }
        
        // Match steps metric
        if text.contains("steps") {
            let value = extractValue(from: text, targetWord: "steps") ?? 5000.0
            actions.append(ParsedAction(
                domain: "habit",
                metric: "steps",
                unit: "count",
                value: value
            ))
        }
        
        return actions
    }
    
    private func extractValue(from text: String, targetWord: String) -> Double? {
        let tokens = text.components(separatedBy: .whitespacesAndNewlines)
        for (index, token) in tokens.enumerated() {
            if token.contains(targetWord) {
                // Check immediate predecessor
                if index > 0, let val = Double(tokens[index - 1]) {
                    return val
                }
                // Check immediate successor
                if index < tokens.count - 1, let val = Double(tokens[index + 1]) {
                    return val
                }
            }
        }
        
        // Fallback search for any numbers
        for token in tokens {
            if let val = Double(token) {
                return val
            }
        }
        
        return nil
    }
}
