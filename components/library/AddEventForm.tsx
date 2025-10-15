"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { LibrarySelectModal } from "@/components/library/LibrarySelectModal";
import MDEditor from "@uiw/react-md-editor";

type AddEventFormProps = {
  mode?: "library" | "trip";
  onCancel: () => void;
  onSave: (data: any, replace?: boolean) => void;
};

export function AddEventForm({
  mode = "library",
  onCancel,
  onSave,
}: AddEventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [packing, setPacking] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [libraryOpen, setLibraryOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };

  const handleLibrarySelect = (item: any) => {
    setTitle(item.title || "");
    setLocation(item.location || "");
    setDescription(String(item.description || ""));
  };

  const handleSubmit = (replace = false) => {
    onSave(
      { title, description, location, time, packing, images, mode },
      replace
    );
  };

  const isTripMode = mode === "trip";

  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: "var(--font-poppins)"}}>
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

      {/* Title */}
      <div>
        <label
          className="block text-[0.95rem] font-medium mb-1"
        >
          Title *
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          maxLength={70}
        />
        <p className="text-xs text-right text-orange-500 mt-1">
          {title.length}/70 Characters
        </p>
      </div>

      {/* Description */}
      <div>
      <label className="block text-[0.95rem] font-medium mb-1">
          Description *
        </label>
        {/* <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter here"
          rows={5}
          maxLength={800}
        /> */}
        <MDEditor
          height={100}
          value={description}
          onChange={(val?: string) => setDescription(val ?? "")}
        />

        <p className="text-xs text-right text-orange-500 mt-1">
          {description.length}/800 Words
        </p>
      </div>

      {/* Location + Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
   <label className="block text-[0.95rem] font-[] font-medium mb-1">
          Location
        </label>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
        />
        </div>
      <div>
           <label className="block text-[0.95rem] font-[] font-medium mb-1">
          Time
        </label>
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          />
      </div>
      </div>

      {/* Packing Suggestions */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-1">
          Packing Suggestions
        </label>
        {/* <Textarea
          value={packing}
          onChange={(e) => setPacking(e.target.value)}
          placeholder="Enter here"
          rows={5}
          maxLength={800}
        /> */}
         <MDEditor
          height={100}
          value={packing}
          onChange={(val?: string) => setPacking(val ?? "")}
        />
        <p className="text-xs text-right text-orange-500 mt-1">
          {packing.length}/800 Words
        </p>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-[0.95rem] font-medium mb-2">
          Images (Max 6)
        </label>
        <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-orange-400 transition">
          <Upload className="w-6 h-6 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">Upload Images</span>
          <span className="text-xs text-gray-400">PNG, JPG up to 10MB</span>
          <input
            type="file"
            accept="image/png,image/jpeg"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {images.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2">
            {images.map((file, i) => (
              <div key={i} className="relative w-16 h-16 rounded overflow-hidden">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        )}
      </div >

        { isTripMode &&  <div className="flex flex-col items-end gap-2">
          <div className="flex justify-end items-center gap-2">
        <Input type="checkbox" value="" className=" w-[22px]" />
          <label className="block text-[0.95rem] font-medium">
          Save in Library
        </label>
          </div>
          
        <Input type="text" value="" id="" placeholder="Save As" className="p-4 w-[12rem] right" />
        </div>  }

      {/* Footer */}
      <div className="flex justify-end items-center gap-4 my-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => handleSubmit(false)}
          className="rounded-full px-6 bg-gradient-to-r from-[#FEA901] via-[#FD6E34] to-[#FE336A] hover:bg-gradient-to-t text-white"
        >
          Save
        </Button>
      </div>

      {/* Library Modal */}
      <LibrarySelectModal
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={handleLibrarySelect}
        category="events"
      />
    </div>
  );
}
