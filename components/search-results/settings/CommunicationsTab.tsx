"use client";

import { Switch } from "@/components/ui/switch";

export default function CommunicationsTab({ communications, setCommunications }: any) {
  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold text-foreground md:hidden">Communications</h2>
      <div className="bg-white border border-[#E4E4E4] rounded-2xl p-6">
        <div className="max-w-xl space-y-8">
          <div>
            <p className="text-sm text-[#6B6B6B] mb-2">Booking Communication Preference</p>

            <button className="w-full flex items-center justify-between px-4 py-3 border border-[#E4E4E4] rounded-xl bg-white">
            <span className="text-sm font-medium text-[#1A1A1A]">Call</span>
            <span className="text-xl text-[#7A7A7A]">›</span>
          </button>
          </div>

          {/* Trip Updates */}
          <div>
            <h3 className="text-base font-semibold mb-3">Trip Updates</h3>

            {[
              ["WhatsApp Updates", "whatsappUpdates"],
              ["Email Notifications", "emailNotifications"],
              ["SMS Updates", "smsUpdates"],
            ].map(([label, key]) => (
              <div
                key={key}
                className="flex items-center justify-between px-4 py-4 bg-white border border-[#E4E4E4] rounded-xl shadow-sm mb-3"
              >
                <span className="text-sm font-medium">{label}</span>

                {/* Custom Toggle Color */}
                <Switch
                  className="data-[state=checked]:bg-[#FF7A45]"
                  checked={communications[key]}
                  onCheckedChange={(checked) =>
                    setCommunications((prev: any) => ({ ...prev, [key]: checked }))
                  }
                />
              </div>
            ))}
          </div>

          {/* Marketing Communications */}
          <div>
            <h3 className="text-base font-semibold mb-3">Marketing Communications</h3>

            {[
              ["WhatsApp Updates", "marketingWhatsapp"],
              ["Marketing Emails", "marketingEmails"],
              ["SMS Updates", "marketingSms"],
            ].map(([label, key]) => (
              <div
                key={key}
                className="flex items-center justify-between px-4 py-4 bg-white border border-[#E4E4E4] rounded-xl shadow-sm mb-3"
              >
                <span className="text-sm font-medium">{label}</span>

                <Switch
                  className="data-[state=checked]:bg-[#FF7A45]"
                  checked={communications[key]}
                  onCheckedChange={(checked) =>
                    setCommunications((prev: any) => ({ ...prev, [key]: checked }))
                  }
                />
              </div>
            ))}
          </div>

          {/* Browser Notifications */}
          <div className="flex items-center justify-between px-4 py-4 bg-white border border-[#E4E4E4] rounded-xl shadow-sm">
            <span className="text-sm font-medium">Browser Notifications</span>

            <Switch
              className="data-[state=checked]:bg-[#FF7A45]"
              checked={communications.browserNotifications}
              onCheckedChange={(checked) =>
                setCommunications((prev: any) => ({ ...prev, browserNotifications: checked }))
              }
            />
          </div>

        </div>
      </div>
    </div>
  );
}
