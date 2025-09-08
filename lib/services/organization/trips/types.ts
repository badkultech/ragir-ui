// Update your types to match the actual API response
export interface TripSummary {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  minPeople: number;
  maxPeople: number;
  basePrice: string; // ← String with currency symbol
  finalPrice: string; // ← String with currency symbol
  discountPercentage?: number;
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "PUBLISHED" | "CANCELLED" | "COMPLETED";
  createdDate: string;
  tags: string[]; // ← Changed from moodTags to tags
  discountAmount: number;
  duration: number;
  statusBadge: {
    key: string;
    label: string;
    color: string;
  };
  quickStats: {
    duration: number;
    groupSize: string;
    priceRange: string;
    discount: boolean;
  };
  hasDiscount: boolean;
  pricePerDay: number;
  isUpcoming: boolean;
  
  // Optional fields that might be missing
  startLocation?: string;
  endLocation?: string;
  firstCoverImage?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface TripsApiResponse {
  status: string;
  message: string;
  data: PageResponse<TripSummary>;
  error: string | null;
  timestamp: string;
}
