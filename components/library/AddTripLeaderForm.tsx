"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Image from "next/image";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";
import { useLazyGetGroupLeaderByIdQuery, useSaveGroupLeaderMutation, useUpdateGroupLeaderMutation } from "@/lib/services/organizer/trip/library/leader";
import { selectAuthState } from "@/lib/slices/auth";
import { useSelector } from "react-redux";
import RichTextEditor from "../editor/RichTextEditor";
import { ChooseFromLibraryButton } from "./ChooseFromLibraryButton";
import { useToast } from "../ui/use-toast";


type AddTripLeaderFormProps = {
  updateId?:number|null;
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any) => void;
  open?: boolean;
};

export function AddTripLeaderForm({
  updateId,
  mode = "trip",
  onCancel,
  onSave,
  open,
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
  const { toast } = useToast();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

 const [getDayDescription] = useLazyGetGroupLeaderByIdQuery();


  
 
  useEffect(() => {
    if (updateId) {
      
      getDayDescription({ organizationId :orgId, leaderId: updateId })
        .then((res) => {
          // RTK Query lazy trigger returns a union; narrow before using
          if ('data' in res && res.data) {
            const data = res.data as any;
            setName(data.name);
            setTagline(data.tagline);
            setBio(data.bio);
            setLibraryOpen(data.libraryOpen);
            setProfileImage(data.profileImage);
          } else {
            console.warn('Failed to load response', res);
          }
        })
        .catch((error) => {
          console.warn('Error to load dayDescription', error);
        });
    }
  }, [updateId]);



  const [updateGroupLeader]=useUpdateGroupLeaderMutation();
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

  const validateForm = () => {
  const newErrors: { [key: string]: string } = {};

  if (!name.trim()) newErrors.name = "Name is required";
  if (!bio.trim()) newErrors.bio = "Bio required";

  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async () => {
    if (!orgId) {
      console.error("Missing org ID");
      return;
    }
    const isValid = validateForm();
    if (!isValid) return;

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

      
    let response;
    if (updateId) {
      // 🟢 Update existing leader
      response = await updateGroupLeader({
        organizationId: orgId,
        LeaderId: updateId,
        data: formData,
      }).unwrap();

      console.log("✅ Trip Leader updated successfully:", response);
    } else {
      // 🟠 Create new leader
      response = await saveGroupLeader({
        organizationId: orgId,
        data: formData,
      }).unwrap();

      onSave(response);
      toast({
        title: "Success",
        description: "Trip leader saved successfully!",
      });
    }
   } catch (err) {
      console.error("Error saving trip leader:", err);
      toast({
        title: "Error",
        description: "Failed to save trip leader",
        variant: "destructive",
      });
    }
  };
  const isTripMode = mode === "trip";




  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: "var(--font-poppins)" }}>
      {/* Profile Image Upload */}
      {/* Top-right button */}
      <div className="flex justify-end">
        {isTripMode ? (
          <ChooseFromLibraryButton onClick={() => setLibraryOpen(true)} />
        ) : (
          <div className="mt-2" />
        )}
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
          <span className="text-[0.95rem]">Update Profile Image</span>
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
        <label className="block text-[0.95rem] font-medium mb-2">
          Name *
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      {/* Tagline */}
      <div>
        <label className="block text-[0.95rem] font-medium  mb-2">
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
        <label className="block text-[0.95rem] font-medium mb-2">
          Bio *
        </label>
        {/* <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Enter here"
          rows={5}
          maxLength={500}
        /> */}
        <RichTextEditor
          value={bio}
          onChange={setBio}
          placeholder="Enter here"
          maxLength={500}
        />
        {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio}</p>}

      </div>
      {mode === "trip" &&
        <LibrarySelectModal
          open={libraryOpen}
          onClose={() => setLibraryOpen(false)}
          onSelect={handleLibrarySelect}
          category="trip-leaders"
        />
      }

      {/* Footer */}
      <div className="flex justify-end items-center gap-4 mt-6">
        <Button variant="outline" className="rounded-full" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !name.trim() || !bio.trim()}
          className="rounded-full px-6 bg-gradient-to-r from-[#FEA901] via-[#FD6E34] to-[#FE336A] hover:bg-gradient-to-t text-white"
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>

      </div>
    </div>
  );
}
