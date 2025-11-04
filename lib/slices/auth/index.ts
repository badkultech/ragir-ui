import { AuthTokenPayload } from "@/hooks/useDecodedToken";
import { RootState } from "@/lib/slices/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  userData?: AuthTokenPayload | null | undefined;
  isTokenExpired?: boolean;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userData: null,
  isTokenExpired: false,
};

// ✅ Type-safe dynamic import wrapper for jwt-decode
let jwtDecodeFn: (<T>(token: string) => T) | undefined;
if (typeof window !== "undefined") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { jwtDecode } = require("jwt-decode");
    jwtDecodeFn = jwtDecode;
  } catch (err) {
    console.error("Failed to load jwt-decode:", err);
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      // ✅ Only decode on the client when jwtDecodeFn is available
      if (action.payload.accessToken && typeof window !== "undefined" && jwtDecodeFn) {
        try {
          const decodedData = jwtDecodeFn<AuthTokenPayload>(action.payload.accessToken);
          state.userData = decodedData;

          if (decodedData.exp && Date.now() >= decodedData.exp * 1000) {
            console.warn("Token has expired");
            state.isTokenExpired = true;
          } else {
            state.isTokenExpired = false;
          }
        } catch (error) {
          console.error("Failed to decode token:", error);
          state.userData = null;
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
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const selectAuthState = (state: RootState) => state.auth;
export default authSlice.reducer;
