"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function OrganizerProfileEditPage() {
  const [logo, setLogo] = useState<string | null>("/demo-logo.png");
  const [banner, setBanner] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setLogo(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setBanner(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OrganizerSidebar />

      <div className="flex-1 flex flex-col">
        <AppHeader title="Organizer Profile" />

        <main className="flex-1 p-6 md:p-8 space-y-8">
          {/* ================= Basic Details ================= */}
          <section className="bg-white rounded-xl border p-6 space-y-6">
            <h2 className="text-lg font-medium">Basic Details</h2>

            {/* Logo */}
            <div className="flex items-center space-x-6">
              {logo && (
                <img
                  src={logo}
                  alt="Logo"
                  className="w-20 h-20 rounded-full border object-cover"
                />
              )}
              <div>
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                  <Button variant="outline">Upload New Image</Button>
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG up to 10MB
                </p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm mb-1">Organizer Name</label>
              <Input placeholder="Enter here" />
            </div>

            {/* Banner */}
            <div>
              <label className="block text-sm mb-1">Cover Image / Banner</label>
              <div className="border border-dashed rounded-lg p-6 text-center">
                {banner ? (
                  <img
                    src={banner}
                    alt="Banner"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBannerChange}
                      />
                      <Button variant="outline">Upload Banner Image</Button>
                    </label>
                    <p className="text-xs text-gray-400 mt-1">
                      1920px x 480px recommended
                    </p>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* ================= About the Organizer ================= */}
          <section className="bg-white rounded-xl border p-6 space-y-6">
            <h2 className="text-lg font-medium">About the Organizer</h2>

            <div>
              <label className="block text-sm mb-1">Tagline</label>
              <Input placeholder="Enter here" />
              <p className="text-xs text-gray-400 text-right">0/200 Characters</p>
            </div>

            <div>
              <label className="block text-sm mb-1">Description</label>
              <Textarea rows={4} placeholder="Enter here" />
              <p className="text-xs text-gray-400 text-right">
                0/500 Characters
              </p>
            </div>
          </section>

          {/* ================= Social Profiles ================= */}
          <section className="bg-white rounded-xl border p-6 space-y-6">
            <h2 className="text-lg font-medium">Social Profiles</h2>

            {/* Two column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Website URL</label>
                <Input placeholder="https://" />
              </div>
              <div>
                <label className="block text-sm mb-1">Instagram Handle</label>
                <Input placeholder="@username" />
              </div>
              <div>
                <label className="block text-sm mb-1">YouTube Channel</label>
                <Input placeholder="youtube.com/" />
              </div>
              <div>
                <label className="block text-sm mb-1">Google Business</label>
                <Input placeholder="Business link" />
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <label className="block text-sm mb-1">
                Add Testimonials or Reviews (Optional)
              </label>
              <Textarea rows={2} placeholder="Enter here" />
              <p className="text-xs text-gray-400 text-right">0/200 Characters</p>
            </div>

            {/* Screenshot Upload */}
            <div className="border border-dashed rounded-lg p-6 text-center">
              <Button variant="outline">Upload Screenshot</Button>
            </div>
          </section>

          {/* ================= Trust & Verification ================= */}
          <section className="bg-white rounded-xl border p-6 space-y-6">
            <h2 className="text-lg font-medium">Trust & Verification</h2>

            {/* Upload new certification */}
            <div className="border border-dashed rounded-lg p-6 text-center">
              <Button variant="outline">Upload Certification</Button>
              <p className="text-xs text-gray-400 mt-1">
                Mountaineering, Adventure Sports etc.
              </p>
            </div>

            {/* Already uploaded certs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg text-center text-sm">
                Certificate 1
                <div className="text-xs text-gray-500 mt-1">
                  Uploaded on 12/12/25
                </div>
              </div>
              <div className="p-4 border rounded-lg text-center text-sm">
                Certificate 2
                <div className="text-xs text-gray-500 mt-1">
                  Uploaded on 12/12/25
                </div>
              </div>
            </div>
          </section>

          {/* ================= Footer Buttons ================= */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline">Save as Draft</Button>
            <Button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
              Save Profile
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}