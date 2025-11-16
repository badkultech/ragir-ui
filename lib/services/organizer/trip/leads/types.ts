export interface TripLeadsRequest {
  tripTitle: string;
  preferredCommunication: PreferredCommunication;
  email: string;
  phone: string;
  tripLeadsStatus: TripLeadsStatus;
  nudgeCount: 0;
  message: string;
  customerName: string;
  createdDate: string;
  tripPublicId: string;
}

export interface TripLeadsResponse extends TripLeadsRequest {
  id: number;
}

export enum PreferredCommunication {
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  WHATSAPP = "WHATSAPP",
}

export enum TripLeadsStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED",
  CONVERTED = "CONVERTED",
}
