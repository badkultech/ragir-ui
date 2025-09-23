"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { tripSteps } from "@/lib/common/stepperConfig";
import { Stepper } from "@/components/trip/stepper";
import { OrganizerSidebar } from "@/components/organizer/organizer-sidebar";
import { AppHeader } from "@/components/app-header";
import { Textarea } from "@/components/ui/textarea";

type PricingMode = "simple" | "dynamic";

type AddOn = {
  particular: string;
  charge: string;
};

type Row = {
  particular: string;
  values: string[];
};

export default function PricingPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [mode, setMode] = useState<PricingMode>("simple");

  // Simple Pricing
  const [price, setPrice] = useState("");

  // Add Ons
  const [addons, setAddons] = useState<AddOn[]>([]);
  const [newAddon, setNewAddon] = useState<AddOn>({
    particular: "",
    charge: "",
  });

  // Dynamic Pricing
  const [columns, setColumns] = useState<string[]>([
    "Single Occupancy",
    "Double Occupancy",
  ]);

  const [rows, setRows] = useState<Row[]>([
    { particular: "Price Particular", values: ["600", "900"] },
    { particular: "Price Particular", values: ["800", "1100"] },
  ]);

  // Discount
  const [discount, setDiscount] = useState("");
  const [discountValidUntil, setDiscountValidUntil] = useState("");

  // GST
  const [gstIncluded, setGstIncluded] = useState(true);

  // Deposit
  const [deposit, setDeposit] = useState("25");

  // Credit Option
  const [creditOption, setCreditOption] = useState<"credit" | "emi">("emi");

  // Cancellation
  const [cancellationPolicy, setCancellationPolicy] = useState("");

  // Add On Handlers
  const handleAddAddon = () => {
    if (newAddon.particular && newAddon.charge) {
      setAddons([...addons, newAddon]);
      setNewAddon({ particular: "", charge: "" });
    }
  };

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

  // Navigation
  const handleSaveAndNext = () => {
    const currentIndex = tripSteps.findIndex((s) => s.path === pathname);
    if (currentIndex < tripSteps.length - 1) {
      router.push(tripSteps[currentIndex + 1].path);
    }
  };

  const handlePrevious = () => {
    const currentIndex = tripSteps.findIndex((s) => s.path === pathname);
    if (currentIndex > 0) {
      router.push(tripSteps[currentIndex - 1].path);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OrganizerSidebar />

      <div className="flex-1 flex flex-col">
        <AppHeader title="Create New Trip" />
        <main className="flex-1 p-8">
          <Stepper />

          <div className="grid grid-cols-3 gap-6">
            {/* Main Form */}
            <Card className="p-6 col-span-2">
              <h2 className="text-xl font-semibold mb-6">Pricing</h2>

              {/* Pricing Mode Toggle */}
              <div className="flex space-x-4 mb-6">
                <Button
                  variant={mode === "simple" ? "default" : "outline"}
                  className={`flex-1 ${
                    mode === "simple" ? "bg-orange-500 text-white" : ""
                  }`}
                  onClick={() => setMode("simple")}
                >
                  Simple Pricing
                </Button>
                <Button
                  variant={mode === "dynamic" ? "default" : "outline"}
                  className={`flex-1 ${
                    mode === "dynamic" ? "bg-orange-500 text-white" : ""
                  }`}
                  onClick={() => setMode("dynamic")}
                >
                  Dynamic Pricing
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
                            <td key={colIdx} className="border p-2 text-center">
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

              {/* Add Ons */}
              <div className="mb-6">
                <label className="block font-medium mb-2">Add Ons</label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    placeholder="Particular"
                    value={newAddon.particular}
                    onChange={(e) =>
                      setNewAddon({ ...newAddon, particular: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Add on charge"
                    value={newAddon.charge}
                    onChange={(e) =>
                      setNewAddon({ ...newAddon, charge: e.target.value })
                    }
                  />
                  <Button variant="outline" onClick={handleAddAddon}>
                    + Add
                  </Button>
                </div>
                {addons.map((addon, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between p-2 border rounded mb-2"
                  >
                    <span>{addon.particular}</span>
                    <span>{addon.charge}</span>
                  </div>
                ))}
              </div>

              {/* Discount */}
              <div className="mb-6">
                <label className="block font-medium mb-2">Discount *</label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Discount"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                  <Input
                    type="date"
                    value={discountValidUntil}
                    onChange={(e) => setDiscountValidUntil(e.target.value)}
                  />
                </div>
              </div>

              {/* GST */}
              <div className="mb-6">
                <label className="block font-medium mb-2">GST Status *</label>
                <div className="flex space-x-4">
                  <Button
                    variant={gstIncluded ? "default" : "outline"}
                    onClick={() => setGstIncluded(true)}
                  >
                    Includes GST
                  </Button>
                  <Button
                    variant={!gstIncluded ? "default" : "outline"}
                    onClick={() => setGstIncluded(false)}
                  >
                    Excludes GST
                  </Button>
                </div>
              </div>

              {/* Deposit */}
              <div className="mb-6">
                <label className="block font-medium mb-2">
                  Deposit Required *
                </label>
                <Input
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                />
              </div>

              {/* Credit Options */}
              <div className="mb-6">
                <label className="block font-medium mb-2">
                  Credit Options *
                </label>
                <div className="flex space-x-4">
                  <Button
                    variant={creditOption === "credit" ? "default" : "outline"}
                    onClick={() => setCreditOption("credit")}
                  >
                    Credit Card
                  </Button>
                  <Button
                    variant={creditOption === "emi" ? "default" : "outline"}
                    onClick={() => setCreditOption("emi")}
                  >
                    EMI
                  </Button>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="mb-6">
                <label className="block font-medium mb-2">
                  Cancellation Policy *
                </label>
                <Textarea
                  placeholder="Describe your cancellation and refund policy..."
                  value={cancellationPolicy}
                  onChange={(e) => setCancellationPolicy(e.target.value)}
                />
              </div>
            </Card>

            {/* Pricing Summary */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Pricing Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Accommodation:</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport:</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between">
                  <span>Meals:</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between">
                  <span>Activities:</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Sub Total:</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (18% GST):</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total per Person:</span>
                  <span>₹0</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              className="px-6 py-2 rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-100"
              onClick={handlePrevious}
            >
              ← Previous
            </Button>

            <div className="space-x-3">
              <Button
                variant="outline"
                className="px-6 py-2 rounded-full border"
              >
                Save as Draft
              </Button>
              <Button
                className="px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                onClick={handleSaveAndNext}
              >
                Save & Next →
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
