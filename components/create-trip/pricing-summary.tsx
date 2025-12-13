import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type DynamicCategory } from "./dynamic-category-card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

interface PricingSummaryProps {
  mode?: 'simple' | 'dynamic';
  simplePrice?: string;
  dynamicCategories?: DynamicCategory[];
  addOns?: { id: string; name: string; charge: number }[];
}

export function PricingSummary({
  mode = 'simple',
  simplePrice = '0',
  dynamicCategories = [],
  addOns = []
}: PricingSummaryProps) {

  const formatPrice = (p: number) => `₹${p.toLocaleString('en-IN')}`;

  const calculateDiscountedPrice = (priceStr: string, discountStr: string) => {
    const price = Number(priceStr) || 0;
    const discount = Number(discountStr) || 0;
    if (discount <= 0) return { original: price, final: price, hasDiscount: false };
    const final = price - (price * discount / 100);
    return { original: price, final: Math.round(final), hasDiscount: true };
  };

  // --- STATE FOR SELECTIONS ---
  // Store selected option ID for each category ID
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  // Store selected addon IDs
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());

  // Initialize defaults when categories change
  useEffect(() => {
    // We want to preserve existing user selections if they are still valid, 
    // but default to first option if nothing selected.
    setSelectedOptions(prev => {
      const next = { ...prev };
      dynamicCategories.forEach(cat => {
        // If this category has no selection yet, OR the selected option no longer exists
        const currentSelection = next[cat.id];
        const selectionIsValid = cat.options.some(o => o.id === currentSelection);

        if ((!currentSelection || !selectionIsValid) && cat.options.length > 0) {
          next[cat.id] = cat.options[0].id;
        }
      });
      return next;
    });

  }, [dynamicCategories]);


  // Helper to get range 
  let minPrice = Infinity;
  let maxPrice = 0;
  if (mode === 'dynamic' && dynamicCategories.length > 0) {
    dynamicCategories.forEach(cat => {
      cat.options.forEach(opt => {
        const { final } = calculateDiscountedPrice(opt.price, opt.discount);
        if (final > 0) {
          if (final < minPrice) minPrice = final;
          if (final > maxPrice) maxPrice = final;
        }
      });
    });
  }
  if (minPrice === Infinity) minPrice = 0;


  // --- CALCULATION ---
  let totalCalculated = 0;

  if (mode === 'simple') {
    totalCalculated = Number(simplePrice) || 0;
  } else {
    // Dynamic Mode
    dynamicCategories.forEach(cat => {
      const selectedOptId = selectedOptions[cat.id];
      const option = cat.options.find(o => o.id === selectedOptId);
      if (option) {
        const { final } = calculateDiscountedPrice(option.price, option.discount);
        totalCalculated += final;
      }
    });
  }

  // Add Addons
  addOns.forEach(addon => {
    if (selectedAddons.has(addon.id)) {
      totalCalculated += (addon.charge || 0);
    }
  });


  const handleAddonToggle = (id: string, checked: boolean) => {
    const newSet = new Set(selectedAddons);
    if (checked) newSet.add(id);
    else newSet.delete(id);
    setSelectedAddons(newSet);
  };

  const firstCategory = dynamicCategories[0];
  const selectedFirstCatOption = firstCategory?.options.find(o => o.id === selectedOptions[firstCategory.id]);

  return (
    <div className="space-y-6">

      {/* Customer Preview (Dynamic Only) */}
      {mode === 'dynamic' && dynamicCategories.length > 0 && (
        <Card className="bg-orange-50 border-orange-100 overflow-hidden hidden md:block">
          <CardHeader className="bg-[#EA580C] text-white py-2 px-3">
            <CardTitle className="text-xs font-medium">Customer Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-6">
            {dynamicCategories.map((cat, idx) => {
              const bestOption = cat.options[0]; // Assuming first is Best Value
              const otherOptions = cat.options.slice(1);
              if (!bestOption) return null;

              const { original: bestOriginal, final: bestFinal, hasDiscount: bestHasDiscount } = calculateDiscountedPrice(bestOption.price, bestOption.discount);

              return (
                <div key={cat.id} className="space-y-3">
                  {idx > 0 && <Separator className="bg-orange-200/50" />}

                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline mb-1">
                      <p className="text-xs text-orange-900 font-bold uppercase tracking-wider">{cat.name || 'Category'}</p>
                    </div>

                    {/* Best Value Option */}
                    <div className="bg-white rounded-lg p-3 shadow-sm border border-orange-100/50 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                        BEST VALUE
                      </div>
                      <div className="flex justify-between items-start mt-1">
                        <div>
                          <h4 className="font-semibold text-gray-900">{bestOption.name || 'Option Name'}</h4>
                        </div>
                        <div className="text-right pr-2">
                          {bestHasDiscount && <div className="text-xs text-muted-foreground line-through">{formatPrice(bestOriginal)}</div>}
                          <div className="font-bold text-gray-900">{formatPrice(bestFinal)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Available Options */}
                  {otherOptions.length > 0 && (
                    <div className="space-y-2 pl-1">
                      <p className="text-[10px] font-semibold text-orange-800/70 uppercase tracking-wider">Other Options</p>
                      <div className="space-y-2">
                        {otherOptions.map((opt) => {
                          const { original, final, hasDiscount } = calculateDiscountedPrice(opt.price, opt.discount);
                          return (
                            <div key={opt.id} className="bg-white/60 rounded-lg p-2.5 shadow-sm border border-orange-100/30 flex justify-between items-center">
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
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Pricing Summary Widget */}
      <Card className="h-full bg-gray-50/50 border-gray-200">
        <CardHeader className="pb-3 border-b border-gray-100 bg-white rounded-t-xl">
          <CardTitle className="text-base flex items-center gap-2">
            Pricing Calculator
            <Badge variant="outline" className="font-normal text-xs">Preview</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6 text-sm">

          {mode === 'dynamic' ? (
            <div className="space-y-6">
              {/* Dynamic Categories */}
              {dynamicCategories.map((cat) => (
                <div key={cat.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{cat.name || 'Category'}</h4>
                  </div>

                  <RadioGroup
                    value={selectedOptions[cat.id]}
                    onValueChange={(val) => setSelectedOptions(prev => ({ ...prev, [cat.id]: val }))}
                    className="space-y-2"
                  >
                    {cat.options.map((opt) => {
                      const { final, hasDiscount, original } = calculateDiscountedPrice(opt.price, opt.discount);
                      return (
                        <div key={opt.id} className="flex items-center space-x-2 bg-white p-2 rounded border border-gray-200/60 shadow-sm">
                          <RadioGroupItem value={opt.id} id={opt.id} />
                          <Label htmlFor={opt.id} className="flex-1 flex justify-between cursor-pointer font-normal text-gray-600">
                            <span>{opt.name || 'Option'}</span>
                            <div className="text-right">
                              {hasDiscount && <span className="text-[10px] text-gray-400 line-through block">{formatPrice(original)}</span>}
                              <span className="font-medium text-gray-900">{formatPrice(final)}</span>
                            </div>
                          </Label>
                        </div>
                      )
                    })}
                  </RadioGroup>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
              <span className="text-gray-500">Base Price</span>
              <span className="font-medium text-gray-900">{formatPrice(Number(simplePrice))}</span>
            </div>
          )}

          {/* Addons Section - "Fixed Price" */}
          {addOns.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900">Fixed Price (Addons)</h4>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>
              <div className="space-y-2">
                {addOns.map(addon => (
                  <div key={addon.id} className="flex items-start space-x-3 bg-white p-2 rounded border border-gray-200/60 shadow-sm">
                    <Checkbox
                      id={addon.id}
                      checked={selectedAddons.has(addon.id)}
                      onCheckedChange={(c) => handleAddonToggle(addon.id, c as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none w-full">
                      <label
                        htmlFor={addon.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex justify-between w-full"
                      >
                        <span className="text-gray-600 font-normal">{addon.name}</span>
                        <span className="font-medium text-gray-900">{formatPrice(addon.charge)}</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Total Payment */}
          <div className="pt-2">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Payment</p>
                <p className="text-xs text-gray-400 font-normal">(Includes GST if applicable)</p>
              </div>
              <div className="text-2xl font-bold text-gray-900 leading-none">
                {formatPrice(totalCalculated)}
              </div>
            </div>

            {mode === 'dynamic' && (
              <p className="text-xs text-right text-gray-400 mt-2">
                *Min: {formatPrice(minPrice)} - Max: {formatPrice(maxPrice)}
              </p>
            )}

          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100 bg-gray-50/50 -mx-6 -mb-6 p-6 rounded-b-xl">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs">GST Status</span>
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 font-normal text-[10px] px-2 py-0.5">Included</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs">Deposit Required</span>
              <span className="font-medium text-xs">25%</span>
            </div>
          </div>


        </CardContent>
      </Card>
    </div>
  )
}
