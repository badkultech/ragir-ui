// Define response types (you can update according to your backend response)
export interface Trip {
  tripId: string;
  publicId: string;
  name: string;
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
  status: string;
  message: string;
  data: Trip;
  error?: string;
  timestamp?: string;
}
