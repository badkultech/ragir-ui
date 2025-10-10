"use client";
import { useState } from "react";

// Mock leader data for demo
const dummyLeaders = [
  { id: 1, name: "John Does", bio: "Adventure awaits beyond comfort zones", img: "/avatar1.png" },
  { id: 2, name: "John Does", bio: "Adventure awaits beyond comfort zones", img: "/avatar1.png" },
  { id: 3, name: "John Does", bio: "Adventure awaits beyond comfort zones", img: "/avatar1.png" },
  { id: 4, name: "John Does", bio: "Adventure awaits beyond comfort zones", img: "/avatar1.png" },
  { id: 5, name: "John Does", bio: "Adventure awaits beyond comfort zones", img: "/avatar1.png" },
];

export  function ChooseLeaderModal({ open, onClose }) {
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  if (!open) return null;

  const filteredLeaders = dummyLeaders.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-[430px] max-h-[90vh] overflow-y-auto shadow-xl p-6 relative">
        {/* Close */}
        <button onClick={onClose} className="absolute right-4 top-4 text-xl text-gray-400 hover:text-black font-bold">×</button>
        <h2 className="font-semibold text-lg mb-4">Add Leader</h2>
        <div className="mb-5">
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 mb-3">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none w-full"
              placeholder="Search"
            />
          </div>
          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
            {filteredLeaders.map(l => (
              <button
                type="button"
                key={l.id}
                onClick={() => setSelectedId(l.id)}
                className={`flex items-center gap-3 rounded-xl p-3 text-left
                  border ${selectedId === l.id ? "border-orange-400 bg-orange-50" : "border-transparent hover:border-gray-300"} transition`}
              >
                <img src={l.img} alt="avatar" className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <div className="font-medium">{l.name}</div>
                  <div className="text-gray-400 text-[15px]">"{l.bio}"</div>
                </div>
              </button>
            ))}
            {filteredLeaders.length === 0 && (
              <div className="text-center py-8 text-gray-400">No leaders found</div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-6 py-2 bg-gray-50 border rounded-full text-gray-600 font-medium">Cancel</button>
          <button
            className="px-6 py-2 rounded-full font-medium text-white bg-gradient-to-r from-orange-400 to-pink-500"
            disabled={!selectedId}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
