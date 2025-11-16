export interface TripLeadsRequest {
  tripTitle: string;
  preferredCommunication: PreferredCommunication;
  email: string;
  phone: string;
  tripLeadsStatus: TripLeadsStatus;
  nudgeCount?: number;
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
