"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AddOnsFieldset } from "@/components/create-trip/add-ons-fieldset"
import { GstStatusToggle, type GstValue } from "@/components/create-trip/gst-status-toggle"
import { CreditOptions } from "@/components/create-trip/credit-options"
import { PricingSummary } from "@/components/create-trip/pricing-summary"
import { Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { WizardFooter } from "@/components/create-trip/wizard-footer"
import { Sidebar } from "@/components/organizer/sidebar"
import { TripStepperHeader } from "@/components/create-trip/tripStepperHeader"
import { OrganizerShell } from "@/components/layouts/organizer-shell"

// If you already have a WizardFooter component, you can replace the footer below with it.

export default function PricingPage() {
    const router = useRouter()
    const [pricingMode, setPricingMode] = useState<"simple" | "dynamic">("simple")
    const [gst, setGst] = useState<GstValue>("excludes")
    const [credit, setCredit] = useState({ card: true, emi: false })

    return (

        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 h-auto  ">
                <OrganizerShell title="Create New Trip">
                    <TripStepperHeader activeStep={5} />
                    <main className="mx-auto w-full max-w-6xl px-4 py-6">
                        {/* Header/Stepper is assumed to be present in your layout; omit here to avoid coupling */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="md:col-span-2 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Simple Pricing</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Pricing mode */}
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 ">
                                            <button
                                                type="button"
                                                onClick={() => setPricingMode("simple")}
                                                className={`flex flex-col items-center justify-center w-full h-22 rounded-xl border transition
                                                      ${pricingMode === "simple"
                                                        ? "border-orange-300 bg-orange-50"
                                                        : "border-gray-200 bg-white"}
                                                      `}
                                            >
                                                {/* Custom radio */}
                                                <span
                                                    className={`mt-2 mb-2 flex items-center justify-center w-4 h-4 rounded-full border transition
                                                         ${pricingMode === "simple"
                                                            ? "border-orange-300 bg-white"
                                                            : "border-gray-200 bg-white"}`}
                                                >
                                                    {pricingMode === "simple" && (
                                                        <span className="inline-block w-3 h-3 rounded-full bg-orange-600" />
                                                    )}
                                                </span>
                                                <span className="text-lg font-medium text-black mt-2">Simple Pricing</span>
                                            </button>
                                            {/* Dynamic Pricing Card */}
                                            <button
                                                type="button"
                                                onClick={() => setPricingMode("dynamic")}
                                                className={`flex flex-col items-center justify-center w-full h-22 rounded-xl border transition
                                                       ${pricingMode === "dynamic"
                                                        ? "border-orange-400 bg-orange-50"
                                                        : "border-gray-200 bg-white"}
                                                           `}
                                            >
                                                {/* Custom radio */}
                                                <span
                                                    className={`mt-2 mb-2 flex items-center justify-center w-4 h-4 rounded-full border transition
                                                         ${pricingMode === "dynamic"
                                                            ? "border-orange-400 bg-white"
                                                            : "border-gray-200 bg-white"}`}
                                                >
                                                    {pricingMode === "dynamic" && (
                                                        <span className="inline-block w-3 h-3 rounded-full bg-[#FF4B2B]  " />
                                                    )}
                                                </span>
                                                <span className="text-lg font-medium text-black mt-2">Dynamic Pricing</span>
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div className="space-y-2">
                                            <Label htmlFor="price">Price *</Label>
                                            <Input id="price" placeholder="Enter price" inputMode="decimal" />
                                        </div>

                                        {/* Add ons */}
                                        <AddOnsFieldset />


                                        <div className="flex gap-4">
                                            <Input
                                                type="text"
                                                placeholder="Particular"
                                                className="flex-1 px-5 py-3  border border-gray-300 text-gray-500 bg-white outline-none focus:ring-2 focus:ring-orange-200 transition text-[18px] font-normal"
                                            />
                                            <Input
                                                type="text"
                                                placeholder="Add on charge"
                                                className="flex-1 px-5 py-3  border border-gray-300 text-gray-500 bg-white outline-none focus:ring-2 focus:ring-orange-200 transition text-[18px] font-normal"
                                            />
                                        </div>


                                        {/* Discount */}
                                        <div className="space-y-2">
                                            <Label>Discount</Label>
                                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                                <Input placeholder="Discount %" inputMode="decimal" />
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-muted-foreground">Valid until</span>
                                                    <div className="relative w-full">
                                                        <Input type="date" className="pr-9" />
                                                        <Calendar className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                    </div>
                                                </div>
                                                <div />
                                            </div>
                                        </div>

                                        {/* GST */}
                                        <div className="space-y-2">
                                            <Label>GST Status *</Label>
                                            <GstStatusToggle value={gst} onChange={setGst} />
                                        </div>

                                        {/* Deposit */}
                                        <div className="space-y-2">
                                            <Label htmlFor="deposit">Deposit Required</Label>
                                            <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
                                                <Input id="deposit" placeholder="25" className="md:col-span-5" inputMode="decimal" />
                                                <Input placeholder="%" className="md:col-span-1" inputMode="numeric" />
                                            </div>
                                        </div>

                                        {/* Credit options */}
                                        <div className="space-y-2">
                                            <Label>Credit Options</Label>
                                            <CreditOptions value={credit} onChange={setCredit} />
                                        </div>

                                        {/* Cancellation policy */}
                                        <div className="space-y-2">
                                            <Label htmlFor="policy">Cancellation Policy</Label>
                                            <Textarea id="policy" placeholder="Describe your cancellation and refund policy.." rows={5} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Summary column */}
                            <div className="md:col-span-1">
                                <PricingSummary />
                            </div>
                        </div>

                        {/* Footer actions (inline, mobile-friendly) */}
                        <WizardFooter
                            onPrev={() => router.push("/organizer/create-trip/faqs")}
                            onDraft={() => console.log("[v0] Draft exclusions:")}
                            onNext={() => router.push("/organizer/create-trip/")}
                            prevLabel="‹ Previous"
                        />
                    </main>
                </OrganizerShell>
            </div>
        </div>
    )
}
