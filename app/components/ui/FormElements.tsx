"use client";

import React, { useRef } from 'react';
import VoiceRecorder from './VoiceRecorder';
import { doubtReact } from '@/app/lib/doubt';

// STYLES
const LABEL_STYLE = "field-label block text-xs font-bold uppercase tracking-widest mb-4 opacity-70";
const INPUT_STYLE = "field-input w-full bg-transparent border-b border-black py-4 pr-14 text-xl md:text-2xl outline-none placeholder-gray-400 transition-all font-serif";
const TEXTAREA_STYLE = "field-textarea w-full bg-white/70 backdrop-blur-sm border border-black p-4 pb-16 text-lg outline-none min-h-[200px] resize-none transition-all";
const CHECKBOX_CONTAINER = "choice flex items-start cursor-pointer group select-none";
const CHECKBOX_BOX = "choice-box w-6 h-6 border border-black flex items-center justify-center mr-4 transition-all group-hover:bg-gray-100 shrink-0";
const CHECKBOX_CHECKED = "choice-fill w-4 h-4 bg-black";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; voice?: boolean };
type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; voice?: boolean };

// Appends a spoken answer to whatever is already typed, then reports it
// through the field's normal onChange so sections need no changes.
function useVoiceAppend<T extends HTMLInputElement | HTMLTextAreaElement>(value: unknown, onChange?: React.ChangeEventHandler<T>) {
    return (text: string) => {
        const current = typeof value === 'string' ? value.trim() : '';
        const next = current ? `${current} ${text}` : text;
        onChange?.({ target: { value: next }, currentTarget: { value: next } } as unknown as React.ChangeEvent<T>);
    };
}

// A small nod from Doubt when someone finishes typing an answer.
function useAnsweredNod<T extends HTMLInputElement | HTMLTextAreaElement>(onBlur?: React.FocusEventHandler<T>) {
    const startValue = useRef('');
    return {
        onFocus: (e: React.FocusEvent<T>) => { startValue.current = e.target.value; },
        onBlur: (e: React.FocusEvent<T>) => {
            if (e.target.value.trim() && e.target.value !== startValue.current) doubtReact('nod');
            onBlur?.(e);
        },
    };
}

export const TextInput = ({ label, className, voice = true, value, onChange, onBlur, ...props }: InputProps) => {
    const append = useVoiceAppend<HTMLInputElement>(value, onChange);
    const nod = useAnsweredNod<HTMLInputElement>(onBlur);
    return (
        <div className={`field mb-12 ${className ?? ''}`}>
            {label && <label className={LABEL_STYLE}>{label}</label>}
            <div className="relative">
                <input className={INPUT_STYLE} value={value} onChange={onChange} {...nod} {...props} />
                <span className="field-underline" aria-hidden />
                {voice && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                        <VoiceRecorder compact onTranscript={append} />
                    </div>
                )}
            </div>
        </div>
    );
};

export const TextArea = ({ label, className, voice = true, value, onChange, onBlur, ...props }: TextAreaProps) => {
    const append = useVoiceAppend<HTMLTextAreaElement>(value, onChange);
    const nod = useAnsweredNod<HTMLTextAreaElement>(onBlur);
    return (
        <div className={`field mb-12 ${className ?? ''}`}>
            {label && <label className={LABEL_STYLE}>{label}</label>}
            <div className="relative">
                <textarea className={TEXTAREA_STYLE} value={value} onChange={onChange} {...nod} {...props} />
                {voice && (
                    <div className="absolute left-4 bottom-4 right-4">
                        <VoiceRecorder onTranscript={append} />
                    </div>
                )}
            </div>
        </div>
    );
};

export const Checkbox = ({ label, checked, onChange, value }: { label: string, checked?: boolean, onChange?: (val: string) => void, value: string }) => {
    const toggle = () => {
        if (!checked) doubtReact('nod');
        onChange?.(value);
    };
    return (
        <div className={`${CHECKBOX_CONTAINER} ${checked ? 'is-checked' : ''}`} onClick={toggle} role="checkbox" aria-checked={!!checked} tabIndex={0}
            onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } }}>
            <div className={CHECKBOX_BOX}>
                {checked && <div className={CHECKBOX_CHECKED} />}
            </div>
            <span className="choice-label text-lg leading-tight pt-0.5">{label}</span>
            <input type="checkbox" className="hidden" value={value} readOnly checked={checked} />
        </div>
    );
};

export const Radio = ({ label, checked, onChange, value, name }: { label: string, checked?: boolean, onChange?: (val: string) => void, value: string, name: string }) => {
    const select = () => {
        if (!checked) doubtReact('nod');
        onChange?.(value);
    };
    return (
        <div className={`${CHECKBOX_CONTAINER} ${checked ? 'is-checked' : ''}`} onClick={select} role="radio" aria-checked={!!checked} tabIndex={0}
            onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); select(); } }}>
            <div className="choice-box w-6 h-6 border border-black rounded-full flex items-center justify-center mr-4 transition-all shrink-0">
                {checked && <div className="choice-fill w-4 h-4 bg-black rounded-full" />}
            </div>
            <span className="choice-label text-lg leading-tight pt-0.5">{label}</span>
            <input type="radio" name={name} className="hidden" value={value} readOnly checked={checked} />
        </div>
    );
};
