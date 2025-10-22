import { LibraryRequest, LibraryResponse } from "../types";

export interface TransitRequest extends LibraryRequest {
  fromLocation: string;
  toLocation: string;
  startTime: string;
  endTime: string;
  vehicleType: string;
  customVehicleType?: string;
  arrangedBy: string;
  description?: string;
  packagingSuggestion?: string;
}

export interface TransitResponse extends LibraryResponse {
  fromLocation: string;
  toLocation: string;
  startTime: string;
  endTime: string;
  vehicleType: string;
  customVehicleType?: string;
  arrangedBy: string;
  description?: string;
  packagingSuggestion?: string;
}
