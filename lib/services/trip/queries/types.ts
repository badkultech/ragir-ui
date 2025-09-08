export interface TripQueryDTO {
  id: number;
  tripId: number;
  tripName: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  query: string;
  status: "PENDING" | "RESPONDED"; // could also allow "in_progress"
  response?: string; // new field
  respondedAt?: string; // new field
  priority: string;
  createdDate: string;
  responseTime: string;
  communicationPreference: string;
}


export type TripQueryResponse = {
  status: string;
  message: string;
  data: TripQueryDTO[];
  error: string | null;
  timestamp: string;
};
