"use client";

import { ChevronRight } from "lucide-react";

export default function LegalTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold md:hidden">Legal & Policies</h2>

      {["Terms of Service", "Privacy Policy", "Cookie Policy"].map((label) => (
        <button
          key={label}
          className="w-full flex items-center justify-between p-4 bg-card border rounded-xl hover:bg-muted"
        >
          <span className="text-sm font-medium">{label}</span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      ))}
    </div>
  );
}
