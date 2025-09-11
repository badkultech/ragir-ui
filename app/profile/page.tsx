"use client"

import { useState } from "react"
import Image from "next/image"
import { GradientButton } from "@/components/gradient-button"
import { AppHeader } from "@/components/app-header"
import { Calendar, ChevronDown, Edit3 } from "lucide-react"

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    fullName: "Alex Kumar",
    gender: "",
    dateOfBirth: "15/06/1995",
    bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    phoneNumber: "99999 99999",
    secondaryEmail: "backup@email.com",
    emergencyContactName: "",
    emergencyContactPhone: "",
    preferredMoods: ["Mountain", "Adventure"],
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const toggleMood = (mood: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredMoods: prev.preferredMoods.includes(mood)
        ? prev.preferredMoods.filter((m) => m !== mood)
        : [...prev.preferredMoods, mood],
    }))
  }

  const moods = ["Mountain", "Adventure", "Beach", "Jungle", "Trekking"]

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="Traveler Profile" variant="white" />

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-gray-900 min-h-screen p-4">
          <div className="bg-gray-800 rounded-lg p-3 flex items-center gap-3 text-white">
            <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
              <span className="text-gray-900 text-sm font-bold">👤</span>
            </div>
            <span className="font-medium">Traveler Profile</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">Traveler Profile</h1>

            {/* Profile Header */}
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative">
                  <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <Image
                      src="/traveler-profile-avatar-outdoor.jpg"
                      alt="Alex Kumar"
                      width={80}
                      height={80}
                      className="h-full w-full object-cover rounded-full"
                    />
                  </div>
                  <button className="absolute -bottom-1 -right-1 h-6 w-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <Edit3 className="h-3 w-3 text-white" />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Alex Kumar</h2>
                  <p className="text-gray-600">Adventure enthusiast • 15 trips completed</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:space-y-8">
              {/* Personal Information */}
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">Personal Information</h3>

                <div className="space-y-4 lg:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <div className="relative">
                        <select
                          value={formData.gender}
                          onChange={(e) => handleInputChange("gender", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                    />
                    <div className="text-right text-sm text-orange-500 mt-1">200/500 Characters</div>
                  </div>
                </div>
              </div>

              {/* Contact & Communication */}
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">Contact & Communication</h3>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone No.</label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <div className="flex items-center gap-2 flex-1 w-full">
                          <span className="text-gray-600 whitespace-nowrap">+91</span>
                          <input
                            type="text"
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                          />
                        </div>
                        <button className="px-4 py-2 border border-orange-400 text-orange-400 rounded-lg hover:bg-orange-50 text-sm whitespace-nowrap">
                          Change
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Email</label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <input
                          type="email"
                          value={formData.secondaryEmail}
                          onChange={(e) => handleInputChange("secondaryEmail", e.target.value)}
                          className="flex-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                        <button className="px-4 py-2 border border-orange-400 text-orange-400 rounded-lg hover:bg-orange-50 text-sm whitespace-nowrap">
                          Verify
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Contact name"
                        value={formData.emergencyContactName}
                        onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                      <input
                        type="text"
                        placeholder="Phone no."
                        value={formData.emergencyContactPhone}
                        onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Linked Social Accounts</label>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-gray-200 rounded-lg gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">G</span>
                          </div>
                          <div>
                            <div className="font-medium">Google Account</div>
                            <div className="text-sm text-gray-600">alexkumar@gmail.com</div>
                          </div>
                        </div>
                        <button className="px-4 py-2 border border-orange-400 text-orange-400 rounded-lg hover:bg-orange-50 text-sm whitespace-nowrap">
                          Change
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-gray-200 rounded-lg gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">F</span>
                          </div>
                          <div>
                            <div className="font-medium">Connect Facebook</div>
                            <div className="text-sm text-gray-600">Not Connected</div>
                          </div>
                        </div>
                        <button className="px-4 py-2 border border-orange-400 text-orange-400 rounded-lg hover:bg-orange-50 text-sm whitespace-nowrap">
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mood Preferences */}
              <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">Mood Preferences</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Preferred Moods</label>
                  <div className="flex flex-wrap gap-3">
                    {moods.map((mood) => (
                      <button
                        key={mood}
                        onClick={() => toggleMood(mood)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          formData.preferredMoods.includes(mood)
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-white text-gray-700 border-gray-200 hover:border-orange-400"
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pb-8">
                <GradientButton className="w-full sm:w-auto max-w-md">Save Profile Changes</GradientButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
