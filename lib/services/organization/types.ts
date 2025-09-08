// Request to get organization by ID
export interface GetByIdRequest {
  id: string
}

// Request to create a new organization
// types.ts
export interface CreateOrganizationRequest {
  entityName: string
  email: string
  primaryPhone: string
  dateOfEstablishment: string // ISO date string

  gstNumber?: string
  websiteUrl?: string
  logoUrl?: string
  description?: string
  secondaryPhone?: string
  tagline?: string
  instagram?: string
  youtubeChannel?: string
  googleBusiness?: string
  status?: "ACTIVE" | "INACTIVE" | "PENDING"
}


// Organization data returned from API
export interface OrganizationData {
  id: string
  entityName: string
  gstNumber?: string
  websiteUrl?: string
  logoUrl?: string
  description?: string
  email: string
  primaryPhone: string
  secondaryPhone?: string
  dateOfEstablishment?: string
  tagline?: string
  instagram?: string
  youtubeChannel?: string
  googleBusiness?: string
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "REJECTED"
  createdAt: string
  updatedAt: string
}

// Generic API response for GET requests
export interface GetOrganizationAPIResponse {
  status: "success" | "error"
  messages: string[]
  data: OrganizationData | null
  timestamp: string
}

// Generic API response for delete/create actions
export interface ActionOrganizationResponse {
  status: "success" | "error"
  messages: string[]
  data?: unknown
  timestamp: string
}
