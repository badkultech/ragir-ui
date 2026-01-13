"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Upload, CheckCircle2, XCircle } from "lucide-react";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { AppHeader } from "@/components/app-header";
import { useChangePasswordMutation } from "@/lib/services/login";
import { showApiError, showSuccess, showError } from "@/lib/utils/toastHelpers";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth";
import { useLazyGetOrganizerProfileQuery } from "@/lib/services/organizer";
import { useOrganizationId } from "@/hooks/useOrganizationId";
import { organizerState, setLogoFile, setProfile } from "../-organizer-slice";
import { EMPTY_DOCUMENT } from "@/hooks/useDocumentsManager";

export default function SettingsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    type NotificationPreference = {
        categoryCode: "NEW_BOOKING" | "NEW_QUERY" | "NEW_LEAD";
        title: string;
        description: string;
        channel: "IN_APP";
        enabled: boolean;
    };
    type OrganizationPreference = {
        language: string;
        currency: string;
        timezone: string;
        dateFormat: string;
    };

    const [organizationPreferences, setOrganizationPreferences] = useState<OrganizationPreference>({
        language: "English",
        currency: "INR",
        timezone: "IST",
        dateFormat: "DD/MM/YYYY",
    });
    const [preferences, setPreferences] = useState<NotificationPreference[]>([
        {
            categoryCode: "NEW_LEAD",
            title: "New Lead Alerts",
            description: "Get notified when someone creates a lead",
            channel: "IN_APP",
            enabled: true,
        },
        {
            categoryCode: "NEW_BOOKING",
            title: "New Booking Alerts",
            description: "Get notified when someone books a trip",
            channel: "IN_APP",
            enabled: true,
        },
        {
            categoryCode: "NEW_QUERY",
            title: "Query Notifications",
            description: "Receive alerts for new user queries",
            channel: "IN_APP",
            enabled: true,
        },
    ]);


    // password states
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [changePassword, { isLoading }] = useChangePasswordMutation();
    const { userData } = useSelector(selectAuthState);
    const email = userData?.email ?? "";
    const organizationId = useOrganizationId();
    const dispatch = useDispatch();
    const { profile, logoFile } = useSelector(organizerState);
    const [getOrgProfile, { isLoading: getOrgProfileLoading }] = useLazyGetOrganizerProfileQuery();

    useEffect(() => {
        if (!organizationId) return;

        getOrgProfile({ organizationId }).then((res) => {
            if (!res?.data) return;

            const data = res.data;

            dispatch(
                setProfile({
                    organizerName: data.organizerName ?? "",
                    tagline: data.tagline ?? "",
                    description: data.description ?? "",
                    mobileNumber: data.mobileNumber ?? "",
                })
            );

            dispatch(setLogoFile(data.displayPicture ?? EMPTY_DOCUMENT));
        });
    }, [organizationId]);

    // 🧠 password rule checks
    // ✅ Password strength & validation rules
    const rules = useMemo(() => {
        return {
            length: newPassword.length >= 8,
            uppercase: /[A-Z]/.test(newPassword),
            number: /[0-9]/.test(newPassword),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
        };
    }, [newPassword]);

    // ✅ Determine if all rules pass
    const allValid =
        currentPassword.trim() &&
        newPassword.trim() &&
        confirmPassword.trim() &&
        newPassword === confirmPassword &&
        Object.values(rules).every(Boolean);

    const handlePasswordUpdate = async () => {
        if (!allValid) return; // should never happen if button disabled

        try {
            await changePassword({
                currentPassword,
                newPassword,
                email
            }).unwrap();

            showSuccess("Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            if (error?.data?.message) {
                showError(error.data.message);
            } else {
                showApiError(error);
            }
        }
    };


    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <OrganizerSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Section */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <AppHeader title="Settings" onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold">Settings</h1>

                    </div>

                    {/* Profile Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Image Upload */}
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <img
                                    src={logoFile?.url || "/images/profile.png"}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full object-cover"
                                />

                                <div>
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2 border-gray-300 text-gray-700"
                                    >
                                        <Upload className="w-4 h-4" />
                                        Upload New Image
                                    </Button>
                                    <p className="text-xs text-gray-500 mt-1">
                                        PNG, JPG up to 10MB
                                    </p>
                                </div>
                            </div>

                            {/* Input Fields */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Input placeholder="Organizer Name" value={profile.organizerName} onChange={(e) => dispatch(setProfile({ ...profile, organizerName: e.target.value }))} />
                                <Input placeholder="Tagline" value={profile.tagline} onChange={(e) => dispatch(setProfile({ ...profile, tagline: e.target.value }))} />
                                <Input placeholder="Description" value={profile.description} onChange={(e) => dispatch(setProfile({ ...profile, description: e.target.value }))} />
                                <Input placeholder="Mobile Number" value={profile.mobileNumber} onChange={(e) => dispatch(setProfile({ ...profile, mobileNumber: e.target.value }))} />
                            </div>
                            <div className="flex items-center gap-3 justify-end">
                                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {preferences.map((pref) => (
                                <div
                                    key={`${pref.categoryCode}-${pref.channel}`}
                                    className="flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800">{pref.title}</p>
                                        <p className="text-sm text-gray-500">{pref.description}</p>
                                    </div>

                                    <Switch
                                        checked={pref.enabled}
                                        onCheckedChange={(checked) =>
                                            setPreferences((prev) =>
                                                prev.map((p) =>
                                                    p.categoryCode === pref.categoryCode &&
                                                        p.channel === pref.channel
                                                        ? { ...p, enabled: checked }
                                                        : p
                                                )
                                            )
                                        }
                                    />
                                </div>
                            ))}

                            {/* Save Button */}
                            <div className="flex justify-end">
                                <Button
                                    onClick={() => {
                                        // call save preferences API
                                        console.log("Saving preferences:", organizationPreferences);
                                    }}
                                >
                                    Save Preferences
                                </Button>
                            </div>
                        </CardContent>
                    </Card>


                    {/* Account Preferences */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Preferences</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-4">
                                {/* Language */}
                                <div>
                                    <p className="text-sm font-medium mb-2">Language</p>
                                    <Select
                                        value={organizationPreferences.language}
                                        onValueChange={(value) =>
                                            setOrganizationPreferences((prev) => ({ ...prev, language: value }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="English">English</SelectItem>
                                            <SelectItem value="Hindi">Hindi</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Time Zone */}
                                <div>
                                    <p className="text-sm font-medium mb-2">Time Zone</p>
                                    <Select
                                        value={organizationPreferences.timezone}
                                        onValueChange={(value) =>
                                            setOrganizationPreferences((prev) => ({ ...prev, timezone: value }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Time Zone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="IST">IST (GMT +5:30)</SelectItem>
                                            <SelectItem value="UTC">UTC</SelectItem>
                                            <SelectItem value="PST">PST (GMT -8:00)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Currency */}
                                <div>
                                    <p className="text-sm font-medium mb-2">Currency</p>
                                    <Select
                                        value={organizationPreferences.currency}
                                        onValueChange={(value) =>
                                            setOrganizationPreferences((prev) => ({ ...prev, currency: value }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="INR">INR (₹)</SelectItem>
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                            <SelectItem value="EUR">EUR (€)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Date Format */}
                                <div>
                                    <p className="text-sm font-medium mb-2">Date Format</p>
                                    <Select
                                        value={organizationPreferences.dateFormat}
                                        onValueChange={(value) =>
                                            setOrganizationPreferences((prev) => ({ ...prev, dateFormat: value }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Date Format" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end">
                                <Button
                                    onClick={() => {
                                        // call save preferences API
                                        console.log("Saving preferences:", organizationPreferences);
                                    }}
                                >
                                    Save Preferences
                                </Button>
                            </div>
                        </CardContent>
                    </Card>



                    {/* Security */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium mb-1">Current Password</p>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="**************"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-gray-500"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {/* New Password */}
                                <div className="relative">
                                    <p className="text-sm font-medium mb-1">New Password</p>
                                    <Input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="**************"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        maxLength={50}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-9 text-gray-500"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>

                                    {/* Password Strength */}
                                    {newPassword && (
                                        <div className="mt-4 space-y-1">
                                            <div className="flex items-center text-sm">
                                                {rules.length ? (
                                                    <CheckCircle2 className="text-[#FF804C] mr-2" size={16} />
                                                ) : (
                                                    <XCircle className="text-gray-400 mr-2" size={16} />
                                                )}
                                                <span className="text-gray-600">8+ characters</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                {rules.uppercase ? (
                                                    <CheckCircle2 className="text-[#FF804C] mr-2" size={16} />
                                                ) : (
                                                    <XCircle className="text-gray-400 mr-2" size={16} />
                                                )}
                                                <span className="text-gray-600">1 uppercase letter</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                {rules.number ? (
                                                    <CheckCircle2 className="text-[#FF804C] mr-2" size={16} />
                                                ) : (
                                                    <XCircle className="text-gray-400 mr-2" size={16} />
                                                )}
                                                <span className="text-gray-600">1 number</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                {rules.special ? (
                                                    <CheckCircle2 className="text-[#FF804C] mr-2" size={16} />
                                                ) : (
                                                    <XCircle className="text-gray-400 mr-2" size={16} />
                                                )}
                                                <span className="text-gray-600">
                                                    1 special symbol (!@#$)
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm New Password */}
                                <div className="relative">
                                    <p className="text-sm font-medium mb-1">Confirm New Password</p>
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="**************"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-9 text-gray-500"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>

                                    {/* Inline error message */}
                                    {confirmPassword &&
                                        newPassword &&
                                        confirmPassword !== newPassword && (
                                            <p className="text-xs text-red-500 mt-1">
                                                Passwords do not match
                                            </p>
                                        )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <Button
                                    variant="outline"
                                    className="text-sm text-gray-700 border-gray-300"
                                >
                                    Forgot Password?
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handlePasswordUpdate}
                                    disabled={!allValid || isLoading}
                                    className={`${allValid
                                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                >
                                    {isLoading ? "Updating..." : "Update Password"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                </main>
            </div>
        </div>
    );
}
