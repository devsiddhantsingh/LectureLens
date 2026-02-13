import React, { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const QuizTab = ({ quizData }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    if (!quizData || quizData.length === 0) {
        return (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤔</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Quiz Available</h3>
                <p style={{ color: 'var(--text-muted)' }}>The AI didn't generate a quiz for this lecture.</p>
            </div>
        );
    }

    const question = quizData[currentQuestion];

    const handleOptionSelect = (option) => {
        if (showResult) return;
        setSelectedOption(option);
        setShowResult(true);

        if (option === question.answer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedOption(null);
            setShowResult(false);
        } else {
            setIsFinished(true);
        }
    };

    const handleRetry = () => {
        setCurrentQuestion(0);
        setSelectedOption(null);
        setShowResult(false);
        setScore(0);
        setIsFinished(false);
    };

    if (isFinished) {
        const percentage = Math.round((score / quizData.length) * 100);
        let message = "Keep Learning!";
        if (percentage >= 80) message = "Excellent Transformation! 🌟";
        else if (percentage >= 60) message = "Good Job! 👍";

        return (
            <div className="glass-card animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                    {percentage >= 60 ? '🏆' : '📚'}
                </div>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 800 }}>
                    Score: {score} / {quizData.length}
                </h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--primary-light)', marginBottom: '2rem' }}>
                    {message}
                </p>
                <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', marginBottom: '2rem', overflow: 'hidden' }}>
                    <div style={{
                        width: `${percentage}%`, height: '100%',
                        background: percentage >= 60 ? 'var(--success)' : 'var(--warning)',
                        transition: 'width 1s ease'
                    }}></div>
                </div>
                <button className="btn-primary" onClick={handleRetry}>
                    <RefreshCw size={18} /> Retry Quiz
                </button>
            </div>
        );
    }

    return (
        <div className="glass-card animate-slide-up" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <span className="tag">Question {currentQuestion + 1} of {quizData.length}</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Score: {score}</span>
            </div>

            {/* Question */}
            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '2rem', lineHeight: 1.5 }}>
                {question.question}
            </h3>

            {/* Options */}
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                {question.options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const isCorrect = option === question.answer;

                    let style = {
                        padding: '1rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--glass-border)',
                        background: 'rgba(255,255,255,0.02)',
                        textAlign: 'left',
                        cursor: showResult ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    };

                    if (showResult) {
                        if (isSelected && isCorrect) {
                            style.background = 'rgba(52, 211, 153, 0.2)'; // Success
                            style.borderColor = 'var(--success)';
                        } else if (isSelected && !isCorrect) {
                            style.background = 'rgba(248, 113, 113, 0.2)'; // Error
                            style.borderColor = 'var(--danger)';
                        } else if (isCorrect) {
                            style.background = 'rgba(52, 211, 153, 0.1)'; // Show correct
                            style.borderColor = 'var(--success)';
                        }
                    } else if (isSelected) {
                        style.background = 'var(--primary-surface)';
                        style.borderColor = 'var(--primary)';
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(option)}
                            disabled={showResult}
                            className={!showResult ? "quiz-option-hover" : ""}
                            style={style}
                        >
                            <span style={{ fontSize: '1rem' }}>{option}</span>
                            {showResult && isCorrect && <CheckCircle size={20} color="var(--success)" />}
                            {showResult && isSelected && !isCorrect && <XCircle size={20} color="var(--danger)" />}
                        </button>
                    );
                })}
            </div>

            {/* Explanation & Next */}
            {showResult && (
                <div className="animate-fade-in">
                    <div style={{
                        padding: '1rem', background: 'rgba(255,255,255,0.03)',
                        borderRadius: 'var(--radius-md)', marginBottom: '1.5rem',
                        borderLeft: '3px solid var(--primary)'
                    }}>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--primary-light)' }}>
                            Explanation:
                        </p>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                            {question.explanation}
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <button className="btn-primary" onClick={handleNext}>
                            {currentQuestion < quizData.length - 1 ? 'Next Question →' : 'Finish Quiz'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizTab;
