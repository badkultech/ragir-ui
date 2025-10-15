"use client";

import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  Calendar,
  Hotel,
  Bus,
  Utensils,
  Activity,
  Users,
  HelpCircle,
  Car,
  Home,
  ForkKnife,
  User2,
} from "lucide-react";
import { GradientButton } from "@/components/gradient-button";
import { useState } from "react";
import { AddNewItemModal } from "@/components/library/AddNewItemModal";
import { LibraryHeader } from "@/components/library/LibraryHeader";

const categories = [
  { label: "Day Description", href: "/organizer/library/events", icon: Calendar },
  { label: "Transit", href: "/organizer/library/transits", icon: Car },
  { label: "Stays", href: "/organizer/library/stays", icon: Home },
  { label: "Meals", href: "/organizer/library/meals", icon: ForkKnife },
  {
    label: "Activities",
    href: "/organizer/library/activities",
    icon: Activity,
  },
  {
    label: "Trip Leaders",
    href: "/organizer/library/trip-leaders",
    icon: User2,
  },
  { label: "FAQs", href: "/organizer/library/faqs", icon: HelpCircle },
];

export default function LibraryOverviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        <AppHeader title="Library" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 md:p-8 lg:w-[1200px] lg:mx-auto">
         
          
          {/* <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Ragir Library
              </h1>
              <p className="text-sm text-gray-500">
                Manage your travel content and organize into custom collections
              </p>
            </div>
            <GradientButton
              className="flex items-center justify-center gap-2 
             w-auto 
             px-5 py-2 
             bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setModalOpen(true)}
            >
              <PlusCircle className="w-4 h-4" />
              Add Item
            </GradientButton>
          </div> */  }

           {/* Header with Add Item */}

            <LibraryHeader
                       title="Ragir Library"
                       buttonLabel="Add item"
                       onAddClick={() => setModalOpen(true)}
                       hideBackBtn = {true}
                     />

          {/* Modal */}
          <AddNewItemModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
          />

          {/* Search */}
          {/* <div className="mb-8">
            <Input
              type="text"
              placeholder="Search Library..."
              className="w-full max-w-md border-orange-300 focus:border-orange-500 focus:ring-orange-500"
            />
          </div> */}

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6  gap-x-2 justify-items-center">
            {categories.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col justify-center items-center 
                 w-full max-w-[200px] md:max-w-[320px] lg:max-w-[300px] 
                 h-[160px] md:h-[170px] 
                 p-4 gap-6
                 bg-[rgba(255,128,76,0.06)] border border-[#FF804C] rounded-xl
                 transition hover:shadow-md hover:border-[#ff662a]"
              >
                <Icon className="h-10 w-10 text-[#FF804C]" />
                <span className="text-base font-medium text-gray-900">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
