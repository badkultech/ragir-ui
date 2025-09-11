"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { GradientButton } from "@/components/gradient-button"
import { ChevronDown } from "lucide-react"
import LoadingOverlay from "@/components/common/LoadingOverlay"

export default function JoinCommunityPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    agreeToTerms: false,
  })
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    if (formData.fullName && formData.age && formData.gender && formData.agreeToTerms) {
      router.push("/profile")
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
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Join Community</h1>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-semibold text-gray-900 mb-2">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="Your age"
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-semibold text-gray-900 mb-2">
                  Gender
                </label>
                <div className="relative">
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="terms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                  className="mt-1 h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-400"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to all the <span className="font-semibold text-gray-900">Terms</span> and{" "}
                  <span className="font-semibold text-gray-900">Privacy Policy</span>
                </label>
              </div>
<LoadingOverlay
                  isLoading={isLoading}
                  message="Joining Community"
                />
              <GradientButton onClick={handleSubmit}>Join Community</GradientButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
