// Define response types (you can update according to your backend response)
export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  minGroupSize: number;
  maxGroupSize: number;
  minAge: number;
  maxAge: number;
  moodTags: string[];
  locations: string[];
  highlights: string;
}

export interface TripResponse {
  trip: Trip;
}
