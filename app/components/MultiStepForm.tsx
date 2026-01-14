"use client";

import React, { useState } from 'react';
import { FormData, INITIAL_DATA } from '@/app/types';
import Section1 from './sections/Section1';
import Section2 from './sections/Section2';
import Section3 from './sections/Section3';
import Section4 from './sections/Section4';
import Section5 from './sections/Section5';
import Section6 from './sections/Section6';
import Section7 from './sections/Section7';
import Section8 from './sections/Section8';
import { v4 as uuidv4 } from 'uuid'; // Need to install uuid or just generate generic

export default function MultiStepForm() {
    const [data, setData] = useState<FormData>(INITIAL_DATA);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

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

    const nextStep = () => {
        if (!validateStep(currentStep)) {
            setError('Please fill in all fields to proceed.');
            window.scrollTo(0, document.body.scrollHeight);
            return;
        }
        setError('');

        if (currentStep < 8) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        } else {
            handleSubmit();
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo(0, 0);
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
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8 text-center animate-in fade-in duration-1000">
                <h1 className="text-5xl md:text-8xl font-serif mb-8">Welcome.</h1>
                <p className="text-xl md:text-3xl font-light opacity-80 mb-12">You’re entering our ecosystem.</p>
                <div className="w-24 h-px bg-white/30 mx-auto"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black flex flex-col relative selection:bg-black selection:text-white">
            {/* Header / Progress */}
            {/* Header / Progress */}
            <header className="fixed top-0 left-0 w-full p-6 md:p-12 z-50 flex justify-end items-start pointer-events-none">
                <div className="text-4xl md:text-6xl font-serif mix-blend-difference text-white">
                    0{currentStep} <span className="text-xl opacity-50 font-sans">/ 08</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center p-6 md:p-24 pt-32 md:pt-48 pb-32">
                <div className="w-full max-w-5xl relative">
                    {currentStep === 1 && <Section1 data={data} updateFields={updateFields} />}
                    {currentStep === 2 && <Section2 data={data} updateFields={updateFields} />}
                    {currentStep === 3 && <Section3 data={data} updateFields={updateFields} />}
                    {currentStep === 4 && <Section4 data={data} updateFields={updateFields} />}
                    {currentStep === 5 && <Section5 data={data} updateFields={updateFields} />}
                    {currentStep === 6 && <Section6 data={data} updateFields={updateFields} />}
                    {currentStep === 7 && <Section7 data={data} updateFields={updateFields} />}
                    {currentStep === 8 && <Section8 data={data} updateFields={updateFields} />}

                    {error && <div className="text-red-500 mt-8 font-bold">{error}</div>}
                </div>
            </main>

            {/* Navigation Footer */}
            <footer className="fixed bottom-0 left-0 w-full p-6 md:p-12 z-40 flex justify-between items-end bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`pointer-events-auto px-8 py-4 uppercase text-xs font-bold tracking-widest hover:opacity-50 transition-opacity ${currentStep === 1 ? 'opacity-0' : 'opacity-100'}`}
                >
                    Back
                </button>

                <button
                    onClick={nextStep}
                    disabled={isSubmitting}
                    className="pointer-events-auto bg-black text-white px-12 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center"
                >
                    {isSubmitting ? 'Processing...' : (currentStep === 8 ? 'Enter Ecosystem' : 'Next Step')}
                </button>
            </footer>
        </div>
    );
}
