"use client";

import { useState } from "react";
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
import { MainHeader } from "@/components/search-results/MainHeader";
import { menuItems, notificationsData, userMenuItems } from "../constants";

import { SidebarMenu } from "@/components/search-results/SidebarMenu";
import { useAuthActions } from "@/hooks/useAuthActions";

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
  const { isLoggedIn, handleLogout, router } = useAuthActions();
  const [notifications, setNotifications] = useState(notificationsData);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const onLogout = () => {
    handleLogout(() => setSidebarOpen(false));
  };


  return (
    <>
      <div className="min-h-screen bg-background w-full">

        {/* ✅ HEADER FIXED */}
        <MainHeader logoText="Settings"
          isLoggedIn={isLoggedIn}
          notifications={notifications}
          onUpdateNotifications={setNotifications}
          onMenuOpen={() => setSidebarOpen(true)}
          variant="edge"
        />

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
        <LogoutModal
          open={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onLogout={() => {
            setShowLogoutModal(false);
            onLogout();
          }}
        />
        <DeactivateModal open={showDeactivateModal} onClose={() => setShowDeactivateModal(false)} />
        <DeleteModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} />

      </div>
      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        menuItems={menuItems}
        userMenuItems={userMenuItems}
        onLogout={onLogout}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
