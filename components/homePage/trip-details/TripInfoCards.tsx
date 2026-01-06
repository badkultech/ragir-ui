import { MapPin, Calendar, Clock, Users } from "lucide-react";

interface TripInfoProps {
  startPoint?: string;
  endPoint?: string;
  startDate?: string;
  endDate?: string;
  minAge?: number;
  maxAge?: number;
  minGroupSize?: number;
  maxGroupSize?: number;
  totalDays?: number;
}

export default function TripInfoCards({
  startPoint,
  endPoint,
  startDate,
  endDate,
  minAge,
  maxAge,
  minGroupSize,
  maxGroupSize,
  totalDays,
}: TripInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-2xl border py-8">
      <Item
        icon={MapPin}
        label="Route"
        value={`${startPoint || "-"} → ${endPoint || "-"}`}
      />

      <Item
        icon={Calendar}
        label="Dates"
        value={`${startDate || "-"} — ${endDate || "-"}`}
      />

      <Item
        icon={Clock}
        label="Duration"
        value={`${totalDays || "-"} Days`}
      />

      <Item
        icon={Users}
        label="Age Group"
        value={`${minAge || "-"} — ${maxAge || "-"}`}
      />

      <Item
        icon={Users}
        label="Group Size"
        value={`${minGroupSize || "-"} — ${maxGroupSize || "-"}`}
      />
    </div>
  );
}

const Item = ({ icon: Icon, label, value }: any) => (
  <div className="flex gap-3">
    <Icon className="w-12 h-12 text-gray-900 bg-gray-50 p-3 rounded-xl" />
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  </div>
);
