export type PublicTripDTO = {
  tripId: number;
  publicId: string;
  name: string;
  startDate: string;
  endDate: string;
  minGroupSize: number;
  maxGroupSize: number;
  minAge: number;
  maxAge: number;
  moodTags: string[];
  cityTags: string[];
  highlights: string;
  tripStatus: string;
  tripTimeStatus: string;
};

export type SearchCriteria = {
  destination?: string;
  month?: number;
  year?: number;
  destinationTags?: string[];
  isDomestic?: boolean;
  moods?: string[];
};

export type Pageable = {
  page: number;
  size: number;
  sort?: string[];
};
