import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Use the local worker bundled with the package
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Parse a PDF file and extract text from all pages.
 * @param {File} file - The uploaded PDF file
 * @returns {Promise<{pages: Array, fullText: string, totalPages: number}>}
 */
export async function parsePDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const pages = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        try {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const text = textContent.items
                .map(item => item.str)
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();

            console.log(`[AutoLecture] PDF Page ${i}/${pdf.numPages} text length:`, text.length);
            if (text.length > 0) {
                console.log(`[AutoLecture] PDF Page ${i} snippet:`, text.substring(0, 50));
                pages.push({ pageNumber: i, text });
            } else {
                console.warn(`[AutoLecture] PDF Page ${i} is empty (likely image-based).`);
            }
        } catch (err) {
            console.error(`[AutoLecture] Error parsing PDF Page ${i}:`, err);
        }
    }

    const fullText = pages.map(p => `[Page ${p.pageNumber}]\n${p.text}`).join('\n\n');
    const isScanned = fullText.length < 50 && pdf.numPages > 0; // Heuristic: very little text for the number of pages

    return { pages, fullText, totalPages: pdf.numPages, isScanned, pdfDocument: pdf };
}

/**
 * Render a specific page of the PDF as an image (Base64 URL)
 * @param {Object} pdfDocument - The PDF document object from pdfjs
 * @param {number} pageNumber - 1-based page number
 * @returns {Promise<string>} - Base64 data URL
 */
export async function renderPageAsImage(pdfDocument, pageNumber) {
    const page = await pdfDocument.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.5 }); // 1.5x scale for better readability

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
        canvasContext: context,
        viewport: viewport
    }).promise;

    // Convert to base64 (JPEG is smaller/faster for vision than PNG)
    return canvas.toDataURL('image/jpeg', 0.85);
}
