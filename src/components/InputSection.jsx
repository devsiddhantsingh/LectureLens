import React, { useState, useRef } from 'react';

const INPUT_TYPES = [
    { id: 'ppt', icon: '📊', label: 'PPT / PPTX', accept: '.pptx,.ppt', desc: 'Upload presentation slides' },
    { id: 'pdf', icon: '📄', label: 'PDF', accept: '.pdf', desc: 'Upload PDF documents' },
    { id: 'audio', icon: '🎙️', label: 'Audio', accept: '.mp3,.wav,.m4a,.ogg,.flac,.webm,.mpga', desc: 'Upload audio recordings (max 25MB)' },
    { id: 'video', icon: '🎬', label: 'Video', accept: '.mp4,.webm,.mpeg,.mov', desc: 'Upload video lectures (max 25MB)' },
    { id: 'image', icon: '🖼️', label: 'Image', accept: '.jpg,.jpeg,.png,.gif,.webp', desc: 'Upload lecture slides or notes images' },
    { id: 'text', icon: '📝', label: 'Text', accept: '.txt,.md', desc: 'Paste or upload text notes' },
];

const InputSection = ({ onProcess, onCancel }) => {
    const [selectedType, setSelectedType] = useState(null);
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [textContent, setTextContent] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const currentType = INPUT_TYPES.find(t => t.id === selectedType);

    const resetSelection = () => {
        setFile(null);
        setFiles([]);
        setTextContent('');
    };

    const handleFileChange = (e) => {
        if (selectedType === 'image' && e.target.files.length > 1) {
            setFiles(Array.from(e.target.files));
            setFile(null);
        } else if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setFiles([]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length === 0) return;

        const first = droppedFiles[0];
        const ext = first.name.split('.').pop().toLowerCase();

        const typeMap = {
            pptx: 'ppt', ppt: 'ppt',
            pdf: 'pdf',
            mp3: 'audio', wav: 'audio', m4a: 'audio', ogg: 'audio', flac: 'audio', mpga: 'audio',
            mp4: 'video', webm: 'video', mpeg: 'video', mov: 'video',
            jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image',
            txt: 'text', md: 'text',
        };

        const detectedType = typeMap[ext];
        if (detectedType) {
            setSelectedType(detectedType);
            if (detectedType === 'image' && droppedFiles.length > 1) {
                setFiles(droppedFiles);
            } else {
                setFile(first);
            }
        }
    };

    const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
    const handleDragLeave = () => setDragOver(false);

    const handleSubmit = () => {
        if (selectedType === 'text' && textContent.trim()) {
            onProcess({ type: 'text', name: 'Pasted Lecture Notes', text: textContent.trim() });
        } else if (selectedType === 'text' && file) {
            onProcess({ type: 'textfile', name: file.name, file });
        } else if (selectedType === 'image' && files.length > 0) {
            onProcess({ type: 'images', name: `${files.length} images`, files });
        } else if (file) {
            onProcess({ type: selectedType, name: file.name, file });
        }
    };

    const canSubmit = (selectedType === 'text' && (textContent.trim() || file)) ||
        (selectedType === 'image' && (file || files.length > 0)) ||
        (selectedType && selectedType !== 'text' && selectedType !== 'image' && file);

    return (
        <div className="container animate-fade-in" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <button className="btn-secondary" onClick={onCancel} style={{ marginBottom: '2rem' }}>← Back</button>

            <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                Choose your <span className="gradient-text">Input Format</span>
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
                Upload any lecture material — we'll handle the rest
            </p>

            {/* Type selector grid */}
            <div className="stagger-children" style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem', maxWidth: '750px', margin: '0 auto 3rem',
            }}>
                {INPUT_TYPES.map(type => (
                    <button
                        key={type.id}
                        className={`glass-card input-type-card ${selectedType === type.id ? 'selected' : ''}`}
                        data-type={type.id}
                        onClick={() => { setSelectedType(type.id); resetSelection(); }}
                        style={{
                            padding: '1.5rem 1.25rem', textAlign: 'center', cursor: 'pointer',
                            border: selectedType === type.id ? '1px solid var(--primary)' : undefined,
                        }}
                    >
                        <div className="card-icon" style={{ fontSize: '2.2rem', marginBottom: '0.65rem' }}>{type.icon}</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>{type.label}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem', lineHeight: 1.4 }}>{type.desc}</div>
                    </button>
                ))}
            </div>

            {/* Upload zone */}
            {selectedType && selectedType !== 'text' && (
                <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div
                        className={`upload-zone ${dragOver ? 'drag-over' : ''} ${(file || files.length > 0) ? 'has-file' : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={currentType?.accept || ''}
                            multiple={selectedType === 'image'}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        {file ? (
                            <>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                                <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{file.name}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                    {(file.size / 1024 / 1024).toFixed(2)} MB — Click to change
                                </p>
                            </>
                        ) : files.length > 0 ? (
                            <>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                                <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{files.length} images selected</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                    Click to change selection
                                </p>
                            </>
                        ) : (
                            <>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{currentType?.icon || '📁'}</div>
                                <p style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                                    Drop your <strong>{currentType?.label}</strong> file here
                                </p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    or click to browse • Accepts {currentType?.accept}
                                </p>
                                {(selectedType === 'audio' || selectedType === 'video') && (
                                    <p style={{ color: 'var(--warning)', fontSize: '0.75rem', marginTop: '0.75rem' }}>
                                        ⚠️ Max 25MB — Transcription powered by Groq Whisper
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Text input */}
            {selectedType === 'text' && (
                <div className="animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Paste your lecture notes or text</h3>
                            <label style={{
                                fontSize: '0.8rem', color: 'var(--primary-light)', cursor: 'pointer',
                                padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--glass-border)',
                                transition: 'all var(--transition-fast)',
                            }}>
                                📎 Upload .txt
                                <input type="file" accept=".txt,.md" style={{ display: 'none' }} onChange={(e) => {
                                    if (e.target.files[0]) { setFile(e.target.files[0]); setTextContent(''); }
                                }} />
                            </label>
                        </div>
                        {file ? (
                            <div style={{
                                padding: '2rem', textAlign: 'center',
                                border: '1px dashed var(--success)', borderRadius: 'var(--radius-md)',
                                background: 'var(--success-surface)',
                            }}>
                                <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>✅ {file.name}</p>
                                <button className="btn-secondary" onClick={() => setFile(null)} style={{ marginTop: '1rem', fontSize: '0.8rem' }}>Remove</button>
                            </div>
                        ) : (
                            <textarea
                                value={textContent}
                                onChange={(e) => setTextContent(e.target.value)}
                                placeholder="Type or paste your lecture content here..."
                                style={{
                                    width: '100%', minHeight: '250px', padding: '1rem',
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--text-primary)',
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: '0.95rem', lineHeight: 1.7,
                                    resize: 'vertical', outline: 'none',
                                    transition: 'border-color var(--transition-fast)',
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Submit */}
            {selectedType && (
                <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                    <button
                        className="btn-primary"
                        disabled={!canSubmit}
                        onClick={handleSubmit}
                        style={{
                            padding: '1rem 3rem', fontSize: '1.05rem',
                            opacity: canSubmit ? 1 : 0.4,
                            cursor: canSubmit ? 'pointer' : 'not-allowed',
                        }}
                    >
                        🧠 Generate Smart Notes
                    </button>
                </div>
            )}
        </div>
    );
};

export default InputSection;
