import React, { useState, useEffect } from 'react';

const steps = [
    { id: 'parse', label: 'Parsing content', icon: '📄' },
    { id: 'summarize', label: 'Generating AI summary', icon: '🧠' },
    { id: 'finalize', label: 'Finalizing output', icon: '✨' },
];

const ProcessingView = ({ data, currentStep, error, onBack, onRetry }) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const getStepStatus = (stepIndex) => {
        const isAnalyzing = currentStep && currentStep.startsWith('Analyzing');
        const effectiveStep = isAnalyzing ? 'parse' : currentStep;

        const activeIndex = steps.findIndex(s => s.id === effectiveStep);
        if (stepIndex < activeIndex) return 'completed';
        if (stepIndex === activeIndex) return 'active';
        return 'pending';
    };

    return (
        <div className="container animate-fade-in" style={{
            paddingTop: '8rem', paddingBottom: '4rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
            {/* Spinner */}
            {!error && (
                <div style={{ marginBottom: '2rem' }}>
                    <div className="spinner" style={{ width: 64, height: 64, borderWidth: 4 }}></div>
                </div>
            )}

            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                {error ? '❌ Error' : (
                    <>Processing <span className="gradient-text">{data?.name || 'content'}</span>{dots}</>
                )}
            </h2>

            {error ? (
                <div style={{
                    marginTop: '1.5rem', padding: '1.5rem 2rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    maxWidth: '500px', textAlign: 'center',
                }}>
                    <p style={{ color: '#fca5a5', marginBottom: '1.5rem' }}>{error}</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        {onBack && <button className="btn-secondary" onClick={onBack}>← Go Back</button>}
                        {onRetry && <button className="btn-primary" onClick={onRetry}>🔄 Retry</button>}
                    </div>
                </div>
            ) : (
                <>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', textAlign: 'center' }}>
                        Our AI is analyzing your content. This may take a moment.
                    </p>

                    {/* Steps */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', width: '100%' }}>
                        {steps.map((step, i) => {
                            const status = getStepStatus(i);
                            const isAnalyzing = currentStep && currentStep.startsWith('Analyzing');
                            const label = (step.id === 'parse' && isAnalyzing) ? currentStep : step.label;

                            return (
                                <div key={step.id} className={`step-indicator ${status}`}>
                                    <div className="step-dot"></div>
                                    <span style={{ fontSize: '1.25rem' }}>{step.icon}</span>
                                    <span style={{
                                        color: status === 'active' ? 'var(--text-primary)' :
                                            status === 'completed' ? 'var(--success)' :
                                                'var(--text-muted)',
                                        fontWeight: status === 'active' ? 600 : 400,
                                        fontSize: '0.95rem',
                                    }}>
                                        {label}
                                        {status === 'completed' && ' ✓'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginTop: '2.5rem', maxWidth: '400px', width: '100%' }}>
                        <div className="progress-bar-track">
                            <div className="progress-bar-fill" style={{
                                width: `${((steps.findIndex(s => s.id === (currentStep && currentStep.startsWith('Analyzing') ? 'parse' : currentStep)) + 1) / steps.length) * 100}%`
                            }}></div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProcessingView;
