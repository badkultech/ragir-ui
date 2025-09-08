import { is } from "date-fns/locale"

export interface SendOTPResponse {
  status: string
  messages: Array<unknown>
  data: unknown
  timestamp: string
}


// lib/services/organization/types.ts

export interface OrganizationDTO {
  entityName: string
  gstNumber?: string
  websiteUrl?: string
  logoUrl?: string
  description?: string
  email: string
  primaryPhone: string
  secondaryPhone?: string
  tagline?: string
  instagram?: string
  youtubeChannel?: string
  googleBusiness?: string
  dateOfEstablishment: string // ISO string
  status?: "ACTIVE" | "INACTIVE" | "PENDING"
}

export interface LocationDTO {
  country: string
  state: string
  city: string
  addressLine1: string
  addressLine2?: string
  zipCode?: string
  isActive?: boolean
}

export type Gender = "MALE" | "FEMALE" | "OTHER"

export interface UserDTO {
  firstName: string
  middleName?: string
  lastName: string
  email: string
  mobileNumber: string
  password: string
  confirmPassword: string
  gender: Gender
  roles: string[]
  isOrganization?: boolean
  otp?: string
}

export interface OnBoardingOrganizationDTO {
  organization: OrganizationDTO
  location: LocationDTO
  user: UserDTO
  isAdmin: boolean
}
