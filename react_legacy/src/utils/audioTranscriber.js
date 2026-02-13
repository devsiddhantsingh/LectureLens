import { GROQ_API_KEY, GROQ_WHISPER_MODEL } from '../config.js';

/**
 * Transcribe an audio or video file using Groq's Whisper API.
 * Supports: mp3, mp4, mpeg, mpga, m4a, wav, webm, ogg, flac
 * @param {File} file - The audio/video file
 * @returns {Promise<{text: string, duration: number}>}
 */
export async function transcribeAudio(file) {
    if (!GROQ_API_KEY || GROQ_API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
        throw new Error('Please set your Groq API key in src/config.js');
    }

    // Groq Whisper has a 25MB limit
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
        throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Groq Whisper supports files up to 25MB. Please compress or trim your file.`);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', GROQ_WHISPER_MODEL);
    formData.append('response_format', 'verbose_json');
    formData.append('language', 'en');

    const response = await fetch('/api/groq/audio/transcriptions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
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

/**
 * Extract audio from a video file as a Blob for transcription.
 * If the browser supports it, we simply pass the video file directly to Whisper
 * since Groq accepts mp4, webm, etc.
 * @param {File} file - The video file
 * @returns {Promise<{text: string, duration: number}>}
 */
export async function transcribeVideo(file) {
    // Groq Whisper natively supports mp4, webm, mpeg formats
    // so we can send the video file directly
    return transcribeAudio(file);
}
