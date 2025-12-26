import { useState } from "react"
import { Car, Utensils, Home, Activity, Calendar, CheckCircle2 } from "lucide-react"

const tabs = ["Transfers", "Meals", "Stays", "Activities"]

export default function IncludedSection({
  transfers,
  meals,
  stays,
  activities,
}: any) {
  const [active, setActive] = useState(0)

  return (
    <div className="bg-white rounded-2xl border p-6">
      <h2 className="text-xl font-semibold mb-4">What's Included</h2>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActive(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${active === i
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-600"
              }`}
          >
            {i === 0 && <Car className="w-4 h-4" />}
            {i === 1 && <Utensils className="w-4 h-4" />}
            {i === 2 && <Home className="w-4 h-4" />}
            {i === 3 && <Activity className="w-4 h-4" />}
            {tab}
          </button>
        ))}
      </div>

      {/* Transfers */}
      {active === 0 &&
        transfers.map((t: any, i: number) => (
          <Row
            key={i}
            icon={<Car />}
            title={t.name}
            desc={t.description}
            right={`${t.startDate} - ${t.endDate}`}
          />
        ))}

      {/* Meals */}
      {active === 1 &&
        meals.map((m: any, i: number) => (
          <Row
            key={i}
            icon={<Utensils />}
            title={m.name}
            desc={m.description}
          />
        ))}

      {/* Stays */}
      {active === 2 &&
        stays.map((s: any, i: number) => (
          <Row
            key={i}
            icon={<Home />}
            title={s.name}
            desc={s.description}
            right={
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {s.dates}
              </span>
            }
          />
        ))}

      {/* Activities */}
      {active === 3 &&
        activities.map((a: any, i: number) => (
          <Row
            key={i}
            icon={<Activity />}
            title={a.name}
            desc={a.description}
            right={
              a.included && (
                <span className="flex items-center gap-1 text-green-600 text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  Included
                </span>
              )
            }
          />
        ))}
    </div>
  )
}

const Row = ({ icon, title, desc, right }: any) => (
  <div className="flex items-start gap-4 pb-4 ">
    <div className="p-3 bg-gray-100 rounded-full">{icon}</div>

    <div className="flex-1">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>

    {right && (
      <div className="text-sm text-gray-900 pt-3 flex items-center gap-1">
        <Calendar className="w-5 h-5 mr-1 inline text-orange-500" />
        {right}
      </div>
    )}
  </div>
)
