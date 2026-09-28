import { useState } from 'react';
import { Copy, Check, Terminal, FileText, CheckCircle2 } from 'lucide-react';

const SYSTEM_PROMPT_TEXT = `You are a travel itinerary generator. You output ONLY valid JSON that
matches the schema below. No markdown, no code fences, no text before
or after the JSON.

Rules:
- Use only real, well-known places that actually exist in the given city.
  Never invent a place. If you are unsure a place exists, leave it out.
- Choose places that match the user's interests and budget level.
- Each day must have 3 to 4 stops. Group each day's stops by geographic
  proximity and list them in a sensible visiting order, so the day does
  not zigzag across the city.
- Do not put the same place on two different days.
- Provide approximate latitude and longitude (4 decimal places) for each
  stop. They must be inside the given city.
- est_entry_price is an APPROXIMATE entry fee in the local currency.
  Use min 0 and max 0 for free places. If you do not know the price,
  set min and max to null. Never guess wildly.
- "category" must be one of: history, food, nature, nightlife,
  shopping, art, other.
- Food: suggest 2 well-known places per day near that day's stops.
- Stays: suggest 3 real hotels or hostels that fit the budget level,
  and set "include" in the output as requested.
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

export function SystemPromptViewer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SYSTEM_PROMPT_TEXT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="rounded-sm border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-indigo-600 text-white flex items-center justify-center">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              System Prompt & Schema Specification
            </h3>
            <p className="text-xs text-slate-500">
              The exact system instructions and rules executing on the server
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-sm transition flex items-center gap-1.5 shadow-xs"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied Prompt!' : 'Copy System Prompt'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-sm bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-800 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Strict Geo-Proximity</span>
          </div>
          <p className="text-[11px] text-slate-500">
            3-4 stops per day in visiting order so days do not zigzag across the city.
          </p>
        </div>
        <div className="p-3 rounded-sm bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-800 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Real Places & Currency</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Real landmarks only, 4 decimal places lat/lng coordinates, accurate admission fees.
          </p>
        </div>
        <div className="p-3 rounded-sm bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-800 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Pure JSON Output</span>
          </div>
          <p className="text-[11px] text-slate-500">
            No markdown, no fences, no chat text. 100% parseable JSON payload.
          </p>
        </div>
      </div>

      <div className="relative rounded-sm bg-slate-950 p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[460px] leading-relaxed">
        <pre className="text-amber-300">
          <code>{SYSTEM_PROMPT_TEXT}</code>
        </pre>
      </div>
    </div>
  );
}
