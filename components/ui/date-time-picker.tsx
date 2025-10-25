"use client";
import { useRef } from "react";
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CustomDateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CustomDateTimePicker({
  value,
  onChange,
  placeholder = "Select date & time",
  className = "",
}: CustomDateTimePickerProps) {
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenPicker = () => {
    hiddenInputRef.current?.showPicker?.();
  };

  const handleHiddenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`relative flex items-center flex-1 ${className}`}>
      {/* Visible input */}
      <Input
        type="text"
        value={
          value
            ? new Date(value).toLocaleString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : ""
        }
        placeholder={placeholder}
        className="w-full pr-10 cursor-pointer"
        readOnly // ✅ prevents typing, removes warning
        onChange={() => {}} // ✅ stops React warning
      />

      {/* Calendar icon */}
      <Calendar
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
        onClick={handleOpenPicker}
      />

      {/* Hidden input (actual datetime-local picker) */}
      <input
        type="datetime-local"
        ref={hiddenInputRef}
        value={value}
        onChange={handleHiddenChange}
        className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none"
      />
    </div>
  );
}
