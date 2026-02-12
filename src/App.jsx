import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import InputSection from './components/InputSection';
import ProcessingView from './components/ProcessingView';
import OutputView from './components/OutputView';
import Dashboard from './components/Dashboard';
import { analyzeImage, analyzeMultipleImages, analyzeBase64 } from './utils/imageProcessor';
import { generateSummary } from './utils/summarizer';
import { parsePPTX, parseTextFile } from './utils/pptParser';
import { parsePDF, renderPageAsImage } from './utils/pdfParser';
import { transcribeAudio, transcribeVideo } from './utils/audioTranscriber';

function App() {
    const [currentView, setCurrentView] = useState('landing');
    const [inputData, setInputData] = useState(null);
    const [results, setResults] = useState(null);
    const [currentStep, setCurrentStep] = useState('parse');
    const [error, setError] = useState(null);
    const [savedItems, setSavedItems] = useState([]);

    const navigateTo = (view) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrentView(view);
    };

    const processScannedPDF = async (pdfDocument, totalPages) => {
        let fullExtractedText = '';
        console.log(`[AutoLecture] Starting Vision analysis for ${totalPages} pages...`);

        for (let i = 1; i <= totalPages; i++) {
            // Update UI with progress
            setCurrentStep(`Analyzing image ${i} of ${totalPages}...`);
            await new Promise(r => setTimeout(r, 100)); // UI refresh

            try {
                const base64 = await renderPageAsImage(pdfDocument, i);
                const analysis = await analyzeBase64(base64);
                fullExtractedText += `\n[Page ${i}]\n${analysis.text}\n`;
            } catch (err) {
                console.error(`[AutoLecture] Failed to analyze page ${i}:`, err);
                fullExtractedText += `\n[Page ${i}] (Analysis Failed)\n`;
            }
        }
        return fullExtractedText;
    };

    const startProcessing = async (data) => {
        setInputData(data);
        setError(null);
        setResults(null);

        setCurrentStep('parse');
        navigateTo('processing');

        try {
            // Step 1: Parse / Transcribe / Analyze content
            console.log('[AutoLecture] Step 1: Parsing content, type:', data.type);
            let extractedText = '';

            switch (data.type) {
                case 'ppt': {
                    const parsed = await parsePPTX(data.file);
                    extractedText = parsed.fullText;
                    break;
                }
                case 'pdf': {
                    const parsed = await parsePDF(data.file);

                    if (parsed.isScanned) {
                        const confirm = window.confirm(
                            "⚠️ No text found. This looks like a scanned document.\n\n" +
                            "Would you like to use AI Vision to read it?\n" +
                            "(This may take 1-2 minutes for large files)"
                        );

                        if (confirm) {
                            extractedText = await processScannedPDF(parsed.pdfDocument, parsed.totalPages);
                        } else {
                            throw new Error("Processing cancelled. Please use a text-based PDF or 'Images' mode.");
                        }
                    } else {
                        extractedText = parsed.fullText;
                    }
                    break;
                }
                case 'audio': {
                    const result = await transcribeAudio(data.file);
                    extractedText = result.text;
                    break;
                }
                case 'video': {
                    const result = await transcribeVideo(data.file);
                    extractedText = result.text;
                    break;
                }
                case 'image': {
                    const result = await analyzeImage(data.file);
                    extractedText = result.text;
                    break;
                }
                case 'images': {
                    const result = await analyzeMultipleImages(data.files);
                    extractedText = result.text;
                    break;
                }
                case 'text': {
                    extractedText = data.text;
                    break;
                }
                case 'textfile': {
                    const parsed = await parseTextFile(data.file);
                    extractedText = parsed.fullText;
                    break;
                }
                default:
                    throw new Error(`Unsupported input type: ${data.type}`);
            }

            console.log('[AutoLecture] Extracted text length:', extractedText?.length || 0);
            console.log('[AutoLecture] Extracted text preview:', extractedText?.substring(0, 200));

            if (!extractedText || !extractedText.trim()) {
                throw new Error(
                    'No selectable text found. This file appears to be scanned or image-only. ' +
                    'Please use a text-based PDF/PPT or try the "Images" upload for screenshots.'
                );
            }

            // Step 2: Summarize with AI
            console.log('[AutoLecture] Step 2: Calling Groq API for summarization...');
            setCurrentStep('summarize');
            const aiResults = await generateSummary(extractedText);
            console.log('[AutoLecture] AI Results received:', aiResults ? 'OK' : 'NULL');
            console.log('[AutoLecture] AI Results keys:', aiResults ? Object.keys(aiResults) : 'N/A');

            // Robust check: allow partial results
            if (!aiResults) {
                throw new Error('AI generation failed. Please try again.');
            }

            // Default missing sections instead of failing
            if (!aiResults.notes) aiResults.notes = [];
            if (!aiResults.summary) aiResults.summary = {};

            // Step 3: Finalize
            console.log('[AutoLecture] Step 3: Finalizing...');
            setCurrentStep('finalize');
            await new Promise(resolve => setTimeout(resolve, 500));

            // Ensure arrays exist for safe rendering
            aiResults.notes = Array.isArray(aiResults.notes) ? aiResults.notes : [];
            aiResults.summary = aiResults.summary || {};
            aiResults.summary.highlights = Array.isArray(aiResults.summary.highlights) ? aiResults.summary.highlights : [];
            aiResults.summary.importantConcepts = Array.isArray(aiResults.summary.importantConcepts) ? aiResults.summary.importantConcepts : [];
            aiResults.summary.keyFormulas = Array.isArray(aiResults.summary.keyFormulas) ? aiResults.summary.keyFormulas : [];

            console.log('[AutoLecture] Final notes count:', aiResults.notes.length);
            console.log('[AutoLecture] Final summary keys:', Object.keys(aiResults.summary));

            setResults(aiResults);
            navigateTo('output');

        } catch (err) {
            console.error('[AutoLecture] Processing error:', err);
            console.error('[AutoLecture] Error stack:', err.stack);
            setError(err.message || 'An unexpected error occurred. Please try again.');
        }
    };

    const handleSave = () => {
        if (inputData && results) {
            const newItem = {
                name: inputData.name,
                type: inputData.type,
                date: new Date().toLocaleDateString(),
                summary: results.summary,
                results,
            };
            setSavedItems(prev => [newItem, ...prev]);
        }
        navigateTo('dashboard');
    };

    return (
        <div className="app-container">
            {currentView === 'landing' && (
                <LandingPage
                    onStart={() => navigateTo('input')}
                    onViewDashboard={() => navigateTo('dashboard')}
                />
            )}

            {currentView === 'input' && (
                <InputSection
                    onProcess={startProcessing}
                    onCancel={() => navigateTo('landing')}
                />
            )}

            {currentView === 'processing' && (
                <ProcessingView
                    data={inputData}
                    currentStep={currentStep}
                    error={error}
                    onBack={() => navigateTo('input')}
                    onRetry={() => inputData && startProcessing(inputData)}
                />
            )}

            {currentView === 'output' && (
                <OutputView
                    data={inputData}
                    results={results}
                    onBack={() => navigateTo('input')}
                    onSave={handleSave}
                />
            )}

            {currentView === 'dashboard' && (
                <Dashboard
                    onBack={() => navigateTo('landing')}
                    onNewLecture={() => navigateTo('input')}
                    savedItems={savedItems}
                />
            )}
        </div>
    );
}

export default App;
