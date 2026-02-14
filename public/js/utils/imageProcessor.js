import { CONFIG } from '../config.js';

const GROQ_API_KEY = CONFIG.VITE_GROQ_API_KEY || CONFIG.GROQ_API_KEY;
const GROQ_VISION_MODEL_USER = 'llama-3.2-11b-vision-preview'; // Hardcoded fallback or add to config if needed

export async function analyzeImage(file) {
    if (!GROQ_API_KEY) {
        throw new Error('Please set your Groq API key in js/config.js');
    }

    const base64 = await fileToBase64(file);
    const mimeType = file.type || 'image/jpeg';

    return analyzeBase64(base64, mimeType);
}

export async function analyzeBase64(base64Data, mimeType = 'image/jpeg') {
    const base64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: GROQ_VISION_MODEL_USER,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: 'Analyze this lecture slide/page. Extract ALL text, headers, bullet points, and formulas exactly as they appear. Organize the output structurally. If there are diagrams, describe their key educational meaning briefly.',
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:${mimeType};base64,${base64}`,
                            },
                        },
                    ],
                },
            ],
            temperature: 0.1,
            max_tokens: 2048,
        }),
    });

    if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Groq Vision error (${response.status}): ${errBody}`);
    }

    const data = await response.json();
    return { text: data.choices[0].message.content || '' };
}

export async function analyzeMultipleImages(files) {
    const results = [];
    for (let i = 0; i < files.length; i++) {
        const result = await analyzeImage(files[i]);
        results.push(`[Image ${i + 1}: ${files[i].name}]\n${result.text}`);
    }
    return { text: results.join('\n\n') };
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
