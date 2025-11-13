export interface FAQItem {
  faqId: number;
  question: string;
  answer: string;
  saveToLibrary: boolean;
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
  question: string;
  answer: string;
  saveToLibrary?: boolean;
}

export interface UpdateFAQRequest {
  question: string;
  answer: string;
  saveToLibrary?: boolean;
}

export interface DeleteFAQResponse {
  status: string;
  message: string;
  data: Record<string, never>;
  timestamp: string;
}
