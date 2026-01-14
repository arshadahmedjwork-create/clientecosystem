import React from 'react';
import { FormData } from '@/app/types';
import { Radio, Checkbox } from '@/app/components/ui/FormElements';

type Props = {
    data: FormData;
    updateFields: (fields: Partial<FormData>) => void;
};

const CONTENT_TYPES = ["Brand Films", "Testimonial Videos", "Reels", "Explainers", "Ads", "BTS"];
const STYLES = ["Minimal", "Lush & Premium", "Real-time / BTS", "Cinematic", "High Energy"];
const PRE_PROD = ["Concept & Scriptwriting", "Visual Moodboarding", "Location Scouting", "Casting", "Creative Direction"];
const POST_PROD = ["Motion Graphics", "Sound Design", "Grading & Color", "Dynamic Edits for Ads"];

export default function Section5({ data, updateFields }: Props) {
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
                <h2 className="text-4xl md:text-6xl font-serif mb-4">Visual Production: Story, Studio & Scale</h2>
                <p className="text-xl md:text-2xl font-light opacity-60 italic">From scripts to cinema. What do you envision?</p>
            </div>

            <div className="mb-12">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Content Types You Prioritize</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {CONTENT_TYPES.map(item => (
                        <Checkbox
                            key={item}
                            label={item}
                            value={item}
                            checked={data.priorityContentTypes.includes(item)}
                            onChange={() => toggleArray('priorityContentTypes', item)}
                        />
                    ))}
                </div>
            </div>

            <div className="mb-12">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Production Style Preference</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {STYLES.map(item => (
                        <Radio // Using Radio for Style Preference as it usually implies a dominant look, but user can pick one.
                            key={item}
                            label={item}
                            name="productionStyle"
                            value={item}
                            checked={data.productionStylePreference === item}
                            onChange={(val) => updateFields({ productionStylePreference: val })}
                        />
                    ))}
                </div>
            </div>

            <div className="mb-12">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Pre-Production Assistance Needed</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PRE_PROD.map(item => (
                        <Checkbox
                            key={item}
                            label={item}
                            value={item}
                            checked={data.preProductionNeeds.includes(item)}
                            onChange={() => toggleArray('preProductionNeeds', item)}
                        />
                    ))}
                </div>
            </div>

            <div className="mb-12">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Post-Production Enhancements</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {POST_PROD.map(item => (
                        <Checkbox
                            key={item}
                            label={item}
                            value={item}
                            checked={data.postProductionEnhancements.includes(item)}
                            onChange={() => toggleArray('postProductionEnhancements', item)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
