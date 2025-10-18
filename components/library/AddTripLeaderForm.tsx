"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Image from "next/image";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";
import { useSaveGroupLeaderMutation } from "@/lib/services/organizer/trip/library/leader";
import { selectAuthState } from "@/lib/slices/auth";
import { useSelector } from "react-redux";


type AddTripLeaderFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any) => void;
};

export function AddTripLeaderForm({
  mode = "library",
  onCancel,
  onSave,
}: AddTripLeaderFormProps) {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [saveGroupLeader, { isLoading }] = useSaveGroupLeaderMutation();
  const { userData } = useSelector(selectAuthState);
  const orgId = userData?.organizationPublicId;

  const handleLibrarySelect = (item: any) => {
    setName(item.title || "");
    setTagline(item.description || "");
    if (item.image) setPreviewUrl(item.image);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!orgId) {
      console.error("Missing org ID");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("bio", bio.trim());
      formData.append("tagline", tagline.trim());
      formData.append("addToLibrary", String(mode === "library"));

      if (profileImage) {
        formData.append("documents[0].file", profileImage, profileImage.name);
        formData.append("documents[0].name", profileImage.name);
        formData.append("documents[0].type", "IMAGE");
      }

      // 🧩 Debug check
      for (const [key, value] of formData.entries()) {
        console.log("➡️", key, value);
      }

      const response = await saveGroupLeader({
        organizationId: orgId,
        data: formData,
      }).unwrap();

      onSave(response);
    } catch (err) {
      console.error("❌ Failed to save trip leader:", err);
    }
  };





  return (
    <div className="flex flex-col gap-6">
      {/* Profile Image Upload */}
      {/* Top-right button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          className="text-orange-500 border-orange-500 hover:bg-orange-50"
          onClick={() => setLibraryOpen(true)}
        >
          Choose from Library
        </Button>
      </div>
      <div className="flex flex-col items-center gap-3">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Profile Preview"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full border flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
        <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
          <Upload className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">Update Profile Image</span>
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        <span className="text-xs text-gray-400">PNG, JPG up to 10MB</span>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
        />
      </div>

      {/* Tagline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tagline
        </label>
        <Input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="Enter tagline"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio *
        </label>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Enter here"
          rows={5}
          maxLength={500}
        />
        <p className="text-xs text-right text-gray-400 mt-1">
          {bio.length}/500 Characters
        </p>
      </div>
      <LibrarySelectModal
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={handleLibrarySelect}
        category="trip-leaders"
      />
      {/* Footer */}
      <div className="flex justify-end items-center gap-4 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !name.trim() || !bio.trim()}
          className="rounded-full px-6 bg-gradient-to-r from-orange-400 to-pink-500 text-white disabled:opacity-60"
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>

      </div>
    </div>
  );
}
