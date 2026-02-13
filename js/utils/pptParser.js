import JSZip from 'jszip';

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
        throw new Error('No slides found in the uploaded file.');
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

function extractTextFromXML(xml) {
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

export async function parseTextFile(file) {
    const text = await file.text();
    return {
        slides: [{ slideNumber: 1, text }],
        fullText: text,
        totalSlides: 1,
    };
}
