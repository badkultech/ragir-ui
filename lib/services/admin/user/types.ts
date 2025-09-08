// Define the types for the API
export interface CreateUserRequest {
  email: string;
  mobileNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  employeeNumber?: string;
  userType?: string;
  roles: string[];
  isActive?: boolean;
  isOrganization?: boolean;
}

export interface UserResponse {
  id: number;
  publicId: string;
  email: string;
  mobileNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  employeeNumber?: string;
  userType?: string;
  roles: string[];
  isActive: boolean;
  isOrganization: boolean;
}