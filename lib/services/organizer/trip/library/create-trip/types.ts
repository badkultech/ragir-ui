// Define response types (you can update according to your backend response)
export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  totalDays: number;
  minGroupSize: number;
  maxGroupSize: number;
  minAge: number;
  maxAge: number;
  moodTags: string[];
  cityTags: string[];
  highlights: string;
  groupLeaderId: number;
}

export interface TripResponse {
  trip: Trip;
}
