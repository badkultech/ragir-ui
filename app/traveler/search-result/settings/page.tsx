"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Scale,
  Bell,
  Menu,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Sidebar from "@/components/search-results/settings/Sidebar";
import ProfileTab from "@/components/search-results/settings/ProfileTab";
import CommunicationsTab from "@/components/search-results/settings/CommunicationsTab";
import PreferencesTab from "@/components/search-results/settings/PreferencesTab";
import SupportTab from "@/components/search-results/settings/SupportTab";
import LegalTab from "@/components/search-results/settings/LegalTab";
import SecurityTab from "@/components/search-results/settings/SecurityTab";
import LogoutModal from "@/components/search-results/settings/LogoutModal";
import DeactivateModal from "@/components/search-results/settings/DeactivateModal";
import DeleteModal from "@/components/search-results/settings/DeleteModal";
import { useRouter } from "next/navigation";

export default function SettingsPage() {

  const [activeTab, setActiveTab] = useState("profile");

  const [formData, setFormData] = useState({
    firstName: "Rahul",
    lastName: "Sharma",
    email: "",
    phone: "",
    gender: "Male",
    dateOfBirth: "",
    bio: "",
  });

  const [communications, setCommunications] = useState({
    whatsappUpdates: true,
    emailNotifications: true,
    smsUpdates: true,
    marketingWhatsapp: true,
    marketingEmails: true,
    marketingSms: true,
    browserNotifications: true,
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter()
  

  return (
    <div className="min-h-screen bg-background">

      {/* ✅ HEADER FIXED */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 md:px-8 py-4 max-w-[1400px] mx-auto">

          {/* Back + Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-1 hover:bg-[#f3f3f3] rounded-full"
            >
              <ChevronLeft className="w-5 h-5 text-[#2d2d2d]" />
            </button>
            <h1 className="text-base md:text-lg font-semibold text-foreground">Settings</h1>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-full transition-colors hidden md:block">
              <Scale className="w-5 h-5 text-foreground" />
            </button>

            <button className="p-2 hover:bg-muted rounded-full transition-colors hidden md:block">
              <Bell className="w-5 h-5 text-foreground" />
            </button>

            <Avatar className="w-8 h-8 md:w-9 md:h-9 ml-2">
              <AvatarImage src="/man-profile.png" />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                RS
              </AvatarFallback>
            </Avatar>

            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">

          {/* SIDEBAR */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* TAB CONTENT */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <ProfileTab formData={formData} setFormData={setFormData} />
            )}

            {activeTab === "communications" && (
              <CommunicationsTab
                communications={communications}
                setCommunications={setCommunications}
              />
            )}

            {activeTab === "preferences" && <PreferencesTab />}
            {activeTab === "support" && <SupportTab />}
            {activeTab === "legal" && <LegalTab />}

            {activeTab === "security" && (
              <SecurityTab
                setShowLogoutModal={setShowLogoutModal}
                setShowDeactivateModal={setShowDeactivateModal}
                setShowDeleteModal={setShowDeleteModal}
              />
            )}
          </div>
        </div>
      </main>

      {/* MODALS */}
      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
      <DeactivateModal open={showDeactivateModal} onClose={() => setShowDeactivateModal(false)} />
      <DeleteModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} />

    </div>
  );
}
