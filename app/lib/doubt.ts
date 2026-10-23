// Tiny event bus so any field can make Doubt (the mascot) react.

export type DoubtMood =
    | 'listen'    // mic is open
    | 'thinking'  // transcribing
    | 'answer'    // a spoken answer landed -> big random trick
    | 'nod'       // small acknowledgement (checkbox, typed answer)
    | 'step'      // moved to the next section
    | 'oops'      // validation error
    | 'party';    // form submitted

export const DOUBT_EVENT = 'doubt:react';

export function doubtReact(mood: DoubtMood, line?: string) {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent(DOUBT_EVENT, { detail: { mood, line } }));
}

export function pick<T>(items: readonly T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}
