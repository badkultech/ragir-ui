import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type DynamicCategory } from "./dynamic-category-card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface PricingSummaryProps {
  mode?: 'simple' | 'dynamic';
  simplePrice?: string;
  dynamicCategories?: DynamicCategory[];
  addOns?: { id: string; name: string; charge: number }[];
  gstMode?: 'includes' | 'excludes';
  depositPercent?: string | number;
  creditOptions?: { card: boolean; emi: boolean };
}

export function PricingSummary({
  mode = 'simple',
  simplePrice = '0',
  dynamicCategories = [],
  addOns = [],
  gstMode = 'excludes',
  depositPercent = '0',
  creditOptions = { card: false, emi: false }
}: PricingSummaryProps) {

  const formatPrice = (p: number) => `₹${p.toLocaleString('en-IN')}`;

  const calculateDiscountedPrice = (priceStr: string, discountStr: string) => {
    const price = Number(priceStr) || 0;
    const discount = Number(discountStr) || 0;
    if (discount <= 0) return { original: price, final: price, hasDiscount: false };
    const final = price - (price * discount / 100);
    return { original: price, final: Math.round(final), hasDiscount: true };
  };

  // Calculate Range
  let rangeMin = 0;
  let rangeMax = 0;

  if (mode === 'dynamic' && dynamicCategories.length > 0) {
    dynamicCategories.forEach(cat => {
      const prices = cat.options.map(opt => calculateDiscountedPrice(opt.price, opt.discount).final);
      if (prices.length > 0) {
        rangeMin += Math.min(...prices);
        rangeMax += Math.max(...prices);
      }
    });
  }

  // Add fixed price addons to Max range only (as per user request)
  const totalAddonsCharge = addOns.reduce((sum, item) => sum + (Number(item.charge) || 0), 0);
  rangeMax += totalAddonsCharge;
  // If user meant addons should optionally be in min, they would say so. 
  // "minimum me sari catogary k lovest vale ka total" implies only categories.


  return (
    <div className="space-y-6">
      {/* Customer Preview (Dynamic Only) */}
      {/* Customer Preview (Dynamic Only) */}
      {mode === 'dynamic' && dynamicCategories.length > 0 && (
        <Card className="bg-orange-50 border-orange-100 overflow-hidden flex flex-col max-h-[600px]">
          <CardHeader className="bg-[#EA580C] text-white py-3 px-4 shrink-0">
            <CardTitle className="text-sm font-medium">Customer Preview</CardTitle>
          </CardHeader>

          {/* Hiding scrollbar: [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] */}
          <CardContent className="p-4 space-y-6 overflow-y-auto custom-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {dynamicCategories.map((category, catIdx) => {
              const selectedOption = category.options[0];
              const otherOptions = category.options.slice(1);

              return (
                <div key={category.id || catIdx} className="space-y-4">
                  {/* Category Label if needed */}
                  {category.name && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-orange-800 uppercase tracking-wide bg-orange-100 px-2 py-0.5 rounded">{category.name}</span>
                    </div>
                  )}

                  {/* Selected Option */}
                  {selectedOption && (
                    <div className="space-y-1">
                      <p className="text-xs text-orange-900/80 font-medium mb-1">Selected Option</p>
                      <div className="bg-white rounded-lg p-3 shadow-sm border border-orange-100/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">{selectedOption.name || 'Option Name'}</h4>
                            <p className="text-xs text-green-600 font-medium mt-0.5">Best Value</p>
                          </div>
                          <div className="text-right">
                            {(() => {
                              const { original, final, hasDiscount } = calculateDiscountedPrice(selectedOption.price, selectedOption.discount);
                              return (
                                <>
                                  {hasDiscount && <div className="text-xs text-muted-foreground line-through">{formatPrice(original)}</div>}
                                  <div className="font-bold text-gray-900">{formatPrice(final)}</div>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Available Options */}
                  {otherOptions.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-orange-900/60 uppercase tracking-wider">Available Options</p>
                      <div className="space-y-2">
                        {otherOptions.map((opt, idx) => {
                          const { original, final, hasDiscount } = calculateDiscountedPrice(opt.price, opt.discount);
                          return (
                            <div key={idx} className="bg-white rounded-lg p-3 shadow-sm border border-orange-100/50 flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-300" />
                                <span className="text-sm text-gray-600">{opt.name || 'Option'}</span>
                              </div>
                              <div className="text-right">
                                {hasDiscount && <div className="text-[10px] text-muted-foreground line-through">{formatPrice(original)}</div>}
                                <div className="text-sm font-semibold text-gray-900">{formatPrice(final)}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Divider between categories */}
                  {catIdx < dynamicCategories.length - 1 && <hr className="border-orange-200/50" />}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Pricing Summary Widget */}
      <Card className="h-full bg-gray-50/50 border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Pricing Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">

          {mode === 'dynamic' && dynamicCategories.length > 0 ? (
            <>
              {dynamicCategories.map((firstCategory, idx) => {
                const allOptions = firstCategory.options || [];
                const displayedOptions = allOptions.slice(0, 3); // Limit summary
                const hasMore = allOptions.length > 3;

                return (
                  <div key={idx} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Category</span>
                      <span className="font-medium text-gray-900">{firstCategory.name || 'Uncategorized'}</span>
                    </div>

                    <div className="space-y-2">
                      {displayedOptions.map((opt, optIdx) => {
                        const { original, final, hasDiscount } = calculateDiscountedPrice(opt.price, opt.discount);
                        return (
                          <div key={optIdx} className="flex justify-between items-center text-gray-600 bg-gray-100/50 p-2 rounded text-xs">
                            <span className="truncate max-w-[120px]">{opt.name || 'Option'}</span>
                            <div className="text-right flex items-center gap-2">
                              {hasDiscount && <span className="text-[10px] text-gray-400 line-through">{formatPrice(original)}</span>}
                              <span className="font-medium text-gray-900">{formatPrice(final)}</span>
                            </div>
                          </div>
                        );
                      })}
                      {hasMore && <div className="text-xs text-center text-gray-400 italic">...and {allOptions.length - 3} more</div>}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Base Price:</span>
              <span className="font-medium">{formatPrice(Number(simplePrice))}</span>
            </div>
          )}

          {/* Add-ons Section */}
          {addOns.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                <span>Fixed Price Add-ons</span>
              </div>
              {addOns.map((addon) => (
                <div key={addon.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{addon.name}</span>
                  <span className="font-medium text-gray-900">{formatPrice(addon.charge)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">GST Status</span>
              <Badge variant="secondary" className={`font-normal px-2 py-0.5 ${gstMode === 'includes' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-100'}`}>
                {gstMode === 'includes' ? 'Included' : 'Excluded'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Deposit Required</span>
              <span className="font-medium">{depositPercent || 0}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Payment Options</span>
              <div className="flex gap-1">
                {creditOptions.card && <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600 border-orange-200 font-normal">Card</Badge>}
                {creditOptions.emi && <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600 border-orange-200 font-normal">EMI</Badge>}
                {!creditOptions.card && !creditOptions.emi && <span className="text-xs text-gray-400">None</span>}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Price Range</p>
              <div className="text-lg font-bold text-gray-900">
                {mode === 'simple'
                  ? formatPrice(Number(simplePrice))
                  : `${formatPrice(rangeMin)} - ${formatPrice(rangeMax)}`
                }
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
