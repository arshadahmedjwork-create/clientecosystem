import React from 'react';
import { FormData } from '@/app/types';
import { TextArea } from '@/app/components/ui/FormElements';

type Props = {
    data: FormData;
    updateFields: (fields: Partial<FormData>) => void;
};

export default function Section8({ data, updateFields }: Props) {
    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="mb-12">
                <h2 className="text-4xl md:text-6xl font-serif mb-4">Feedback & Vision Expansion</h2>
                <p className="text-xl md:text-2xl font-light opacity-60 italic">Let’s build long-term. With honesty.</p>
            </div>

            <TextArea
                label="What would make you 10/10 satisfied?"
                value={data.satisfactionDefinition}
                onChange={e => updateFields({ satisfactionDefinition: e.target.value })}
            />

            <TextArea
                label="What part of your business do you feel no one is helping you solve yet? (200-word)"
                className="min-h-[300px]"
                value={data.unsolvedProblems}
                onChange={e => updateFields({ unsolvedProblems: e.target.value })}
            />
        </div>
    );
}
