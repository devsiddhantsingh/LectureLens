import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const Dashboard = ({ onBack, onNewLecture, savedItems: localItems, currentUser, onLogin, onLogout }) => {
    const [cloudItems, setCloudItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            setCloudItems([]);
            return;
        }

        setLoading(true);
        const q = query(collection(db, 'users', currentUser.uid, 'lectures'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() });
            });
            setCloudItems(items);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    // Merge or switch between local vs cloud
    const displayItems = currentUser ? cloudItems : localItems;

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
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {currentUser ? (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                {currentUser.displayName}
                            </span>
                            <button className="btn-secondary" onClick={onLogout} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button className="btn-secondary" onClick={onLogin} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                            Login to Sync
                        </button>
                    )}
                    <button className="btn-primary" onClick={onNewLecture}>
                        + New Lecture
                    </button>
                </div>
            </div>

            {/* Empty State */}
            {!loading && displayItems.length === 0 && (
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

            {/* Loading State */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                    <p style={{ color: 'var(--text-muted)' }}>Syncing your library...</p>
                </div>
            )}

            {/* Saved Items Grid */}
            {!loading && displayItems.length > 0 && (
                <div className="stagger-children" style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '1.5rem',
                }}>
                    {displayItems.map((item, i) => (
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
