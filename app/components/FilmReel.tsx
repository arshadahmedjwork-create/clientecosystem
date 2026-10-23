"use client";

import React, { useEffect, useRef, useState } from 'react';
import { doubtReact } from '@/app/lib/doubt';

// The W&W × QIQ AI five-star film. Plays muted on loop; the vertical cut
// is used on phones.
const FILM = {
    wide: { src: '/film/ww-qiq-film-16x9.mp4', poster: '/film/poster-16x9.jpg' },
    tall: { src: '/film/ww-qiq-film-9x16.mp4', poster: '/film/poster-9x16.jpg' },
};

export default function FilmReel() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [format, setFormat] = useState<'wide' | 'tall' | null>(null);
    const [muted, setMuted] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)');
        const pick = () => setFormat(mq.matches ? 'tall' : 'wide');
        pick();
        mq.addEventListener('change', pick);
        return () => mq.removeEventListener('change', pick);
    }, []);

    const toggleSound = () => {
        const video = videoRef.current;
        if (!video) return;
        const next = !muted;
        video.muted = next;
        setMuted(next);
        if (!next) {
            video.currentTime = 0;
            video.play().catch(() => {});
            doubtReact('nod', 'Ooh, I’m in this one!');
        }
    };

    const film = format ? FILM[format] : null;

    return (
        <figure className={`film reveal-up ${format === 'tall' ? 'film--tall' : ''}`} style={{ animationDelay: '1400ms' }}>
            <div className="film-frame">
                {film && (
                    <video
                        key={film.src}
                        ref={videoRef}
                        className="film-video"
                        src={film.src}
                        poster={film.poster}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        onTimeUpdate={e => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
                    />
                )}
                <button type="button" onClick={toggleSound} className="film-sound" aria-label={muted ? 'Play with sound' : 'Mute'}>
                    {muted ? (
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 5 6 9H3v6h3l5 4V5z" />
                            <path d="m22 9-6 6M16 9l6 6" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 5 6 9H3v6h3l5 4V5z" />
                            <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
                        </svg>
                    )}
                    <span>{muted ? 'Sound on' : 'Sound off'}</span>
                </button>
                <div className="film-progress" style={{ transform: `scaleX(${progress})` }} />
            </div>
            <figcaption className="film-caption">
                <span>W&amp;W × QIQ AI</span>
                <span className="opacity-50">Every idea starts on paper.</span>
            </figcaption>
        </figure>
    );
}
