export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  error?: string;
  timestamp: string; // LocalDate as string
}