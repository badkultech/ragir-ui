"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AddOnsFieldset } from "@/components/create-trip/add-ons-fieldset";
import {
  GstStatusToggle,
  type GstValue,
} from "@/components/create-trip/gst-status-toggle";
import { CreditOptions } from "@/components/create-trip/credit-options";
import { PricingSummary } from "@/components/create-trip/pricing-summary";
import { useRouter } from "next/navigation";
import { WizardFooter } from "@/components/create-trip/wizard-footer";
import { TripStepperHeader } from "@/components/create-trip/tripStepperHeader";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";

import {
  useGetPricingQuery,
  useCreatePricingMutation,
  useUpdatePricingMutation,
} from "@/lib/services/organizer/trip/pricing";

type PricingMode = "simple" | "dynamic";

type Row = {
  particular: string;
  values: string[];
};

export default function PricingPage() {
  const router = useRouter();

  const [gst, setGst] = useState<GstValue>("excludes");
  const [credit, setCredit] = useState({ card: true, emi: false });
  const [mode, setMode] = useState<PricingMode>("simple");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // SIMPLE PRICE
  const [price, setPrice] = useState("");

  // DISCOUNT
  const [discount, setDiscount] = useState("");
  const [discountUntil, setDiscountUntil] = useState("");

  // DEPOSIT
  const [depositPercent, setDepositPercent] = useState("");

  // CANCELLATION POLICY
  const [policy, setPolicy] = useState("");

  // ADD ONS
  const [addOns, setAddOns] = useState<{ id: string; name: string; charge: number }[]>([]);


  // DYNAMIC PRICING
  const [columns, setColumns] = useState<string[]>([
    "Single Occupancy",
    "Double Occupancy",
  ]);
  const [rows, setRows] = useState<Row[]>([
    { particular: "Price Particular", values: ["600", "900"] },
    { particular: "Price Particular", values: ["800", "1100"] },
  ]);

  // API HOOKS
  const { data: pricingData } = useGetPricingQuery({
    organizationId: "1",
    tripPublicId: "x1",
  });

  const [createPricing] = useCreatePricingMutation();
  const [updatePricing] = useUpdatePricingMutation();

  // Load pricing from backend into UI
  useEffect(() => {
    if (pricingData) {
      setPrice(String(pricingData.basePrice || ""));

      setGst(pricingData.includesGst ? "includes" : "excludes");

      setDiscount(String(pricingData.discountPercent || ""));
      setDiscountUntil(pricingData.discountValidUntil || "");

      setDepositPercent(String(pricingData.depositRequiredPercent || ""));

      setCredit({
        card: pricingData.creditOptions === "CREDIT_CARD",
        emi: pricingData.creditOptions === "EMI",
      });

      setPolicy(pricingData.cancellationPolicy || "");

      setAddOns(
        pricingData.addOns?.map(a => ({
          id: crypto.randomUUID(),
          name: a.name,
          charge: a.charge,
        })) || []
      );

    }
  }, [pricingData]);

  // Build payload for API
  const buildPayload = () => ({
    discountPercent: Number(discount || 0),
    discountValidUntil: discountUntil || "",
    includesGst: gst === "includes",
    depositRequiredPercent: Number(depositPercent || 0),
    creditOptions: credit.card ? "CREDIT_CARD" : "EMI",
    cancellationPolicy: policy || "",
    basePrice: Number(price || 0),
    addOns: addOns,
  });

  // Dynamic Handlers
  const addRow = () => {
    setRows([
      ...rows,
      {
        particular: "Price Particular",
        values: Array(columns.length).fill(""),
      },
    ]);
  };

  const removeRow = (rowIdx: number) => {
    setRows(rows.filter((_, idx) => idx !== rowIdx));
  };

  const addColumn = () => {
    setColumns([...columns, `Occupancy ${columns.length + 1}`]);
    setRows(rows.map((row) => ({ ...row, values: [...row.values, ""] })));
  };

  const removeColumn = (colIdx: number) => {
    setColumns(columns.filter((_, idx) => idx !== colIdx));
    setRows(
      rows.map((row) => ({
        ...row,
        values: row.values.filter((_, idx) => idx !== colIdx),
      }))
    );
  };

  const handleRowChange = (rowIdx: number, value: string) => {
    const updated = [...rows];
    updated[rowIdx].particular = value;
    setRows(updated);
  };

  const handleCellChange = (rowIdx: number, colIdx: number, value: string) => {
    const updated = [...rows];
    updated[rowIdx].values[colIdx] = value;
    setRows(updated);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1">
        <AppHeader title="Create New Trip" />
        <TripStepperHeader activeStep={5} />

        <main className="mx-auto w-full max-w-6xl px-4 py-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Simple Pricing</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Mode Buttons */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 ">
                    <Button
                      variant={mode === "simple" ? "default" : "outline"}
                      onClick={() => setMode("simple")}
                    >
                      Simple Pricing
                    </Button>
                    <Button
                      variant={mode === "dynamic" ? "default" : "outline"}
                      onClick={() => setMode("dynamic")}
                    >
                      Dynamic Pricing
                    </Button>
                  </div>

                  {/* SIMPLE PRICING */}
                  {mode === "simple" && (
                    <div className="space-y-5">
                      <Label>Price *</Label>
                      <Input
                        placeholder="Enter price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />

                      <Label>Discount</Label>
                      <Input
                        placeholder="Discount %"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                      />

                      <Label>Discount Valid Until</Label>
                      <Input
                        type="date"
                        value={discountUntil}
                        onChange={(e) => setDiscountUntil(e.target.value)}
                      />

                      <Label>GST Status *</Label>
                      <GstStatusToggle value={gst} onChange={setGst} />

                      <Label>Deposit Required</Label>
                      <Input
                        placeholder="Deposit %"
                        value={depositPercent}
                        onChange={(e) => setDepositPercent(e.target.value)}
                      />

                      <Label>Credit Options</Label>
                      <CreditOptions value={credit} onChange={setCredit} />

                      <Label>Cancellation Policy</Label>
                      <Textarea
                        value={policy}
                        onChange={(e) => setPolicy(e.target.value)}
                      />
                    </div>
                  )}

                  {/* ADD ONS */}
                  <AddOnsFieldset value={addOns} onChange={setAddOns} />

                  {/* Dynamic Pricing (unchanged) */}
                  {mode === "dynamic" && (
                    <div className="mb-6 overflow-x-auto">
                      {/* TABLE CODE UNCHANGED */}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1">
              <PricingSummary />
            </div>
          </div>

          {/* NEXT → POST/PUT PRICING */}
          <WizardFooter
            onPrev={() => router.push("/organizer/create-trip/faqs")}
            onDraft={() => console.log("Draft saved")}
            onNext={async () => {
              const payload = buildPayload();
              try {
                if (!pricingData) {
                  await createPricing({
                    organizationId: "1",
                    tripPublicId: "x1",
                    data: payload,
                  });
                } else {
                  await updatePricing({
                    organizationId: "1",
                    tripPublicId: "x1",
                    data: payload,
                  });
                }
                router.push("/organizer/create-trip/review");
              } catch (e) {
                console.error("Pricing save error", e);
              }
            }}
          />
        </main>
      </div>
    </div>
  );
}
