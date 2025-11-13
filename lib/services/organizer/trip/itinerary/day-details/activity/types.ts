
export interface ActivityItem {
  id: number;  
  tripItemId?: number;  
  tripType?: string;      
  name: string;
  location?: string;
  time?: string;
  description?: string;
  documents?: any[];      
  packingSuggestion?: string;
}

export interface ActivityResponse {
  tripItemId: number;
  name: string;
  location?: string;
  time?: string;
  description?: string;
  documents?: any[];
  packingSuggestion?: string;
  dayDetailId: number;
  tripType: string; 
}

export interface CreateActivityRequest {
  name: string;
  location?: string;
  time?: string;
  description?: string;
  packingSuggestion?: string;
  documents?: File[] | string[];
}

export interface UpdateActivityRequest extends CreateActivityRequest {}

export interface DeleteActivityResponse {
  message: string;
  status: string;
}
