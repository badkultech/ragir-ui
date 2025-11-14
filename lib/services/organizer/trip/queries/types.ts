export interface TripQueryRequest {
  // backend validation: @NotNull(message = "question is required")
  question: string;
}

export enum QueryStatus {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export interface TripQueryResponse {
  id: number;
  tripName?: string;
  userName?: string;
  status?: QueryStatus;
  question: string;
  createdDate?: string; // ISO string — backend LocalDateTime serialized
}
