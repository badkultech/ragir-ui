// Define your User type (adjust fields to your backend response)
export interface UserDetails extends Profile {
  id: string;
  publicId: string;
  createdDate?: string;
  updatedDate?: string;
}

export type Profile = {
  fullName: string;
  email: string;
  role?: string;
  phone?: string;
};