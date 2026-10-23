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
    const markRef = useRef<SVGGElement>(null);
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

    // Wake up on any activity; the question mark leans toward the cursor.
    useEffect(() => {
        let frame = 0;
        const onMove = (e: PointerEvent) => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const el = rootRef.current;
                const mark = markRef.current;
                if (!el || !mark) return;
                const box = el.getBoundingClientRect();
                const dx = e.clientX - (box.left + box.width / 2);
                const dy = e.clientY - (box.top + box.height * 0.15);
                const d = Math.hypot(dx, dy) || 1;
                const lean = Math.max(-18, Math.min(18, (dx / d) * Math.min(18, d / 20)));
                mark.style.transform = `rotate(${lean}deg)`;
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
                    <svg viewBox="420 150 1100 1560" className="doubt-svg" fill="none" stroke="#000" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round">
                        {/* the question mark is Doubt's head */}
                        <g ref={markRef} className="doubt-mark-follow">
                            <g className="doubt-mark">
                                {symbol === '?' ? (
                                    <>
                                        <path d="M882 272 Q886 201 966 201 Q1050 201 1050 274 Q1050 349 966 349 H944 V398" strokeWidth="34" strokeLinecap="butt" strokeLinejoin="miter" />
                                        <circle cx="943" cy="467" r="25" fill="#000" stroke="none" />
                                    </>
                                ) : (
                                    <text x="966" y="490" textAnchor="middle" fontSize="340" fontFamily="Inter, system-ui, sans-serif" fontWeight="500" fill="#000" stroke="none">{symbol}</text>
                                )}
                            </g>
                        </g>

                        {/* listening rings */}
                        <g className="doubt-rings">
                            <path d="M1150 260 a110 110 0 0 1 0 170" />
                            <path d="M1210 200 a190 190 0 0 1 0 290" />
                        </g>

                        <g className="doubt-body">
                            {/* torso, revealed when the sleeves move */}
                            <path d="M696 1370 V860 C696 700 760 590 850 590 H1085 C1175 590 1236 700 1236 860 V1370 Z" fill="#fff" />

                            {/* sleeves */}
                            <g className="doubt-arm-l">
                                <Sleeve />
                            </g>
                            <g className="doubt-arm-r">
                                <Sleeve side="right" />
                            </g>

                            {/* shorts */}
                            <path d="M687 1366 H1245 V1597 L1414 1673 H518 L687 1597 Z" fill="#000" stroke="none" />
                            <path d="M966 1580 V1680" stroke="#fff" strokeWidth="13" />
                        </g>
                    </svg>
                </div>
                <div className="doubt-shadow" />
            </button>
        </div>
    );
}

// One sleeve per side; its fill hides the torso outline so at rest
// Doubt matches the original art, and the torso shows when an arm moves.
const SLEEVES = {
    left: ['M850 590 C700 590 560 690 500 880 C460 1030 455 1250 470 1370 C478 1460 540 1520 625 1520 C650 1520 670 1515 696 1508 V862 C700 720 770 600 880 592 Z', 'M850 590 C700 590 560 690 500 880 C460 1030 455 1250 470 1370 C478 1460 540 1520 625 1520 C650 1520 670 1515 690 1508', 'M470 1366 H696 M696 862 V1508'],
    right: ['M 1082 590 C 1232 590 1372 690 1432 880 C 1472 1030 1477 1250 1462 1370 C 1454 1460 1392 1520 1307 1520 C 1282 1520 1262 1515 1236 1508 V 862 C 1232 720 1162 600 1052 592 Z', 'M 1082 590 C 1232 590 1372 690 1432 880 C 1472 1030 1477 1250 1462 1370 C 1454 1460 1392 1520 1307 1520 C 1282 1520 1262 1515 1242 1508', 'M 1462 1366 H 1236 M 1236 862 V 1508'],
};

function Sleeve({ side = 'left' }: { side?: 'left' | 'right' }) {
    const [fill, outline, lines] = SLEEVES[side];
    return (
        <>
            <path d={fill} fill="#fff" stroke="none" />
            <path d={outline} />
            <path d={lines} />
        </>
    );
}
