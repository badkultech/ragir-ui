"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { GradientButton } from "@/components/gradient-button"
import { ArrowRight } from "lucide-react"

export default function PhoneEntryPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const router = useRouter()

  const handleGenerateOTP = () => {
    if (phoneNumber.trim()) {
      router.push(`/verify-otp?phone=${encodeURIComponent(phoneNumber)}`)
    }
  }

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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Enter Your Phone No.</h1>
              <p className="text-gray-600">
                We will send you the <span className="font-semibold">6-digit</span> verification code
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                  Enter Phone No.
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91"
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-lg"
                  />
                </div>
              </div>

              <GradientButton onClick={handleGenerateOTP} className="flex items-center justify-center gap-2">
                Generate OTP
                <ArrowRight className="h-5 w-5" />
              </GradientButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
