import React from 'react';
import { FormData } from '@/app/types';
import { Radio, Checkbox } from '@/app/components/ui/FormElements';

type Props = {
    data: FormData;
    updateFields: (fields: Partial<FormData>) => void;
};

const CAPABILITIES = ["Website", "Mobile-Responsive Design", "Booking System", "SEO Strategy"];
const PURPOSES = ["Portfolio", "Sales Tool", "Ecommerce", "Brand Showcase", "Community Hub"];
const INTERESTS = ["UI/UX Audit", "Full Stack Web Revamp", "Conversion Funnel Design", "Speed Optimization", "Analytics Dashboards"];

export default function Section6({ data, updateFields }: Props) {
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
                <h2 className="text-4xl md:text-6xl font-serif mb-4">Web, UI/UX & Digital Architecture</h2>
                <p className="text-xl md:text-2xl font-light opacity-60 italic">Your website is your first handshake. Let’s make it unforgettable.</p>
            </div>

            <div className="mb-12">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Do you currently have:</label>
                <div className="grid grid-cols-2 gap-4">
                    {CAPABILITIES.map(item => (
                        <Checkbox
                            key={item}
                            label={item}
                            value={item}
                            checked={data.existingDigitalCapabilities.includes(item)}
                            onChange={() => toggleArray('existingDigitalCapabilities', item)}
                        />
                    ))}
                </div>
            </div>

            <div className="mb-12">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Purpose of Your Website</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PURPOSES.map(item => (
                        <Radio
                            key={item}
                            label={item}
                            name="websitePurpose"
                            value={item}
                            checked={data.websitePurpose === item}
                            onChange={(val) => updateFields({ websitePurpose: val })}
                        />
                    ))}
                </div>
            </div>

            <div className="mb-12">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Interested in:</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {INTERESTS.map(item => (
                        <Checkbox
                            key={item}
                            label={item}
                            value={item}
                            checked={data.digitalInterests.includes(item)}
                            onChange={() => toggleArray('digitalInterests', item)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
