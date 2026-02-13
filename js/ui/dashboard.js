import { db } from '../firebase.js';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';

export async function renderDashboard(container, app) {
    if (!app.user) {
        app.navigateTo('landing');
        return;
    }

    // 1. Fetch Data First (for stats)
    let notes = [];
    try {
        const q = query(
            collection(db, 'summaries'),
            where('userId', '==', app.user.uid),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        notes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
        console.error("Error fetching notes:", err);
        // We will handle render error below
    }

    // 2. Calculate Stats
    const totalNotes = notes.length;
    const totalQuizzes = notes.reduce((acc, note) => acc + (note.quiz ? 1 : 0), 0);

    // 3. Greeting Logic
    const hour = new Date().getHours();
    let greeting = 'Good Morning';
    if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
    if (hour >= 17) greeting = 'Good Evening';

    // 4. Render Layout
    container.innerHTML = `
        <div class="container animate-fade-in" style="max-width: 1200px; margin: 0 auto;">
            
            <!-- Header Section -->
            <div style="margin-bottom: 2rem;">
                <h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">
                    ${greeting}, <span class="text-gradient">${app.user.displayName?.split(' ')[0] || 'Scholar'}</span>
                </h1>
                <p style="color: var(--text-muted); font-size: 1.1rem;">Here's what you've studied recently.</p>
            </div>

            <!-- Stats Row -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 3rem;">
                <div class="glass-card" style="display: flex; align-items: center; gap: 1rem; padding: 1.25rem;">
                    <div style="width: 48px; height: 48px; background: rgba(99, 102, 241, 0.1); color: var(--primary); border-radius: 12px; display: grid; place-items: center;">
                        <i data-lucide="library"></i>
                    </div>
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 700;">${totalNotes}</div>
                        <div style="font-size: 0.9rem; color: var(--text-muted);">Lectures Analyzed</div>
                    </div>
                </div>
                
                <div class="glass-card" style="display: flex; align-items: center; gap: 1rem; padding: 1.25rem;">
                    <div style="width: 48px; height: 48px; background: rgba(16, 185, 129, 0.1); color: var(--success); border-radius: 12px; display: grid; place-items: center;">
                        <i data-lucide="check-circle-2"></i>
                    </div>
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 700;">${totalQuizzes}</div>
                        <div style="font-size: 0.9rem; color: var(--text-muted);">Quizzes Generated</div>
                    </div>
                </div>

                 <div class="glass-card" style="display: flex; align-items: center; gap: 1rem; padding: 1.25rem; cursor: pointer; border: 1px dashed var(--glass-border); background: transparent;" onclick="window.app.navigateTo('input')">
                    <div style="width: 48px; height: 48px; background: var(--bg-surface); color: var(--text-primary); border-radius: 12px; display: grid; place-items: center;">
                        <i data-lucide="plus"></i>
                    </div>
                    <div>
                        <div style="font-size: 1.1rem; font-weight: 600;">New Analysis</div>
                        <div style="font-size: 0.9rem; color: var(--text-muted);">Upload or paste content</div>
                    </div>
                </div>
            </div>

            <!-- Search & Filter -->
            <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                <div style="flex: 1; position: relative; min-width: 250px;">
                    <i data-lucide="search" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); width: 18px;"></i>
                    <input type="text" id="search-input" placeholder="Search your library..." style="
                        width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem;
                        background: var(--bg-card); border: 1px solid var(--glass-border);
                        border-radius: var(--radius-sm); color: white; outline: none;
                        transition: border-color 0.2s;
                    ">
                </div>
                <!-- Future: Dropdown for Type Filter -->
            </div>

            <!-- Content Grid -->
            <div id="notes-grid" style="
                display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 1.5rem; padding-bottom: 4rem;
            ">
                <!-- Cards Injected Here -->
            </div>
        </div>
    `;

    // 5. Render Cards
    const grid = container.querySelector('#notes-grid');

    if (notes.length === 0) {
        grid.style.display = 'block'; // Remove grid layout for empty state
        grid.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; color: var(--text-muted);">
                <div style="margin-bottom: 1.5rem; opacity: 0.3;">
                    <i data-lucide="ghost" width="64" height="64"></i>
                </div>
                <h3 style="font-size: 1.2rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem;">Nothing here yet</h3>
                <p style="margin-bottom: 2rem;">It's a bit empty in space. Start your journey!</p>
                <button class="btn-primary" onclick="window.app.navigateTo('input')">
                    Create First Analysis
                </button>
            </div>
        `;
    } else {
        renderNoteCards(grid, notes, app);
    }

    // 6. Search Functionality
    const searchInput = container.querySelector('#search-input');
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = notes.filter(n =>
            (n.topic && n.topic.toLowerCase().includes(term)) ||
            (n.summary.overview && n.summary.overview.toLowerCase().includes(term))
        );
        renderNoteCards(grid, filtered, app);
    });

    if (window.lucide) window.lucide.createIcons();
}

function renderNoteCards(container, notes, app) {
    container.innerHTML = '';

    if (notes.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No matches found.</p>`;
        return;
    }

    notes.forEach(data => {
        const card = document.createElement('div');
        card.className = 'glass-card animate-fade-in';
        card.style.cursor = 'pointer';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.height = '100%';
        card.style.position = 'relative';

        // Hover lift handled by CSS class .glass-card:hover

        // Helper for Date
        const timeAgo = (date) => {
            if (!date) return 'Recently';
            const seconds = Math.floor((new Date() - date) / 1000);
            if (seconds < 60) return 'Just now';
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `${minutes}m ago`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours}h ago`;
            const days = Math.floor(hours / 24);
            if (days < 7) return `${days}d ago`;
            return date.toLocaleDateString();
        };

        // Helper for Icons
        const getTypeConfig = (type) => {
            const map = {
                'pdf': { icon: 'file-text', color: '#f87171' },
                'ppt': { icon: 'presentation', color: '#fbbf24' },
                'audio': { icon: 'headphones', color: '#818cf8' },
                'video': { icon: 'video', color: '#38bdf8' },
                'text': { icon: 'align-left', color: '#a89efb' },
                'image': { icon: 'image', color: '#34d399' }
            };
            return map[type] || { icon: 'file', color: '#94a3b8' };
        };

        const typeConfig = getTypeConfig(data.type);
        const dateStr = data.createdAt ? timeAgo(data.createdAt.toDate()) : 'Unknown Date';

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="
                        width: 40px; height: 40px; border-radius: 10px;
                        background: ${typeConfig.color}15; color: ${typeConfig.color};
                        display: grid; place-items: center;
                        border: 1px solid ${typeConfig.color}30;
                    ">
                        <i data-lucide="${typeConfig.icon}" width="20"></i>
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.1rem;">${data.type}</div>
                        <div style="font-size: 0.75rem; color: var(--text-faint);">${dateStr}</div>
                    </div>
                </div>
                <button class="delete-btn" style="
                    width: 28px; height: 28px; display: grid; place-items: center;
                    color: var(--text-muted); background: transparent; border: none;
                    border-radius: 6px; cursor: pointer; transition: all 0.2s;
                ">
                    <i data-lucide="more-horizontal" width="16"></i>
                </button>
            </div>
            
            <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.75rem; line-height: 1.3; color: white;">
                ${data.topic || 'Untitled Analysis'}
            </h3>
            
            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: auto;">
                ${data.summary.overview || "No preview available."}
            </p>

            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: var(--text-muted);">
                    ${data.quiz ? `<span style="display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="help-circle" width="12"></i> Quiz</span>` : ''}
                    ${data.notes ? `<span style="display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="file-text" width="12"></i> Notes</span>` : ''}
                </div>
                <div style="color: var(--primary); font-size: 0.85rem; font-weight: 500;">View</div>
            </div>
        `;

        // Interactive Logic
        const delBtn = card.querySelector('.delete-btn');
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            import('./confirm-modal.js').then(({ showConfirmModal }) => {
                showConfirmModal(
                    `Delete "${data.topic || 'Note'}"?`,
                    async () => {
                        await deleteDoc(doc(db, 'summaries', data.id));
                        card.style.transform = 'scale(0.95)';
                        card.style.opacity = '0';
                        setTimeout(() => {
                            renderNoteCards(container, notes.filter(n => n.id !== data.id), app);
                        }, 200);
                    }
                );
            });
        });

        card.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            app.params.results = data;
            app.navigateTo('output');
        });

        container.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
}
