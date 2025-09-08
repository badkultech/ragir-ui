// lib/services/organization/onboarding-api.ts
import { baseAPI } from ".."
import { SendOTPResponse, OnBoardingOrganizationDTO } from "./types"



export const onboardingAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    sendOnboardingOTP: builder.mutation<SendOTPResponse, OnBoardingOrganizationDTO>({
      query: (payload) => ({
        url: "/onboarding/send-otp",
        method: "POST",
        headers: {
          "Origin": "global-tenant",
          "Content-Type": "application/json",
        },
        body: payload,
      }),
    }),
  }),
})

export const { useSendOnboardingOTPMutation } = onboardingAPI
