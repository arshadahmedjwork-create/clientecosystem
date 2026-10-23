"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DOUBT_EVENT, DoubtMood, pick } from '@/app/lib/doubt';

// Doubt: the W&W question-mark mascot, redrawn as a living vector.
// Listens for doubtReact() events and performs a trick for each one.

const TRICKS = ['jump', 'spin', 'wave', 'dance', 'flip', 'dash', 'grow', 'wobble'] as const;
type Trick = typeof TRICKS[number] | 'nod' | 'listen' | 'think' | 'shake' | 'party' | 'sleep';

const LINES: Record<DoubtMood, string[]> = {
    answer: ['Ooh, that’s gold.', 'Got every word.', 'Say less. Noted!', 'Chef’s kiss.', 'Now we’re talking.', 'Love that energy.', 'Writing it in ink.', 'That’s the good stuff.'],
    nod: ['Nice.', 'Noted.', 'Good pick.', 'Mm-hmm.', 'Ooh.', 'Smart.'],
    listen: ['I’m all ears…', 'Go on, I’m listening.', 'Take your time.'],
    thinking: ['Hmm, writing that down…', 'Scribbling…', 'Decoding genius…'],
    step: ['Onwards!', 'Chapter done. Next!', 'You’re flying.', 'Look at you go.'],
    oops: ['Missed a spot!', 'Almost — a few blanks left.'],
    party: ['Welcome in!'],
};

const CLICK_LINES = ['Hey! That tickles.', 'I’m Doubt. I clear them up.', 'Psst — you can speak your answers.', 'Boop.', 'Ask me anything. Kidding, I ask.'];

const SYMBOLS: Partial<Record<Trick, string>> = {
    listen: '♪', think: '…', dance: '♫', party: '★', sleep: 'z', grow: '!', jump: '!', spin: '!', wave: '♥', flip: '!', dash: '!', wobble: '?', shake: '?!',
};

let greeted = false;

type Particle = { id: number; x: number; y: number; r: number; kind: number; delay: number };

export default function Doubt() {
    const [trick, setTrick] = useState<Trick | null>(null);
    const [line, setLine] = useState('');
    const [particles, setParticles] = useState<Particle[]>([]);
    const [trickKey, setTrickKey] = useState(0);
    const rootRef = useRef<HTMLDivElement>(null);
    const eyesRef = useRef<SVGGElement>(null);
    const trickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lineTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const sustained = useRef(false); // listen / think hold until replaced
    const lastNod = useRef(0);
    const particleId = useRef(0);

    const say = useCallback((text: string, ms = 2600) => {
        if (lineTimer.current) clearTimeout(lineTimer.current);
        setLine(text);
        lineTimer.current = setTimeout(() => setLine(''), ms);
    }, []);

    const burst = useCallback((count: number) => {
        const fresh = Array.from({ length: count }, () => {
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.4;
            const dist = 60 + Math.random() * 90;
            return {
                id: particleId.current++,
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist,
                r: Math.random() * 540 - 270,
                kind: Math.floor(Math.random() * 4),
                delay: Math.random() * 120,
            };
        });
        setParticles(p => [...p, ...fresh]);
        const ids = new Set(fresh.map(f => f.id));
        setTimeout(() => setParticles(p => p.filter(x => !ids.has(x.id))), 1400);
    }, []);

    const perform = useCallback((next: Trick, duration: number, hold = false) => {
        if (trickTimer.current) clearTimeout(trickTimer.current);
        sustained.current = hold;
        setTrick(next);
        setTrickKey(k => k + 1);
        if (!hold) trickTimer.current = setTimeout(() => setTrick(null), duration);
    }, []);

    const resetIdle = useCallback(() => {
        if (idleTimer.current) clearTimeout(idleTimer.current);
        idleTimer.current = setTimeout(() => {
            if (!sustained.current) {
                perform('sleep', 0, true);
                sustained.current = false;
            }
        }, 25000);
    }, [perform]);

    useEffect(() => {
        const onReact = (e: Event) => {
            const { mood, line: custom } = (e as CustomEvent<{ mood: DoubtMood; line?: string }>).detail;
            resetIdle();
            switch (mood) {
                case 'listen':
                    perform('listen', 0, true);
                    say(custom || pick(LINES.listen), 2200);
                    break;
                case 'thinking':
                    perform('think', 0, true);
                    say(custom || pick(LINES.thinking), 6000);
                    break;
                case 'answer': {
                    const t = pick(TRICKS);
                    perform(t, t === 'dash' ? 1800 : 1300);
                    say(custom || pick(LINES.answer));
                    burst(14);
                    break;
                }
                case 'nod': {
                    const now = Date.now();
                    if (sustained.current || now - lastNod.current < 700) return;
                    lastNod.current = now;
                    perform('nod', 600);
                    if (Math.random() < 0.35) say(custom || pick(LINES.nod), 1400);
                    burst(4);
                    break;
                }
                case 'step':
                    perform(pick(['flip', 'spin', 'jump'] as const), 1300);
                    say(custom || pick(LINES.step));
                    burst(18);
                    break;
                case 'oops':
                    perform('shake', 700);
                    say(custom || pick(LINES.oops));
                    break;
                case 'party':
                    perform('party', 0, true);
                    say(custom || pick(LINES.party), 4000);
                    burst(30);
                    break;
            }
        };
        window.addEventListener(DOUBT_EVENT, onReact);
        return () => window.removeEventListener(DOUBT_EVENT, onReact);
    }, [perform, say, burst, resetIdle]);

    // Wake up on any activity; eyes follow the cursor.
    useEffect(() => {
        let frame = 0;
        const onMove = (e: PointerEvent) => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const el = rootRef.current;
                const eyes = eyesRef.current;
                if (!el || !eyes) return;
                const box = el.getBoundingClientRect();
                const dx = e.clientX - (box.left + box.width / 2);
                const dy = e.clientY - (box.top + box.height * 0.35);
                const d = Math.hypot(dx, dy) || 1;
                const m = Math.min(3, d / 60);
                eyes.style.transform = `translate(${(dx / d) * m}px, ${(dy / d) * m}px)`;
            });
        };
        const onActivity = () => {
            setTrick(t => (t === 'sleep' ? null : t));
            resetIdle();
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerdown', onActivity);
        window.addEventListener('keydown', onActivity);
        window.addEventListener('scroll', onActivity, { passive: true });
        resetIdle();
        const hello = greeted ? undefined : setTimeout(() => { greeted = true; perform('wave', 1300); say('Hi! I’m Doubt. Tap the mic to talk.', 3600); }, 1200);
        return () => {
            cancelAnimationFrame(frame);
            clearTimeout(hello);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerdown', onActivity);
            window.removeEventListener('keydown', onActivity);
            window.removeEventListener('scroll', onActivity);
        };
    }, [perform, say, resetIdle]);

    const onPoke = () => {
        perform(pick(TRICKS), 1300);
        say(pick(CLICK_LINES));
        burst(8);
    };

    const symbol = (trick && SYMBOLS[trick]) || '?';

    return (
        <div ref={rootRef} className="doubt-wrap" aria-live="polite">
            {line && <div key={line} className="doubt-bubble">{line}</div>}

            <div className="doubt-particles" aria-hidden>
                {particles.map(p => (
                    <span
                        key={p.id}
                        className={`doubt-particle doubt-particle--${p.kind}`}
                        style={{ '--x': `${p.x}px`, '--y': `${p.y}px`, '--r': `${p.r}deg`, animationDelay: `${p.delay}ms` } as React.CSSProperties}
                    />
                ))}
            </div>

            <button type="button" onClick={onPoke} className="doubt-hit" aria-label="Doubt, the W&W mascot">
                <div key={trickKey} className={`doubt ${trick ? `doubt--${trick}` : ''}`}>
                    <svg viewBox="0 0 120 170" className="doubt-svg" fill="none" stroke="#000" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                        {/* thought mark */}
                        <g className="doubt-mark">
                            <text x="60" y="26" textAnchor="middle" fontSize="28" fontFamily="Inter, system-ui, sans-serif" fontWeight="500" fill="#000" stroke="none">{symbol}</text>
                        </g>

                        {/* listening rings */}
                        <g className="doubt-rings">
                            <path d="M86 46 a14 14 0 0 1 0 20" />
                            <path d="M92 40 a22 22 0 0 1 0 32" />
                        </g>

                        <g className="doubt-body">
                            {/* legs */}
                            <g className="doubt-legs">
                                <path className="doubt-leg-l" d="M50 140 L50 158 L44 160" />
                                <path className="doubt-leg-r" d="M70 140 L70 158 L76 160" />
                            </g>

                            {/* shorts */}
                            <path d="M36 120 H84 V142 H63 L60 132 L57 142 H36 Z" fill="#000" />

                            {/* torso / sweater */}
                            <path d="M38 76 Q60 68 82 76 Q92 80 92 92 V122 H28 V92 Q28 80 38 76 Z" fill="#fff" />
                            <path d="M44 92 V120 M76 92 V120" />

                            {/* arms */}
                            <g className="doubt-arm-l">
                                <path d="M32 82 Q20 86 20 100 V126 Q20 132 26 132 Q32 132 32 126 V96" fill="#fff" />
                            </g>
                            <g className="doubt-arm-r">
                                <path d="M88 82 Q100 86 100 100 V126 Q100 132 94 132 Q88 132 88 126 V96" fill="#fff" />
                            </g>

                            {/* head */}
                            <g className="doubt-head">
                                <circle cx="60" cy="54" r="19" fill="#fff" />
                                <g ref={eyesRef} className="doubt-eyes">
                                    <g className="doubt-blink">
                                        <ellipse cx="53" cy="54" rx="2.2" ry="2.8" fill="#000" stroke="none" />
                                        <ellipse cx="67" cy="54" rx="2.2" ry="2.8" fill="#000" stroke="none" />
                                    </g>
                                </g>
                                <path className="doubt-mouth" d="M55 63 Q60 66 65 63" strokeWidth="2" />
                            </g>
                        </g>
                    </svg>
                </div>
                <div className="doubt-shadow" />
            </button>
        </div>
    );
}
