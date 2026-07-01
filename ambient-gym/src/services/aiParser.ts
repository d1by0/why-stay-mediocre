/**
 * AI Audio Transcription and Semantic JSON Parsing Services
 */

export interface ParsedWorkoutSet {
  exercise: string;
  weight: number;
  reps: number;
  rpe: number | null;
}

export interface VoiceParsingResult {
  rawTranscript: string;
  parsedSets: ParsedWorkoutSet[];
  success: boolean;
  error?: string;
}

// In-app configuration storage keys
export const AI_KEYS = {
  OPENAI_API_KEY: 'openai_api_key',
  SUPABASE_URL: 'supabase_url',
  SUPABASE_ANON_KEY: 'supabase_anon_key',
};

/**
 * Standard gym and exercise phrasing examples for LLM parsing
 */
const FEW_SHOT_EXAMPLES = [
  {
    input: "Logged squat, did a solid set of five reps at three hundred fifteen pounds, felt like a nine RPE.",
    output: { exercise: "Squat", sets: [{ weight: 315, reps: 5, rpe: 9 }] }
  },
  {
    input: "Bench press today, first set was two hundred twenty-five for eight reps, then dropped to one eighty-five for ten.",
    output: { exercise: "Bench Press", sets: [{ weight: 225, reps: 8, rpe: null }, { weight: 185, reps: 10, rpe: null }] }
  }
];

/**
 * Simulate semantic voice parsing for testing when keys aren't configured yet.
 * Detects common fitness patterns from spoken text.
 */
export function simulateSemanticParsing(text: string): ParsedWorkoutSet[] {
  const normalizedText = text.toLowerCase();
  
  // Basic matching heuristics
  let exercise = "Squat";
  if (normalizedText.includes("bench") || normalizedText.includes("chest")) {
    exercise = "Bench Press";
  } else if (normalizedText.includes("deadlift") || normalizedText.includes("pull")) {
    exercise = "Deadlift";
  } else if (normalizedText.includes("shoulder") || normalizedText.includes("press")) {
    exercise = "Overhead Press";
  } else if (normalizedText.includes("curl")) {
    exercise = "Bicep Curl";
  }
  
  // Extract numbers (weight, reps, rpe)
  // Look for patterns like "315 pounds", "five reps", "9 rpe"
  let weight = 135;
  const weightMatch = normalizedText.match(/(\d+)\s*(pounds|lbs|kg|kilos|pound)/i) || normalizedText.match(/at\s+(\d+)/i);
  if (weightMatch) {
    weight = parseInt(weightMatch[1], 10);
  } else {
    // Check written numbers
    if (normalizedText.includes("two twenty five") || normalizedText.includes("225")) weight = 225;
    if (normalizedText.includes("three fifteen") || normalizedText.includes("315")) weight = 315;
    if (normalizedText.includes("four five") || normalizedText.includes("405")) weight = 405;
    if (normalizedText.includes("one eighty five") || normalizedText.includes("185")) weight = 185;
    if (normalizedText.includes("ninety five") || normalizedText.includes("95")) weight = 95;
  }

  let reps = 5;
  const repsMatch = normalizedText.match(/(\d+)\s*(reps|repetitions|rep)/i) || normalizedText.match(/of\s+(\d+)/i);
  if (repsMatch) {
    reps = parseInt(repsMatch[1], 10);
  } else {
    if (normalizedText.includes("one rep")) reps = 1;
    if (normalizedText.includes("five rep")) reps = 5;
    if (normalizedText.includes("eight rep")) reps = 8;
    if (normalizedText.includes("ten rep")) reps = 10;
    if (normalizedText.includes("twelve rep")) reps = 12;
  }

  let rpe: number | null = null;
  const rpeMatch = normalizedText.match(/(\d+(?:\.\d+)?)\s*rpe/i) || normalizedText.match(/rpe\s*(?:of\s*)?(\d+)/i);
  if (rpeMatch) {
    rpe = parseFloat(rpeMatch[1]);
  } else {
    if (normalizedText.includes("rpe nine") || normalizedText.includes("nine rpe")) rpe = 9;
    if (normalizedText.includes("rpe eight") || normalizedText.includes("eight rpe")) rpe = 8;
    if (normalizedText.includes("rpe seven") || normalizedText.includes("seven rpe")) rpe = 7;
    if (normalizedText.includes("rpe ten") || normalizedText.includes("ten rpe")) rpe = 10;
  }

  return [{ exercise, weight, reps, rpe }];
}

/**
 * Main parser entry point. Call Whisper and GPT APIs if keys are present,
 * otherwise fallback gracefully to local simulation.
 */
export async function parseWorkoutVoiceInput(
  audioUri: string | null,
  textOverride?: string,
  apiKey?: string
): Promise<VoiceParsingResult> {
  // If no audio is provided but direct text is inputted
  if (textOverride) {
    const parsed = simulateSemanticParsing(textOverride);
    return {
      rawTranscript: textOverride,
      parsedSets: parsed,
      success: true,
    };
  }

  if (!audioUri) {
    return {
      rawTranscript: "",
      parsedSets: [],
      success: false,
      error: "No audio file provided.",
    };
  }

  // Under normal production conditions, the audio is sent to the Whisper API.
  if (!apiKey) {
    // No OpenAI API Key found - return a random simulator transcription based on realistic outputs
    const sampleTranscripts = [
      "Logged squat, did a solid set of five reps at three hundred fifteen pounds, felt like a nine RPE.",
      "Bench press today, first set was two hundred twenty-five for eight reps, then dropped to one eighty-five for ten.",
      "Did some curls, ninety-five pounds for twelve reps, felt like an eight RPE.",
      "Finished overhead press with one hundred thirty-five pounds for five reps, solid RPE ten.",
    ];
    const randomIndex = Math.floor(Math.random() * sampleTranscripts.length);
    const mockTranscript = sampleTranscripts[randomIndex];
    const parsed = simulateSemanticParsing(mockTranscript);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    return {
      rawTranscript: `[Simulated Whisper Transcript] ${mockTranscript}`,
      parsedSets: parsed,
      success: true,
    };
  }

  try {
    // 1. Whisper Transcription API request
    const formData = new FormData();
    formData.append('file', {
      uri: audioUri,
      name: 'audio.m4a',
      type: 'audio/m4a',
    } as any);
    formData.append('model', 'whisper-1');
    formData.append('prompt', 'RPE, RIR, AMRAP, Squat, Bench Press, Deadlift, Overhead Press, Bicep Curl');

    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!whisperResponse.ok) {
      const errBody = await whisperResponse.text();
      throw new Error(`Whisper Transcription failed: ${errBody}`);
    }

    const whisperData = await whisperResponse.json();
    const transcript = whisperData.text;

    // 2. GPT-4o-mini structuring schema API request
    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a fitness logger assistant. Parse unstructured workout comments into structured JSON.
Return a JSON array of parsed sets. Each set must have:
- exercise (string, e.g., "Squat", "Bench Press", "Deadlift")
- weight (number in lbs/kg)
- reps (integer number of repetitions)
- rpe (number or null)

Use these examples:
${JSON.stringify(FEW_SHOT_EXAMPLES, null, 2)}

Only output valid JSON. Do not include markdown formatting or backticks.`,
          },
          {
            role: 'user',
            content: transcript,
          },
        ],
        temperature: 0.0,
      }),
    });

    if (!gptResponse.ok) {
      const errBody = await gptResponse.text();
      throw new Error(`GPT semantic parsing failed: ${errBody}`);
    }

    const gptData = await gptResponse.json();
    const content = gptData.choices[0].message.content.trim();
    // Strip markdown code block wrappers if any
    const cleanContent = content.replace(/^```json/, '').replace(/```$/, '').trim();
    const parsedSets = JSON.parse(cleanContent);

    return {
      rawTranscript: transcript,
      parsedSets: Array.isArray(parsedSets) ? parsedSets : [parsedSets],
      success: true,
    };
  } catch (error: any) {
    console.error("AI Parser API error:", error);
    return {
      rawTranscript: "Failed to transcribe/parse audio.",
      parsedSets: [],
      success: false,
      error: error.message || String(error),
    };
  }
}
