interface TripHighlightsProps {
  highlights?: string;
}

export default function TripHighlights({ highlights }: TripHighlightsProps) {
  return (
    <div className="bg-white rounded-2xl border p-6">
      <h2 className="text-xl font-bold mb-3">Trip Highlights</h2>

      <p className="text-gray-600 leading-relaxed">
        {highlights || "No highlights added yet."}
      </p>
    </div>
  );
}
