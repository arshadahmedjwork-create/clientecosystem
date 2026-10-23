"use client";

import React, { useEffect, useRef } from 'react';

// Ambient motion layer behind the form: drifting blobs with mouse parallax,
// a giant outlined step number and a slow marquee of the studio mantra.
export default function Backdrop({ step }: { step: number }) {
    const layerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let frame = 0;
        const onMove = (e: PointerEvent) => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const x = e.clientX / window.innerWidth - 0.5;
                const y = e.clientY / window.innerHeight - 0.5;
                layerRef.current?.style.setProperty('--px', x.toFixed(3));
                layerRef.current?.style.setProperty('--py', y.toFixed(3));
            });
        };
        window.addEventListener('pointermove', onMove);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('pointermove', onMove);
        };
    }, []);

    const mantra = 'Build Brands · Craft Stories · Engineer Growth · ';

    return (
        <div ref={layerRef} className="backdrop" aria-hidden>
            <div className="backdrop-grid" />
            <div className="blob blob--a" />
            <div className="blob blob--b" />
            <div className="blob blob--c" />
            <div key={step} className="backdrop-number">{String(step).padStart(2, '0')}</div>
            <div className="backdrop-marquee">
                <div className="backdrop-marquee-track">
                    <span>{mantra.repeat(4)}</span>
                    <span>{mantra.repeat(4)}</span>
                </div>
            </div>
            <div className="backdrop-grain" />
        </div>
    );
}
