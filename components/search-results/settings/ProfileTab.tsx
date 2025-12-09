"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Calendar } from "lucide-react";

interface ProfileTabProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
    bio: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      gender: string;
      dateOfBirth: string;
      bio: string;
    }>
  >;
}

export default function ProfileTab({ formData, setFormData }: ProfileTabProps) {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold md:hidden">Profile</h2>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8">

        {/* Profile Image Section */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="w-20 h-20 md:w-24 md:h-24">
            <AvatarImage src="/man-profile.png" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              RS
            </AvatarFallback>
          </Avatar>

          <div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
              <Upload className="w-4 h-4" />
              <span>Upload New Image</span>
            </button>
            <p className="text-xs text-muted-foreground mt-2">
              PNG, JPG up to 10MB
            </p>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <InputField
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            label="First Name"
          />

          <InputField
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            label="Last Name"
          />

          <InputField
            name="email"
            value={formData.email}
            onChange={handleChange}
            label="Email Address"
          />

          <InputField
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            label="Phone No."
          />

          {/* Gender Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Gender (Optional)
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#E4E4E4] rounded-lg"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
              <option>Prefer not to say</option>
            </select>
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="text"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                placeholder="dd/mm/yyyy"
                className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#E4E4E4] rounded-lg"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">
            Bio / About me (Optional)
          </label>

          <div className="relative ">
            <textarea
              name="bio"
              rows={4}
              maxLength={500}
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-[#E4E4E4] rounded-lg resize-none"
            />

            <span className="absolute bottom-3 right-3 text-xs text-primary">
              {formData.bio.length}/500 Characters
            </span>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-[linear-gradient(90deg,#fea901,#fd6e34,#FE336A,#FD401A)] text-primary-foreground rounded-full hover:opacity-90 transition-opacity text-sm font-medium">
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}

function InputField({
  name,
  value,
  onChange,
  label,
}: {
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  label: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#E4E4E4] rounded-lg"
      />
    </div>
  );
}
