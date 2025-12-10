"use client";

export default function PreferencesTab() {
  return (
    <div className="w-full">
      <div className="
        bg-card border border-border rounded-2xl 
        p-6 md:p-10 
        min-h-[70vh]   /* height increased to match screenshot */
        w-full
      ">
        <h2 className="text-lg font-semibold md:hidden mb-6">Preferences</h2>
        <div className="space-y-8 max-w-xl"> 
          {[
            ["Language", "English"],
            ["Timezone", "IST (GMT+5:30)"],
            ["Currency", "INR (₹)"],
          ].map(([label, val]) => (
            <div key={label} className="space-y-2">

              <label className="text-sm text-muted-foreground block">
                {label}
              </label>

              <button
                className="
                  w-full flex items-center justify-between 
                  px-4 py-4 bg-white 
                  border border-border 
                  rounded-xl hover:bg-muted transition
                "
              >
                <span className="text-sm font-medium">{val}</span>
                <span className="text-muted-foreground text-lg">›</span>
              </button>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
