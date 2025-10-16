"use client";

import { Calendar } from "lucide-react";
import { ModalWrapper } from "../ui/ModalWrapper";
import { DayDescriptionModal } from "./dayDescription";
import { useState } from "react";


export function DetailsOptions() {
    const [showDayDescription, setShowDayDescription] = useState(false);
  // Yeh component icon waali options render karega
  return (
    <div className="flex gap-4 mt-4">
      <button onClick={() => setShowDayDescription(true)}

       className="border-2 rounded-xl px-6  flex flex-col items-center justify-center shadow bg-gradient-to-r from-orange-50 to-white text-black font-medium">
        <Calendar className="mb-2" size={18} />
        Day Description
      </button>
     {showDayDescription && (
        <ModalWrapper onClose={() => setShowDayDescription(false)}>
          <DayDescriptionModal onClose={() => setShowDayDescription(false)} />
        </ModalWrapper>
      )}

      <div className="border rounded-xl px-6 py-2 flex flex-col items-center justify-center text-gray-700">
        🚗
        <span className="text-xs mt-1">Transit</span>
      </div>
      <div className="border rounded-xl px-6 py-2 flex flex-col items-center justify-center text-gray-700">
        🏠
        <span className="text-xs mt-1">Stay</span>
      </div>
      <div className="border rounded-xl px-6 py-2 flex flex-col items-center justify-center text-gray-700">
        🍽️
        <span className="text-xs mt-1">Meal</span>
      </div>
      <div className="border rounded-xl px-6 py-2 flex flex-col items-center justify-center text-gray-700">
        🏃‍♂️
        <span className="text-xs mt-1">Activity</span>
      </div>
    </div>
  );
}