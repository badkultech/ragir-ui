"use client";
import { useRef } from "react";
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CustomDateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  mode?: "datetime" | "date"; // ✅ NEW PROP
}

export function CustomDateTimePicker({
  value,
  onChange,
  placeholder = "Select date",
  className = "",
  mode = "datetime", // datetime | date
}: CustomDateTimePickerProps) {
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenPicker = () => {
    hiddenInputRef.current?.showPicker?.();
  };

  const handleHiddenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Disable past dates → tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, mode === "date" ? 10 : 16);

  // Format visible input
  const formatted = value
    ? new Date(value).toLocaleString(
        "en-GB",
        mode === "date"
          ? { year: "numeric", month: "2-digit", day: "2-digit" }
          : {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }
      )
    : "";

  return (
    <div className={`relative flex items-center flex-1 ${className}`}>
      {/* Visible text input */}
      <Input
        type="text"
        value={formatted}
        placeholder={placeholder}
        className="w-full pr-10 cursor-pointer"
        readOnly
      />

      <Calendar
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
        onClick={handleOpenPicker}
      />

      {/* Hidden actual picker */}
      <input
        type={mode === "date" ? "date" : "datetime-local"} // ✅ SWITCH PICKER TYPE!
        ref={hiddenInputRef}
        value={value}
        onChange={handleHiddenChange}
        min={minDate}
        className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none"
      />
    </div>
  );
}
