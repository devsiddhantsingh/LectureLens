import { askLecture } from '../utils/summarizer.js';

export function renderOutput(container, app) {
    const { results } = app.params;
    if (!results) {
        app.navigateTo('input');
        return;
    }

    container.innerHTML = `
        <div class="container" style="padding-top: 2rem;">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <div>
                    <button class="btn-icon" id="btn-back-output" style="margin-bottom: 0.5rem;">
                        <i data-lucide="arrow-left"></i>
                    </button>
                    <h2 style="font-size: 1.8rem; font-weight: 700;">Lecture Analysis</h2>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button class="btn-secondary" id="btn-save" title="Save to Dashboard">
                        <i data-lucide="save"></i> Save
                    </button>
                    <button class="btn-primary" onclick="window.print()">
                        <i data-lucide="download"></i> Export
                    </button>
                </div>
            </div>

            <!-- Content Grid -->
            <div class="output-grid">
                <!-- Left Column: Notes & Summary -->
                <div class="glass-card" style="display: flex; flex-direction: column; height: 80vh;">
                    <div class="tabs" style="margin: 1rem;">
                        <button class="tab active" data-tab="summary">Summary</button>
                        <button class="tab" data-tab="notes">Detailed Notes</button>
                    </div>
                    
                    <div id="content-area" class="scroll-area" style="flex: 1;">
                        <!-- Content Injected Here -->
                    </div>
                </div>

                <!-- Right Column: Quiz & Chat -->
                <div class="glass-card" style="display: flex; flex-direction: column; height: 80vh;">
                    <div class="tabs" style="margin: 1rem;">
                        <button class="tab active" data-tab="quiz">Quiz</button>
                        <button class="tab" data-tab="chat">Ask AI</button>
                    </div>

                    <div id="interactive-area" class="scroll-area" style="flex: 1;">
                        <!-- Interactive Content Injected Here -->
                    </div>
                </div>
            </div>
        </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Elements
    const contentArea = container.querySelector('#content-area');
    const interactiveArea = container.querySelector('#interactive-area');
    const tabs = container.querySelectorAll('.tab');

    // State
    const state = {
        activeLeft: 'summary',
        activeRight: 'quiz',
        quizScore: 0
    };

    // Render Initial Content
    renderLeftContent(contentArea, state.activeLeft, results);
    renderRightContent(interactiveArea, state.activeRight, results, app);

    // Tab Logic
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const isRightSide = tab.parentElement.parentElement.parentElement.classList.contains('output-grid');
            // Better detection: check if parent container is left or right column
            const parentCard = tab.closest('.glass-card');
            const isRightColumn = parentCard.nextElementSibling === null; // Right column is last in grid? No, logic depends on grid order.
            // Let's use the tab data attribute which is unique enough
            const mode = tab.dataset.tab;

            if (['summary', 'notes'].includes(mode)) {
                // Left Column
                container.querySelectorAll('.tab[data-tab="summary"], .tab[data-tab="notes"]').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                state.activeLeft = mode;
                renderLeftContent(contentArea, mode, results);
            } else {
                // Right Column
                container.querySelectorAll('.tab[data-tab="quiz"], .tab[data-tab="chat"]').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                state.activeRight = mode;
                renderRightContent(interactiveArea, mode, results, app);
            }
        });
    });

    // Navigation
    // Save Logic
    const saveBtn = container.querySelector('#btn-save');
    saveBtn.addEventListener('click', async () => {
        if (!app.user) {
            alert("Please log in to save your notes.");
            return;
        }

        const originalText = saveBtn.innerHTML;
        saveBtn.disabled = true;
        saveBtn.innerHTML = `<span class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></span> Saving...`;

        try {
            // Import dynamically to avoid loading firebase if not needed immediately
            const { db } = await import('../firebase.js');
            const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');

            // Construct Data Payload
            const saveData = {
                userId: app.user.uid,
                type: results.type || 'text',
                topic: results.topic || 'Untitled Analysis',
                summary: results.summary,
                notes: results.notes,
                quiz: results.quiz,
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, 'summaries'), saveData);

            saveBtn.innerHTML = `<i data-lucide="check"></i> Saved!`;
            saveBtn.style.borderColor = 'var(--success)';
            saveBtn.style.color = 'var(--success)';

            setTimeout(() => {
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;
                saveBtn.style.borderColor = '';
                saveBtn.style.color = '';
                if (window.lucide) window.lucide.createIcons();
            }, 3000);

        } catch (err) {
            console.error("Save Error:", err);
            saveBtn.innerHTML = `<i data-lucide="x"></i> Error`;
            saveBtn.style.borderColor = 'var(--danger)';
            alert("Failed to save: " + err.message);
            saveBtn.disabled = false;
        }
    });

    // PDF Export Logic
    const exportBtn = container.querySelector('button.btn-primary[onclick="window.print()"]');
    // Remove old onclick attribute
    exportBtn.removeAttribute('onclick');
    exportBtn.addEventListener('click', () => {
        const originalText = exportBtn.innerHTML;
        exportBtn.innerHTML = `<span class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></span> Generating...`;

        import(`../utils/pdf-exporter.js?t=${Date.now()}`).then(({ exportToPDF }) => {
            exportToPDF(results);
            exportBtn.innerHTML = originalText;
            if (window.lucide) window.lucide.createIcons();
        }).catch(err => {
            console.error("PDF Error:", err);
            alert("Failed to generate PDF. Please try again.");
            exportBtn.innerHTML = originalText;
        });
    });
}

function renderLeftContent(container, mode, results) {
    container.innerHTML = '';
    container.scrollTop = 0;

    if (mode === 'summary') {
        const { summary } = results;
        container.innerHTML = `
            <div class="animate-fade-in">
                <h3 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 1rem;">Executive Summary</h3>
                <p style="font-size: 1rem; line-height: 1.7; margin-bottom: 2rem;">${summary.overview}</p>

                <h4 style="font-size: 1.1rem; font-weight: 600; color: var(--accent);">✨ Key Highlights</h4>
                <ul style="list-style: none; padding: 0; margin-top: 0.5rem; margin-bottom: 2rem;">
                    ${summary.highlights.map(h => `<li style="margin-bottom: 0.5rem; padding-left: 1.5rem; position: relative;"><span style="position: absolute; left: 0; color: var(--accent);">•</span>${h}</li>`).join('')}
                </ul>

                <h4 style="font-size: 1.1rem; font-weight: 600; color: var(--warning);">🎓 Exam Tips</h4>
                <div style="background: var(--warning-surface); padding: 1rem; border-radius: var(--radius-sm); border-left: 3px solid var(--warning); margin-bottom: 2rem;">
                    ${summary.examTip}
                </div>

                 <h4 style="font-size: 1.1rem; font-weight: 600; color: var(--primary);">🔑 Key Takeaway</h4>
                 <p style="font-style: italic; color: var(--text-secondary);">${summary.keyTakeaway}</p>
            </div>
        `;
    } else if (mode === 'notes') {
        container.innerHTML = `
            <div class="animate-fade-in">
                ${results.notes.map(topic => `
                    <div style="margin-bottom: 3rem;">
                        <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--primary-light); margin-bottom: 0.75rem;">${topic.topic}</h3>
                        <p style="margin-bottom: 1rem; line-height: 1.7;">${topic.content}</p>

                        ${topic.definitions?.length ? `
                            <div style="margin-bottom: 1rem;">
                                <strong style="color: var(--text-faint); font-size: 0.85rem; text-transform: uppercase;">Definitions</strong>
                                <ul style="list-style: none; padding-left: 0; margin-top: 0.25rem;">
                                    ${topic.definitions.map(d => `<li style="font-size: 0.95rem; margin-bottom: 0.25rem; color: var(--text-secondary);">${d}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}

                        ${topic.examples?.length ? `
                            <div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: var(--radius-sm);">
                                <strong style="color: var(--success);">Example:</strong>
                                <p style="margin-top: 0.25rem; font-size: 0.95rem;">${topic.examples[0]}</p>
                            </div>
                        ` : ''}
                    </div>
                `).join('<hr style="border: 0; border-top: 1px solid var(--glass-border); margin: 2rem 0;">')}
            </div>
        `;
    }
}

function renderRightContent(container, mode, results, app) {
    container.innerHTML = '';

    if (mode === 'quiz') {
        const { quiz } = results;
        const quizContainer = document.createElement('div');
        quizContainer.className = 'animate-fade-in';

        quiz.forEach((q, index) => {
            const qEl = document.createElement('div');
            qEl.style.marginBottom = '2rem';
            qEl.innerHTML = `
                <p style="font-weight: 600; margin-bottom: 1rem;">${index + 1}. ${q.question}</p>
                <div class="options-grid" style="display: grid; gap: 0.5rem;">
                    ${q.options.map((opt, i) => `
                        <button class="quiz-option quiz-option-hover" data-idx="${i}" style="
                            padding: 0.75rem 1rem; text-align: left; background: rgba(0,0,0,0.2);
                            border: 1px solid var(--glass-border); border-radius: var(--radius-sm);
                            color: var(--text-secondary); cursor: pointer; transition: all 0.2s;
                        ">${opt}</button>
                    `).join('')}
                </div>
                <div class="feedback" style="margin-top: 0.75rem; font-size: 0.9rem; display: none;"></div>
            `;

            // Add Click Handlers
            const options = qEl.querySelectorAll('.quiz-option');
            const feedback = qEl.querySelector('.feedback');

            options.forEach(btn => {
                btn.addEventListener('click', () => {
                    const selected = btn.textContent;
                    const isCorrect = selected === q.answer;

                    // Disable all options
                    options.forEach(b => {
                        b.disabled = true;
                        b.classList.remove('quiz-option-hover');
                        if (b.textContent === q.answer) {
                            b.style.background = 'var(--success-surface)';
                            b.style.borderColor = 'var(--success)';
                            b.style.color = 'var(--success)';
                        } else if (b === btn && !isCorrect) {
                            b.style.background = 'var(--danger-surface)';
                            b.style.borderColor = 'var(--danger)';
                            b.style.color = 'var(--danger)';
                        }
                    });

                    feedback.style.display = 'block';
                    feedback.innerHTML = isCorrect
                        ? `<span style="color: var(--success);">Checking... Correct! 🎉</span>`
                        : `<span style="color: var(--danger);">Incorrect.</span> The correct answer is: ${q.answer}`;

                    if (!isCorrect) {
                        feedback.innerHTML += `<br><span style="color: var(--text-muted); font-size: 0.85rem;">${q.explanation}</span>`;
                    }
                });
            });

            quizContainer.appendChild(qEl);
        });
        container.appendChild(quizContainer);

    } else if (mode === 'chat') {
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%;">
                <div id="chat-messages" style="flex: 1; overflow-y: auto; padding-right: 0.5rem; display: flex; flex-direction: column; gap: 1rem;">
                    <div style="align-self: flex-start; background: var(--bg-secondary); padding: 0.75rem 1rem; border-radius: var(--radius-md) var(--radius-md) var(--radius-md) 0; max-width: 85%;">
                        Hello! 👋 I've analyzed your lecture. Ask me anything about specific topics or definitions!
                    </div>
                </div>
                <form id="chat-form" style="margin-top: 1rem; position: relative;">
                    <input type="text" id="chat-input" placeholder="Ask a question..." style="
                        width: 100%; padding: 0.8rem 3rem 0.8rem 1rem;
                        background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border);
                        border-radius: var(--radius-md); color: white; outline: none;
                    ">
                    <button type="submit" style="
                        position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%);
                        background: none; border: none; color: var(--primary-light); cursor: pointer;
                    ">
                        <i data-lucide="send" width="18"></i>
                    </button>
                </form>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();

        const chatForm = container.querySelector('#chat-form');
        const chatInput = container.querySelector('#chat-input');
        const messages = container.querySelector('#chat-messages');

        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const question = chatInput.value.trim();
            if (!question) return;

            // Add User Message
            addMessage(messages, question, true);
            chatInput.value = '';

            // Loading State
            const loadingId = addMessage(messages, '<span class="typing-indicator">...</span>', false);

            try {
                const answer = await askLecture(question, results.extractedText);
                updateMessage(messages, loadingId, answer);
            } catch (err) {
                updateMessage(messages, loadingId, "Sorry, I encountered an error answering that.");
            }
        });
    }
}

function addMessage(container, text, isUser) {
    const msg = document.createElement('div');
    const id = Date.now();
    msg.id = `msg-${id}`;
    msg.style.alignSelf = isUser ? 'flex-end' : 'flex-start';
    msg.style.background = isUser ? 'var(--primary-surface)' : 'var(--bg-secondary)';
    msg.style.color = isUser ? 'var(--primary-light)' : 'var(--text-primary)';
    msg.style.padding = '0.75rem 1rem';
    msg.style.borderRadius = isUser
        ? 'var(--radius-md) var(--radius-md) 0 var(--radius-md)'
        : 'var(--radius-md) var(--radius-md) var(--radius-md) 0';
    msg.style.maxWidth = '85%';
    msg.style.border = isUser ? '1px solid var(--primary-surface)' : '1px solid var(--glass-border)';
    msg.innerHTML = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
    return id;
}

function updateMessage(container, id, text) {
    const msg = container.querySelector(`#msg-${id}`);
    if (msg) {
        msg.innerHTML = text; // Replace loading indicator
        container.scrollTop = container.scrollHeight; // Auto-scroll
    }
}
