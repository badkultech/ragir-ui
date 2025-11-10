import { LibraryResponse } from "../types";

export interface Document {
  id?: number;
  type?: string | null;
  url?: string;
  file?: File | null;
  markedForDeletion?: boolean;
}

export interface DayDescriptionRequest {
  organizationId: string;
  data: {
    documents: Array<Document> | null;
    addedToLibrary: boolean;
    tripId: null;
    message: null;
    description: string;
    location: string;
    time: string;
    packingSuggestion: string;
  };
}

export interface DayDescription {
  id: number;
  name: string;
  documents: Array<Document> | null;
  addedToLibrary: boolean;
  tripId: null;
  message: null;
  description: string;
  location: string;
  time: string;
  packingSuggestion: string;
}
export interface DayDescriptionsResponse {
  status: string;
  message: string;
  data: Array<DayDescription>;
  error: null;
  timestamp: string;
}

export interface DayDescriptionByIdResponse {
  status: string;
  message: string;
  data: DayDescription;
  error: null;
  timestamp: string;
}

export interface libraryDayDescriptionResponse extends LibraryResponse {
  status: string;
  message: string;
  data: DayDescription;
  error: null;
  timestamp: string;
}
