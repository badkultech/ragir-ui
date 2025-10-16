import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function QueryStats() {
  const stats = [
    { label: "Total Queries", value: 460 },
    { label: "Open Queries", value: 460 },
    { label: "Responded", value: 460 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="shadow-sm border rounded-xl bg-white hover:shadow-md transition"
        >
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">
                {stat.value}
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <MessageSquare className="w-5 h-5 text-[#F97316]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
