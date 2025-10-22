import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function QueryItem({ query, onView, onDelete }: any) {
  // a small helper to render status badge + age badge
  const StatusBadge = () => {
    if (query.status === "open") {
      return (
        <div className="inline-flex items-center gap-2">
          <span className="text-xs font-medium bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full">Open</span>
          {query.age && (
            <span className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded-full">{query.age}</span>
          )}
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-2">
        <span className="text-xs font-medium bg-green-50 text-green-800 px-3 py-1 rounded-full">Responded</span>
      </div>
    );
  };

  return (
    <div className="bg-white border rounded-2xl p-5 flex items-start justify-between">
      <div className="w-full pr-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-lg">{query.name}</h3>
              <StatusBadge />
            </div>

            <p className="text-sm text-gray-400 mt-1">Trip: {query.trip}</p>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-400">{query.date}</div>
          </div>
        </div>

        <p className="mt-4 text-gray-700">{query.question}</p>
      </div>

      <div className="flex flex-col gap-3 items-end">
        <Button variant="ghost" className="px-4 py-2" onClick={onView}>
          View <span className="ml-2">›</span>
        </Button>

        <button
          onClick={onDelete}
          className="border border-red-200 text-red-500 rounded-lg p-2 hover:bg-red-50"
          aria-label="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
