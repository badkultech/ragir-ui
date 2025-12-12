import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, X, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DynamicOption {
    id: string;
    name: string;
    price: string;
    discount: string;
}

export interface DynamicCategory {
    id: string;
    name: string;
    description: string;
    type: 'single' | 'multi';
    options: DynamicOption[];
}

interface DynamicCategoryCardProps {
    category: DynamicCategory;
    onChange: (updated: DynamicCategory) => void;
    onRemove: () => void;
}

export function DynamicCategoryCard({ category, onChange, onRemove }: DynamicCategoryCardProps) {

    const updateField = (field: keyof DynamicCategory, value: any) => {
        onChange({ ...category, [field]: value });
    };

    const addOption = () => {
        const newOption: DynamicOption = {
            id: crypto.randomUUID(),
            name: '',
            price: '',
            discount: '',
        };
        onChange({ ...category, options: [...category.options, newOption] });
    };

    const updateOption = (idx: number, field: keyof DynamicOption, value: string) => {
        const newOptions = [...category.options];
        newOptions[idx] = { ...newOptions[idx], [field]: value };
        onChange({ ...category, options: newOptions });
    };

    const removeOption = (idx: number) => {
        const newOptions = category.options.filter((_, i) => i !== idx);
        onChange({ ...category, options: newOptions });
    };

    return (
        <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5 mb-6 relative">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">Price Category</h3>
                </div>
            </div>

            <div className="space-y-4">
                {/* Basic Info */}
                <div className="space-y-2">
                    <Label>Category Name</Label>
                    <Input
                        placeholder="e.g. Car, Hotel, Ticket"
                        value={category.name}
                        onChange={(e) => updateField('name', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Description (Optional)</Label>
                    <Textarea
                        placeholder="Enter description here"
                        value={category.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        className="resize-none"
                    />
                    <div className="text-right text-xs text-muted-foreground">0/500 Words</div>
                </div>

                {/* Pricing Type */}
                <div className="space-y-2">
                    <Label>Pricing Type</Label>
                    <RadioGroup
                        value={category.type}
                        onValueChange={(val) => updateField('type', val)}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div className={cn(
                            "relative flex flex-col gap-2 rounded-lg border-2 p-4 cursor-pointer hover:bg-gray-50 transition-all",
                            category.type === 'single' ? "border-orange-200 bg-orange-50/30" : "border-gray-200 bg-white"
                        )}>
                            <RadioGroupItem value="single" id={`single-${category.id}`} className="sr-only" />
                            <Label htmlFor={`single-${category.id}`} className="cursor-pointer font-bold">Single Price</Label>
                            <span className="text-xs text-muted-foreground">Single price for this category</span>
                        </div>

                        <div className={cn(
                            "relative flex flex-col gap-2 rounded-lg border-2 p-4 cursor-pointer hover:bg-gray-50 transition-all",
                            category.type === 'multi' ? "border-orange-200 bg-orange-50/30" : "border-gray-200 bg-white"
                        )}>
                            <RadioGroupItem value="multi" id={`multi-${category.id}`} className="sr-only" />
                            <Label htmlFor={`multi-${category.id}`} className="cursor-pointer font-bold">Multi-price</Label>
                            <span className="text-xs text-muted-foreground">Different choices with different pricing</span>
                        </div>
                    </RadioGroup>
                </div>

                {/* Bulk Action */}
                {category.type === 'multi' && (
                    <div className="flex justify-end">
                        <Button
                            variant="link"
                            className="text-orange-500 h-auto p-0 text-xs font-semibold"
                            onClick={() => {
                                const firstDiscount = category.options[0]?.discount || '0';
                                const newOptions = category.options.map(o => ({ ...o, discount: firstDiscount }));
                                onChange({ ...category, options: newOptions });
                            }}
                        >
                            <Tag className="w-3 h-3 mr-1" />
                            Apply Discount to All
                        </Button>
                    </div>
                )}

                {/* Options List */}
                <div className="space-y-3">
                    {category.options.map((option, idx) => (
                        <div key={option.id} className="flex gap-2 items-start">
                            <div className="flex-1 space-y-1">
                                {idx === 0 && <Label className="text-xs text-muted-foreground">Option Name</Label>}
                                <Input
                                    placeholder={category.type === 'single' ? "Standard" : "e.g. Economy, Sedan"}
                                    value={option.name}
                                    onChange={(e) => updateOption(idx, 'name', e.target.value)}
                                    disabled={category.type === 'single'}
                                />
                            </div>
                            <div className="w-28 space-y-1">
                                {idx === 0 && <Label className="text-xs text-muted-foreground">Price (₹)</Label>}
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={option.price}
                                    onChange={(e) => updateOption(idx, 'price', e.target.value)}
                                />
                            </div>
                            <div className="w-32 space-y-1">
                                {idx === 0 && <Label className="text-xs text-muted-foreground">Discount</Label>}
                                <div className="relative">
                                    <Input
                                        placeholder="0"
                                        value={option.discount}
                                        onChange={(e) => updateOption(idx, 'discount', e.target.value)}
                                        className="pr-8"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <span className="text-xs">%</span>
                                    </div>
                                </div>
                            </div>
                            {category.type === 'multi' && category.options.length > 1 && (
                                <div className="pt-7">
                                    <Button variant="ghost" size="icon" onClick={() => removeOption(idx)} className="h-10 w-10 text-muted-foreground hover:text-destructive">
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Option Button */}
                {category.type === 'multi' && (
                    <Button
                        variant="outline"
                        className="w-full border-dashed border-2 py-6 text-muted-foreground hover:text-foreground hover:border-gray-400"
                        onClick={addOption}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Pricing Option
                    </Button>
                )}
            </div>
        </div>
    );
}
