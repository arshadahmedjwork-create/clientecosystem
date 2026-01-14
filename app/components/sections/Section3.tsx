import React from 'react';
import { FormData } from '@/app/types';
import { Radio, Checkbox } from '@/app/components/ui/FormElements';

type Props = {
    data: FormData;
    updateFields: (fields: Partial<FormData>) => void;
};

const ASSETS = ["Brand Guidelines", "Logo", "Typography", "Palette", "Moodboard"];
const TONES = ["Elite", "Friendly", "Disruptive", "Sustainable", "Minimal", "Premium"];
const EXPLORATIONS = ["Rebranding", "Packaging Design", "Merchandise", "Creative Art Direction"];
const CONSISTENCY = ["Yes", "No", "Needs Refinement"];

export default function Section3({ data, updateFields }: Props) {
    const toggleArray = (field: keyof FormData, item: string) => {
        const current = (data[field] as string[]) || [];
        if (current.includes(item)) {
            updateFields({ [field]: current.filter(i => i !== item) });
        } else {
            updateFields({ [field]: [...current, item] });
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="mb-12">
                <h2 className="text-4xl md:text-6xl font-serif mb-4">Brand Identity & Visual Positioning</h2>
                <p className="text-xl md:text-2xl font-light opacity-60 italic">Your aesthetic is your armor. Let’s sharpen it.</p>
            </div>

            {/* Existing Assets */}
            <div className="mb-12">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Do you have:</label>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {ASSETS.map(item => (
                        <Checkbox
                            key={item}
                            label={item}
                            value={item}
                            checked={data.existingAssets.includes(item)}
                            onChange={() => toggleArray('existingAssets', item)}
                        />
                    ))}
                </div>
            </div>

            {/* Consistency */}
            <div className="mb-12">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Are your assets consistent across platforms?</label>
                <div className="flex flex-col md:flex-row gap-8">
                    {CONSISTENCY.map(opt => (
                        <Radio
                            key={opt}
                            label={opt}
                            name="consistency"
                            value={opt}
                            checked={data.assetsConsistency === opt}
                            onChange={(val) => updateFields({ assetsConsistency: val })}
                        />
                    ))}
                </div>
            </div>

            {/* Brand Tone */}
            <div className="mb-12">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Your brand tone is:</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {TONES.map(tone => (
                        <Checkbox
                            key={tone}
                            label={tone}
                            value={tone}
                            checked={data.brandTone.includes(tone)}
                            onChange={() => toggleArray('brandTone', tone)}
                        />
                    ))}
                </div>
            </div>

            {/* Explorations */}
            <div className="mb-12">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Would you explore:</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {EXPLORATIONS.map(item => (
                        <Checkbox
                            key={item}
                            label={item}
                            value={item}
                            checked={data.explorationInterests.includes(item)}
                            onChange={() => toggleArray('explorationInterests', item)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
