import { NextRequest, NextResponse } from 'next/server';

// Forwards a recorded answer to OpenAI Whisper and returns the text.
// Without OPENAI_API_KEY this returns 501 and the client keeps the
// browser's live speech-recognition transcript instead.
export async function POST(req: NextRequest) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'Transcription not configured' }, { status: 501 });
    }

    try {
        const incoming = await req.formData();
        const audio = incoming.get('audio');
        if (!(audio instanceof Blob) || audio.size === 0) {
            return NextResponse.json({ error: 'No audio received' }, { status: 400 });
        }
        if (audio.size > 25 * 1024 * 1024) {
            return NextResponse.json({ error: 'Recording too long' }, { status: 413 });
        }

        const type = audio.type || 'audio/webm';
        const ext = type.includes('mp4') ? 'mp4' : type.includes('ogg') ? 'ogg' : 'webm';

        const body = new FormData();
        body.append('file', audio, `answer.${ext}`);
        body.append('model', process.env.OPENAI_TRANSCRIBE_MODEL || 'whisper-1');
        body.append('response_format', 'json');

        const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: { Authorization: `Bearer ${apiKey}` },
            body,
        });

        if (!res.ok) {
            console.error('Whisper error:', res.status, await res.text());
            return NextResponse.json({ error: 'Transcription failed' }, { status: 502 });
        }

        const json = await res.json();
        return NextResponse.json({ text: (json.text || '').trim() });
    } catch (error) {
        console.error('Transcribe route error:', error);
        return NextResponse.json({ error: 'Transcription failed' }, { status: 500 });
    }
}
