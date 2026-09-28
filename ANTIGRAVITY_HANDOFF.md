# ANTIGRAVITY HANDOFF: TRAVELX / ITINERARYGEN

This document provides a comprehensive, accurate technical handoff for continuing development of the **TravelX / ItineraryGen** project in **Google Antigravity**. It details the current codebase, architecture, integrations, data structures, known limitations, and rules for future iterations.

---

## 1. Project Overview

**TravelX** (registered as `ItineraryGen - Travel Itinerary Generator` in `metadata.json`) is a full-stack web application designed to generate, customize, visualize, and export realistic, structured travel itineraries.

### Core Purpose
1. **3-Screen User Journey**: Offers a seamless navigation flow from Home Page search discovery → dedicated Search & Planning Window → comprehensive Itinerary Results Studio, fully synchronized with browser history and URL hash routing (`#home`, `#search`, `#results`).
2. **Intelligent Itinerary Generation**: Generates 1 to 5-day itineraries adhering strictly to an exact JSON schema using Google Gemini models (`gemini-2.5-flash` with fallback to `gemini-3.8-flash`).
3. **Geographic Proximity Routing**: Curates 3 to 4 stops per day in a sensible, non-zigzag geographical sequence to maximize travel efficiency.
4. **Budget & Experience Realism**: Incorporates estimated attraction entry fees in local currency, authentic local culinary spots (2 per day), and budget-matched accommodations (3 per city).
5. **Dual-Mode Experience**: Offers both an interactive visual studio (with timeline cards, statistics, and OpenStreetMap Leaflet visualization) and a pure Raw JSON view with syntax highlighting, schema validation, 1-click clipboard copy, and file download.
6. **Travel to Destination (Transportation)**: An optional feature allowing travelers to explore estimated train and flight connections to reach the destination city, complete with class fare estimates, amenities, and AI-generated travel guidance.
7. **100% Free Tier**: Built entirely on zero-cost infrastructure: Gemini free-tier API, open-source Leaflet / OpenStreetMap (no map keys), and in-memory client state.

---

## 2. Current Feature Set

### Implemented Features

| Feature | Description | Implementation Location |
| :--- | :--- | :--- |
| **Home Page Discovery** | Hero search bar with destination and duration inputs, popular destination quick-select chips, curated destination cards, and architecture highlight cards. | `src/components/HomePage.tsx` |
| **Dedicated Search Window** | Focused planning window taking destination city/country, duration (1–5 days), budget tier (`low`, `mid`, `high`), pace (`relaxed`, `moderate`, `packed`), interest tags, and custom notes. Features instant preset detection and animated progress tracking. | `src/components/SearchWindow.tsx` |
| **Robust LLM JSON Parser** | Server-side depth-tracking boundary parser (`parseJsonFromLlm`) that isolates the outermost `{ ... }` structure, strips trailing markdown fences/commentary, sanitizes trailing commas, and handles unclosed structures. | `server.ts` |
| **Structured API Error Middleware** | Express middleware on `/api/*` ensuring errors always respond with `{ error: '...', success: false }` JSON, eliminating unexpected HTML `<!doctype` syntax errors. | `server.ts` |
| **AI Itinerary Generation** | Full generation engine supporting both `GeneratorDrawer.tsx` and `SearchWindow.tsx` with dual payload compatibility (`data` and `itinerary`). | `server.ts`, `src/types.ts` |
| **Strict JSON Schema Conformance** | Backend prompts enforce an exact schema with no markdown fences, returning pure valid JSON. | `server.ts`, `src/types.ts` |
| **Itinerary Presets** | 6 comprehensive pre-crafted itineraries for instant demo loading with zero latency: **Jaipur**, **Lucknow**, **Noida**, **Kyoto**, **Rome**, and **Barcelona**. | `src/data/presets.ts` |
| **Day-by-Day Timeline** | Tabbed day navigation (`Day 1`, `Day 2`, `Day 3`... or `All Days`) showing daily theme, duration, and stop sequence. | `src/App.tsx`, `src/components/StopCard.tsx` |
| **Interactive Map View** | Real OpenStreetMap tiles via Leaflet with custom colored circular pins matching category, order numbers (1 → 2 → 3 → 4), popups, and zoom controls. | `src/components/MapView.tsx` |
| **Geographic Proximity Routing** | Sequential dashed polylines connecting consecutive stops in visiting order so days do not zigzag. | `src/components/MapView.tsx` |
| **Stop Details & Inline Editing** | Stop cards show name, category, time of day (`morning`, `afternoon`, `evening`), duration, entry fee, GPS lat/lng, and external Google Maps links. Users can edit stops directly in the UI. | `src/components/StopCard.tsx` |
| **Daily Culinary Stops** | 2 authentic culinary stops suggested per day near that day's stops, with cuisine type, description, price level, and map search link. | `src/components/FoodSection.tsx` |
| **Curated Accommodations** | 3 real hotels/hostels tailored to the budget tier with neighborhood/area, price tier, description, and direct map link. | `src/components/StaysSection.tsx` |
| **Trip Budget & Analytics Widget** | Computes estimated total entrance fee range in local currency, total planned hours, average hours/day, and category distribution. | `src/components/BudgetSummary.tsx` |
| **Raw JSON Mode & Schema Validator** | Live formatted code view of the itinerary JSON, schema validation indicator, 1-click Copy, `.json` file download, and paste/edit mode. | `src/components/RawJsonViewer.tsx`, `src/utils/itineraryHelper.ts` |
| **System Prompt Inspector** | Dedicated tab displaying the exact server-side prompt instructions and schema rules. | `src/components/SystemPromptViewer.tsx` |
| **🚆 Train Transportation Options** | Search form with starting station, journey date, quota (`General`, `Tatkal`, `Other`), and preferred class (`SL`, `3A`, `2A`, `1A`, `CC`, `EC`). Auto-determines destination station. Displays 3–5 trains with duration and class fares. | `src/components/TransportationSection.tsx`, `server.ts` |
| **✈️ Flight Transportation Options** | Search form with departure airport, journey date, cabin class (`Economy`, `Premium Economy`, `Business`, `First`), auto-determined arrival airport. Displays 3–5 flights with airline, times, duration, and fare. | `src/components/TransportationSection.tsx`, `server.ts` |
| **Transportation Detail Deep-Dive** | Modal view showing AI-generated journey overview, key transit route, class explanation (what berths/seats mean), amenities, and practical travel tips. | `src/components/TransportationDetailModal.tsx`, `server.ts` |
| **Prominent Disclaimers** | Unambiguous notices clarifying that transportation schedules and fares are AI-generated estimates and not live booking data. | `src/components/TransportationSection.tsx`, `src/components/TransportationDetailModal.tsx` |
| **Print / PDF Export** | Clean print stylesheet support via native `window.print()`. | `src/App.tsx` |

### Planned (Not Yet Implemented) Features
- User authentication & user accounts.
- Persistent database storage (Supabase).
- Community sharing & discovery feed.
- Upvoting / bookmarking / cloning public itineraries.
- Live booking or ticketing integration (IRCTC, airlines).

---

## 3. Current Architecture

The project is structured as a **Full-Stack Single-Port Application** where Express and Vite run within the same Node.js process on port 3000.

```
┌────────────────────────────────────────────────────────────────────────┐
│                                Browser                                 │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                       React 19 SPA (Vite)                        │  │
│  │  - URL Hash Router: #home <-> #search <-> #results               │  │
│  │  - HomePage (Hero search bar, featured cards, features)          │  │
│  │  - SearchWindow (Destination, duration, budget, pace, tags)      │  │
│  │  - Itinerary Studio (Timeline, StopCard inline edit, MapView)    │  │
│  │  - MapView (Leaflet + OpenStreetMap tiles, ordered pins)         │  │
│  │  - FoodSection, StaysSection, BudgetSummary, RawJsonViewer       │  │
│  │  - TransportationSection & DetailModal (Train & Flight routes)   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ REST / JSON (fetch with safe text/json guard)
┌───────────────────────────────────▼────────────────────────────────────┐
│                      Express Backend (server.ts)                       │
│  - POST /api/itinerary/generate                                        │
│  - POST /api/transportation/search                                     │
│  - POST /api/transportation/details                                    │
│  - GET  /api/health                                                    │
│  - Robust JSON extraction: parseJsonFromLlm() with depth tracking      │
│  - Explicit JSON error middleware for /api/* routes                    │
│  - Vite middleware (Dev) / Static files (Prod)                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Server-side SDK calls (@google/genai)
┌───────────────────────────────────▼────────────────────────────────────┐
│                            Google Gemini API                           │
│  - Primary: gemini-2.5-flash                                           │
│  - Fallback: gemini-3.8-flash                                          │
│  - Retry: 3 attempts (2s, 4s, 8s backoff)                              │
│  - Response: application/json (pure text strictly parsed)              │
└────────────────────────────────────────────────────────────────────────┘
```

### Communication Flow
1. **Client to Server**: The browser React app makes standard `fetch` POST requests with `Content-Type: application/json` to `/api/*` endpoints.
2. **Server to Gemini**: The Express server initializes `GoogleGenAI` using `process.env.GEMINI_API_KEY`.
3. **Execution**: The server executes `generateWithRetry()`:
   - Tries primary model `gemini-2.5-flash`.
   - On transient errors, retries up to 3 times with 2s, 4s, and 8s backoff.
   - If still failing, falls back to `gemini-3.8-flash`.
   - If all attempts fail, returns HTTP 503 with `{ error: "Servers are busy, please try again in a minute", success: false }`.
4. **Depth-Tracking Parsing**: Raw LLM output is processed by `parseJsonFromLlm()`, which uses an exact character-level depth tracker to isolate the root `{ ... }` block, stripping any trailing markdown commentary.
5. **Response Delivery**: Parsed JSON is sent to the client as `{ success: true, itinerary: parsedJson, data: parsedJson, rawJson: "..." }`.

---

## 4. Important Files

```
├── ANTIGRAVITY_HANDOFF.md         # This technical handoff document
├── .env.example                   # Template for environment variables (GEMINI_API_KEY, APP_URL)
├── index.html                     # HTML entry point with metadata, titles, and root mounting div
├── metadata.json                  # AI Studio project metadata & server-side Gemini capability
├── package.json                   # Dependencies, devDependencies, and npm scripts ("dev": "tsx server.ts")
├── server.ts                      # Full-stack entry point: Express server, Vite middleware, Gemini API endpoints, parseJsonFromLlm
├── tsconfig.json                  # TypeScript compiler options (bundler resolution, node types)
├── vite.config.ts                 # Vite bundler configuration with Tailwind CSS v4 and React plugins
└── src/
    ├── main.tsx                   # React root render + Leaflet CSS import
    ├── index.css                  # Global Tailwind v4 CSS (@import "tailwindcss";)
    ├── App.tsx                    # Main visual application shell, URL hash router (#home, #search, #results)
    ├── types.ts                   # Core TypeScript types for Itinerary, Stops, Food, Stays, and Transport
    ├── data/
    │   └── presets.ts             # 6 hardcoded preset itineraries (Jaipur, Lucknow, Noida, Kyoto, Rome, Barcelona)
    ├── utils/
    │   └── itineraryHelper.ts     # Schema validation, category styling, currency formatting, budget calculations
    └── components/
        ├── HomePage.tsx           # Screen 1: Home Page with hero search bar, featured cities, and feature highlights
        ├── SearchWindow.tsx       # Screen 2: Dedicated search and customization window with animated progress bar
        ├── MapView.tsx            # Leaflet map component with OpenStreetMap tiles, custom marker pins & route polylines
        ├── StopCard.tsx           # Individual stop card with time, category, duration, fee, lat/lng, and inline editor
        ├── FoodSection.tsx        # Daily culinary recommendation card (2 spots/day)
        ├── StaysSection.tsx       # Curated accommodations section (3 stays/city)
        ├── BudgetSummary.tsx      # Analytics ribbon (total fees, total hours, stops count, experience breakdown)
        ├── RawJsonViewer.tsx      # Pure JSON viewer with validation badge, copy, download, and JSON editor
        ├── SystemPromptViewer.tsx # System prompt and schema rules viewer
        ├── GeneratorDrawer.tsx    # Slide-over modal to customize and trigger AI itinerary generation
        ├── TransportationSection.tsx     # Optional "Travel to [Destination]" section with Train & Flight tabs
        └── TransportationDetailModal.tsx # Detailed view of selected train/flight class, route, and travel tips
```

---

## 5. Gemini Integration

### Models
- **Primary Model**: `gemini-2.5-flash` (low latency, high throughput, free tier).
- **Fallback Model**: `gemini-3.8-flash` (used if primary retries fail).

### API Integration & Key Handling
- **SDK**: Modern `@google/genai` (v2.4.0) SDK.
- **Location**: **Server-side only** inside `server.ts`.
- **API Key Storage**: Loaded strictly from `process.env.GEMINI_API_KEY`.
- **Browser Protection**: The API key is **never** sent to the client, never embedded in Vite bundles, and no client-side API key configuration UI is present.
- **Telemetry**: Server sets headers `{ 'User-Agent': 'aistudio-build' }`.

### Depth-Tracking JSON Parser (`server.ts`)
To prevent `SyntaxError: Unexpected non-whitespace character after JSON` when models output trailing text or markdown fences, `parseJsonFromLlm()` performs:
1. Fast-path direct parsing attempt.
2. Code block fence extraction (` ```json ... ``` `).
3. Exact character-level depth tracking (`{` increments depth, `}` decrements depth, ignores characters inside quotes or escaped sequences).
4. Slices text at the exact index where `depth === 0` for the root object.
5. Sanitizes trailing commas before closing braces/brackets (`,\s*([}\]])` -> `$1`).
6. Recovers unclosed structures if generation was truncated.

---

## 6. Itinerary Data Structure

The application strictly expects and produces the following JSON structure:

```typescript
export type Category = 'history' | 'food' | 'nature' | 'nightlife' | 'shopping' | 'art' | 'other';
export type BestTime = 'morning' | 'afternoon' | 'evening';
export type PriceLevel = 'low' | 'mid' | 'high';

export interface EntryPrice {
  min: number | null; // 0 for free, null if unknown, number for approximate fee
  max: number | null;
}

export interface Stop {
  name: string;
  category: Category;
  description: string;       // One short sentence
  best_time: BestTime;
  duration_hours: number;
  lat: number;               // Approximate 4 decimal places
  lng: number;               // Approximate 4 decimal places
  est_entry_price: EntryPrice;
}

export interface FoodSpot {
  name: string;
  cuisine: string;
  description: string;
  price_level: PriceLevel;
}

export interface DayPlan {
  day: number;
  theme: string;
  stops: Stop[];             // 3 to 4 stops grouped by geographic proximity
  food: FoodSpot[];          // Exactly 2 food spots near that day's stops
}

export interface StaySpot {
  name: string;
  type: string;
  area: string;
  price_level: PriceLevel;
  description: string;
}

export interface Itinerary {
  city: string;
  country: string;
  currency: string;
  summary: string;
  days: DayPlan[];
  stays: StaySpot[];         // 3 curated stays
}
```

---

## 7. Demo Presets

All demo presets are stored statically in `src/data/presets.ts`.

### 1. Jaipur, Rajasthan, India (`jaipur`)
- **Duration**: 2 days | **Budget**: Mid | **Pace**: Moderate
- **Themes**: History & Heritage, Art & Museums, Food & Street Markets
- **Currency**: `INR` (₹).
- **Day 1**: *Amer Fort Heritage, Traditional Textile Art & Historic Bazaars* (Amber Palace, Anokhi Museum of Hand Printing, Jal Mahal, Johari & Bapu Bazaar; Food: LMB, Rawat Mishthan Bhandar).
- **Day 2**: *Royal Palaces, Celestial Observatories & Heritage Art* (City Palace, Jantar Mantar, Hawa Mahal, Albert Hall Museum; Food: Peacock Rooftop, Tapri Central).
- **Stays**: Alsisar Haveli (Mid), Shahpura House (Mid), Umaid Bhawan Heritage House Hotel (Mid).
- **Transportation Preset**: Jaipur Junction (`JP`), Jaipur International Airport (`JAI`), sample Marudhar Express, Shatabdi, Vande Bharat, and domestic flights.

### 2. Lucknow, Uttar Pradesh, India (`lucknow`)
- **Duration**: 2 days | **Budget**: Mid | **Pace**: Moderate
- **Themes**: History & Heritage, Art & Museums, Food & Street Markets
- **Currency**: `INR` (₹).
- **Day 1**: *Nawabi Imambara Architecture, Rumi Darwaza & Historic Chowk* (Bara Imambara, Rumi Darwaza, Chota Imambara, Chowk Heritage Bazaars; Food: Tunday Kababi, Rahim's Kulcha Nihari).
- **Day 2**: *Residency Heritage, State Art Museum & Hazratganj Promenade* (The British Residency, State Museum Lucknow, Chattar Manzil, Hazratganj Promenade; Food: Dastarkhwan, Royal Cafe).
- **Stays**: Lebua Lucknow (Mid), The Piccadily Lucknow (Mid), Fairfield by Marriott Lucknow (Mid).
- **Transportation Preset**: Lucknow Charbagh (`LKO`), Lucknow Airport (`LKO`), sample Tejas Express, Shatabdi, Pushpak Express, and domestic flights.

### 3. Noida, Uttar Pradesh, India (`noida`)
- **Duration**: 2 days | **Budget**: Mid | **Pace**: Moderate
- **Themes**: History & Heritage, Nightlife & Bars, Food & Street Markets
- **Currency**: `INR` (₹).
- **Day 1**: *Sandstone Memorial Heritage, Bird Sanctuary & Sector 18 Nightlife* (Rashtriya Dalit Prerna Sthal & Museum, Okhla Bird Sanctuary, Atta Market & Sector 18 Bazaar, Gardens Galleria Nightlife Hub; Food: Brahmaputra Market Sector 29, Imperfecto Ruin Pub).
- **Day 2**: *Spiritual Heritage, Local Haat Crafts & Skyline Evening Lounges* (ISKCON Temple Noida, Noida Haat & Cultural Center, Sector 50 Street Food & Central Market, Advant Navis Skyline Lounges; Food: Bikanervala Sector 18, Skyhouse Bar & Grill).
- **Stays**: Radisson Blu Hotel Noida (Mid), Mosaic Hotel Noida (Mid), Park Ascent (Mid).
- **Transportation Preset**: Hazrat Nizamuddin (`NZM`) / Anand Vihar (`ANVT`), Indira Gandhi International Airport (`DEL`) / Noida Airport (`DXN`), Vande Bharat Express, Bhopal Shatabdi, and domestic flights.

### Other Presets
- **Kyoto, Japan** (`kyoto`).
- **Rome, Italy** (`rome`).
- **Barcelona, Spain** (`barcelona`).

---

## 8. Map Implementation

- **Library**: `leaflet` (v1.9.4) with `@types/leaflet` (v1.9.22).
- **CSS**: Imported globally via `import 'leaflet/dist/leaflet.css';` in `src/main.tsx`.
- **Tile Provider**: OpenStreetMap standard tile layer (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).
- **Cost & API Key**: **Zero cost, zero API keys required**.
- **Marker Implementation**: Custom HTML DOM icons created with `L.divIcon` displaying a colored circular pill with the stop sequence number (1, 2, 3, 4), category color coding, white border, drop shadow, and downward directional pointer.
- **Route Line Implementation**: `L.polyline` connecting consecutive day stops with dashed styling (`dashArray: '6, 8'`, weight: 3.5, opacity: 0.85).
- **Coordinates Source**: Lat/lng coordinates are generated by Gemini as part of the itinerary JSON (approximated to 4 decimal places within the city).
- **Routing Engine**: Visual sequential straight-line polylines between consecutive stops. No external turn-by-turn routing or geocoding API is called.

---

## 9. Transportation Feature

### How It Works
1. **Optional Entry Point**: A dedicated banner and button `"Travel to [Destination]"` appears after the itinerary.
2. **User Inputs**:
   - **Train**: Starting station, journey date, quota (`General`, `Tatkal`, `Other`), preferred class (`Any`, `SL`, `3A`, `2A`, `1A`, `CC`, `EC`). Destination station is auto-inferred (e.g. `Jaipur Junction (JP)`).
   - **Flight**: Departure city/airport, journey date, cabin class (`Economy`, `Premium Economy`, `Business`, `First`). Arrival airport is auto-inferred.
3. **Search Endpoint**: Calls `POST /api/transportation/search`. Gemini generates 3 to 5 realistic options matching the route and class criteria.
4. **Details Endpoint**: User clicks **[View Details]** on any card, triggering `POST /api/transportation/details`. Gemini generates:
   - Overview of the service.
   - Transit route and prominent junctions.
   - What the selected class provides (berth type, AC, linen, privacy, seat pitch, baggage).
   - Estimated fare guidance.
   - 3 to 4 practical travel tips.
5. **No External Transportation APIs**:
   - **No connection to IRCTC, Indian Railways, or airline GDS/APIs.**
   - All schedules, train numbers, and fares are **AI-generated estimates**.
   - A mandatory disclaimer is prominently rendered in the UI:  
     `"AI-generated transportation information. Fares and schedules are estimates and are not live booking information."`

---

## 10. UI Navigation Structure

The application features a clean, dedicated 3-screen user journey:

1. **Home Page (`src/components/HomePage.tsx`)**:
   - Hero banner with inspiring search bar: *"Where do you want to explore next?"*.
   - Direct destination query and duration selector with *"Search & Plan"* action.
   - Quick-explore chips for popular destinations (Jaipur, Lucknow, Noida, Kyoto, Rome, Barcelona).
   - Curated destination cards with highlights and *"Explore Itinerary"* or *"Customize Inputs"* actions.
   - Core value-proposition feature cards (Geographic routing, local dining, transit connections, JSON export).

2. **Search & Planning Window (`src/components/SearchWindow.tsx`)**:
   - Clean, dedicated planning window taking user input:
     - Destination City and Country (with popular destination quick-select buttons).
     - Instant preset banner if destination has a pre-crafted itinerary.
     - Trip duration picker (1 to 5 days).
     - Budget tier selector (Budget, Mid-Range, Luxury).
     - Pace preference (Relaxed, Moderate, Packed).
     - Key interests & themes multi-select tags (History, Art, Food, Nightlife, Nature, Shopping, etc.).
     - Custom notes / special requests.
   - Animated step-by-step progress indicator during Gemini AI generation.
   - Error banner with 1-click fallback button to load verified presets if servers are busy.
   - *"Back to Home"* navigation link.

3. **Results View: Itinerary Studio (`src/App.tsx`)**:
   - **Header**:
     - *"← Home"* button to return to the Home page.
     - *"🔍 New Search"* button to reopen the Search Window with current parameters.
     - Destination summary, currency badge, and country indicator.
     - View switcher: `Itinerary Studio` | `Raw JSON` | `Prompt & Rules`.
     - Presets bar: `Jaipur`, `Lucknow`, `Noida`, `Kyoto`, `Rome`.
   - **Studio Layout**:
     - **Left Column**: Day tabs, theme card, ordered stop cards with inline editing, daily food spots.
     - **Right Column**: Sticky interactive Leaflet map with sequenced markers and route polyline.
     - **Accommodations Section**: 3 curated hotels/hostels matching the budget level.
     - **Transportation Section**: Estimated train & flight connections, class fares, and detail modal.

---

## 11. Current Environment Configuration

### Required Environment Variables
Defined in `.env.example`:
- `GEMINI_API_KEY`: Required for server-side Gemini API calls (`@google/genai`).
- `APP_URL`: Self-referential base URL for deployment.
- `PORT`: (Optional) Server listen port (defaults to `3000`).
- `NODE_ENV`: Set to `production` when building/serving production bundles.

> **CRITICAL**: Never commit actual API keys or secrets to version control.

---

## 12. Current Known Limitations

1. **Simulated Transportation Data**: Train schedules, train numbers, flight times, and fares are AI-estimated guidelines for trip planning. They do not represent live inventory or seat availability.
2. **Straight-Line Map Routes**: Polylines connect stops in straight segments to illustrate geographic sequence; they do not calculate turn-by-turn road driving directions.
3. **In-Memory Client State**: Itinerary modifications (inline edits, newly generated trips) live in React component state. Refreshing the browser resets the app to the selected preset.
4. **No User Accounts / Database**: There is currently no persistent database or user authentication layer.

---

## 13. Important Existing Decisions

1. **Keep Gemini Calls on the Server**: All calls to `@google/genai` are handled exclusively in `server.ts`. Never import `@google/genai` on the frontend or expose `GEMINI_API_KEY`.
2. **Flash as Default with Backoff & Flash Fallback**: Keeps generation snappy on free-tier while ensuring resilience against high-demand errors through automated retries.
3. **Robust Depth-Tracking JSON Parsing**: Uses `parseJsonFromLlm()` on the server to prevent any syntax errors from trailing LLM markdown or commentary.
4. **Safe Response Parsing on Client**: All client-side fetch calls parse `response.text()` before `JSON.parse` inside try/catch blocks, ensuring user-friendly error banners if a network or gateway failure occurs.
5. **Preserve Exact JSON Schema**: The frontend parser, validator, and stop renderers rely strictly on the schema defined in `src/types.ts`.
6. **Leaflet + OpenStreetMap**: Zero API key dependencies for map rendering; reliable, lightweight, and 100% free tier.
7. **No Booking / Payment in Prototype**: Transportation is strictly exploratory and educational.

---

## 14. Planned Next Development (Roadmap)

The intended next phase of development in Antigravity:

1. **Move Development to Antigravity**: Establish the project in Google Antigravity and verify builds.
2. **Make Remaining UI Refinements**: Polish styling, micro-interactions, and mobile responsiveness.
3. **Integrate Supabase**:
   - Set up Supabase client and schema.
   - Create tables for `itineraries`, `users`, and `community_shares`.
4. **Add Authentication / Login**:
   - Supabase Auth (Email / OAuth).
   - User profile management.
   - Private saved itineraries per user.
5. **Add Community Section**:
   - Explore public itineraries created by other travelers.
   - Filter by destination city, country, or tag.
6. **Allow Users to Share Itineraries to Community**:
   - "Publish to Community" toggle on saved itineraries.
   - Public view links.
7. **Allow Other Users to View Shared Itineraries**:
   - Read-only community itinerary viewer.
   - "Clone / Customize Itinerary" button to fork a community trip into personal studio.
8. **Additional Community Functionality (Only If Needed)**:
   - Upvotes / likes.
   - Comments / travel tips from community members.

---

## 15. Rules for Antigravity

When continuing development in Antigravity, follow these engineering directives:

1. **Do Not Break Existing Functionality**:
   - The itinerary generator, Leaflet map, Raw JSON validator, stop editor, and transport feature must continue functioning.
2. **Do Not Expose API Keys**:
   - Never import `@google/genai` on the client or put secrets into client-accessible files.
3. **Preserve the Itinerary JSON Schema**:
   - Do not alter the fields of `Itinerary`, `DayPlan`, `Stop`, `FoodSpot`, or `StaySpot` in `src/types.ts` unless implementing a strictly backward-compatible migration.
4. **Preserve Demo Presets**:
   - Keep `jaipur`, `lucknow`, `noida`, `kyoto`, `rome`, and `barcelona` presets functional so the application can be demonstrated instantly even when disconnected or during API downtime.
5. **Do Not Replace Working Code Unnecessarily**:
   - Modify existing files incrementally rather than replacing complete modules from scratch.
6. **No Fake/Premature Booking Implementations**:
   - Maintain clear disclaimers that transportation is estimated. Do not add fake checkout or payment forms.
7. **Keep Dependencies Lean**:
   - Do not install heavyweight frameworks or redundant mapping libraries.

---

## 16. Recommended First Task in Antigravity

Before writing any new code or installing Supabase dependencies in Antigravity:

1. **Inspect and Verify**:
   - Verify that `npm run build` (`vite build`) and `npm run lint` (`tsc --noEmit`) complete with zero errors.
   - Start the server (`npm run dev`) and test navigating between the Home Page, Search Window, and Results View.
   - Test generating a new 2-day itinerary and opening the **"Travel to [Destination]"** section.
2. **Verify Environment**:
   - Check that `GEMINI_API_KEY` is populated in the environment.
3. **Plan Supabase Schema**:
   - Design the Supabase relational schema to store the existing `Itinerary` JSON structure cleanly before implementing authentication and community sharing.
