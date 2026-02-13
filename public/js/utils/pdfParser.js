import * as pdfjsLib from 'pdfjs-dist';

// Set worker to the CDN URL defined in importmap or directly
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs';

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
                pages.push({ pageNumber: i, text });
            } else {
                console.warn(`[AutoLecture] PDF Page ${i} is empty.`);
            }
        } catch (err) {
            console.error(`[AutoLecture] Error parsing PDF Page ${i}:`, err);
        }
    }

    const fullText = pages.map(p => `[Page ${p.pageNumber}]\n${p.text}`).join('\n\n');
    const isScanned = fullText.length < 50 && pdf.numPages > 0;

    return { pages, fullText, totalPages: pdf.numPages, isScanned, pdfDocument: pdf };
}

export async function renderPageAsImage(pdfDocument, pageNumber) {
    const page = await pdfDocument.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
        canvasContext: context,
        viewport: viewport
    }).promise;

    return canvas.toDataURL('image/jpeg', 0.85);
}
