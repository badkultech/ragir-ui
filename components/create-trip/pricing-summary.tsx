import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type DynamicCategory } from "./dynamic-category-card";

interface PricingSummaryProps {
  mode?: 'simple' | 'dynamic';
  simplePrice?: string;
  dynamicCategories?: DynamicCategory[];
}

export function PricingSummary({ mode = 'simple', simplePrice = '0', dynamicCategories = [] }: PricingSummaryProps) {

  // Calculate Dynamic Range
  let minPrice = Infinity;
  let maxPrice = 0;
  let hasDynamicData = false;

  if (mode === 'dynamic' && dynamicCategories.length > 0) {
    dynamicCategories.forEach(cat => {
      cat.options.forEach(opt => {
        const p = Number(opt.price) || 0;
        if (p > 0) {
          hasDynamicData = true;
          if (p < minPrice) minPrice = p;
          if (p > maxPrice) maxPrice = p;
        }
      });
    });
  }

  if (!hasDynamicData) {
    minPrice = 0;
    maxPrice = 0;
  }

  // Formatting helper
  const formatPrice = (p: number) => `₹${p.toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">
      {/* Customer Preview (Dynamic Only) */}
      {mode === 'dynamic' && (
        <Card className="bg-orange-50 border-orange-100">
          <CardHeader className="bg-orange-400 text-white rounded-t-xl py-3 px-4">
            <CardTitle className="text-sm font-medium">Customer Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-orange-900 uppercase tracking-wider">Available Options</p>
              <div className="space-y-2 bg-white rounded-lg p-2">
                {dynamicCategories.flatMap(cat => cat.options).slice(0, 5).map((opt, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded border-b border-gray-100 last:border-0">
                    <span className="flex items-center gap-2">
                      {/* Simple icon placeholder */}
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                      {opt.name || "Option"}
                    </span>
                    <span className="font-semibold">{opt.price ? formatPrice(Number(opt.price)) : '-'}</span>
                  </div>
                ))}
                {dynamicCategories.length === 0 && <p className="text-xs text-muted-foreground p-2">No options added yet.</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="h-full bg-gray-50">
        <CardHeader>
          <CardTitle className="text-base ">Pricing Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {/* ... other summary items ... keep simple logic for now, or hide if irrelevant for dynamic? 
                The screenshot shows "Category", "Available Options" in summary too but let's stick to the bottom total for now 
            */}

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Sub Total:</span>
            <span>{mode === 'simple' ? formatPrice(Number(simplePrice)) : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Taxes (18% GST):</span>
            <span>₹0</span>
          </div>
          <hr className="my-2" />

          {mode === 'simple' ? (
            <div className="flex items-center justify-between font-medium">
              <span>Total per Person:</span>
              <span>{formatPrice(Number(simplePrice))}</span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-between font-medium">
                <span>Price Range</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(minPrice)} - {formatPrice(maxPrice)}
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
