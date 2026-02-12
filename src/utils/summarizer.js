import { GROQ_API_KEY, GROQ_MODEL } from '../config.js';

const GROQ_API_URL = '/api/groq/chat/completions';

/**
 * Generates structured notes, summary, and mind map data from lecture text.
 * Uses chunked processing for large content to stay within Groq free tier limits.
 * @param {string} text - The extracted lecture/PPT text
 * @returns {Promise<{notes: Array, summary: Object, mindmap: Object}>}
 */
export async function generateSummary(text) {
  if (!GROQ_API_KEY || GROQ_API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
    throw new Error('Please set your Groq API key in src/config.js');
  }

  // Keep input short enough for free tier (6000 TPM limit ~ 4500 chars input max)
  const maxChars = 3500;
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
  }
}
RULES:
1. Generate atleast 3-5 distinct topics (Quality > Quantity).
2. "examples": MUST have at least 1 detailed example per topic.
3. "analogies": Provide at least 1 analogy per topic if applicable.
4. Math/Science: Focus heavily on formulas/derivations and step-by-step logic.
5. Content be deep enough for exam review.
6. NO markdown in values. strictly JSON.`;

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

    // Handle rate limit with retry
    if (response.status === 429 || response.status === 413) {
      throw new Error(`Groq rate limit hit. The free tier allows 6000 tokens/min. Please wait 60 seconds and try again, or upgrade at console.groq.com.`);
    }

    throw new Error(`API error (${response.status}): ${errBody}`);
  }

  const data = await response.json();
  let content = data.choices[0].message.content;

  try {
    // 1. Remove markdown code blocks if present (e.g., ```json ... ```)
    content = content.replace(/```json/g, '').replace(/```/g, '');

    // 2. Find the first '{' and last '}' to isolate the JSON object
    const firstOpen = content.indexOf('{');
    const lastClose = content.lastIndexOf('}');

    if (firstOpen !== -1 && lastClose !== -1) {
      content = content.substring(firstOpen, lastClose + 1);
    }

    const parsed = JSON.parse(content);
    return parsed;
  } catch (err) {
    console.error("Failed to parse AI response:", content);
    throw new Error('Failed to parse AI response. Please try again.');
  }
}
