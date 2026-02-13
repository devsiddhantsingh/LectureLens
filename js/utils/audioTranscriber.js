import { GROQ_API_KEY, GROQ_WHISPER_MODEL } from '../config.js';

export async function transcribeAudio(file) {
    if (!GROQ_API_KEY) {
        throw new Error('Please set your Groq API key in js/config.js');
    }

    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
        throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Groq Whisper max is 25MB.`);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', GROQ_WHISPER_MODEL);
    formData.append('response_format', 'verbose_json');
    // formData.append('language', 'en'); // Optional, auto-detect is often better

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            // Do NOT set Content-Type header when using FormData, browser does it automatically with boundary
        },
        body: formData,
    });

    if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Groq Whisper error (${response.status}): ${errBody}`);
    }

    const data = await response.json();

    return {
        text: data.text || '',
        duration: data.duration || 0,
        segments: data.segments || [],
    };
}

export async function transcribeVideo(file) {
    // Groq Whisper supports mp4, mpeg, mpga, m4a, wav, or webm
    // We can send the video file directly for transcription.
    return transcribeAudio(file);
}
