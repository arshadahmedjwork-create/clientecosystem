import React from 'react';
import { FormData } from '@/app/types';
import { TextInput, TextArea, Radio } from '@/app/components/ui/FormElements';

type Props = {
    data: FormData;
    updateFields: (fields: Partial<FormData>) => void;
};

const ARCHETYPES = [
    "Innovator", "Hero", "Creator", "Caregiver", "Ruler", "Explorer", "Sage", "Lover"
];

export default function Section1({ data, updateFields }: Props) {
    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="mb-12">
                <h2 className="text-4xl md:text-6xl font-serif mb-4">Brand Profile & Vision Mapping</h2>
                <p className="text-xl md:text-2xl font-light opacity-60 italic">Let’s understand your brand from its roots to its reach.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <TextInput
                    label="Brand / Company Name"
                    value={data.brandName}
                    onChange={e => updateFields({ brandName: e.target.value })}
                    autoFocus
                />
                <TextInput
                    label="Founded in (Year)"
                    value={data.foundedYear}
                    onChange={e => updateFields({ foundedYear: e.target.value })}
                />
            </div>

            <TextArea
                label="Core Products / Services"
                value={data.coreProducts}
                onChange={e => updateFields({ coreProducts: e.target.value })}
            />

            <TextArea
                label="Your North Star (What does success look like?)"
                value={data.northStar}
                onChange={e => updateFields({ northStar: e.target.value })}
            />

            <div className="mb-12">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Your Brand Archetype</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {ARCHETYPES.map(arch => (
                        <Radio
                            key={arch}
                            label={arch}
                            name="archetype"
                            value={arch}
                            checked={data.brandArchetype === arch}
                            onChange={(val) => updateFields({ brandArchetype: val })}
                        />
                    ))}
                </div>
            </div>

            <TextArea
                label="Key Competitors or Market References"
                value={data.competitors}
                onChange={e => updateFields({ competitors: e.target.value })}
            />
        </div>
    );
}
