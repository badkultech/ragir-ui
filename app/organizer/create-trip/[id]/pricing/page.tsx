'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AddOnsFieldset } from '@/components/create-trip/add-ons-fieldset';
import {
  GstStatusToggle,
  type GstValue,
} from '@/components/create-trip/gst-status-toggle';
import { CreditOptions } from '@/components/create-trip/credit-options';
import { PricingSummary } from '@/components/create-trip/pricing-summary';
import { useParams, useRouter } from 'next/navigation';
import { WizardFooter } from '@/components/create-trip/wizard-footer';
import { TripStepperHeader } from '@/components/create-trip/tripStepperHeader';
import { AppHeader } from '@/components/app-header';
import { OrganizerSidebar } from '@/components/organizer/organizer-sidebar';

import {
  useCreatePricingMutation,
  useUpdatePricingMutation,
  useGetPricingQuery,
} from '@/lib/services/organizer/trip/pricing';
import { useOrganizationId } from '@/hooks/useOrganizationId';
import { CustomDateTimePicker } from '@/components/ui/date-time-picker';
import { DynamicCategoryCard, type DynamicCategory } from '@/components/create-trip/dynamic-category-card';
import { Plus } from 'lucide-react';

type PricingMode = 'simple' | 'dynamic';

type Row = {
  particular: string;
  values: string[];
};

export default function PricingPage() {
  const router = useRouter();
  const params = useParams();
  const tripId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [gst, setGst] = useState<GstValue>('excludes');
  const [credit, setCredit] = useState({ card: true, emi: false });
  const [mode, setMode] = useState<PricingMode>('simple');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [discountUntil, setDiscountUntil] = useState('');
  const [depositPercent, setDepositPercent] = useState('');
  const [policy, setPolicy] = useState('');
  const [addOns, setAddOns] = useState<
    { id: string; name: string; charge: number }[]
  >([]);

  const organizationId = useOrganizationId();
  const [createPricing] = useCreatePricingMutation();
  const [updatePricing] = useUpdatePricingMutation();
  const { data: pricingData } = useGetPricingQuery({
    organizationId,
    tripPublicId: tripId as string,
  });

  const [isSavingNext, setIsSavingNext] = useState(false);
  const [draftDisabled, setDraftDisabled] = useState(false);

  // Restore existing data
  useEffect(() => {
    if (!pricingData) return;

    // Set mode from API
    setMode(
      pricingData.tripPricingType === "DYNAMIC"
        ? "dynamic"
        : "simple"
    );

    // SIMPLE PRICING DATA
    if (pricingData.simplePricingRequest) {
      setPrice(String(pricingData.simplePricingRequest.basePrice ?? ""));
      setDiscount(String(pricingData.simplePricingRequest.discountPercent ?? ""));
      setDiscountUntil(pricingData.simplePricingRequest.discountValidUntil || "");
    }

    // DYNAMIC PRICING DATA
    if (pricingData.dynamicPricingRequest) {
      setDynamicCategories(
        pricingData.dynamicPricingRequest.pricingCategoryDtos?.map((c: any) => ({
          id: crypto.randomUUID(),
          name: c.categoryName,
          description: c.description,
          type: c.pricingCategoryType === "SINGLE" ? "single" : "multi",
          options: c.pricingCategoryOptionDTOs.map((o: any) => ({
            id: crypto.randomUUID(),
            name: o.name,
            price: String(o.price),
            discount: String(o.discount),
          }))
        })) ?? []
      );
    }

    // COMMON FIELDS
    setGst(pricingData.includesGst ? "includes" : "excludes");
    setDepositPercent(String(pricingData.depositRequiredPercent ?? ""));
    setCredit({
      card: pricingData.creditOptions === "CREDIT_CARD",
      emi: pricingData.creditOptions === "EMI",
    });
    setPolicy(pricingData.cancellationPolicy || "");

    // ADD ONS (null safe)
    setAddOns(
      (pricingData.addOns || []).map((a: any) => ({
        id: String(a.id ?? crypto.randomUUID()),
        name: a.name,
        charge: Number(a.charge),
      }))
    );
  }, [pricingData]);


  // DYNAMIC PRICING SATE
  const [dynamicCategories, setDynamicCategories] = useState<DynamicCategory[]>([]);

  const addCategory = () => {
    setDynamicCategories([
      ...dynamicCategories,
      {
        id: crypto.randomUUID(),
        name: '',
        description: '',
        type: 'multi',
        options: [{ id: crypto.randomUUID(), name: '', price: '', discount: '' }],
      },
    ]);
  };

  const updateCategory = (idx: number, updated: DynamicCategory) => {
    const newCats = [...dynamicCategories];

    // Logic: If switching to 'single', enforce only 1 option
    if (updated.type === 'single' && updated.options.length > 1) {
      updated.options = [updated.options[0]];
      updated.options[0].name = 'Standard'; // Default name for single
    }

    newCats[idx] = updated;
    setDynamicCategories(newCats);
  };

  const removeCategory = (idx: number) => {
    setDynamicCategories(dynamicCategories.filter((_, i) => i !== idx));
  };

  const handleSavePricing = async (isDraft: boolean = false) => {
    if (!tripId) return;

    try {
      isDraft ? setDraftDisabled(true) : setIsSavingNext(true);

      const fd = new FormData();

      // COMMON FIELDS
      fd.append("includesGst", gst === "includes" ? "true" : "false");
      fd.append("depositRequiredPercent", String(Number(depositPercent || 0)));
      fd.append("creditOptions", credit.card ? "CREDIT_CARD" : "EMI");
      fd.append("cancellationPolicy", policy || "");
      fd.append("tripPricingType", mode === "simple" ? "SIMPLE" : "DYNAMIC");

      // ---------- SIMPLE PRICING ----------
      if (mode === "simple") {
        fd.append("simplePricingRequest.basePrice", String(Number(price || 0)));
        fd.append("simplePricingRequest.discountPercent", String(Number(discount || 0)));
        fd.append("simplePricingRequest.discountValidUntil", discountUntil || "");
      }

      // ---------- DYNAMIC PRICING ----------
      if (mode === "dynamic") {
        dynamicCategories.forEach((cat, i) => {
          fd.append(`dynamicPricingRequest.pricingCategoryDtos[${i}].categoryName`, cat.name);
          fd.append(`dynamicPricingRequest.pricingCategoryDtos[${i}].description`, cat.description);
          fd.append(
            `dynamicPricingRequest.pricingCategoryDtos[${i}].pricingCategoryType`,
            cat.type === "single" ? "SINGLE" : "MULTI"
          );

          cat.options.forEach((opt, j) => {
            fd.append(
              `dynamicPricingRequest.pricingCategoryDtos[${i}].pricingCategoryOptionDTOs[${j}].name`,
              opt.name
            );
            fd.append(
              `dynamicPricingRequest.pricingCategoryDtos[${i}].pricingCategoryOptionDTOs[${j}].price`,
              String(Number(opt.price || 0))
            );
            fd.append(
              `dynamicPricingRequest.pricingCategoryDtos[${i}].pricingCategoryOptionDTOs[${j}].discount`,
              String(Number(opt.discount || 0))
            );
          });
        });
      }


      // ---------- ADD ONS ----------
      addOns.forEach((a, i) => {
        fd.append(`addOns[${i}].name`, a.name);
        fd.append(`addOns[${i}].charge`, String(Number(a.charge || 0)));
      });

      // CREATE / UPDATE
      if (!pricingData) {
        await createPricing({ organizationId, tripPublicId: tripId, data: fd as any }).unwrap();
      } else {
        await updatePricing({ organizationId, tripPublicId: tripId, data: fd as any }).unwrap();
      }

      if (!isDraft) router.push(`/organizer/create-trip/${tripId}/review`);
    } catch (e) {
      console.error("Pricing save error", e);
      if (isDraft) setDraftDisabled(false);
    } finally {
      if (!isDraft) setIsSavingNext(false);
    }
  };


  return (
    <div className='flex min-h-screen bg-gray-50'>
      <OrganizerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className='flex-1'>
        <AppHeader title='Create New Trip' />
        <TripStepperHeader activeStep={5} />

        <main className='mx-auto w-full max-w-6xl px-4 py-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            <div className='md:col-span-2 space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Simple Pricing</CardTitle>
                </CardHeader>

                <CardContent className='space-y-6'>
                  {/* Mode Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                    {/* Simple Pricing */}
                    <div
                      onClick={() => setMode("simple")}
                      className={`
      flex flex-col items-center justify-center gap-3
      px-6 py-4 rounded-xl border cursor-pointer transition-all
      ${mode === "simple"
                          ? "border-orange-400 bg-orange-50 shadow-sm"
                          : "border-gray-200 bg-white"
                        }
    `}
                    >
                      {/* RADIO BUTTON TOP */}
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={
                          mode === "simple"
                            ? {
                              border: "2px solid transparent",
                              background: `
            linear-gradient(white, white) padding-box,
            linear-gradient(90deg, #FEA901, #FD6E34, #FE336A, #FD401A) border-box
          `,
                            }
                            : {
                              border: "2px solid #D1D5DB",
                              background: "white",
                            }
                        }
                      >
                        {mode === "simple" && (
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              background:
                                "linear-gradient(90deg, #FEA901, #FD6E34, #FE336A, #FD401A)",
                            }}
                          ></div>
                        )}
                      </div>


                      {/* TEXT BELOW */}
                      <span
                        className={`text-sm font-medium ${mode === "simple" ? "text-black" : "text-gray-600"
                          }`}
                      >
                        Simple Pricing
                      </span>
                    </div>

                    {/* Dynamic Pricing */}
                    <div
                      onClick={() => setMode("dynamic")}
                      className={`
      flex flex-col items-center justify-center gap-3
      px-6 py-4 rounded-xl border cursor-pointer transition-all
      ${mode === "dynamic"
                          ? "border-orange-400 bg-orange-50 shadow-sm"
                          : "border-gray-200 bg-white"
                        }
    `}
                    >
                      {/* RADIO BUTTON TOP */}
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={
                          mode === "dynamic"
                            ? {
                              border: "2px solid transparent",
                              background: `
            linear-gradient(white, white) padding-box,
            linear-gradient(90deg, #FEA901, #FD6E34, #FE336A, #FD401A) border-box
          `,
                            }
                            : {
                              border: "2px solid #D1D5DB",
                            }
                        }
                      >
                        {mode === "dynamic" && (
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              background:
                                "linear-gradient(90deg, #FEA901, #FD6E34, #FE336A, #FD401A)",
                            }}
                          ></div>
                        )}
                      </div>


                      {/* TEXT BELOW */}
                      <span
                        className={`text-sm font-medium ${mode === "dynamic" ? "text-black" : "text-gray-600"
                          }`}
                      >
                        Dynamic Pricing
                      </span>
                    </div>

                  </div>


                  {/* SIMPLE PRICING */}
                  {mode === 'simple' && (
                    <div className='space-y-5'>
                      <Label>Price *</Label>
                      <Input
                        placeholder='Enter price'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />

                      <Label>Discount</Label>
                      <Input
                        placeholder='Discount %'
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                      />

                      <Label>Discount Valid Until</Label>
                      <CustomDateTimePicker
                        mode='date'
                        value={discountUntil}
                        onChange={setDiscountUntil}
                        stepMinutes={15}
                      />

                      <Label>Discount Valid Until</Label>
                      <CustomDateTimePicker
                        mode='date'
                        value={discountUntil}
                        onChange={setDiscountUntil}
                        stepMinutes={15}
                      />
                    </div>
                  )}

                  {/* Dynamic Pricing */}
                  {mode === 'dynamic' && (
                    <div className='space-y-6'>
                      {dynamicCategories.map((category, idx) => (
                        <DynamicCategoryCard
                          key={category.id}
                          category={category}
                          onChange={(updated) => updateCategory(idx, updated)}
                          onRemove={() => removeCategory(idx)}
                        />
                      ))}
                      <Button
                        variant="outline"
                        className="w-full border-orange-200 text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                        onClick={addCategory}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Category
                      </Button>
                    </div>
                  )}

                  {/* COMMON FIELDS (Shared between Simple & Dynamic) */}
                  {/* ADD ONS */}
                  <AddOnsFieldset value={addOns} onChange={setAddOns} />
                  <div className="space-y-5 pt-4 border-t border-gray-100">
                    <Label>GST Status *</Label>
                    <GstStatusToggle value={gst} onChange={setGst} />
                    <Label>Deposit Required</Label>
                    <Input
                      placeholder='Deposit %'
                      value={depositPercent}
                      onChange={(e) => setDepositPercent(e.target.value)}
                    />

                    <Label>Credit Options</Label>
                    <CreditOptions value={credit} onChange={setCredit} />

                    <Label>Cancellation Policy</Label>
                    <Textarea
                      value={policy}
                      onChange={(e) => setPolicy(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className='md:col-span-1'>
              <PricingSummary
                mode={mode}
                simplePrice={price}
                dynamicCategories={dynamicCategories}
                addOns={addOns}
                gstMode={gst}
                depositPercent={depositPercent}
                creditOptions={credit}
              />
            </div>
          </div>

          <WizardFooter
            onPrev={() => router.push(`/organizer/create-trip/${tripId}/faqs`)}
            onDraft={() => handleSavePricing(true)}
            onNext={() => handleSavePricing(false)}
            loading={isSavingNext}
            draftDisabled={draftDisabled}
          />
        </main>
      </div>
    </div>
  );
}
