import { GROQ_API_KEY, GROQ_VISION_MODEL } from '../config.js';

/**
 * Analyze an image using Groq's Vision model and extract educational content.
 * Supports: jpg, jpeg, png, gif, webp
 * @param {File} file - The image file
 * @returns {Promise<{text: string}>}
 */
export async function analyzeImage(file) {
    if (!GROQ_API_KEY || GROQ_API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
        throw new Error('Please set your Groq API key in src/config.js');
    }

    // Convert image to base64
    const base64 = await fileToBase64(file);
    const mimeType = file.type || 'image/jpeg';

    return analyzeBase64(base64, mimeType);
}

/**
 * Analyze a base64 image directly
 * @param {string} base64 - Base64 string (no data prefix if possible, but we'll handle it)
 * @param {string} mimeType - Mime type
 */
export async function analyzeBase64(base64Data, mimeType = 'image/jpeg') {
    // Strip data URL prefix if present
    const base64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');

    const response = await fetch('/api/groq/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: GROQ_VISION_MODEL,
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
            temperature: 0.1, // Lower temperature for more accurate extraction
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

/**
 * Analyze multiple images and combine results
 * @param {File[]} files - Array of image files
 * @returns {Promise<{text: string}>}
 */
export async function analyzeMultipleImages(files) {
    const results = [];

    for (let i = 0; i < files.length; i++) {
        const result = await analyzeImage(files[i]);
        results.push(`[Image ${i + 1}: ${files[i].name}]\n${result.text}`);
    }

    return { text: results.join('\n\n') };
}

/**
 * Convert a File to a base64 string (without the data URL prefix)
 */
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
