export interface PartnerRequest {
  organizerName?: string;
  email: string;
  phone: string;
}

export interface PartnerResponse {
  id: number;
  organizerName: string;
  email: string;
  phone: string;
  createdAt: string;
}
