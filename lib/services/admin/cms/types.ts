// ---------- Full DTOs from backend ----------
export interface CmsSectionDTO {
  id: number;
  type: string;
  content: any; // backend stores as JSON string
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CmsPageDTO {
  id: number;
  title: string;
  slug: string;
  status: string; // draft | published
  lastModified: string;
  sections: CmsSectionDTO[];
}

// ---------- Request DTOs ----------
export interface CreateCmsPageDTO {
  title: string;
  slug: string;
  status: string;
}

export interface UpdateCmsPageDTO {
  title?: string;
  slug?: string;
  status?: string;
}

export interface CreateCmsSectionDTO {
  type: string;
  content: any; // keep string, or change to Record<string, any> if needed
  sortOrder: number;
}

export interface UpdateCmsSectionDTO {
  type?: string;
  content?: string;
  sortOrder?: number;
}
