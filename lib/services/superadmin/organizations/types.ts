export interface OrganizationDTO {
  publicId: string;
  entityName: string;
  email: string;
  primaryPhone: string;
  businessType: string;
  status: "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED";
  createdDate: string;
}
