export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: "OPEN" |  "CLOSED" | "PENDING" | "RESOLVED" |  "IN_ACTIVE" | "CANCELLED" | "ASSIGNED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  category: "COMPLAINT" | "SUPPORT" | "ISSUE" | "ENQUIRY" | "OTHER";
  createdAt: string;
  updatedAt: string;
  responses: number;
}

export interface CreateTicketRequest {
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  title: string;
  description: string;
}

// types.ts - Add response wrapper interface
export interface TicketResponse {
  status: string;
  message: string;
  data: Ticket[];
  error: string | null;
  timestamp: string;
}

export interface CreateTicketResponse {
  status: string;
  message: string;
  data: Ticket;
  error: string | null;
  timestamp: string;
}

// Update your types.ts file

export interface User {
  publicId: string;
  email: string | null;
  mobileNumber: string | null;
  password: string | null;
  confirmPassword: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  gender: string | null;
  employeeNumber: string | null;
  userType: string | null;
  roles: string | null;
  otp: string | null;
  active: boolean;
  organization: boolean;
}

export interface TicketDetail {
  id: number;
  title: string;
  description: string;
  category: "COMPLAINT" | "SUPPORT" | "ISSUE" | "ENQUIRY" | "OTHER";
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  raisedBy: User;
  assignedTo: User | null;
  createdAt?: string; // Add these if they exist in your API
  updatedAt?: string; // Add these if they exist in your API
  messages?: Message[]; // Add messages if they exist
  ticketcomments?: TicketComment[];
}

export interface Message {
  id: number;
  content: string;
  sender: "USER" | "ADMIN";
  senderName: string;
  createdAt: string;
  user?: User;
}

export interface TicketDetailResponse {
  status: string;
  message: string;
  data: TicketDetail;
  error: string | null;
  timestamp: string;
}

// Keep existing types...
export interface AddMessageRequest {
  message: string;
}

export interface AddMessageResponse {
  status: string;
  message: string;
  data: Message;
  error: string | null;
  timestamp: string;
}
// Update your types to match the backend structure

export interface TicketComment {
  id: number;
  ticket: Ticket;
  comment: string;
  responder: User;
}

export interface CreateCommentRequest {
  comment: string;
}

export interface TicketCommentResponse {
  status: string;
  message: string;
  data: TicketComment;
  error: string | null;
  timestamp: string;
}
