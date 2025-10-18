"use client";

import { Calendar } from "lucide-react";
import { ModalWrapper } from "../ui/ModalWrapper";
import { useState } from "react";
import { Button } from "../ui/button";
import { AddEventForm } from "../library/AddEventForm";
import { AddTransitForm } from "../library/AddTransitForm";
import { AddStayForm } from "../library/AddStayForm";
import { AddMealForm } from "../library/AddMealForm";
import { AddActivityForm } from "../library/AddActivityForm";


export function DetailsOptions() {
  const [showDayDescription, setShowDayDescription] = useState(false);
  const [showTransit, setShowTransit] = useState(false);
  const [showStay, setShowStay] = useState(false);
  const [showMeal, setShowMeal] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  // Yeh component icon waali options render karega
  return (
    <div className="flex gap-4 mt-4">
      <div>
        <Button onClick={() => setShowDayDescription(true)}

          className="border-2 rounded-xl px-6 h-auto  flex flex-col items-center justify-center shadow bg-gradient-to-r from-orange-50 to-white text-black font-medium">
          <Calendar className="" size={14} />
          Day Description
        </Button>
        {showDayDescription && (
          <ModalWrapper onClose={() => setShowDayDescription(false)}>
            <AddEventForm
              onCancel={() => setShowDayDescription(false)}
              onSave={(data) => {
                console.log("Event saved:", data);
                setShowDayDescription(false);
              }}
            />
          </ModalWrapper>
        )}

      </div>

      <div>
        <Button onClick={() => setShowTransit(true)}
          type="button"

          className="border-2 rounded-xl px-6 h-auto  flex flex-col items-center justify-center shadow bg-gradient-to-r from-orange-50 to-white text-black font-medium">
          🚗
          <span className="text-xs mt-1">Transit</span>
        </Button>
        {showTransit && (
          <ModalWrapper onClose={() => setShowTransit(false)}>
            <AddTransitForm
              onCancel={() => setShowTransit(false)}
              onSave={(data) => {
                console.log("Transit data saved:", data);
                setShowTransit(false);
              }}
            />
          </ModalWrapper>
        )}

      </div>
      <div >
        <Button onClick={() => setShowStay(true)}
          className="border-2 rounded-xl px-6 h-auto  flex flex-col items-center justify-center shadow bg-gradient-to-r from-orange-50 to-white text-black font-medium"
        >
          🏠
          <span className="text-xs mt-1">Stay</span>
        </Button>
        {showStay && (
          <ModalWrapper onClose={() => setShowStay(false)}>
            <AddStayForm
              onCancel={() => setShowStay(false)}
              onSave={(data) => {
                console.log("stay data saved:", data);
                setShowStay(false);
              }}
            />
          </ModalWrapper>
        )}
      </div>

      <div>
        <Button onClick={() => setShowMeal(true)}
          className="border-2 rounded-xl px-6 h-auto  flex flex-col items-center justify-center shadow bg-gradient-to-r from-orange-50 to-white text-black font-medium"
        >
          🍽️
          <span className="text-xs mt-1">Meal</span>

        </Button>
        {showMeal && (
          <ModalWrapper onClose={() => setShowMeal(false)}>
            <AddMealForm
              onCancel={() => setShowMeal(false)}
              onSave={(data) => {
                console.log("Meal data saved:", data);
                setShowMeal(false);
              }}
            />
          </ModalWrapper>
        )}

      </div>
      <div>
       <Button onClick={()=>setShowActivity(true)}
          className="border-2 rounded-xl px-6 h-auto  flex flex-col items-center justify-center shadow bg-gradient-to-r from-orange-50 to-white text-black font-medium"
       >

        🏃‍♂️
        <span className="text-xs mt-1">Activity</span>
       </Button>
       {showActivity && (
          <ModalWrapper onClose={() => setShowActivity(false)}>
            <AddActivityForm
              onCancel={() => setShowActivity(false)}
              onSave={(data) => {
                console.log("Activity data saved:", data);
                setShowActivity(false);
              }}
            />
          </ModalWrapper>
        )}
      </div>


    </div>


  );
}