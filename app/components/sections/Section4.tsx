import React from 'react';
import { FormData } from '@/app/types';
import { Radio, Checkbox } from '@/app/components/ui/FormElements';

type Props = {
    data: FormData;
    updateFields: (fields: Partial<FormData>) => void;
};

const CHANNELS = ["Instagram", "LinkedIn", "YouTube", "WhatsApp", "Email", "Offline"];
const EXPLORE = ["Paid Media Strategy", "Performance Marketing", "Influencer Outreach", "Email Automation", "Funnel Mapping", "CRM Integration"];
const STYLES = ["Community-Driven", "Product-Led", "Story-Driven", "Awareness First", "Performance-First"];

export default function Section4({ data, updateFields }: Props) {
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
                <h2 className="text-4xl md:text-6xl font-serif mb-4">Strategic Marketing & Demand Gen</h2>
                <p className="text-xl md:text-2xl font-light opacity-60 italic">We don’t just run campaigns — we craft conversions.</p>
            </div>

            <div className="mb-12">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Active Channels</label>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {CHANNELS.map(item => (
                        <Checkbox
                            key={item}
                            label={item}
                            value={item}
                            checked={data.activeChannels.includes(item)}
                            onChange={() => toggleArray('activeChannels', item)}
                        />
                    ))}
                </div>
            </div>

            <div className="mb-12">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Would you like to explore:</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {EXPLORE.map(item => (
                        <Checkbox
                            key={item}
                            label={item}
                            value={item}
                            checked={data.marketingExplorations.includes(item)}
                            onChange={() => toggleArray('marketingExplorations', item)}
                        />
                    ))}
                </div>
            </div>

            <div className="mb-12">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Marketing Strategy Style</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {STYLES.map(item => (
                        <Radio
                            key={item}
                            label={item}
                            name="strategy"
                            value={item}
                            checked={data.marketingStrategyStyle === item}
                            onChange={(val) => updateFields({ marketingStrategyStyle: val })}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
