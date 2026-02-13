import React, { useEffect, useRef, useState } from 'react';
import FOG from 'vanta/dist/vanta.fog.min';
import * as THREE from 'three';

const LandingPage = ({ onStart, onViewDashboard, currentUser }) => {
    const vantaRef = useRef(null);
    const [vantaEffect, setVantaEffect] = useState(null);

    useEffect(() => {
        if (!vantaEffect && vantaRef.current) {
            setVantaEffect(
                FOG({
                    el: vantaRef.current,
                    THREE,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.0,
                    minWidth: 200.0,
                    highlightColor: 0x7c6ef0, // Primary Indigo
                    midtoneColor: 0x2dd4bf,   // Teal Accent
                    lowlightColor: 0x111122,  // Deep Blue-Black
                    baseColor: 0x06070a,      // Background
                    blurFactor: 0.6,
                    speed: 1.2,
                    zoom: 0.5,
                })
            );
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Navigation */}
            <nav className="container" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1.5rem 2rem', position: 'relative', zIndex: 10,
                background: 'rgba(6, 7, 10, 0.4)', backdropFilter: 'blur(10px)',
                borderRadius: '0 0 24px 24px', borderBottom: '1px solid var(--glass-border)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="logo-mark">L</div>
                    <span style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.3px' }}>
                        Lecture<span className="gradient-text">Lens</span>
                    </span>
                </div>
                <button className="btn-secondary" onClick={onViewDashboard} style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                    {currentUser ? `📚 ${currentUser.displayName.split(' ')[0]}'s Notes` : '📚 My Notes'}
                </button>
            </nav>

            {/* Hero Section with Vanta FOG Background */}
            <main
                ref={vantaRef}
                style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    textAlign: 'center', padding: '4rem 2rem',
                    gap: '2rem', position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Overlay Gradient for better text readability */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle at center, transparent 0%, rgba(6,7,10,0.8) 100%)',
                    zIndex: 1, pointerEvents: 'none'
                }}></div>

                {/* Content overlay */}
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem' }}>
                    {/* Badge */}
                    <div className="badge-pill animate-fade-in" style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 0 20px rgba(124, 110, 240, 0.2)',
                    }}>
                        ✨ AI-Powered Study Companion
                    </div>

                    {/* Heading */}
                    <h1 className="animate-slide-up" style={{
                        fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                        fontWeight: 800, lineHeight: 1.05,
                        maxWidth: '900px', letterSpacing: '-2px',
                        textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    }}>
                        Master Any Lecture <br />
                        <span className="gradient-text" style={{ filter: 'drop-shadow(0 0 20px rgba(124, 110, 240, 0.3))' }}>
                            in Seconds
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="animate-slide-up" style={{
                        fontSize: '1.15rem', color: 'var(--text-muted)',
                        maxWidth: '600px', lineHeight: 1.8,
                        animationDelay: '0.1s',
                    }}>
                        Upload PPTs, PDFs, audio, video, or images.
                        Get AI-powered structured notes and summaries in seconds.
                    </p>

                    {/* Supported formats ribbon */}
                    <div className="animate-fade-in" style={{
                        display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center',
                        animationDelay: '0.15s',
                    }}>
                        {['📊 PPT', '📄 PDF', '🎙️ Audio', '🎬 Video', '🖼️ Images', '📝 Text'].map(f => (
                            <span key={f} className="tag">{f}</span>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="animate-slide-up" style={{ display: 'flex', gap: '1rem', animationDelay: '0.2s' }}>
                        <button className="btn-primary" onClick={onStart} style={{ padding: '1rem 2.5rem', fontSize: '1.05rem' }}>
                            🚀 Get Started
                        </button>
                        <button className="btn-secondary" onClick={onViewDashboard} style={{ padding: '1rem 2rem' }}>
                            View Dashboard
                        </button>
                    </div>
                </div>
            </main>

            {/* Feature Cards — below the Vanta hero */}
            <section className="container" style={{ paddingBottom: '4rem' }}>
                <div className="stagger-children" style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1.5rem', maxWidth: '900px', width: '100%', margin: '0 auto',
                }}>
                    {[
                        { icon: '📝', title: 'Smart Notes', desc: 'Topic-wise structured notes from any lecture format' },
                        { icon: '🎙️', title: 'AI Transcription', desc: 'Whisper-powered transcription for audio & video lectures' },
                        { icon: '💡', title: 'Summaries', desc: 'Executive summaries with exam tips and key takeaways' },
                        { icon: '🖼️', title: 'Image Analysis', desc: 'Extract notes from whiteboard photos & slide images' },
                        { icon: '📊', title: 'Multi-Format', desc: 'Supports PPT, PDF, audio, video, images & text' },
                    ].map((feature, i) => (
                        <div key={i} className="glass-card feature-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
                            <div style={{
                                fontSize: '2.2rem', marginBottom: '0.85rem',
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                            }}>{feature.icon}</div>
                            <h3 style={{
                                fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem',
                                color: 'var(--text-primary)',
                            }}>{feature.title}</h3>
                            <p style={{
                                fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6,
                            }}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="container" style={{
                textAlign: 'center', padding: '2rem',
                color: 'var(--text-faint)', fontSize: '0.8rem',
                borderTop: '1px solid var(--glass-border)',
            }}>
                Built with ❤️ using React & Groq AI
            </footer>
        </div>
    );
};

export default LandingPage;
