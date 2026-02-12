// ============================================
// 🔑 GROQ API KEY — Paste your key below
// ============================================
// Get your free API key at: https://console.groq.com/keys
export const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

// Models
export const GROQ_MODEL = 'llama-3.1-8b-instant';            // Text summarization
export const GROQ_WHISPER_MODEL = 'whisper-large-v3';         // Audio transcription
export const GROQ_VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct'; // Multimodal (Vision)
