import React from 'react';
import { FormData } from '@/app/types';
import { TextInput, TextArea, Checkbox } from '@/app/components/ui/FormElements';

type Props = {
    data: FormData;
    updateFields: (fields: Partial<FormData>) => void;
};

const GROWTH_GOALS = [
    "Market Expansion", "Sales Pipeline Uplift", "Brand Awareness",
    "Product Launch", "Hiring / Employer Branding", "Online Conversions"
];

const BOTTLENECKS = [
    "Low engagement", "Ineffective storytelling", "No performance tracking",
    "Fragmented digital presence", "Lack of creative assets"
];

export default function Section2({ data, updateFields }: Props) {
    const toggleGoal = (goal: string) => {
        const current = data.growthGoals || [];
        if (current.includes(goal)) {
            updateFields({ growthGoals: current.filter(g => g !== goal) });
        } else {
            updateFields({ growthGoals: [...current, goal] });
        }
    };

    const toggleBottleneck = (item: string) => {
        const current = data.growthBottlenecks || [];
        if (current.includes(item)) {
            updateFields({ growthBottlenecks: current.filter(b => b !== item) });
        } else {
            updateFields({ growthBottlenecks: [...current, item] });
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="mb-12">
                <h2 className="text-4xl md:text-6xl font-serif mb-4">Business Goals & Growth Levers</h2>
                <p className="text-xl md:text-2xl font-light opacity-60 italic">Let’s align creative capital to business capital.</p>
            </div>

            <div className="mb-12">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Top 3 Growth Goals (Quarterly)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {GROWTH_GOALS.map(goal => (
                        <Checkbox
                            key={goal}
                            label={goal}
                            value={goal}
                            checked={data.growthGoals.includes(goal)}
                            onChange={toggleGoal}
                        />
                    ))}
                </div>
            </div>

            <TextArea
                label="Target Audience (Age, Demographics, Context)"
                value={data.targetAudience}
                onChange={e => updateFields({ targetAudience: e.target.value })}
            />

            <div className="mb-12">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Current Bottlenecks</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {BOTTLENECKS.map(item => (
                        <Checkbox
                            key={item}
                            label={item}
                            value={item}
                            checked={data.growthBottlenecks.includes(item)}
                            onChange={toggleBottleneck}
                        />
                    ))}
                </div>
                <TextInput
                    label="Other (Describe)"
                    value={data.growthBottlenecksOther}
                    onChange={e => updateFields({ growthBottlenecksOther: e.target.value })}
                    placeholder="Other bottleneck..."
                />
            </div>
        </div>
    );
}
