"use client";

import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// fake profile toggle (replace with API data later)
const hasProfile = true;

export default function OrganizerProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <OrganizerSidebar isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col">
        <AppHeader title="Organizer Profile" />

        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Top row: page heading + buttons */}
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-semibold">Organiser Profile</h1>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  className="rounded-full px-5 py-2 border-gray-300"
                >
                  Discard
                </Button>

                <Link href="/organizer/profile/edit">
                  <Button className="rounded-full px-5 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>

            {!hasProfile ? (
              // Empty state
              <div className="flex flex-col items-center justify-center h-72 text-center">
                <h2 className="text-2xl font-semibold mb-2">Complete Your Profile</h2>
                <p className="text-gray-500 mb-6 max-w-md">
                  Add your details to showcase your identity and manage your events seamlessly.
                </p>

                <Link href="/organizer/profile/edit">
                  <Button className="rounded-full px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                    Add Details +
                  </Button>
                </Link>
              </div>
            ) : (
              // Profile view
              <div className="space-y-6">
                {/* Cover Image */}
                <div className="relative w-full h-56 rounded-xl overflow-hidden">
                  <img
                    src="/demo-cover.jpg"
                    alt="Cover"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                {/* Logo + Name + Socials (logo overlaps by negative margin) */}
                <div className="flex items-center -mt-12 px-2">
                  <img
                    src="/demo-logo.png"
                    alt="Logo"
                    className="w-28 h-28 rounded-full border-4 border-white shadow-md"
                  />

                  <div className="ml-4">
                    <h2 className="text-2xl font-semibold">Bon Ton</h2>
                    <p className="text-gray-500">Tagline</p>
                  </div>

                  <div className="ml-auto flex items-center space-x-3">
                    <a href="#" target="_blank" rel="noreferrer">
                      <img src="/icons/youtube.svg" className="w-6 h-6" alt="YouTube" />
                    </a>
                    <a href="#" target="_blank" rel="noreferrer">
                      <img src="/icons/instagram.svg" className="w-6 h-6" alt="Instagram" />
                    </a>
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-lg bg-gray-50 p-6 text-gray-700 text-sm leading-relaxed border border-gray-100">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
                  remaining essentially unchanged.
                </div>

                {/* (optional) other actions or meta can go here */}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
