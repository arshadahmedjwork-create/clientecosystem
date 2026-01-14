import React from 'react';

// STYLES
const LABEL_STYLE = "block text-xs font-bold uppercase tracking-widest mb-4 opacity-70";
const INPUT_STYLE = "w-full bg-transparent border-b border-black py-4 text-xl md:text-2xl outline-none placeholder-gray-400 focus:border-b-2 transition-all font-serif";
const TEXTAREA_STYLE = "w-full bg-transparent border border-black p-4 text-lg outline-none min-h-[200px] resize-none focus:ring-1 focus:ring-black transition-all";
const CHECKBOX_CONTAINER = "flex items-start cursor-pointer group hover:opacity-70 transition-opacity";
const CHECKBOX_BOX = "w-6 h-6 border border-black flex items-center justify-center mr-4 transition-all group-hover:bg-gray-100 shrink-0";
const CHECKBOX_CHECKED = "w-4 h-4 bg-black";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label?: string };
type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string };

export const TextInput = ({ label, className, ...props }: InputProps) => (
    <div className={`mb-12 ${className}`}>
        {label && <label className={LABEL_STYLE}>{label}</label>}
        <input className={INPUT_STYLE} {...props} />
    </div>
);

export const TextArea = ({ label, className, ...props }: TextAreaProps) => (
    <div className={`mb-12 ${className}`}>
        {label && <label className={LABEL_STYLE}>{label}</label>}
        <textarea className={TEXTAREA_STYLE} {...props} />
    </div>
);

export const Checkbox = ({ label, checked, onChange, value }: { label: string, checked?: boolean, onChange?: (val: string) => void, value: string }) => {
    return (
        <div className={CHECKBOX_CONTAINER} onClick={() => onChange && onChange(value)}>
            <div className={CHECKBOX_BOX}>
                {checked && <div className={CHECKBOX_CHECKED} />}
            </div>
            <span className="text-lg leading-tight pt-0.5">{label}</span>
            <input type="checkbox" className="hidden" value={value} readOnly checked={checked} />
        </div>
    );
};

export const Radio = ({ label, checked, onChange, value, name }: { label: string, checked?: boolean, onChange?: (val: string) => void, value: string, name: string }) => {
    return (
        <div className={CHECKBOX_CONTAINER} onClick={() => onChange && onChange(value)}>
            <div className={`w-6 h-6 border border-black rounded-full flex items-center justify-center mr-4 transition-all shrink-0`}>
                {checked && <div className="w-4 h-4 bg-black rounded-full" />}
            </div>
            <span className="text-lg leading-tight pt-0.5">{label}</span>
            <input type="radio" name={name} className="hidden" value={value} readOnly checked={checked} />
        </div>
    );
};
