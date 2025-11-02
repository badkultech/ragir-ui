"use client";

import { useState } from "react";
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
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { WizardFooter } from "@/components/create-trip/wizard-footer";
import { Sidebar } from "@/components/organizer/sidebar";
import { TripStepperHeader } from "@/components/create-trip/tripStepperHeader";
import { AppHeader } from "@/components/app-header";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";

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
  const [price, setPrice] = useState("");

  // Dynamic Pricing
  const [columns, setColumns] = useState<string[]>([
    "Single Occupancy",
    "Double Occupancy",
  ]);

  const [rows, setRows] = useState<Row[]>([
    { particular: "Price Particular", values: ["600", "900"] },
    { particular: "Price Particular", values: ["800", "1100"] },
  ]);

  // Dynamic Pricing Handlers
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
      {/* Sidebar */}
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 h-auto  ">
        <AppHeader title="Create New Trip" />
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
                    <Button
                      variant={mode === "simple" ? "default" : "outline"}
                      className={`flex-1 ${
                        mode === "simple" ? "bg-orange-50 text-white" : ""
                      }`}
                      onClick={() => setMode("simple")}
                    >
                      {/* Custom radio */}
                      <span
                        className={`mt-2 mb-2 flex items-center justify-center w-4 h-4 rounded-full border transition
                                                         ${
                                                           mode === "simple"
                                                             ? "border-orange-300 bg-white"
                                                             : "border-gray-200 bg-white"
                                                         }`}
                      >
                        {mode === "simple" && (
                          <span className="inline-block w-3 h-3 rounded-full bg-orange-600" />
                        )}
                      </span>
                      <span className="text-lg font-medium text-black mt-2">
                        Simple Pricing
                      </span>
                    </Button>
                    {/* Dynamic Pricing Card */}
                    <Button
                      variant={mode === "dynamic" ? "default" : "outline"}
                      className={`flex-1 ${
                        mode === "dynamic" ? "bg-orange-50 text-white" : ""
                      }`}
                      onClick={() => setMode("dynamic")}
                    >
                      {/* Custom radio */}
                      <span
                        className={`mt-2 mb-2 flex items-center justify-center w-4 h-4 rounded-full border transition
                                                         ${
                                                           mode === "dynamic"
                                                             ? "border-orange-400 bg-white"
                                                             : "border-gray-200 bg-white"
                                                         }`}
                      >
                        {mode === "dynamic" && (
                          <span className="inline-block w-3 h-3 rounded-full bg-[#FF4B2B]  " />
                        )}
                      </span>
                      <span className="text-lg font-medium text-black mt-2">
                        Dynamic Pricing
                      </span>
                    </Button>
                  </div>

                  {/* Simple Pricing */}
                  {mode === "simple" && (
                    <div className="mb-6">
                      <label className="block font-medium mb-2">Price *</label>
                      <Input
                        placeholder="Enter price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Dynamic Pricing */}
                  {mode === "dynamic" && (
                    <div className="mb-6 overflow-x-auto">
                      <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead>
                          <tr className="bg-orange-100 text-orange-700">
                            <th className="border p-3 text-left font-semibold">
                              Price Particular
                            </th>
                            {columns.map((col, colIdx) => (
                              <th
                                key={colIdx}
                                className="border p-3 text-center font-semibold"
                              >
                                <div className="flex items-center justify-between">
                                  {col}
                                  <button
                                    className="text-red-500 text-xs ml-2"
                                    onClick={() => removeColumn(colIdx)}
                                  >
                                    ✕
                                  </button>
                                </div>
                              </th>
                            ))}
                            <th className="border p-3 text-center font-semibold">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-orange-50">
                              {/* Row Header */}
                              <td className="border p-3 font-medium bg-orange-50 text-orange-700">
                                <Input
                                  className="bg-white"
                                  placeholder="Enter Particular"
                                  value={row.particular}
                                  onChange={(e) =>
                                    handleRowChange(rowIdx, e.target.value)
                                  }
                                />
                              </td>
                              {/* Row Values */}
                              {columns.map((_, colIdx) => (
                                <td
                                  key={colIdx}
                                  className="border p-2 text-center"
                                >
                                  <Input
                                    className="text-center"
                                    placeholder="Price"
                                    value={row.values[colIdx] || ""}
                                    onChange={(e) =>
                                      handleCellChange(
                                        rowIdx,
                                        colIdx,
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                              ))}
                              {/* Actions */}
                              <td className="border p-2 text-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeRow(rowIdx)}
                                >
                                  Remove
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Add Row / Column */}
                      <div className="flex space-x-4 mt-4">
                        <Button variant="outline" onClick={addRow}>
                          + Add Particular
                        </Button>
                        <Button variant="outline" onClick={addColumn}>
                          + Add Occupancy Type
                        </Button>
                      </div>
                    </div>
                  )}

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
                        <span className="text-sm text-muted-foreground">
                          Valid until
                        </span>
                        <div className="relative w-full">
                          <Input type="date" className="pr-9" />
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
                      <Input
                        id="deposit"
                        placeholder="25"
                        className="md:col-span-5"
                        inputMode="decimal"
                      />
                      <Input
                        placeholder="%"
                        className="md:col-span-1"
                        inputMode="numeric"
                      />
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
                    <Textarea
                      id="policy"
                      placeholder="Describe your cancellation and refund policy.."
                      rows={5}
                    />
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
            onDraft={() => console.log(" Draft exclusions:")}
            onNext={() => router.push("/organizer/create-trip/review")}
          />
        </main>
      </div>
    </div>
  );
}
