"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function QueryResponseForm() {
  const [response, setResponse] = useState("");

  return (
    <div className="border-t mt-6 pt-6">
      <h4 className="font-semibold text-gray-700 mb-2">What’s your response</h4>
      <Textarea
        placeholder="Type your response..."
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        className="min-h-[120px] mb-4"
      />

      <div className="flex gap-3">
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Send Response
        </Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
}
