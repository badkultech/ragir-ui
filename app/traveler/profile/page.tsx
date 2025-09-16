"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, PencilIcon } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { Sidebar } from "@/components/traveler/Sidebar"

export default function TravelerProfile() {
  const [formData, setFormData] = useState({
    fullName: "Alex Kumar",
    gender: "",
    dateOfBirth: "15/06/1995",
    bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    phoneNumber: "99999 99999",
    secondaryEmail: "backup@email.com",
    emergencyContactName: "",
    emergencyContactPhone: "",
    moods: {
      mountain: true,
      adventure: true,
      beach: false,
      jungle: false,
      trekking: false,
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMoodChange = (mood: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      moods: { ...prev.moods, [mood]: checked },
    }))
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    console.log("Profile saved:", formData)
  }

  const bioCharCount = formData.bio.length
  const maxBioLength = 500

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        <AppHeader showAvatar={true} title="Traveler Profile" />

        <main className="p-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Traveler Profile</h1>

            {/* Profile Header */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/adventure-traveler-in-nature.jpg" alt="Alex Kumar" />
                    <AvatarFallback>AK</AvatarFallback>
                  </Avatar>
                  <button className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md border">
                    <PencilIcon className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Alex Kumar</h2>
                  <p className="text-gray-600">Adventure enthusiast • 15 trips completed</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                    Date of Birth
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      placeholder="DD/MM/YYYY"
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                    Gender
                  </Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="mt-1 min-h-[120px]"
                  maxLength={maxBioLength}
                />
                <div className="flex justify-end mt-1">
                  <span
                    className={`text-xs ${bioCharCount > maxBioLength * 0.9 ? "text-orange-500" : "text-gray-500"}`}
                  >
                    {bioCharCount}/{maxBioLength} Characters
                  </span>
                </div>
              </div>
            </div>

            {/* Contact & Communication */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact & Communication</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                    Phone No.
                  </Label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      +91
                    </span>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className="rounded-l-none"
                    />
                    <Button
                      variant="outline"
                      className="ml-2 text-orange-500 border-orange-500 hover:bg-orange-50 bg-transparent"
                    >
                      Change
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondaryEmail" className="text-sm font-medium text-gray-700">
                    Secondary Email
                  </Label>
                  <div className="flex mt-1">
                    <Input
                      id="secondaryEmail"
                      value={formData.secondaryEmail}
                      onChange={(e) => handleInputChange("secondaryEmail", e.target.value)}
                      type="email"
                    />
                    <Button
                      variant="outline"
                      className="ml-2 text-orange-500 border-orange-500 hover:bg-orange-50 bg-transparent"
                    >
                      Verify
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Emergency Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Contact name"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                  />
                  <Input
                    placeholder="Phone no."
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Linked Social Accounts */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Linked Social Accounts</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      G
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Google Account</p>
                      <p className="text-sm text-gray-500">alexkumar@gmail.com</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="text-orange-500 border-orange-500 hover:bg-orange-50 bg-transparent"
                  >
                    Change
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      f
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Connect Facebook</p>
                      <p className="text-sm text-gray-500">Not Connected</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="text-orange-500 border-orange-500 hover:bg-orange-50 bg-transparent"
                  >
                    + Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Mood Preferences */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood Preferences</h3>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Preferred Moods</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(formData.moods).map(([mood, checked]) => (
                    <div key={mood} className="flex items-center space-x-2">
                      <Checkbox
                        id={mood}
                        checked={checked}
                        onCheckedChange={(checked) => handleMoodChange(mood, checked as boolean)}
                        className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <Label htmlFor={mood} className="text-sm font-medium capitalize cursor-pointer">
                        {mood}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    Save Profile Changes
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
