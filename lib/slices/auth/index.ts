// lib/features/authSlice.ts
import { AuthTokenPayload } from '@/hooks/useDecodedToken';
import { RootState } from '@/lib/slices/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  userData?: AuthTokenPayload | null | undefined;
  isTokenExpired?: boolean;
  focusedOrganization?: string | null;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userData: null,
  isTokenExpired: false,
  focusedOrganization: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      if (action.payload.accessToken) {
        const decodedData = jwtDecode<AuthTokenPayload>(
          action.payload.accessToken,
        );
        state.userData = decodedData;
        state.focusedOrganization =
          action.payload.focusedOrganization ??
          decodedData.organizationPublicId;
        if (decodedData.exp && Date.now() >= decodedData.exp * 1000) {
          console.warn('Token has expired');
          state.isTokenExpired = true;
        }
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.userData = null;
      state.isTokenExpired = true;
    },
    setFocusedOrganization: (state, action: PayloadAction<string>) => {
      state.focusedOrganization = action.payload;
    },
  },
});

export const { setCredentials, logout, setFocusedOrganization } =
  authSlice.actions;
export const selectAuthState = (state: RootState) => state.auth;
export default authSlice;
