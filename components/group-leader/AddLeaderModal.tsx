"use client";

import { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export function AddLeaderModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Open file dialog when clicking "Update Profile Image"
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Handle image file selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-[600px] shadow-xl p-6 relative">
        {/* Close button */}
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 text-lg text-gray-400 hover:text-gray-600 font-bold"
        >
          ×
        </Button>

        <h2 className="font-semibold text-lg mb-4">Add New Group Leader</h2>

        {/* Profile Image Upload */}
        <div className="mb-4">
          <Label className="text-sm font-medium block mb-2">Profile Image</Label>

          <div className="flex items-center gap-3">
            <img
              src={imagePreview || "/default-profile.png"}
              alt="Profile"
              className="w-14 h-14 rounded-full border object-cover"
            />
            <Button
              onClick={handleImageClick}
              className="border px-4 py-2 text-black rounded-md bg-gray-100 font-medium hover:bg-gray-200"
            >
              Update Profile Image
            </Button>

            {/* Hidden File Input */}
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="text-xs text-gray-400 ml-16">
            PNG, JPG up to 10MB
          </div>
        </div>

        {/* Name Input */}
        <div className="mb-4">
          <Label className="text-sm font-medium block mb-2">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-orange-400 outline-none"
            placeholder="Enter name"
          />
        </div>

        {/* Bio Input */}
        <div className="mb-4">
          <Label className="text-sm font-medium block mb-2">Bio</Label>
          <Textarea
            className="w-full border rounded-md px-4 py-2 min-h-[80px] focus:ring-2 focus:ring-orange-400 outline-none"
            maxLength={500}
            placeholder="Enter here"
          ></Textarea>
          <div className="text-xs text-gray-400 text-right mt-1">
            0/500 Characters
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="px-6 py-2 bg-gray-50 border rounded-full text-gray-600 font-medium hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button className="px-6 py-2 rounded-full font-medium text-white bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
