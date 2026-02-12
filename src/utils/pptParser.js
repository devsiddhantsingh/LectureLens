import JSZip from 'jszip';

/**
 * Parse a .pptx file and extract text from all slides.
 * @param {File} file - The uploaded .pptx file
 * @returns {Promise<{slides: Array<{slideNumber: number, text: string}>, fullText: string}>}
 */
export async function parsePPTX(file) {
    const zip = await JSZip.loadAsync(file);

    // Find all slide XML files
    const slideFiles = Object.keys(zip.files)
        .filter(name => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
        .sort((a, b) => {
            const numA = parseInt(a.match(/slide(\d+)/)[1]);
            const numB = parseInt(b.match(/slide(\d+)/)[1]);
            return numA - numB;
        });

    if (slideFiles.length === 0) {
        throw new Error('No slides found in the uploaded file. Please upload a valid .pptx file.');
    }

    const slides = [];

    for (const slidePath of slideFiles) {
        const xmlContent = await zip.files[slidePath].async('string');
        const text = extractTextFromXML(xmlContent);
        const slideNumber = parseInt(slidePath.match(/slide(\d+)/)[1]);

        if (text.trim()) {
            slides.push({ slideNumber, text: text.trim() });
        }
    }

    const fullText = slides.map(s => `[Slide ${s.slideNumber}]\n${s.text}`).join('\n\n');

    return { slides, fullText, totalSlides: slideFiles.length };
}

/**
 * Extract plain text from PowerPoint XML content.
 * Looks for <a:t> tags which contain the text runs.
 */
function extractTextFromXML(xml) {
    const textParts = [];

    // Match all <a:t>...</a:t> text run elements
    const regex = /<a:t[^>]*>([\s\S]*?)<\/a:t>/g;
    let match;

    while ((match = regex.exec(xml)) !== null) {
        const text = match[1]
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'");
        textParts.push(text);
    }

    // Group text by paragraphs (<a:p> elements)
    const paragraphs = xml.split(/<\/a:p>/);
    const result = [];

    for (const para of paragraphs) {
        const paraTexts = [];
        const paraRegex = /<a:t[^>]*>([\s\S]*?)<\/a:t>/g;
        let paraMatch;
        while ((paraMatch = paraRegex.exec(para)) !== null) {
            paraTexts.push(paraMatch[1]
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&apos;/g, "'"));
        }
        if (paraTexts.length > 0) {
            result.push(paraTexts.join(''));
        }
    }

    return result.join('\n');
}

/**
 * Parse a plain text file
 */
export async function parseTextFile(file) {
    const text = await file.text();
    return {
        slides: [{ slideNumber: 1, text }],
        fullText: text,
        totalSlides: 1,
    };
}
