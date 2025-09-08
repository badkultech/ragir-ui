export interface GetByIdRequest {
  id?: string;
  userId?: string;
  orgId?: string;
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER'; // Adjust if needed
export type UserType = 'SYSTEM_ADMIN' | 'TRAINER' | 'USER'; // Add more as needed

export interface CreateUserRequest {
  orgId?: string;
  payload: {
    publicId: string;
    email: string;
    mobileNumber: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    middleName: string;
    lastName: string;
    gender: Gender;
    employeeNumber: string;
    userType: UserType;
    roles: string[]; // Or define a Role enum if roles are known
    otp: string;
    active: boolean;
    organization: boolean;
  };
  // Change to an object if more details are included
}

export interface CreateUserRequest {
  id: string;
  //... other fields as needed
}

export interface UserData {
  publicId: string;
  email: string;
  mobileNumber: string;
  password: string | null;
  confirmPassword: string | null;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  employeeNumber: string | null;
  userType: string;
  roles: Array<string>;
  otp: string | null;
  active: boolean;
  organization: boolean;

  id?: string;
  avatar?: string;
  status?: string;
  joinedAt?: string;
  lastActive?: string;
  permissions: Array<string>;
}

export interface GetUserAPIResponse {
  status: string;
  messages: Array<unknown>;
  data: Array<UserData>;
  timestamp: Date;
}

export interface DeleteUserResponse {
  status: string;
  messages: Array<unknown>;
  data: unknown;
  timestamp: Date;
}
