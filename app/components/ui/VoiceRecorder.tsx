"use client";

import React, { useEffect, useRef, useState } from 'react';
import { doubtReact } from '@/app/lib/doubt';

type Status = 'idle' | 'recording' | 'transcribing';

const MAX_SECONDS = 180;
const BAR_COUNT = 14;

// Minimal typing for the browser SpeechRecognition API (not in lib.dom yet).
type SpeechRecognitionLike = {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
    start: () => void;
    stop: () => void;
    abort: () => void;
};

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
    if (typeof window === 'undefined') return null;
    const w = window as unknown as Record<string, unknown>;
    return (w.SpeechRecognition || w.webkitSpeechRecognition || null) as (new () => SpeechRecognitionLike) | null;
}

function formatTime(s: number) {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * Mic button that records a spoken answer, transcribes it with Whisper
 * (via /api/transcribe) and falls back to the browser's live speech
 * recognition when Whisper isn't configured.
 */
export default function VoiceRecorder({ onTranscript, compact = false }: { onTranscript: (text: string) => void; compact?: boolean }) {
    const [status, setStatus] = useState<Status>('idle');
    const [seconds, setSeconds] = useState(0);
    const [live, setLive] = useState('');
    const [notice, setNotice] = useState('');

    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const rafRef = useRef<number>(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const barsRef = useRef<HTMLSpanElement[]>([]);
    const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
    const recognitionDoneRef = useRef<Promise<void>>(Promise.resolve());
    const speechTextRef = useRef('');
    const cancelledRef = useRef(false);

    const teardown = () => {
        cancelAnimationFrame(rafRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        audioCtxRef.current?.close().catch(() => {});
        audioCtxRef.current = null;
    };

    useEffect(() => () => {
        cancelledRef.current = true;
        recognitionRef.current?.abort();
        if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
        teardown();
    }, []);

    useEffect(() => {
        if (!notice) return;
        const t = setTimeout(() => setNotice(''), 4000);
        return () => clearTimeout(t);
    }, [notice]);

    useEffect(() => {
        if (status === 'recording' && seconds >= MAX_SECONDS) stop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seconds, status]);

    const startLevels =(stream: MediaStream) => {
        try {
            const ctx = new AudioContext();
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64;
            ctx.createMediaStreamSource(stream).connect(analyser);
            audioCtxRef.current = ctx;
            const data = new Uint8Array(analyser.frequencyBinCount);
            const tick = () => {
                analyser.getByteFrequencyData(data);
                barsRef.current.forEach((bar, i) => {
                    if (!bar) return;
                    const v = data[(i * 2 + 1) % data.length] / 255;
                    bar.style.transform = `scaleY(${0.15 + v * 0.85})`;
                });
                rafRef.current = requestAnimationFrame(tick);
            };
            tick();
        } catch {
            // Level meter is decoration only.
        }
    };

    const startSpeech = () => {
        const SR = getSpeechRecognition();
        speechTextRef.current = '';
        if (!SR) return;
        const rec = new SR();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = navigator.language || 'en-US';
        let finalText = '';
        rec.onresult = e => {
            let interim = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                const r = e.results[i];
                if (r.isFinal) finalText += r[0].transcript + ' ';
                else interim += r[0].transcript;
            }
            speechTextRef.current = finalText.trim();
            setLive((finalText + interim).trim());
        };
        recognitionDoneRef.current = new Promise(resolve => {
            rec.onend = () => resolve();
            rec.onerror = () => resolve();
        });
        try {
            rec.start();
            recognitionRef.current = rec;
        } catch {
            recognitionRef.current = null;
        }
    };

    const start = async () => {
        if (status !== 'idle') return;
        if (!navigator.mediaDevices?.getUserMedia) {
            setNotice('Voice input isn’t supported in this browser.');
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            cancelledRef.current = false;
            chunksRef.current = [];
            setLive('');
            setSeconds(0);

            if (typeof MediaRecorder !== 'undefined') {
                const recorder = new MediaRecorder(stream);
                recorder.ondataavailable = e => e.data.size && chunksRef.current.push(e.data);
                recorder.start();
                recorderRef.current = recorder;
            }

            startSpeech();
            startLevels(stream);
            timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
            setStatus('recording');
            doubtReact('listen');
        } catch {
            teardown();
            setNotice('Mic access was blocked. Allow it in your browser to speak answers.');
            doubtReact('oops', 'I can’t hear you!');
        }
    };

    const stopRecorder = () =>
        new Promise<Blob | null>(resolve => {
            const recorder = recorderRef.current;
            if (!recorder || recorder.state === 'inactive') return resolve(null);
            recorder.onstop = () => resolve(new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' }));
            recorder.stop();
        });

    const transcribe = async (blob: Blob | null) => {
        if (!blob || blob.size < 1000) return '';
        try {
            const body = new FormData();
            body.append('audio', blob);
            const res = await fetch('/api/transcribe', { method: 'POST', body });
            if (!res.ok) return '';
            const json = await res.json();
            return (json.text as string) || '';
        } catch {
            return '';
        }
    };

    async function stop() {
        if (timerRef.current) clearInterval(timerRef.current);
        setStatus('transcribing');
        doubtReact('thinking');

        recognitionRef.current?.stop();
        const blob = await stopRecorder();
        teardown();

        const [whisperText] = await Promise.all([
            transcribe(blob),
            Promise.race([recognitionDoneRef.current, new Promise(r => setTimeout(r, 1500))]),
        ]);
        recognitionRef.current = null;
        if (cancelledRef.current) return;

        const text = (whisperText || speechTextRef.current || '').trim();
        setStatus('idle');
        setLive('');
        if (text) {
            onTranscript(text);
            doubtReact('answer');
        } else {
            setNotice('Didn’t catch that. Give it another go?');
            doubtReact('oops', 'Didn’t catch that…');
        }
    }

    const cancel = () => {
        cancelledRef.current = true;
        recognitionRef.current?.abort();
        recognitionRef.current = null;
        if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
        teardown();
        setStatus('idle');
        setLive('');
        doubtReact('oops', 'Scrapped. No worries.');
    };

    return (
        <div className={`voice ${compact ? 'voice--compact' : ''}`}>
            {status === 'idle' && (
                <button type="button" onClick={start} className="voice-mic" aria-label="Record your answer" title="Speak your answer">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <rect x="9" y="3" width="6" height="12" rx="3" />
                        <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                    </svg>
                    {!compact && <span className="voice-mic-label">Speak</span>}
                </button>
            )}

            {status === 'recording' && (
                <div className="voice-pill" role="status" aria-live="polite">
                    <span className="voice-dot" />
                    <span className="voice-bars" aria-hidden>
                        {Array.from({ length: BAR_COUNT }).map((_, i) => (
                            <span key={i} ref={el => { if (el) barsRef.current[i] = el; }} />
                        ))}
                    </span>
                    <span className="voice-time">{formatTime(seconds)}</span>
                    <button type="button" onClick={cancel} className="voice-ghost" aria-label="Discard recording">✕</button>
                    <button type="button" onClick={stop} className="voice-stop" aria-label="Stop and transcribe">
                        <span />
                    </button>
                </div>
            )}

            {status === 'transcribing' && (
                <div className="voice-pill voice-pill--busy" role="status">
                    <span className="voice-spinner" />
                    <span className="voice-time">Transcribing…</span>
                </div>
            )}

            {status === 'recording' && live && <div className="voice-live">“{live}”</div>}
            {notice && <div className="voice-notice">{notice}</div>}
        </div>
    );
}
