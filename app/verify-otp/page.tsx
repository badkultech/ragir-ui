"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { GradientButton } from "@/components/gradient-button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import LoadingOverlay from "@/components/common/LoadingOverlay";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const phone = searchParams.get("phone");
    if (phone) {
      setPhoneNumber(phone);
    }
  }, [searchParams]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = () => {
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      router.push("/join-community");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-orange-200 via-pink-200 to-red-200"
      style={{
        backgroundImage: "url(/orgRegisterBg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      <AppHeader />

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                OTP Verification
              </h1>
              <p className="text-gray-600">
                Enter the OTP sent to{" "}
                <span className="font-semibold">
                  {phoneNumber || "+91 99999 99999"}
                </span>
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Enter Phone No.
                </label>
                <div className="flex gap-3 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-semibold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      maxLength={1}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600">
                  {"Didn't recieve OTP? "}
                  <button className="text-orange-500 font-semibold hover:underline">
                    Resend
                  </button>
                </p>
              </div>

              <div className="space-y-3">
                <GradientButton
                  variant="secondary"
                  onClick={handleBack}
                  className="flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back
                </GradientButton>

                <LoadingOverlay
                  isLoading={isLoading}
                  message="Verifying OTP"
                />
                <GradientButton
                  onClick={handleVerify}
                  className="flex items-center justify-center gap-2"
                >
                  Verify and Continue
                  <ArrowRight className="h-5 w-5" />
                </GradientButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
