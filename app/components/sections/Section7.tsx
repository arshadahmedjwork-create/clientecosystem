import React from 'react';
import { FormData } from '@/app/types';
import { TextInput, Radio, Checkbox, TextArea } from '@/app/components/ui/FormElements';

type Props = {
    data: FormData;
    updateFields: (fields: Partial<FormData>) => void;
};

const NEXT_PHASE = ["Web/App Buildout", "Retainer Marketing", "Monthly Content Packs", "Growth Experiments", "Photography / Asset Bank Creation"];

export default function Section7({ data, updateFields }: Props) {
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
                <h2 className="text-4xl md:text-6xl font-serif mb-4">Opportunity Mapping & Cross-Sell Activation</h2>
                <p className="text-xl md:text-2xl font-light opacity-60 italic">We’re here to build your brand’s operating system.</p>
            </div>

            <div className="mb-12">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Would you like a 360° Brand Performance Audit?</label>
                <div className="flex gap-8">
                    <Radio label="Yes" name="audit" value="Yes" checked={data.wantsAudit === "Yes"} onChange={(val) => updateFields({ wantsAudit: val })} />
                    <Radio label="No" name="audit" value="No" checked={data.wantsAudit === "No"} onChange={(val) => updateFields({ wantsAudit: val })} />
                </div>
            </div>

            <div className="mb-12">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Are there other agencies/freelancers you're working with?</label>
                <div className="flex gap-8 mb-4">
                    <Radio label="Yes" name="agencies" value="Yes" checked={data.workingWithAgencies === "Yes"} onChange={(val) => updateFields({ workingWithAgencies: val })} />
                    <Radio label="No" name="agencies" value="No" checked={data.workingWithAgencies === "No"} onChange={(val) => updateFields({ workingWithAgencies: val })} />
                </div>
                {data.workingWithAgencies === "Yes" && (
                    <TextArea
                        label="If yes, where can we collaborate or replace with better integration?"
                        value={data.workingWithAgenciesDetails}
                        onChange={e => updateFields({ workingWithAgenciesDetails: e.target.value })}
                    />
                )}
            </div>

            <div className="mb-12">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Are you open to a customized service ecosystem bundle?</label>
                <div className="flex gap-8">
                    <Radio label="Yes" name="bundle" value="Yes" checked={data.openToBundle === "Yes"} onChange={(val) => updateFields({ openToBundle: val })} />
                    <Radio label="No" name="bundle" value="No" checked={data.openToBundle === "No"} onChange={(val) => updateFields({ openToBundle: val })} />
                </div>
            </div>

            <div className="mb-12">
                <label className="block text-xs font-bold uppercase tracking-widest mb-4 opacity-70">Services you might consider for the next phase:</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {NEXT_PHASE.map(item => (
                        <Checkbox
                            key={item}
                            label={item}
                            value={item}
                            checked={data.nextPhaseServices.includes(item)}
                            onChange={() => toggleArray('nextPhaseServices', item)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
