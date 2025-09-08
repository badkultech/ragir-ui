// lib/services/trip/types.ts
export enum TripStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface PricingCategory {
  id?: number;
  tripId?: number;
  category: 'ACCOMMODATION' | 'TRANSPORT' | 'MEALS' | 'ACTIVITIES' | 'EQUIPMENT' | 'PERMITS' | '';
  subType: string;
  price: number;
  description?: string;
}

export interface PaymentOptions {
  soloFriendly?: boolean;
  coupleFriendly?: boolean;
  emiAvailable?: boolean;
}


export interface TripDTO {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  minPeople: number;
  maxPeople: number;
  minAge?: number;
  maxAge?: number;
  groupType?: string;
  startLocation?: string;
  endLocation?: string;
  basePrice: number;
  discountPercentage: number | undefined;
  finalPrice?: number;
  groupLeader?: string;
  status: TripStatus;
  organizationId: string;
  moodTags: string[];
  coverImages: string[];
  galleryImages: string[];
  exclusions: string[];
  paymentOptions?: PaymentOptions;
  createdDate?: string;
  updatedDate?: string;
  createdBy?: string;
  updatedBy?: string;
  
}

export interface TripCreateRequestDTO {
  id?: number;
  title: string;
  description?:string;
  maxGroupSize?:number|string;
  price?:number;
  destination?:string;
  startDate: string;
  endDate: string;
  minPeople: number;
  maxPeople: number;
  minAge?: number;
  maxAge?: number;
  groupType?: string;
  startLocation?: string;
  endLocation?: string;
  basePrice: number;
  discountPercentage?: number;
  groupLeader?: string;
  moodTags?: string[];
  coverImages?: string[];
  galleryImages?: string[];
  exclusions?: string[];
  paymentOptions?: PaymentOptions;
}

export interface ItineraryItem {
  id?: number;
  tripId?: number;
  type: 'TRANSIT' | 'STAY' | 'ACTIVITY' | 'MEAL';
  title: string;
  description: string;
  timeSlot: string;
  location: string;
  dayNumber?: number;
  sortOrder?: number;
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
export interface PricingData {
  basePrice: number;
  discountPercentage: number;
  finalPrice: number;
  categories: PricingCategory[];
  paymentOptions: PaymentOptions;
}

// lib/services/trip/types.ts - Add these interfaces
export interface TripImageUploadDTO {
  file: File;
  type: 'COVER' | 'GALLERY';
  sortOrder?: number;
}

export interface TripImageResponseDTO {
  id: number;
  imageUrl: string;
  type: 'COVER' | 'GALLERY';
  sortOrder: number;
  uploadedAt: string;
}

export interface TripMediaResponseDTO {
  coverImages: TripImageResponseDTO[];
  galleryImages: TripImageResponseDTO[];
  totalImages: number;
}

// Define exclusion type
export type Exclusion = {
  name: string;
  description: string;
  category: string;
};

export type ExclusionsResponse = {
  status: string;
  message: string;
  data: Exclusion[];
  error: string | null;
  timestamp: string;
};

export interface TripExclusionDTO {
  name: string;
  isMaster: boolean;
  description?: string;
}

export interface TripExclusionsResponseDTO {
  id: number;
  name: string;
  description?: string;
  isMaster: boolean;
  createdAt: string;
}