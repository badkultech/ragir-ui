import { MapPin, Calendar, Clock, Users } from "lucide-react"

export default function TripInfoCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-2xl border">
      <Item icon={MapPin} label="Route" value="Delhi → Delhi" />
      <Item icon={Calendar} label="Dates" value="15 Dec, 2025 - 22 Dec, 2025" />
      <Item icon={Clock} label="Duration" value="6N / 7D" />
      <Item icon={Users} label="Age Group" value="18-40 years" />
    </div>
  )
}

const Item = ({ icon: Icon, label, value }: any) => (
  <div className="flex gap-3">
    <Icon className="w-5 h-5 text-gray-400" />
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  </div>
)
