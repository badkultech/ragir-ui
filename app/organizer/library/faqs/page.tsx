"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2, HelpCircle } from "lucide-react";
import { AddNewItemModal } from "@/components/library/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";

const mockFAQs = [
  {
    id: 1,
    question: "What is included in the trip package?",
    answer:
      "Our packages typically include accommodation, meals as specified, transportation, guided tours, and entry fees to attractions. Flight tickets are usually separate unless mentioned otherwise.",
    tags: ["Trekking"],
  },
  {
    id: 2,
    question: "Is travel insurance provided?",
    answer: "Yes, all packages include basic travel insurance coverage.",
    tags: ["Safety"],
  },
];

export default function FAQsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = mockFAQs.filter((f) =>
    f.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col">
        <AppHeader title="FAQs" />
        <main className="flex-1 p-6 md:p-8">
          {/* Header */}
          <LibraryHeader
            buttonLabel="Add faq"
            onAddClick={() => setModalOpen(true)}
          />

          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Search FAQs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-80 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          {/* List */}
          <div className="flex flex-col gap-4">
            {filtered.map((faq) => (
              <div
                key={faq.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-start gap-4"
              >
                {/* Icon */}
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-gray-500" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {faq.answer}
                  </p>
                  {faq.tags && (
                    <div className="mt-2 text-xs text-gray-400">
                      {faq.tags.join(", ")}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 text-gray-500">
                  <button className="hover:text-orange-500">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button className="hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                No FAQs found.
              </div>
            )}
          </div>
        </main>
      </div>
      <AddNewItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialStep="faq"
      />
    </div>
  );
}
