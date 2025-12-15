"use client"

import { Label } from "@/components/ui/label"

export function CreditOptions({
  value,
  onChange,
}: {
  value: { card: boolean; emi: boolean }
  onChange: (v: { card: boolean; emi: boolean }) => void
}) {
  const handleSelect = (option: "card" | "emi") => {
    if (option === "card") onChange({ card: true, emi: false })
    else onChange({ card: false, emi: true })
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      
      {/* Credit Card Option */}
      <label
        onClick={() => handleSelect("card")}
        className={`flex items-center gap-2 rounded-md border p-3 cursor-pointer transition 
          hover:border-orange-300 ${
            value.card ? "bg-orange-50 border-orange-200" : "bg-white"
          }`}
      >
        {/* GRADIENT BOX */}
        <div
          className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 overflow-hidden
            ${value.card ? "border-transparent" : "border-gray-300 bg-white"}
          `}
          style={
            value.card
              ? {
                  background:
                    "linear-gradient(90deg, #FEA901, #FD6E34, #FE336A, #FD401A)",
                }
              : {}
          }
        >
          {value.card && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        <Label className="m-0">Credit Card</Label>
      </label>

      {/* EMI Option */}
      <label
        onClick={() => handleSelect("emi")}
        className={`flex items-center gap-2 rounded-md border p-3 cursor-pointer transition 
          hover:border-orange-300 ${
            value.emi ? "bg-orange-50 border-orange-200" : "bg-white"
          }`}
      >
        {/* GRADIENT BOX */}
        <div
          className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 overflow-hidden
            ${value.emi ? "border-transparent" : "border-gray-300 bg-white"}
          `}
          style={
            value.emi
              ? {
                  background:
                    "linear-gradient(90deg, #FEA901, #FD6E34, #FE336A, #FD401A)",
                }
              : {}
          }
        >
          {value.emi && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        <Label className="m-0">EMI</Label>
      </label>
    </div>
  )
}
