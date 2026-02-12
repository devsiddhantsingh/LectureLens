import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates a PDF from a specified HTML element.
 * @param {string} elementId - The ID of the HTML element to capture.
 * @param {string} filename - The name of the file to save as (without extension).
 */
export const downloadPDF = async (elementId, filename) => {
    console.log(`Attempting to generate PDF for element: ${elementId}`);
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id '${elementId}' not found.`);
        alert(`Error: Could not find content to download. (ID: ${elementId})`);
        return;
    }

    try {
        console.log('Starting html2canvas capture...');
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: true,
            backgroundColor: '#ffffff',
            scrollY: -window.scrollY,
            onclone: (clonedDoc) => {
                const clonedElement = clonedDoc.getElementById(elementId);
                if (clonedElement) {
                    // === NUCLEAR OPTION: Inject a stylesheet that overrides EVERYTHING ===
                    const styleEl = clonedDoc.createElement('style');
                    styleEl.textContent = `
                        :root {
                            --text-primary: #111111 !important;
                            --text-secondary: #222222 !important;
                            --text-muted: #333333 !important;
                            --primary-light: #4a3ab5 !important;
                            --primary: #4a3ab5 !important;
                            --accent: #0e8fa0 !important;
                            --success: #0a7c5a !important;
                            --warning: #b37400 !important;
                            --danger: #c0392b !important;
                            --bg-primary: #ffffff !important;
                            --bg-secondary: #f8f9fa !important;
                            --bg-tertiary: #f0f0f0 !important;
                            --surface: #f5f5f5 !important;
                            --glass-bg: #ffffff !important;
                            --glass-border: #dddddd !important;
                            --glass-hover: #f0f0f0 !important;
                        }
                        #${elementId}, #${elementId} * {
                            color: #111111 !important;
                            text-shadow: none !important;
                            opacity: 1 !important;
                            -webkit-text-fill-color: #111111 !important;
                        }
                        #${elementId} h1, #${elementId} h2, #${elementId} h3,
                        #${elementId} h4, #${elementId} h5, #${elementId} h6 {
                            color: #000000 !important;
                            -webkit-text-fill-color: #000000 !important;
                        }
                        #${elementId} .gradient-text {
                            background: none !important;
                            -webkit-background-clip: unset !important;
                            background-clip: unset !important;
                            -webkit-text-fill-color: #000000 !important;
                            color: #000000 !important;
                        }
                        #${elementId} .glass-card {
                            background: #ffffff !important;
                            backdrop-filter: none !important;
                            -webkit-backdrop-filter: none !important;
                            box-shadow: none !important;
                            border: 1px solid #dddddd !important;
                        }
                        #${elementId} .scroll-area {
                            overflow: visible !important;
                            height: auto !important;
                            max-height: none !important;
                        }
                        #${elementId} .tag {
                            background: #e8e4f9 !important;
                            color: #4a3ab5 !important;
                            -webkit-text-fill-color: #4a3ab5 !important;
                            border-color: #c4b5fd !important;
                        }
                        #${elementId} [style*="monospace"], #${elementId} code {
                            color: #111111 !important;
                            -webkit-text-fill-color: #111111 !important;
                        }
                    `;
                    clonedDoc.head.appendChild(styleEl);

                    // Force root element styles
                    clonedElement.style.overflow = 'visible';
                    clonedElement.style.height = 'auto';
                    clonedElement.style.maxHeight = 'none';
                    clonedElement.style.background = '#ffffff';
                    clonedElement.style.padding = '2rem';

                    // Iterate ALL descendants for extra safety
                    const allElements = clonedElement.querySelectorAll('*');
                    allElements.forEach(el => {
                        // Strip any remaining rgba/transparent backgrounds
                        const bg = el.style.background || '';
                        if (bg.includes('rgba') || bg.includes('transparent')) {
                            el.style.background = 'transparent';
                        }

                        // Handle SVGs
                        const tag = el.tagName.toLowerCase();
                        if (tag === 'svg') {
                            el.setAttribute('stroke', '#111111');
                            el.style.color = '#111111';
                        }
                        if (tag === 'path' || tag === 'circle' || tag === 'rect') {
                            if (el.getAttribute('stroke') && el.getAttribute('stroke') !== 'none') {
                                el.setAttribute('stroke', '#111111');
                            }
                        }
                    });
                } else {
                    console.error('Cloned element not found in onclone callback');
                }
            }
        });
        console.log('Canvas captured successfully.');

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        console.log(`PDF dimensions: ${imgWidth}x${imgHeight}mm`);

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        console.log(`Saving PDF: ${filename}.pdf`);
        pdf.save(`${filename}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Check console for details.');
    }
};
