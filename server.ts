import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

const SYSTEM_INSTRUCTION = `You are a travel itinerary generator. You output ONLY valid JSON that matches the schema below. No markdown, no code fences, no text before or after the JSON.

Rules:
- Use only real, well-known places that actually exist in the given city. Never invent a place. If you are unsure a place exists, leave it out.
- Choose places that match the user's interests and budget level.
- Each day must have 3 to 4 stops. Group each day's stops by geographic proximity and list them in a sensible visiting order, so the day does not zigzag across the city.
- Do not put the same place on two different days.
- Provide approximate latitude and longitude (4 decimal places) for each stop. They must be inside the given city.
- est_entry_price is an APPROXIMATE entry fee in the local currency. Use min 0 and max 0 for free places. If you do not know the price, set min and max to null. Never guess wildly.
- "category" must be one of: history, food, nature, nightlife, shopping, art, other.
- Food: suggest 2 well-known places per day near that day's stops.
- Stays: suggest 3 real hotels or hostels that fit the budget level, and set "include" in the output as requested.
- Keep every description to one short sentence.

Schema:
{
  "city": string,
  "country": string,
  "currency": string,
  "summary": string,
  "days": [
    {
      "day": number,
      "theme": string,
      "stops": [
        {
          "name": string,
          "category": "history" | "food" | "nature" | "nightlife" | "shopping" | "art" | "other",
          "description": string,
          "best_time": "morning" | "afternoon" | "evening",
          "duration_hours": number,
          "lat": number,
          "lng": number,
          "est_entry_price": { "min": number|null, "max": number|null }
        }
      ],
      "food": [
        { "name": string, "cuisine": string, "description": string,
          "price_level": "low" | "mid" | "high" }
      ]
    }
  ],
  "stays": [
    { "name": string, "type": string, "area": string,
      "price_level": "low" | "mid" | "high", "description": string }
  ]
}`;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateWithRetry(
  ai: GoogleGenAI,
  userPrompt: string,
  systemInstruction: string = SYSTEM_INSTRUCTION
): Promise<string> {
  const PRIMARY_MODEL = 'gemini-3.1-flash-lite';
  const FALLBACK_MODEL = 'gemini-3.8-flash';
  const retryWaits = [2000, 4000, 8000]; // 2s, 4s, 8s

  // Attempt 1 with Flash-Lite
  try {
    console.log(`[GeminiAPI] Attempting generation with primary model: ${PRIMARY_MODEL}`);
    const response = await ai.models.generateContent({
      model: PRIMARY_MODEL,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    if (response.text) {
      return response.text;
    }
  } catch (err: any) {
    console.warn(`[GeminiAPI] Initial attempt with ${PRIMARY_MODEL} failed: ${err?.message || err}`);
  }

  // Retry up to 3 times with waits of 2s, 4s, 8s using Flash-Lite
  for (let attempt = 0; attempt < retryWaits.length; attempt++) {
    const waitMs = retryWaits[attempt];
    console.log(`[GeminiAPI] Waiting ${waitMs / 1000}s before retry ${attempt + 1}/3 with ${PRIMARY_MODEL}...`);
    await delay(waitMs);

    try {
      const response = await ai.models.generateContent({
        model: PRIMARY_MODEL,
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      if (response.text) {
        console.log(`[GeminiAPI] Succeeded on retry ${attempt + 1} with ${PRIMARY_MODEL}`);
        return response.text;
      }
    } catch (retryErr: any) {
      console.warn(`[GeminiAPI] Retry ${attempt + 1}/3 with ${PRIMARY_MODEL} failed: ${retryErr?.message || retryErr}`);
    }
  }

  // Fall back to the other Flash model
  console.log(`[GeminiAPI] Flash-Lite retries exhausted. Falling back to ${FALLBACK_MODEL}...`);
  try {
    const response = await ai.models.generateContent({
      model: FALLBACK_MODEL,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    if (response.text) {
      console.log(`[GeminiAPI] Succeeded with fallback model ${FALLBACK_MODEL}`);
      return response.text;
    }
  } catch (fallbackErr: any) {
    console.warn(`[GeminiAPI] Fallback model ${FALLBACK_MODEL} failed: ${fallbackErr?.message || fallbackErr}`);
  }

  // All attempts failed
  throw new Error('Servers are busy, please try again in a minute');
}

// Robust JSON extractor and parser for LLM responses
function parseJsonFromLlm(rawText: string): any {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Empty response from model');
  }

  let text = rawText.trim();

  // Try parsing directly first (fast path)
  try {
    return JSON.parse(text);
  } catch (_) {
    // Continue to extract
  }

  // Strip markdown code block fences if present: ```json ... ``` or ``` ... ```
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch (_) {
      text = codeBlockMatch[1].trim();
    }
  }

  // Find start of outermost JSON object '{' or array '['
  const firstBrace = text.indexOf('{');
  const firstBracket = text.indexOf('[');
  let startIndex = -1;
  let isObject = true;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIndex = firstBrace;
    isObject = true;
  } else if (firstBracket !== -1) {
    startIndex = firstBracket;
    isObject = false;
  }

  if (startIndex === -1) {
    throw new Error('No JSON structure found in response');
  }

  // Track depth to find the EXACT closing brace of the root JSON structure.
  // This cleanly eliminates any trailing text, markdown, extra brackets, or commentary!
  const openChar = isObject ? '{' : '[';
  const closeChar = isObject ? '}' : ']';
  let depth = 0;
  let inString = false;
  let escape = false;
  let endIndex = -1;

  for (let i = startIndex; i < text.length; i++) {
    const char = text[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (char === '\\' && inString) {
      escape = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === openChar) {
        depth++;
      } else if (char === closeChar) {
        depth--;
        if (depth === 0) {
          endIndex = i;
          break; // Stop at the exact root closing boundary!
        }
      }
    }
  }

  const jsonCandidate =
    endIndex !== -1 ? text.substring(startIndex, endIndex + 1) : text.substring(startIndex);

  try {
    return JSON.parse(jsonCandidate);
  } catch (initialErr: any) {
    console.warn(`[JSONParser] Initial parse failed: ${initialErr?.message}, applying sanitization...`);

    // Remove trailing commas: ", }" -> "}" and ", ]" -> "]"
    let sanitized = jsonCandidate.replace(/,\s*([}\]])/g, '$1');

    // Strip non-printable control characters except \r, \n, \t
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    try {
      return JSON.parse(sanitized);
    } catch (secondErr: any) {
      // If unclosed structure (e.g. truncated response), try auto-closing
      if (depth > 0) {
        let autoClosed = sanitized.trim();
        if (inString) autoClosed += '"';
        while (depth > 0) {
          autoClosed += isObject ? '}' : ']';
          depth--;
        }
        try {
          return JSON.parse(autoClosed);
        } catch (_) {}
      }
      console.error('[JSONParser] Sanitized parse failed:', secondErr);
      throw initialErr;
    }
  }
}

async function generateItineraryContent(ai: GoogleGenAI, userPrompt: string): Promise<string> {
  return generateWithRetry(ai, userPrompt, SYSTEM_INSTRUCTION);
}

// API route to generate an itinerary
app.post('/api/itinerary/generate', async (req: Request, res: Response) => {
  try {
    const {
      city,
      country = '',
      daysCount = 3,
      budgetLevel = 'mid',
      interests = [],
      includeStays = true,
    } = req.body;

    const pace = req.body.pace || req.body.pacePreference || 'moderate';
    const customNotes = req.body.customNotes || req.body.notes || '';

    if (!city || typeof city !== 'string') {
      res.status(400).json({ error: 'City is required' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json({
        error: 'Servers are busy, please try again in a minute',
        code: 'MISSING_API_KEY'
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const userPrompt = `Generate a realistic ${daysCount}-day travel itinerary for:
City: ${city}
Country: ${country || 'detect accurately'}
Budget level: ${budgetLevel}
Key interests: ${interests.length > 0 ? interests.join(', ') : 'general highlights, culture, food, landmarks'}
Pace: ${pace}
Include stays: ${includeStays ? 'Yes, include 3 real hotels/hostels matching budget' : 'No (empty array)'}
${customNotes ? `Additional requirements: ${customNotes}` : ''}

Remember: Output ONLY valid JSON matching the exact schema. Strictly adhere to all rules, approximate 4-decimal lat/lng coordinates for each stop, realistic entry prices or null/0, sensible non-zigzag visiting order, and 2 food spots per day.`;

    const rawText = await generateItineraryContent(ai, userPrompt);
    const parsedJson = parseJsonFromLlm(rawText);

    res.json({
      success: true,
      itinerary: parsedJson,
      data: parsedJson,
      rawJson: JSON.stringify(parsedJson, null, 2)
    });
  } catch (error: any) {
    console.error('Error generating itinerary:', error);
    res.status(503).json({
      error: 'Servers are busy, please try again in a minute'
    });
  }
});

const TRANSPORTATION_SEARCH_INSTRUCTION = `You are an AI travel transportation assistant. You output ONLY valid JSON matching the schema below. No markdown fences, no code blocks, no text before or after the JSON.

Rules:
- Provide approximately 3 to 5 realistic, well-known train or flight options for the requested journey.
- Use real train names (e.g. Shatabdi Express, Rajdhani Express, Vande Bharat Express, Superfast, Mail, Shinkansen, etc.) or real airlines (e.g. IndiGo, Air India, Vistara, SpiceJet, etc.).
- Approximate departure/arrival times, durations, and fares must be realistic estimates for the route and classes in local currency (e.g. ₹ or local symbol).
- For trains: include relevant classes (e.g. SL, 3A, 2A, 1A, CC, EC) and estimated fares.
- All returned data is estimated and AI-generated.
- Never output markdown or extra text.

Schema for mode == 'train':
{
  "mode": "train",
  "disclaimer": "AI-generated transportation information. Fares and schedules are estimates and are not live booking information.",
  "options": [
    {
      "id": string,
      "name": string,
      "number": string,
      "startingStation": string,
      "destinationStation": string,
      "departureTime": string,
      "arrivalTime": string,
      "duration": string,
      "classes": [
        { "className": string, "fare": string }
      ]
    }
  ]
}

Schema for mode == 'flight':
{
  "mode": "flight",
  "disclaimer": "AI-generated transportation information. Fares and schedules are estimates and are not live booking information.",
  "options": [
    {
      "id": string,
      "airline": string,
      "flightNumber": string,
      "departureAirport": string,
      "arrivalAirport": string,
      "departureTime": string,
      "arrivalTime": string,
      "duration": string,
      "cabinClass": string,
      "fare": string
    }
  ]
}`;

const TRANSPORTATION_DETAILS_INSTRUCTION = `You are an AI travel guide providing comprehensive journey details for an estimated train or flight option. You output ONLY valid JSON matching the schema below. No markdown fences, no code blocks, no text before or after the JSON.

Rules:
- Clearly explain the train/flight route, key transit stations/stops, and total duration.
- Explain what the selected travel class means (e.g., SL = Sleeper class with non-AC berths, 3A = AC 3 Tier with air conditioning, linen and reading lamps, 2A = AC 2 Tier with privacy curtains and wider berths, 1A = First Class AC lockable coupes/cabins, or Economy vs Business class seats, baggage allowance, meals).
- Provide general amenities (catering/pantry, bedding, charging ports, cleanliness).
- Provide approximate fare guidance and 3 to 4 practical travel tips.
- All info is AI-generated and estimated.

Schema:
{
  "title": string,
  "mode": "train" | "flight",
  "identifier": string,
  "overview": string,
  "route": string,
  "duration": string,
  "classMeaning": string,
  "classInfo": string,
  "estimatedFare": string,
  "travelTips": string[],
  "disclaimer": "AI-generated transportation information. Fares and schedules are estimates and are not live booking information."
}`;

// API route to search transportation options (Train / Flight)
app.post('/api/transportation/search', async (req: Request, res: Response) => {
  try {
    const {
      mode = 'train',
      destinationCity,
      startingStation,
      destinationStation,
      journeyDate,
      quota,
      preferredClass,
      departureCity,
      arrivalCity,
      cabinClass
    } = req.body;

    if (!destinationCity) {
      res.status(400).json({ error: 'Destination city is required' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json({
        error: 'Servers are busy, please try again in a minute',
        code: 'MISSING_API_KEY'
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    let prompt = '';
    if (mode === 'train') {
      prompt = `Generate 3 to 5 realistic train options for travel to destination:
Destination City: ${destinationCity}
Starting Station: ${startingStation || 'Major connecting hub'}
Destination Station: ${destinationStation || `${destinationCity} Railway Station`}
Date of Journey: ${journeyDate || 'Upcoming date'}
Quota: ${quota || 'General'}
Preferred Class: ${preferredClass || 'Any'}

Remember: Output ONLY valid JSON matching the schema for mode 'train'. Include realistic train numbers, names, approximate times, durations, and classes (SL, 3A, 2A, 1A, etc.) with approximate fare in local currency.`;
    } else {
      prompt = `Generate 3 to 5 realistic flight options for travel to destination:
Destination City: ${destinationCity}
Departure City / Airport: ${departureCity || 'Major domestic/international airport'}
Arrival City / Airport: ${arrivalCity || `${destinationCity} Airport`}
Date of Journey: ${journeyDate || 'Upcoming date'}
Preferred Cabin Class: ${cabinClass || 'Economy'}

Remember: Output ONLY valid JSON matching the schema for mode 'flight'. Include realistic airlines, flight numbers, approximate departure/arrival, duration, and approximate fare in local currency.`;
    }

    const rawText = await generateWithRetry(ai, prompt, TRANSPORTATION_SEARCH_INSTRUCTION);
    const parsedJson = parseJsonFromLlm(rawText);

    res.json({
      success: true,
      data: parsedJson
    });
  } catch (error: any) {
    console.error('Error in /api/transportation/search:', error);
    res.status(503).json({
      error: 'Servers are busy, please try again in a minute'
    });
  }
});

// API route to get detailed travel information for a selected train or flight
app.post('/api/transportation/details', async (req: Request, res: Response) => {
  try {
    const { mode = 'train', item, destinationCity, selectedClass } = req.body;

    if (!item) {
      res.status(400).json({ error: 'Item details are required' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json({
        error: 'Servers are busy, please try again in a minute',
        code: 'MISSING_API_KEY'
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    let prompt = '';
    if (mode === 'train') {
      prompt = `Provide comprehensive travel details and guidance for this train:
Train Name: ${item.name} (${item.number})
Route: ${item.startingStation} to ${item.destinationStation}
Destination: ${destinationCity}
Approximate Duration: ${item.duration}
Selected / Preferred Class: ${selectedClass || item.selectedClass || '3A / Sleeper'}
Available Classes: ${JSON.stringify(item.classes || [])}

Include:
1. Overview of the train's reputation and service
2. Key route and prominent intermediate junctions
3. Journey duration and schedule feel
4. What the selected class (${selectedClass || 'the relevant class'}) means in practice (type of berth, AC, linen, privacy)
5. General class amenities (charging, meals, luggage)
6. Approximate fare range
7. 3-4 practical travel tips for passengers on this route.

Output ONLY valid JSON matching the schema.`;
    } else {
      prompt = `Provide comprehensive travel details and guidance for this flight:
Airline: ${item.airline}
Flight Number: ${item.flightNumber}
Route: ${item.departureAirport} to ${item.arrivalAirport}
Destination: ${destinationCity}
Duration: ${item.duration}
Cabin Class: ${item.cabinClass || selectedClass || 'Economy'}
Approximate Fare: ${item.fare}

Include:
1. Flight and airline overview
2. Route and flight path info
3. Journey duration & transit considerations
4. What the cabin class (${item.cabinClass || 'Economy'}) means (baggage allowance, seat pitch, in-flight service)
5. General amenities
6. Approximate fare context
7. 3-4 practical travel tips (airport arrival time, boarding tips, ground transport at destination).

Output ONLY valid JSON matching the schema.`;
    }

    const rawText = await generateWithRetry(ai, prompt, TRANSPORTATION_DETAILS_INSTRUCTION);
    const parsedJson = parseJsonFromLlm(rawText);

    res.json({
      success: true,
      data: parsedJson
    });
  } catch (error: any) {
    console.error('Error in /api/transportation/details:', error);
    res.status(503).json({
      error: 'Servers are busy, please try again in a minute'
    });
  }
});


// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', hasApiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// Explicit error handler for all /api routes to prevent HTML error responses
app.use('/api', (err: any, _req: Request, res: Response, _next: any) => {
  console.error('[API Error Handler]:', err);
  if (!res.headersSent) {
    res.status(503).json({
      error: 'Servers are busy, please try again in a minute',
      success: false,
    });
  }
});

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
