"use client";

export function AddLeaderModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-[600px] shadow-xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-lg text-gray-400 hover:text-gray-600 font-bold">×</button>
        <h2 className="font-semibold text-lg mb-4">Add New Group Leader</h2>
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2">Profile Image</label>
          <div className="flex items-center gap-3">
            <img src="" alt="Profile" className="w-14 h-14 rounded-full border object-cover" />
            <button className="border px-4 py-2 rounded-md bg-gray-50 font-medium">Update Profile Image</button>
          </div>
          <div className="text-xs text-gray-400 ml-16">PNG, JPG up to 10MB</div>
        </div>
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2">Name <span className="text-red-500">*</span></label>
          <input className="w-full border px-4 py-2 rounded-md" placeholder="Enter name"/>
        </div>
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2">Bio</label>
          <textarea className="w-full border rounded-md px-4 py-2 min-h-[80px]" maxLength={500} placeholder="Enter here"></textarea>
          <div className="text-xs text-gray-400 text-right mt-1">0/500 Characters</div>
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-gray-50 border rounded-full text-gray-600 font-medium">Cancel</button>
          <button className="px-6 py-2 rounded-full font-medium text-white bg-gradient-to-r from-orange-400 to-pink-500">Save</button>
        </div>
      </div>
    </div>
  );
}
