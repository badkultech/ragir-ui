"use client";

export default function PreferencesTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold md:hidden">Preferences</h2>

      {[
        ["Language", "English"],
        ["Timezone", "IST (GMT+5:30)"],
        ["Currency", "INR (₹)"],
      ].map(([label, val]) => (
        <div key={label}>
          <label className="text-sm text-muted-foreground mb-2 block">{label}</label>
          <button className="w-full flex items-center justify-between px-4 py-4 bg-card border rounded-xl hover:bg-muted">
            <span className="text-sm font-medium">{val}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
