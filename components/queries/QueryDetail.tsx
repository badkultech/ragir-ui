"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Flag } from "lucide-react";
import QueryResponseForm from "./QueryResponseForm";

export default function QueryDetail({ query, onBack, onReport }: any) {
  const isResponded = query.status === "responded";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" onClick={onBack} className="p-0 hover:bg-transparent">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Queries
        </Button>
      </div>

      <div className="bg-white rounded-2xl p-6 border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">{query.name}</h3>
            <p className="text-sm text-gray-500">Trip: {query.trip}</p>
          </div>
          <div className="flex items-center gap-3">
            {query.status === "open" ? (
              <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                Open
              </span>
            ) : (
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                Responded
              </span>
            )}
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

        {/* Chat bubbles */}
        <div className="space-y-4 mt-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">LOREM IPSUM</p>
            <div className="bg-gray-100 px-4 py-2 rounded-xl w-fit">
              {query.question}
            </div>
          </div>

          {isResponded && (
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">LOREM IPSUM</p>
              <div className="bg-blue-50 px-4 py-2 rounded-xl inline-block">
                Yes, all camping equipment including tents, sleeping bags, and mats are provided.
              </div>
            </div>
          )}
        </div>

        {!isResponded && (
          <div className="mt-8">
            <QueryResponseForm />
          </div>
        )}
      </div>
    </div>
  );
}
