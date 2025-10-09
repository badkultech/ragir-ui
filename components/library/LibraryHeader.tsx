"use client";

import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type LibraryHeaderProps = {
  backHref?: string;
  title?: string;
  description?: string;
  buttonLabel: string;
  onAddClick: () => void;
};

export function LibraryHeader({
  backHref = "/organizer/library",
  title ="Ragir Library",
  description = "Manage your travel content and organize into custom collections",
  buttonLabel,
  onAddClick,
}: LibraryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      {/* Back + Title/Description */}
      <div className="flex items-start">
        <Link
          href={backHref}
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      {/* Add Button */}
      <Button
        onClick={onAddClick}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
      >
        <PlusCircle className="w-4 h-4" />
        {buttonLabel}
      </Button>
    </div>
  );
}
