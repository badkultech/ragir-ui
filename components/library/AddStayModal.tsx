"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Hotel,
  Bus,
  Utensils,
  Activity,
  Users,
  HelpCircle,
} from "lucide-react";
import { AddStayForm } from "./AddStayForm";

// Categories for Step 1
const categories = [
  { label: "Events", icon: Calendar },
  { label: "Stays", icon: Hotel },
  { label: "Transit", icon: Bus },
  { label: "Meals", icon: Utensils },
  { label: "Activities", icon: Activity },
  { label: "Trip Leaders", icon: Users },
  { label: "FAQs", icon: HelpCircle },
];

type AddNewItemModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AddNewItemModal({ open, onClose }: AddNewItemModalProps) {
  const [step, setStep] = useState<"select" | "stay">("select");
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = () => {
    if (selected === "Stays") {
      setStep("stay");
    }
  };

  const handleBack = () => {
    setStep("select");
    setSelected(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-3xl max-h-[90vh] overflow-y-auto sm:rounded-2xl">
        {step === "select" && (
          <>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>

            {/* Category Grid */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {categories.slice(0, 6).map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => setSelected(label)}
                  className={`flex flex-col justify-center items-center p-6 h-24 rounded-xl border transition ${
                    selected === label
                      ? "border-orange-500 shadow-md"
                      : "border-gray-200 hover:border-orange-400"
                  }`}
                >
                  <Icon className="h-6 w-6 text-gray-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    {label}
                  </span>
                </button>
              ))}
            </div>

            {/* FAQs row */}
            <div className="mt-4">
              <button
                onClick={() => setSelected("FAQs")}
                className={`flex flex-col justify-center items-center w-full p-6 h-20 rounded-xl border transition ${
                  selected === "FAQs"
                    ? "border-orange-500 shadow-md"
                    : "border-gray-200 hover:border-orange-400"
                }`}
              >
                <HelpCircle className="h-6 w-6 text-gray-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">FAQs</span>
              </button>
            </div>

            {/* Footer */}
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline" className="rounded-full px-6">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleNext}
                disabled={!selected}
                className="rounded-full px-6 bg-gradient-to-r from-orange-400 to-pink-500 text-white"
              >
                Next
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "stay" && (
          <>
            <DialogHeader>
              <DialogTitle>Add Stay</DialogTitle>
            </DialogHeader>

            <AddStayForm
              mode="library"
              onCancel={handleBack}
              onSave={(data) => {
                console.log("Stay saved:", data);
                onClose();
              }}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
