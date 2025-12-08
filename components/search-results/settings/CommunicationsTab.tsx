"use client";

import { Switch } from "@/components/ui/switch";

export default function CommunicationsTab({ communications, setCommunications }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground md:hidden">Communications</h2>

      <div>
        <p className="text-sm text-muted-foreground mb-3">Booking Communication Preference</p>
        <button className="w-full flex items-center justify-between px-4 py-4 bg-card border rounded-xl hover:bg-muted transition-colors">
          <span className="text-sm font-medium">Call</span>
        </button>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-3">Trip Updates</h3>

        {[
          ["WhatsApp Updates", "whatsappUpdates"],
          ["Email Notifications", "emailNotifications"],
          ["SMS Updates", "smsUpdates"],
        ].map(([label, key]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-card border rounded-xl">
            <span className="text-sm font-medium">{label}</span>
            <Switch
              checked={communications[key]}
              onCheckedChange={(checked) =>
                setCommunications((prev: any) => ({ ...prev, [key]: checked }))
              }
            />
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-base font-semibold mb-3">Marketing Communications</h3>

        {[
          ["WhatsApp Updates", "marketingWhatsapp"],
          ["Marketing Emails", "marketingEmails"],
          ["SMS Updates", "marketingSms"],
        ].map(([label, key]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-card border rounded-xl">
            <span className="text-sm font-medium">{label}</span>
            <Switch
              checked={communications[key]}
              onCheckedChange={(checked) =>
                setCommunications((prev: any) => ({ ...prev, [key]: checked }))
              }
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between p-4 bg-card border rounded-xl">
        <span className="text-sm font-medium">Browser Notifications</span>
        <Switch
          checked={communications.browserNotifications}
          onCheckedChange={(checked) =>
            setCommunications((prev: any) => ({ ...prev, browserNotifications: checked }))
          }
        />
      </div>
    </div>
  );
}
