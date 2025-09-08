import { UserData } from "../../organization/users/type";

// Define the API response shape for organization stats
export interface OrganizationStatsResponse {
  pending: number;   // pending approvals
  active: number;    // active organizations
  rejected: number;  // rejected organizations (if needed later)
}
export interface ActiveCustomersCountResponse {
  // since your API wraps "data" as a number, we can just alias number
  userCount: number;
}

export interface OpenTickets{
  openTicketCount: number;
}

export interface UserStats{
  totalUsers : number;
  activeUsers : number;
  suspendedUsers: number;
  newThisMonth: number;
}
export interface UsersListResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  content: UserData[]; // Spring Boot Page uses 'content' for the data array
  number: number;  // This is the current page number (0-based)
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  name?: string;
}