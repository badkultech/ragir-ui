"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  CalendarDays,
  Clock,
  Edit,
  Trash2,
  Archive,
  Undo2,
  PlusCircle,
} from "lucide-react";

export default function TripCard({ trip, tab, onArchive, onDelete }: any) {
  const renderButtons = () => {
    switch (tab) {
      // UPCOMING / ACTIVE TRIPS
      case "upcoming":
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-center gap-2 border-gray-200 text-gray-800 hover:bg-gray-50 h-10 flex-grow rounded-lg"
            >
              <PlusCircle size={16} />
              Create Similar Trip
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-gray-200 text-gray-800 hover:bg-gray-50 h-10 px-4 rounded-lg"
            >
              <Edit size={15} /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50 h-10 px-4 rounded-lg"
              onClick={onArchive}
            >
              <Archive size={15} /> Archive
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-center border border-red-300 text-red-500 hover:bg-red-50 h-10 w-10 rounded-lg"
              onClick={onDelete}
            >
              <Trash2 size={18} />
            </Button>
          </>
        );

      // PAST TRIPS
      case "past":
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-center gap-2 border-gray-200 text-gray-800 hover:bg-gray-50 h-10 flex-grow rounded-lg"
            >
              <PlusCircle size={16} />
              Create Similar Trip
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-center border border-red-300 text-red-500 hover:bg-red-50 h-10 w-10 rounded-lg"
              onClick={onDelete}
            >
              <Trash2 size={18} />
            </Button>
          </>
        );

      // DRAFT TRIPS — fixed to match your screenshot
      case "drafts":
        return (
          <>
            {/* Continue Editing — full width button */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-center gap-2 border-gray-300 text-gray-800 hover:bg-gray-50 h-10 flex-grow rounded-lg"
            >
              <Edit size={15} /> Continue Editing
            </Button>

            {/* Delete — icon-only button */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-center border border-red-300 text-red-500 hover:bg-red-50 h-10 w-10 rounded-lg"
              onClick={onDelete}
            >
              <Trash2 size={18} />
            </Button>
          </>
        );

      // ARCHIVED TRIPS
      case "archived":
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-center gap-2 border-green-400 text-green-600 hover:bg-green-50 h-10 flex-grow rounded-lg"
            >
              <Undo2 size={15} /> Unarchive
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-center border border-red-300 text-red-500 hover:bg-red-50 h-10 w-10 rounded-lg"
              onClick={onDelete}
            >
              <Trash2 size={18} />
            </Button>
          </>
        );

      // DELETED TRIPS
      case "deleted":
        return (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center justify-center gap-2 border-green-400 text-green-600 hover:bg-green-50 h-10 rounded-lg"
          >
            <Undo2 size={15} /> Restore
          </Button>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            {trip.title}
          </h2>
          <span
            className={`text-xs font-medium px-3 py-1 rounded-md ${
              trip.status === "Published"
                ? "bg-green-50 text-green-600"
                : trip.status === "Under Review"
                ? "bg-yellow-50 text-yellow-600"
                : trip.status === "Requires Modification"
                ? "bg-red-50 text-red-600"
                : trip.status === "Draft"
                ? "bg-gray-100 text-gray-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {trip.status}
          </span>
        </div>

        {/* Details */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin size={14} /> {trip.location}
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays size={14} /> {trip.date}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} /> {trip.duration}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div className="rounded-lg bg-gray-50 text-center py-3">
            <p className="text-lg font-semibold text-gray-800">
              {trip.views ?? "00"}
            </p>
            <p className="text-gray-500 text-sm">Views</p>
          </div>

          <div className="rounded-lg bg-blue-50 text-center py-3 relative">
            <p className="text-lg font-semibold text-blue-700">
              {trip.queries ?? "00"}
            </p>
            <p className="text-gray-500 text-sm">Queries</p>
          </div>

          <div className="rounded-lg bg-green-50 text-center py-3 relative">
            <p className="text-lg font-semibold text-green-700">
              {trip.leads ?? "00"}
            </p>
            <p className="text-gray-500 text-sm">Leads</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-3 flex-wrap">{renderButtons()}</div>
      </div>
    </Card>
  );
}
