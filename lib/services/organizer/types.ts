export interface PartnerRequest {
  organizationId: string;
  data: {
    displayPicture: {
      id: number;
      type: string;
      url: string;
      file: string;
      markedForDeletion: true;
    };
    organizerName: string;
    bannerImage: {
      id: number;
      type: string;
      url: string;
      file: string;
      markedForDeletion: true;
    };
    tagline: string;
    description: string;
    websiteUrl: string;
    instagramHandle: string;
    youtubeChannel: string;
    googleBusiness: string;
    testimonials: string;
    testimonialScreenshot: {
      id: number;
      type: string;
      url: string;
      file: string;
      markedForDeletion: true;
    };
    certifications: [
      {
        id: number;
        type: string;
        url: string;
        file: string;
        markedForDeletion: true;
      },
    ];
  };
}

export interface PartnerResponse {
  status: string;
  message: string;
  data: {
    displayPicture: {
      id: number;
      type: string;
      url: string;
      file: string;
      markedForDeletion: true;
    };
    organizerName: string;
    bannerImage: {
      id: number;
      type: string;
      url: string;
      file: string;
      markedForDeletion: true;
    };
    tagline: string;
    description: string;
    websiteUrl: string;
    instagramHandle: string;
    youtubeChannel: string;
    googleBusiness: string;
    testimonials: string;
    testimonialScreenshot: {
      id: number;
      type: string;
      url: string;
      file: string;
      markedForDeletion: true;
    };
    certifications: [
      {
        id: number;
        type: string;
        url: string;
        file: string;
        markedForDeletion: true;
      },
    ];
  };
  error: string;
  timestamp: '2025-10-14';
}
