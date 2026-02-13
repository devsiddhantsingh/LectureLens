export function renderInput(container, app) {
    container.innerHTML = `
        <div class="container" style="padding-top: 4rem; max-width: 800px;">
            <div style="margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem;">
                <button class="btn-icon" id="btn-back-input">
                    <i data-lucide="arrow-left"></i>
                </button>
                <h2 style="font-size: 1.8rem; font-weight: 700;">Upload Material</h2>
            </div>
            
            <div class="glass-card" style="padding: 2rem; animation: slideUp 0.5s ease;">
                <!-- Upload Zone -->
                <div id="drop-zone" class="upload-zone">
                    <div style="font-size: 3rem; margin-bottom: 1rem; color: var(--text-muted);">
                        <i data-lucide="cloud-upload"></i>
                    </div>
                    <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem;">
                        Drag & Drop or Click to Upload
                    </h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 2rem;">
                        Supports: PPT, PDF, Audio (MP3/WAV), Video (MP4), Images
                    </p>
                    <input type="file" id="file-input" style="display: none;" accept=".ppt,.pptx,.pdf,.mp3,.wav,.m4a,.mp4,.webm,.jpg,.jpeg,.png,.webp" multiple>
                    <button class="btn-primary" onclick="document.getElementById('file-input').click()">
                        Select Files
                    </button>
                </div>

                <div style="margin-top: 2rem; text-align: center; position: relative;">
                    <span style="background: var(--bg-secondary); padding: 0 1rem; color: var(--text-muted); font-size: 0.8rem; position: relative; z-index: 1;">
                        OR START WITH DEMO
                    </span>
                    <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: var(--glass-border); z-index: 0;"></div>
                </div>

                <div style="margin-top: 2rem; display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                    <button class="btn-secondary" id="btn-demo-physics">
                        ⚛️ Quantum Physics (Text)
                    </button>
                    <button class="btn-secondary" id="btn-demo-blank">
                        📝 Blank Editor
                    </button>
                </div>
            </div>
        </div>
    `;

    // Initialize Lucide icons
    if (window.lucide) window.lucide.createIcons();
    else if (window.lucide && window.lucide.icons) { /* Already loaded? */ }

    // Event Listeners
    container.querySelector('#btn-back-input').addEventListener('click', () => app.navigateTo('landing'));

    const dropZone = container.querySelector('#drop-zone');
    const fileInput = container.querySelector('#file-input');

    // Drag & Drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files, app);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFiles(e.target.files, app);
        }
    });

    // Demo Buttons
    container.querySelector('#btn-demo-physics').addEventListener('click', () => {
        const demoText = `Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science.`;
        app.navigateTo('processing', { type: 'text', content: demoText, title: 'Quantum Physics Demo' });
    });

    container.querySelector('#btn-demo-blank').addEventListener('click', () => {
        // Navigate to processing with empty text placeholder
        const placeholder = "Paste your lecture notes here...";
        app.navigateTo('processing', { type: 'text', content: placeholder, title: 'New Note' });
    });
}

function handleFiles(files, app) {
    const file = files[0]; // Handle single file for now
    // Determine type
    let type = 'unknown';
    if (file.type.includes('pdf')) type = 'pdf';
    else if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) type = 'ppt';
    else if (file.type.includes('image')) type = 'image';
    else if (file.type.includes('audio')) type = 'audio';
    else if (file.type.includes('video')) type = 'video';
    else if (file.type.includes('text')) type = 'text';

    console.log('File selected:', file.name, type);
    app.navigateTo('processing', { type, file: file, title: file.name });
}
