export type Category = 'history' | 'food' | 'nature' | 'nightlife' | 'shopping' | 'art' | 'other';
export type BestTime = 'morning' | 'afternoon' | 'evening';
export type PriceLevel = 'low' | 'mid' | 'high';

export interface EntryPrice {
  min: number | null;
  max: number | null;
}

export interface Stop {
  name: string;
  category: Category;
  description: string;
  best_time: BestTime;
  duration_hours: number;
  lat: number;
  lng: number;
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
  stops: Stop[];
  food: FoodSpot[];
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
  stays: StaySpot[];
}

export interface GenerationParams {
  city: string;
  country?: string;
  daysCount?: number;
  budgetLevel?: 'low' | 'mid' | 'high';
  interests?: string[];
  pace?: 'relaxed' | 'moderate' | 'packed';
  includeStays?: boolean;
}

export type TransportationMode = 'train' | 'flight';

export interface TrainClassFare {
  className: string; // e.g. "SL", "3A", "2A", "1A"
  fare: string; // e.g. "₹450", "₹1,250", "₹1,850", "₹3,100"
}

export interface TrainOption {
  id: string;
  name: string;
  number: string;
  startingStation: string;
  destinationStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classes: TrainClassFare[];
  selectedClass?: string;
}

export interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  cabinClass: string;
  fare: string;
}

export interface TrainQueryParams {
  startingStation: string;
  destinationStation: string;
  destinationCity: string;
  journeyDate: string;
  quota: 'General' | 'Tatkal' | 'Other';
  preferredClass?: string;
}

export interface FlightQueryParams {
  departureCity: string;
  arrivalCity: string;
  journeyDate: string;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
}

export interface TransportationDetail {
  title: string;
  mode: TransportationMode;
  identifier: string;
  overview: string;
  route: string;
  duration: string;
  classMeaning: string;
  classInfo: string;
  estimatedFare: string;
  travelTips: string[];
}

