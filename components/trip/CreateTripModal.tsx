"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Copy, X } from "lucide-react";

interface CreateTripModalProps {
  open: boolean;
  onClose: () => void;
  onStartFromScratch?: () => void;
  onUseSimilarTrip?: () => void;
}

export function CreateTripModal({
  open,
  onClose,
  onStartFromScratch,
  onUseSimilarTrip,
}: CreateTripModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md w-[90%] max-w-[420px] rounded-2xl p-6 mx-auto
                   overflow-hidden shadow-lg border border-gray-200"
      >
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-center w-full">
            Create New Trip
          </DialogTitle>
          <DialogClose asChild>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-3 mt-6">
          {/* Start from Scratch */}
          <Button
            variant="ghost"
            className="w-full justify-start h-auto py-4 bg-gray-50 hover:bg-gray-100
                       rounded-xl text-left flex items-center space-x-3"
            onClick={onStartFromScratch}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500 text-white flex-shrink-0">
              <Plus className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium text-base">Start from Scratch</span>
              <span className="text-sm text-gray-500">
                Create a completely new trip with custom details
              </span>
            </div>
          </Button>

          {/* Use Similar Trip */}
          <Button
            variant="ghost"
            className="w-full justify-start h-auto py-4 bg-gray-50 hover:bg-gray-100
                       rounded-xl text-left flex items-center space-x-3"
            onClick={onUseSimilarTrip}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex-shrink-0">
              <Copy className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium text-base">Use Similar Trip</span>
              <span className="text-sm text-gray-500">
                Select an existing trip and modify it based on your needs
              </span>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
