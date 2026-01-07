import { useState } from "react";
import {
  Car,
  Utensils,
  Home,
  Activity,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { TRIP_DETAILS } from "@/lib/constants/strings";

const tabs = TRIP_DETAILS.INCLUDED.TABS;

interface IncludedProps {
  transfers?: any[];
  meals?: any[];
  stays?: any[];
  activities?: any[];
}

export default function IncludedSection({
  transfers = [],
  meals = [],
  stays = [],
  activities = [],
}: IncludedProps) {
  const [active, setActive] = useState(0);

  const renderEmpty = () => (
    <p className="text-sm text-gray-500">{TRIP_DETAILS.INCLUDED.EMPTY}</p>
  );

  return (
    <div className="bg-white rounded-2xl border p-6">
      <h2 className="text-xl font-semibold mb-4">{TRIP_DETAILS.INCLUDED.INCLUDED_LABEL}</h2>

      {/* tabs */}
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
        (transfers.length ? (
          transfers.map((t, i) => (
            <Row
              key={i}
              icon={<Car />}
              title={t?.name}
              desc={t?.description}
              right={`${t?.startDate || ""} - ${t?.endDate || ""}`}
            />
          ))
        ) : (
          renderEmpty()
        ))}

      {/* Meals */}
      {active === 1 &&
        (meals.length ? (
          meals.map((m, i) => (
            <Row
              key={i}
              icon={<Utensils />}
              title={m?.name}
              desc={m?.description}
            />
          ))
        ) : (
          renderEmpty()
        ))}

      {/* Stays */}
      {active === 2 &&
        (stays.length ? (
          stays.map((s, i) => (
            <Row
              key={i}
              icon={<Home />}
              title={s?.name}
              desc={s?.description}
              right={
                s?.dates && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {s?.dates}
                  </span>
                )
              }
            />
          ))
        ) : (
          renderEmpty()
        ))}

      {/* Activities */}
      {active === 3 &&
        (activities.length ? (
          activities.map((a, i) => (
            <Row
              key={i}
              icon={<Activity />}
              title={a?.name}
              desc={a?.description}
              right={
                a?.included && (
                  <span className="flex items-center gap-1 text-green-600 text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    Included
                  </span>
                )
              }
            />
          ))
        ) : (
          renderEmpty()
        ))}
    </div>
  );
}

const Row = ({ icon, title, desc, right }: any) => (
  <div className="flex items-start gap-4 pb-4">
    <div className="p-3 bg-gray-100 rounded-full">{icon}</div>

    <div className="flex-1">
      <h3 className="font-semibold">{title || "--"}</h3>
      <p className="text-sm text-gray-600">{desc || ""}</p>
    </div>

    {right && (
      <div className="text-sm text-gray-900 pt-3 flex items-center gap-1">
        {right}
      </div>
    )}
  </div>
);
