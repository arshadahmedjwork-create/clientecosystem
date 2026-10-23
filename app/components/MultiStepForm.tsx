"use client";

import React, { useEffect, useState } from 'react';
import { FormData, INITIAL_DATA } from '@/app/types';
import Section1 from './sections/Section1';
import Section2 from './sections/Section2';
import Section3 from './sections/Section3';
import Section4 from './sections/Section4';
import Section5 from './sections/Section5';
import Section6 from './sections/Section6';
import Section7 from './sections/Section7';
import Section8 from './sections/Section8';
import Doubt from './Doubt';
import Backdrop from './Backdrop';
import { doubtReact } from '@/app/lib/doubt';

const TOTAL_STEPS = 8;

const STEP_TITLES = [
    'Brand Profile',
    'Goals & Growth',
    'Brand Assets',
    'Marketing',
    'Content & Production',
    'Digital',
    'Partnership',
    'Vision',
];

const STEP_LINES: Record<number, string> = {
    2: 'One down. You’re a natural.',
    4: 'Halfway there. Look at you!',
    6: 'Home stretch vibes.',
    8: 'Last one. Make it count!',
};

export default function MultiStepForm() {
    const [data, setData] = useState<FormData>(INITIAL_DATA);
    const [started, setStarted] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState<'forward' | 'back'>('forward');
    const [curtain, setCurtain] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [errorKey, setErrorKey] = useState(0);

    const updateFields = (fields: Partial<FormData>) => {
        setData(prev => ({ ...prev, ...fields }));
    };

    const validateStep = (step: number) => {
        switch (step) {
            case 1:
                return data.brandName && data.foundedYear && data.coreProducts && data.northStar && data.brandArchetype && data.competitors;
            case 2:
                // Require at least one growth goal, target audience, and at least one bottleneck (or other)
                return data.growthGoals.length > 0 && data.targetAudience && (data.growthBottlenecks.length > 0 || data.growthBottlenecksOther);
            case 3:
                return data.existingAssets.length > 0 && data.assetsConsistency && data.brandTone.length > 0 && data.explorationInterests.length > 0;
            case 4:
                return data.activeChannels.length > 0 && data.marketingExplorations.length > 0 && data.marketingStrategyStyle;
            case 5:
                return data.priorityContentTypes.length > 0 && data.productionStylePreference && data.preProductionNeeds.length > 0 && data.postProductionEnhancements.length > 0;
            case 6:
                return data.existingDigitalCapabilities.length > 0 && data.websitePurpose && data.digitalInterests.length > 0;
            case 7:
                // workingWithAgenciesDetails is only required if workingWithAgencies is yes?
                // Simple check: just ensure the main toggles/inputs are there.
                // Assuming "workingWithAgencies" is "Yes"/"No".
                return data.wantsAudit && data.workingWithAgencies && data.openToBundle && data.nextPhaseServices.length > 0;
            case 8:
                return data.satisfactionDefinition && data.unsolvedProblems;
            default:
                return true;
        }
    };

    // Curtain wipe between sections: cover, swap the step underneath, reveal.
    const goTo = (step: number, dir: 'forward' | 'back') => {
        setDirection(dir);
        setCurtain(step);
        setTimeout(() => {
            setCurrentStep(step);
            window.scrollTo(0, 0);
        }, 550);
        setTimeout(() => setCurtain(null), 1150);
    };

    const nextStep = () => {
        if (curtain !== null) return;
        if (!validateStep(currentStep)) {
            setError('Please fill in all fields to proceed.');
            setErrorKey(k => k + 1);
            doubtReact('oops');
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            return;
        }
        setError('');

        if (currentStep < TOTAL_STEPS) {
            const next = currentStep + 1;
            goTo(next, 'forward');
            setTimeout(() => doubtReact('step', STEP_LINES[next]), 1100);
        } else {
            handleSubmit();
        }
    };

    const prevStep = () => {
        if (currentStep > 1 && curtain === null) {
            setError('');
            goTo(currentStep - 1, 'back');
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');

        try {
            // Prepare payload
            const payload = {
                ...data,
                submissionId: crypto.randomUUID(),
                timestamp: new Date().toISOString(),
            };

            const res = await fetch('/api/submit-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error('Submission failed');
            }

            setIsSubmitted(true);
            window.scrollTo(0, 0);
        } catch (err) {
            setError('Something went wrong. Please try again.');
            setErrorKey(k => k + 1);
            doubtReact('oops', 'Uh-oh. Let’s try that again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (isSubmitted) {
            const t = setTimeout(() => doubtReact('party', `Welcome in${data.brandName ? `, ${data.brandName}` : ''}!`), 600);
            return () => clearTimeout(t);
        }
    }, [isSubmitted, data.brandName]);

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8 text-center relative overflow-hidden">
                <div className="finale-rays" aria-hidden />
                <div className="finale-confetti" aria-hidden>
                    {Array.from({ length: 40 }).map((_, i) => (
                        <span key={i} style={{ '--i': i, left: `${(i * 37) % 100}%` } as React.CSSProperties} />
                    ))}
                </div>
                <h1 className="finale-title text-6xl md:text-9xl font-serif mb-8 relative">
                    {'Welcome.'.split('').map((ch, i) => (
                        <span key={i} style={{ animationDelay: `${200 + i * 70}ms` }}>{ch}</span>
                    ))}
                </h1>
                <p className="reveal-up text-xl md:text-3xl font-light opacity-80 mb-12 relative" style={{ animationDelay: '900ms' }}>
                    You’re entering our ecosystem.
                </p>
                <div className="finale-line w-24 h-px bg-white/50 mx-auto relative" />
                <Doubt />
            </div>
        );
    }

    if (!started) {
        return (
            <div className="min-h-screen relative overflow-hidden bg-white text-black flex items-center justify-center p-6">
                <Backdrop step={0} />
                <div className="relative z-10 max-w-4xl text-center">
                    <p className="reveal-up text-xs font-bold uppercase tracking-[0.4em] opacity-60 mb-8" style={{ animationDelay: '100ms' }}>
                        Client Growth Ecosystem
                    </p>
                    <h1 className="intro-title text-5xl md:text-8xl font-serif leading-[1.05] mb-10">
                        {['Let’s', 'build', 'something', 'unforgettable.'].map((w, i) => (
                            <span key={w} className="intro-word" style={{ animationDelay: `${250 + i * 140}ms` }}>
                                <span>{w}</span>
                            </span>
                        ))}
                    </h1>
                    <p className="reveal-up text-lg md:text-2xl font-light opacity-70 mb-4" style={{ animationDelay: '900ms' }}>
                        8 short chapters. About 10 minutes.
                    </p>
                    <p className="reveal-up text-base md:text-lg opacity-60 mb-14 flex items-center justify-center gap-2" style={{ animationDelay: '1050ms' }}>
                        <span className="intro-mic">
                            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <rect x="9" y="3" width="6" height="12" rx="3" />
                                <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                            </svg>
                        </span>
                        Hate typing? Tap the mic on any answer and just talk.
                    </p>
                    <button
                        onClick={() => { setStarted(true); setTimeout(() => doubtReact('step', 'Let’s go!'), 400); }}
                        className="btn-primary reveal-up bg-black text-white px-14 py-5 text-xs font-bold uppercase tracking-widest"
                        style={{ animationDelay: '1200ms' }}
                    >
                        <span>Let’s begin</span>
                        <span className="btn-arrow">→</span>
                    </button>
                </div>
                <Doubt />
            </div>
        );
    }

    const progress = ((currentStep - 1) / TOTAL_STEPS) * 100;

    return (
        <div className="min-h-screen bg-white text-black flex flex-col relative selection:bg-black selection:text-white overflow-x-hidden">
            <Backdrop step={currentStep} />

            {/* Progress bar */}
            <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-black/5">
                <div className="progress-fill h-full bg-black" style={{ width: `${progress}%` }} />
            </div>

            {/* Header / Progress */}
            <header className="fixed top-0 left-0 w-full p-6 md:p-12 z-50 flex justify-end items-start pointer-events-none">
                <div className="text-right">
                    <div className="text-4xl md:text-6xl font-serif text-black overflow-hidden">
                        <span key={currentStep} className="inline-block counter-roll">0{currentStep}</span> <span className="text-xl opacity-50 font-sans">/ 08</span>
                    </div>
                    <div className="hidden md:flex gap-1.5 justify-end mt-3">
                        {STEP_TITLES.map((title, i) => (
                            <span
                                key={title}
                                title={title}
                                className={`step-dot ${i + 1 < currentStep ? 'is-done' : ''} ${i + 1 === currentStep ? 'is-active' : ''}`}
                            />
                        ))}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center p-6 md:p-24 pt-32 md:pt-48 pb-48 relative z-10">
                <div key={currentStep} className={`w-full max-w-5xl relative step-enter step-enter--${direction}`}>
                    {currentStep === 1 && <Section1 data={data} updateFields={updateFields} />}
                    {currentStep === 2 && <Section2 data={data} updateFields={updateFields} />}
                    {currentStep === 3 && <Section3 data={data} updateFields={updateFields} />}
                    {currentStep === 4 && <Section4 data={data} updateFields={updateFields} />}
                    {currentStep === 5 && <Section5 data={data} updateFields={updateFields} />}
                    {currentStep === 6 && <Section6 data={data} updateFields={updateFields} />}
                    {currentStep === 7 && <Section7 data={data} updateFields={updateFields} />}
                    {currentStep === 8 && <Section8 data={data} updateFields={updateFields} />}

                    {error && <div key={errorKey} className="error-shake text-red-500 mt-8 font-bold">{error}</div>}
                </div>
            </main>

            {/* Section curtain */}
            {curtain !== null && (
                <div className={`curtain curtain--${direction}`} aria-hidden>
                    <div className="curtain-inner">
                        <span className="curtain-num font-serif">0{curtain}</span>
                        <span className="curtain-title">{STEP_TITLES[curtain - 1]}</span>
                    </div>
                </div>
            )}

            {/* Navigation Footer */}
            <footer className="fixed bottom-0 left-0 w-full p-6 md:p-12 z-40 flex justify-between items-end bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`btn-back pointer-events-auto px-8 py-4 uppercase text-xs font-bold tracking-widest transition-opacity ${currentStep === 1 ? 'opacity-0' : 'opacity-100'}`}
                >
                    <span className="btn-arrow-back">←</span> Back
                </button>

                <button
                    onClick={nextStep}
                    disabled={isSubmitting}
                    className="btn-primary pointer-events-auto bg-black text-white px-12 py-4 text-xs font-bold uppercase tracking-widest disabled:opacity-50 flex items-center"
                >
                    <span>{isSubmitting ? 'Processing...' : (currentStep === 8 ? 'Enter Ecosystem' : 'Next Step')}</span>
                    {!isSubmitting && <span className="btn-arrow">→</span>}
                </button>
            </footer>

            <Doubt />
        </div>
    );
}
