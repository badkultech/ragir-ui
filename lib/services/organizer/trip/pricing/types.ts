export interface AddOn {
  id: string;
  name: string;
  charge: string; 
}

export interface PricingItem {
  discountPercent: number;
  discountValidUntil: string;
  includesGst: boolean;
  depositRequiredPercent: number;
  creditOptions: string;
  cancellationPolicy: string;
  basePrice: number;
  addOns: { name: string; charge: number }[];
}

export type PricingCreateRequest = PricingItem;
export type PricingUpdateRequest = PricingItem;

export interface PricingResponse {
  status: string;
  message: string;
  data: PricingItem;
  timestamp: string;
}
