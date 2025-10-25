import { Document, EMPTY_DOCUMENT } from '@/hooks/useDocumentsManager';
import { RootState } from '@/lib/slices/store';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Profile {
  organizerName: string;
  tagline: string;
  description: string;
  websiteUrl: string;
  instagramHandle: string;
  youtubeChannel: string;
  googleBusiness: string;
  testimonials: string;
}
//  const [logoFile, setLogoFile] = useState<Document>(EMPTY_DOCUMENT);
//   const [bannerFile, setBannerFile] = useState<Document>(EMPTY_DOCUMENT);
//   const [testimonialScreenshotFile, setTestimonialScreenshotFile] =
//     useState<Document>(EMPTY_DOCUMENT);

export interface OrganizerSliceState {
  // Organizer Profile State
  profile: Profile;
  currentStep: number;
  logoFile: Document;
  bannerFile: Document;
  testimonialScreenshotFile: Document;
  certificationsDocuments: Array<Document>;
}

export const initialOrganizerSliceState: OrganizerSliceState = {
  currentStep: 0,
  profile: {
    organizerName: '',
    tagline: '',
    description: '',
    websiteUrl: '',
    instagramHandle: '',
    youtubeChannel: '',
    googleBusiness: '',
    testimonials: '',
  },
  logoFile: EMPTY_DOCUMENT,
  bannerFile: EMPTY_DOCUMENT,
  testimonialScreenshotFile: EMPTY_DOCUMENT,
  certificationsDocuments: [],
};

export const organizerSlice = createSlice({
  name: 'organizer_slice',
  initialState: initialOrganizerSliceState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
    setLogoFile: (state, action: PayloadAction<Document>) => {
      state.logoFile = action.payload;
    },
    setBannerFile: (state, action: PayloadAction<Document>) => {
      state.bannerFile = action.payload;
    },
    setTestimonialScreenshotFile: (state, action: PayloadAction<Document>) => {
      state.testimonialScreenshotFile = action.payload;
    },
    setCertificationsDocuments: (
      state,
      action: PayloadAction<Array<Document>>,
    ) => {
      state.certificationsDocuments = action.payload;
    },
  },
});

export const {
  setLogoFile,
  setBannerFile,
  setTestimonialScreenshotFile,
  setCertificationsDocuments,
  setProfile,
} = organizerSlice.actions;
// dataContextSlice.sta

export const organizerState = (state: RootState) => state.organizer;

export default organizerSlice.reducer;
