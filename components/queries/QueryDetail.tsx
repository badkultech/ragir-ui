"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Flag } from "lucide-react";
import QueryResponseForm from "./QueryResponseForm";
import { useState } from "react";

export default function QueryDetail({ query, onBack, onReport }: any) {
  // If query already responded, preload one response
  const [chat, setChat] = useState<
    { sender: "user" | "you"; text: string; time: string }[]
  >([
    {
      sender: "user",
      text: query.question,
      time: "10:30 AM",
    },
    ...(query.status === "responded"
      ? [
          {
            sender: "you",
            text: "Yes, all camping equipment including tents, sleeping bags, and mats are provided.",
            time: "10:45 AM",
          },
        ]
      : []),
  ]);

  const handleSendResponse = (text: string) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChat((prev) => [...prev, { sender: "you", text, time }]);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" onClick={onBack} className="p-0 hover:bg-transparent">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Queries
        </Button>
      </div>

      {/* Query card */}
      <div className="bg-white rounded-2xl p-6 border">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-lg">{query.name}</h3>
            <p className="text-sm text-gray-500">Trip: {query.trip}</p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-sm px-3 py-1 rounded-full ${
                chat.some((m) => m.sender === "you")
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {chat.some((m) => m.sender === "you") ? "Responded" : "Open"}
            </span>
            <span className="text-sm text-gray-400">{query.date}</span>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50"
              onClick={onReport}
            >
              <Flag className="w-4 h-4 mr-2" />
              Report
            </Button>
          </div>
        </div>

        {/* Chat container */}
        <div className="h-[250px] overflow-y-auto pr-2 pb-4 border-t border-b border-gray-100">
          <div className="flex flex-col gap-5 mt-5">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "you" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                    msg.sender === "you"
                      ? "bg-blue-50 text-gray-800 rounded-tr-none"
                      : "bg-gray-100 text-gray-800 rounded-tl-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p
                    className={`text-[11px] mt-1 ${
                      msg.sender === "you"
                        ? "text-right text-blue-400"
                        : "text-gray-400"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Response box */}
        <div className="mt-6">
          <QueryResponseForm
            onSend={handleSendResponse}
            onCancel={() => console.log("Cancelled")}
          />
        </div>
      </div>
    </div>
  );
}
