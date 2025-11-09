// components/library/AddNewItemModal/StepHeader.tsx
"use client";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

type StepHeaderProps = {
  title: string;
};

export function StepHeader({ title }: StepHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle className="text-lg font-semibold text-gray-800">
        {title}
      </DialogTitle>
    </DialogHeader>
  );
}
