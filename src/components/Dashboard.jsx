import React from 'react';

const Dashboard = ({ onBack, onNewLecture, savedItems }) => {
    const items = savedItems || [];

    return (
        <div className="container animate-fade-in" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
            {/* Header */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '3rem',
            }}>
                <div>
                    <button className="btn-secondary" onClick={onBack} style={{ marginBottom: '1rem' }}>
                        ← Home
                    </button>
                    <h2 style={{ fontSize: '2rem' }}>
                        My <span className="gradient-text">Dashboard</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        {items.length} saved {items.length === 1 ? 'lecture' : 'lectures'}
                    </p>
                </div>
                <button className="btn-primary" onClick={onNewLecture}>
                    + New Lecture
                </button>
            </div>

            {/* Empty State */}
            {items.length === 0 && (
                <div className="glass-card" style={{
                    padding: '4rem', textAlign: 'center',
                    maxWidth: '500px', margin: '0 auto',
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📚</div>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>No saved lectures yet</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Upload a PPT or paste lecture text to get started.
                    </p>
                    <button className="btn-primary" onClick={onNewLecture}>
                        🚀 Upload First Lecture
                    </button>
                </div>
            )}

            {/* Saved Items Grid */}
            {items.length > 0 && (
                <div className="stagger-children" style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '1.5rem',
                }}>
                    {items.map((item, i) => (
                        <div key={i} className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer' }}>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'flex-start', marginBottom: '1rem',
                            }}>
                                <div>
                                    <span className="tag">{item.type === 'ppt' ? 'PPT' : 'Text'}</span>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.5rem' }}>
                                        {item.name}
                                    </h3>
                                </div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                    {item.date}
                                </span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                                {item.summary?.keyTakeaway || 'AI-generated notes and mind map available.'}
                            </p>
                            <div style={{
                                display: 'flex', gap: '0.5rem', marginTop: '1rem',
                            }}>
                                <span className="tag">📝 Notes</span>
                                <span className="tag">🧠 Mind Map</span>
                                <span className="tag">💡 Summary</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
