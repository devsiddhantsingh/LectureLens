import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { askLecture } from '../utils/summarizer';

const ChatTab = ({ lectureText }) => {
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hi! I've analyzed this lecture. Ask me anything about specific topics, formulas, or details." }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const answer = await askLecture(userMsg, lectureText);
            setMessages(prev => [...prev, { role: 'ai', content: answer }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error answering that. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="glass-card animate-slide-up" style={{
            height: '600px', display: 'flex', flexDirection: 'column',
            maxWidth: '900px', margin: '0 auto', overflow: 'hidden'
        }}>
            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        display: 'flex', gap: '0.75rem',
                        alignItems: 'flex-start',
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                    }}>
                        {msg.role === 'ai' && (
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: 'var(--gradient-primary)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                <Bot size={18} color="white" />
                            </div>
                        )}
                        <div style={{
                            padding: '1rem 1.25rem',
                            borderRadius: '18px',
                            background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                            borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
                            borderTopLeftRadius: msg.role === 'ai' ? '4px' : '18px',
                            lineHeight: 1.6,
                            fontSize: '0.95rem'
                        }}>
                            {msg.content}
                        </div>
                        {msg.role === 'user' && (
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                <User size={18} color="var(--text-muted)" />
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: 'var(--gradient-primary)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Bot size={18} color="white" />
                        </div>
                        <div className="typing-indicator" style={{
                            padding: '1rem', background: 'rgba(255,255,255,0.05)',
                            borderRadius: '18px', borderTopLeftRadius: '4px',
                            color: 'var(--text-muted)', fontSize: '0.9rem'
                        }}>
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div style={{
                padding: '1.25rem', borderTop: '1px solid var(--glass-border)',
                background: 'rgba(0,0,0,0.2)', display: 'flex', gap: '1rem'
            }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question about the lecture..."
                    style={{
                        flex: 1, padding: '0.9rem', borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)',
                        color: 'white', outline: 'none', fontSize: '0.95rem'
                    }}
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className="btn-primary"
                    style={{ padding: '0 1.5rem', borderRadius: 'var(--radius-md)' }}
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};

export default ChatTab;
