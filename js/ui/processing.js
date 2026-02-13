import { parsePDF, renderPageAsImage } from '../utils/pdfParser.js';
import { parsePPTX, parseTextFile } from '../utils/pptParser.js';
import { analyzeImage, analyzeMultipleImages } from '../utils/imageProcessor.js';
import { transcribeAudio, transcribeVideo } from '../utils/audioTranscriber.js';
import { generateSummary } from '../utils/summarizer.js';

export async function renderProcessing(container, app) {
    container.innerHTML = `
        <div class="container" style="padding-top: 4rem; max-width: 800px; text-align: center;">
            <h2 style="font-size: 2rem; margin-bottom: 2rem;">Analyzing Material</h2>
            
            <div class="glass-card" style="padding: 3rem; display: flex; flex-direction: column; align-items: center; gap: 2rem;">
                <!-- Spinner -->
                <div class="spinner"></div>
                
                <!-- Status Text -->
                <div id="status-text" class="animate-pulse" style="font-size: 1.1rem; color: var(--text-secondary);">
                    Initializing...
                </div>

                <!-- Progress Bar -->
                <div style="width: 100%; max-width: 400px; height: 6px; background: rgba(255,255,255,0.1); border-radius: 99px; overflow: hidden; position: relative;">
                    <div id="progress-bar" style="width: 0%; height: 100%; background: var(--gradient-primary); transition: width 0.3s ease;"></div>
                </div>

                <!-- Tips -->
                <p id="tip-text" style="font-size: 0.9rem; color: var(--text-muted); margin-top: 1rem;">
                    Tip: AI models process text faster than images or video.
                </p>
            </div>
        </div>
    `;

    const { type, file, content } = app.params;

    if (!type && !file && !content) {
        console.error("No input data found");
        updateStatus(container, "Error: No input data found", 0, true);
        setTimeout(() => app.navigateTo('input'), 2000);
        return;
    }

    try {
        // Step 1: Extract Text
        updateStatus(container, "Extracting text from file...", 20);
        let extractedText = "";
        let pdfDoc = null; // For PDF page rendering later

        if (content) {
            extractedText = content; // Demo text or direct input
        } else if (file) {
            if (type === 'pdf') {
                const result = await parsePDF(file);
                extractedText = result.fullText;
                pdfDoc = result.pdfDocument;
                app.params.pdfDocument = pdfDoc; // Store for valid page rendering
            } else if (type === 'ppt') {
                const result = await parsePPTX(file);
                extractedText = result.fullText;
            } else if (type === 'text') {
                const result = await parseTextFile(file);
                extractedText = result.fullText;
            } else if (type === 'image') {
                updateStatus(container, "Analyzing image structure...", 30);
                const result = await analyzeImage(file);
                extractedText = result.text;
            } else if (type === 'audio') {
                updateStatus(container, "Transcribing audio (this may take a minute)...", 30);
                const result = await transcribeAudio(file);
                extractedText = result.text;
            } else if (type === 'video') {
                updateStatus(container, "Extracting audio and transcribing...", 30);
                const result = await transcribeVideo(file);
                extractedText = result.text;
            }
        }

        console.log("Extracted Text Length:", extractedText.length);
        if (extractedText.length < 50) {
            throw new Error("Could not extract enough text. The file might be empty or scanned without OCR.");
        }

        // Step 2: Generate Summary
        updateStatus(container, "Generating notes & quiz with AI...", 60);
        const aiResult = await generateSummary(extractedText);

        updateStatus(container, "Finalizing...", 90);

        // Save Results to App State
        app.params.results = {
            extractedText,
            ...aiResult
        };

        // Step 3: Navigate to Output
        setTimeout(() => {
            app.navigateTo('output');
        }, 500);

    } catch (err) {
        console.error("Processing Error:", err);
        updateStatus(container, `Error: ${err.message}`, 0, true);
        const retryBtn = document.createElement('button');
        retryBtn.className = 'btn-primary';
        retryBtn.textContent = 'Try Again';
        retryBtn.style.marginTop = '1rem';
        retryBtn.onclick = () => app.navigateTo('input');
        container.querySelector('.glass-card').appendChild(retryBtn);
    }
}

function updateStatus(container, text, progress, isError = false) {
    const statusEl = container.querySelector('#status-text');
    const barEl = container.querySelector('#progress-bar');

    if (statusEl) {
        statusEl.textContent = text;
        if (isError) statusEl.style.color = 'var(--danger)';
    }
    if (barEl) barEl.style.width = `${progress}%`;
}
