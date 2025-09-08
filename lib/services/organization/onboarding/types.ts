type OrganizationStatus = "ACTIVE" | "INACTIVE"; // Add more statuses if needed
type Gender = "MALE" | "FEMALE" | "OTHER";
type UserType = "TRAINER" | "ADMIN" | "STAFF"; // Extend as per your use case

interface Organization {
  entityName: string;
  gstNumber: string;
  websiteUrl: string;
  logoUrl: string;
  description: string;
  email: string;
  primaryPhone: string;
  secondaryPhone: string;
  tagline: string;
  instagram: string;
  youtubeChannel: string;
  googleBusiness: string;
  dateOfEstablishment: string; // ISO date string, e.g., "2025-08-25"
}

interface Location {
  id?: number;
  country: string;
  state: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  zipCode: string;
}

interface User {
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
}


export interface CreateOrganizationRequest {
  organization: Organization;
  location: Location;
  user: User;
}