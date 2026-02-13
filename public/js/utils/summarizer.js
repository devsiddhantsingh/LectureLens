import { GROQ_API_KEY, GROQ_MODEL } from '../config.js';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function generateSummary(text) {
    if (!GROQ_API_KEY || GROQ_API_KEY.includes('your_api_key')) {
        throw new Error('Please set your Groq API key in js/config.js (or .env)');
    }

    const maxChars = 15000; // Increased limit slightly for better context
    const truncatedText = text.length > maxChars
        ? text.substring(0, maxChars) + '\n[...truncated]'
        : text;

    const systemPrompt = `You are a world-class professor. Create EXTREMELY DETAILED, academic-quality study material. Return ONLY valid JSON:
{
  "notes": [
    {
      "topic": "Concept Name",
      "content": "Comprehensive, multi-paragraph explanation (6-10 sentences). Cover the core mechanics, the 'WHY', historical context, and practical utility. Be exhaustive.",
      "analogies": ["A powerful analogy to explain this concept simply"],
      "definitions": ["Term: precise, academic definition"],
      "formulas": ["Name: Math/Logic expression (variables defined & units context)"],
      "bulletPoints": ["Critical nuance 1", "Critical nuance 2", "Critical nuance 3", "Critical nuance 4"],
      "examples": ["Detailed worked example 1", "Real-world application case study 2"]
    }
  ],
  "summary": {
    "overview": "A rich, thorough executive summary around 20 sentences connecting all major themes.",
    "highlights": ["highlight 1", "highlight 2", "highlight 3", "highlight 4", "highlight 5"],
    "importantConcepts": ["Concept: detailed explanation"],
    "keyFormulas": ["Formula: expression (context)"],
    "examTip": "High-value exam strategy: trick questions to watch for.",
    "keyTakeaway": "One definitive sentence summing up the lecture's value."
  },
  "quiz": [
    {
      "question": "Challenging multiple-choice question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "explanation": "Brief explanation of why this answer is correct."
    }
  ]
}
RULES:
1. Generate atleast 3-5 distinct topics (Quality > Quantity).
2. "examples": MUST have at least 1 detailed example per topic.
3. "analogies": Provide at least 1 analogy per topic if applicable.
4. "quiz": Generate exactly 5 questions testing understanding, not just recall.
5. Math/Science: Focus heavily on formulas/derivations and step-by-step logic.
6. Content be deep enough for exam review.
7. NO markdown in values. strictly JSON.`;

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: truncatedText },
            ],
            temperature: 0.3,
            max_tokens: 4096,
            response_format: { type: 'json_object' },
        }),
    });

    if (!response.ok) {
        const errBody = await response.text();
        if (response.status === 429 || response.status === 413) {
            throw new Error(`Groq rate limit hit. Please wait 60 seconds.`);
        }
        throw new Error(`API error (${response.status}): ${errBody}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content;

    try {
        content = content.replace(/```json/g, '').replace(/```/g, '');
        const firstOpen = content.indexOf('{');
        const lastClose = content.lastIndexOf('}');
        if (firstOpen !== -1 && lastClose !== -1) {
            content = content.substring(firstOpen, lastClose + 1);
        }
        return JSON.parse(content);
    } catch (err) {
        console.error("Failed to parse AI response:", content);
        throw new Error('Failed to parse AI response. Please try again.');
    }
}

export async function askLecture(question, context) {
    if (!GROQ_API_KEY) throw new Error('API Key missing');

    const safeContext = context.length > 20000 ? context.substring(0, 20000) + "...(truncated)" : context;

    const systemPrompt = `You are a helpful teaching assistant. Answer the user's question based ONLY on the provided lecture context.
  If the answer is not in the context, say "I couldn't find that information in the lecture."
  Keep answers concise (2-3 sentences) unless asked for detail.`;

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Context:\n${safeContext}\n\nQuestion: ${question}` },
            ],
            temperature: 0.5,
            max_tokens: 512,
        }),
    });

    if (!response.ok) throw new Error('Chat API failed');
    const data = await response.json();
    return data.choices[0].message.content;
}
