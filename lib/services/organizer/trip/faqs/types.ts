export interface FAQItem {
  faqId: number;
  name: string;     
  answer: string;
  addToLibrary: boolean; 
  documents: any[];      
  groupName: string;  
  tripId: number;
  organizationId: string;
  requestId: string;
  currentTimestamp: string;
}


export interface FAQListResponse {
  status: string;
  message: string;
  data: FAQItem[];
  timestamp: string;
}

export interface FAQByIdResponse {
  status: string;
  message: string;
  data: FAQItem;
  timestamp: string;
}

export interface CreateFAQRequest {
  requestId: string;
  currentTimestamp: string;
  organizationId: string;
  name: string;          
  documents: any[];
  tripId: number;
  addToLibrary: boolean;
  answer: string;
  groupName: string;
}


export interface UpdateFAQRequest {
  requestId: string;
  currentTimestamp: string;
  organizationId: string;
  name: string;         
  documents: any[];
  tripId: number;
  addToLibrary: boolean;
  answer: string;
  groupName: string;
}


export interface DeleteFAQResponse {
  status: string;
  message: string;
  data: Record<string, never>;
  timestamp: string;
}
