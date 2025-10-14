  "use client";
  import { useState, ChangeEvent } from "react";
  import { Calendar } from "lucide-react";

  export  function DayDescriptionModal({ onClose }: { onClose: () => void }) {
    const [images, setImages] = useState<File[]>([]);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [location, setLocation] = useState("");
    const [time, setTime] = useState("");
    const [packing, setPacking] = useState("");
    const [saveLibrary, setSaveLibrary] = useState(false);

    // Handle images (max 6)
    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      let newFiles = Array.from(e.target.files);
      let combined = [...images, ...newFiles].slice(0, 6);
      setImages(combined);
    };

    // Remove individual image
    const removeImage = (idx: number) =>
      setImages(images.filter((_, i) => i !== idx));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center h-screen overflow-auto bg-black/40 ">

      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 max-w-md w-full max-h-[90vh] h-auto    ">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-semibold">Day Description</span>
          <button className="px-3 py-1 rounded border border-orange-300 bg-white text-orange-600 hover:bg-orange-50 transition font-medium text-sm">
            Choose from Library
          </button>
        </div>
        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          <div className="position: relative  ">
            <label className="font-medium text-gray-700 text-sm">Title *</label>
            <input
              type="text"
              maxLength={70}
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full  mt-1 px-3 py-2  border rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              placeholder="Enter title"
            />
            <span className="block text-xs position: absolute top-8.5 left-75 text-orange-400 mt-1">{title.length}/70 Characters</span>
          </div>
          <div className="relative">
            <label className="font-medium text-gray-700 text-sm">Description *</label>
            <textarea
              maxLength={800}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={3}
              className="w-full mt-1 px-3 py-2 border rounded-lg outline-none resize-none focus:ring-2 focus:ring-orange-500 text-sm"
              placeholder="Enter here"
            />
            <span className="block absolute top-13 left-78 text-xs text-orange-400 mt-1">{desc.length}/800 Words</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-gray-700 text-sm">Location</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                placeholder="Location"
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 text-sm">Time</label>
              <input
                type="text"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                placeholder="12:30 PM"
              />
            </div>
          </div>
          <div className="relative">
            <label className="font-medium text-gray-700 text-sm">Packing Suggestions</label>
            <textarea
              maxLength={800}
              value={packing}
              onChange={e => setPacking(e.target.value)}
              rows={2}
              className="w-full mt-1 px-3 py-2 border rounded-lg outline-none resize-none focus:ring-2 focus:ring-orange-500 text-sm"
              placeholder="Enter here"
            />
            <span className="block absolute top-11 left-78 text-xs text-orange-400 mt-1">{packing.length}/800 Words</span>
          </div>
          {/* Image Upload */}
          <div>
            <label className="font-medium text-gray-700 text-sm">Images (Max 6)</label>
            <div className="mt-2 bg-gray-50 border rounded-xl flex flex-col items-center justify-center py-6 px-3">
              <input
                type="file"
                multiple
                accept="image/png, image/jpeg"
                style={{ display: "none" }}
                id="uploadImg"
                onChange={handleFile}
                disabled={images.length >= 6}
              />
              <label htmlFor="uploadImg" className="flex flex-col items-center cursor-pointer">
                <span className="text-2xl mb-1"><Calendar /></span>
                <span className="text-sm text-gray-500 mb-1">Upload Images</span>
                <span className="text-xs text-gray-400">PNG, JPG up to 10MB</span>
              </label>
            </div>
            {/* Image preview + delete */}
            <div className="flex mt-3 gap-2 flex-wrap">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Preview ${idx}`}
                    className="h-14 w-14 object-cover rounded-xl border shadow"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-white border border-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-600 shadow group-hover:bg-red-200"
                    onClick={() => removeImage(idx)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Save in Library checkbox */}
          <label className="flex items-center gap-2 text-sm mt-2">
            <input
              type="checkbox"
              checked={saveLibrary}
              onChange={e => setSaveLibrary(e.target.checked)}
              className="accent-orange-500"
            />
            Save in Library
          </label>
          {/* Action buttons */}
          <div className="flex justify-end items-center gap-3 mt-4">
            <button onClick={onClose}
            className="px-7 py-2 rounded-full border bg-white text-gray-500 font-medium hover:bg-gray-50 transition">
              Cancel
            </button>
            <button className="px-8 py-2 rounded-full font-medium text-white bg-gradient-to-r from-orange-400 to-pink-500 shadow hover:from-orange-500 hover:to-pink-600 transition">
              Save
            </button>
          </div>
        </div>
      </div>
      </div>
    );
  }
