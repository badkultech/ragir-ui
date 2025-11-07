"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Image from "next/image";
import RichTextEditor from "../editor/RichTextEditor";
import {
  useLazyGetGroupLeaderByIdQuery,
  useSaveGroupLeaderMutation,
  useUpdateGroupLeaderMutation,
} from "@/lib/services/organizer/trip/library/leader";
import { selectAuthState } from "@/lib/slices/auth";
import { useSelector } from "react-redux";
import { useToast } from "../ui/use-toast";
import { showSuccess, showApiError } from "@/lib/utils/toastHelpers";

type AddTripLeaderFormProps = {
  updateId?: number | null;
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any) => void;
};

export function AddTripLeaderForm({
  updateId,
  mode = "trip",
  onCancel,
  onSave,
}: AddTripLeaderFormProps) {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [saveGroupLeader, { isLoading }] = useSaveGroupLeaderMutation();
  const [updateGroupLeader] = useUpdateGroupLeaderMutation();
  const [getLeaderById] = useLazyGetGroupLeaderByIdQuery();

  const { userData } = useSelector(selectAuthState);
  const orgId = userData?.organizationPublicId;
  const { toast } = useToast();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isTripMode = mode === "trip";

  // ✅ Prefill for edit mode
  useEffect(() => {
    if (updateId && orgId) {
      getLeaderById({ organizationId: orgId, leaderId: updateId })
        .unwrap()
        .then((res: any) => {
          const data = res?.data;
          if (data) {
            setName(data.name || "");
            setTagline(data.tagline || "");
            setBio(data.bio || "");
            if (data.documents?.[0]?.url) setPreviewUrl(data.documents[0].url);
          }
        })
        .catch((err) => console.error("❌ Failed to load leader:", err));
    }
  }, [updateId, orgId, getLeaderById]);

  // ✅ File preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ✅ Validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!bio.trim()) newErrors.bio = "Bio is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit
  const handleSubmit = async () => {
    if (!orgId) {
      showApiError("Organization ID missing!");
      return;
    }

    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("bio", bio.trim());
      formData.append("tagline", tagline.trim());
      formData.append("addToLibrary", isTripMode ? "true" : "false");

      if (profileImage) {
        formData.append("documents[0].file", profileImage, profileImage.name);
        formData.append("documents[0].name", profileImage.name);
        formData.append("documents[0].type", "IMAGE");
      }

      let response;
      if (updateId) {
        response = await updateGroupLeader({
          organizationId: orgId,
          LeaderId: updateId,
          data: formData,
        }).unwrap();
        showSuccess("Leader updated successfully!");
      } else {
        response = await saveGroupLeader({
          organizationId: orgId,
          data: formData,
        }).unwrap();
        showSuccess("Leader added successfully!");
      }

      onSave((response as any)?.data || response || {});
    } catch (err) {
      console.error("❌ Error saving trip leader:", err);
      showApiError("Failed to save trip leader");
    }
  };

  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: "var(--font-poppins)" }}>
      {/* ✅ Profile Image Section */}
      <div>
        {/* Show heading only in Add Leader */}
        {isTripMode && (
          <label className="block text-[0.95rem] font-semibold mb-2">
            Profile Image
          </label>
        )}

        {isTripMode ? (
          // 🟠 Add Leader form (trip mode)
          <>
            <div className="flex items-center gap-4">
              {/* Circle Image */}
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

              {/* Upload Button */}
              <div className="flex flex-col">
                <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-4 h-4 text-gray-500" />
                  <span className="text-[0.95rem]">
                    {profileImage ? "Update Profile Image" : "Upload Profile Image"}
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                {/* ✅ Note directly under button */}
                <p className="text-xs text-gray-400 mt-1 ml-1">
                  PNG, JPG up to 10MB
                </p>
              </div>
            </div>
          </>
        ) : (
          // 🟢 Library/Edit mode (centered)
          <div className="flex flex-col items-center gap-3">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Profile Preview"
                width={90}
                height={90}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border flex items-center justify-center text-gray-400 text-sm">
                No Image
              </div>
            )}
            <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
              <Upload className="w-4 h-4 text-gray-500" />
              <span className="text-[0.95rem]">
                {profileImage ? "Update Profile Image" : "Upload Profile Image"}
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* ✅ Centered note for library */}
            <p className="text-xs text-gray-400 text-center mt-1">
              PNG, JPG up to 10MB
            </p>
          </div>
        )}
      </div>

      {/* Name */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          maxLength={50}
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      {/* Tagline */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">Tagline</label>
        <Input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="Enter tagline"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
          Bio <span className="text-red-500">*</span>
        </label>
        <RichTextEditor
          value={bio}
          onChange={setBio}
          placeholder="Enter here"
          maxLength={500}
        />
        {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio}</p>}
      </div>

      {/* Footer */}
      <div className="flex justify-end items-center gap-4 mt-6">
        <Button variant="outline" className="rounded-full" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="rounded-full px-6 gap-2 bg-[linear-gradient(90deg,#FEA901_0%,#FD6E34_33%,#FE336A_66%,#FD401A_100%)] hover:opacity-90 text-white"
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
