import { CONFIG } from './config.js';
import { initAuth } from './auth.js';
// import { renderLanding } from './ui/landing.js';

class App {
    constructor() {
        this.currentView = 'landing';
        this.user = null;
        this.params = {}; // Store data passed between views (e.g. parsed text)

        this.init();
    }

    async init() {
        console.log('App Initializing...');

        // Initialize Auth and wait for first result
        this.user = await initAuth((user) => this.onAuthChange(user));

        // If user is logged in, go to dashboard. Else landing.
        // In a real router, we'd check window.location.hash/path
        if (this.user) {
            this.navigateTo('dashboard');
        } else {
            this.navigateTo('landing');
        }
    }

    onAuthChange(user) {
        this.user = user;
        console.log('User state changed:', user);
        // Re-render current view if needed (e.g. update nav bar)
        if (this.currentView === 'landing') {
            this.navigateTo('landing');
        } else if (this.currentView === 'dashboard') {
            this.navigateTo('dashboard');
        }
    }

    navigateTo(viewId, params = {}) {
        console.log(`Navigating to: ${viewId}`, params);
        this.currentView = viewId;
        this.params = { ...this.params, ...params };

        // Auth Guard
        const protectedViews = ['dashboard', 'input', 'processing', 'output'];
        if (protectedViews.includes(viewId) && !this.user) {
            console.warn('Unauthorized access to', viewId);
            this.showAuthModal();
            if (this.currentView !== 'landing') {
                this.currentView = 'landing';
                viewId = 'landing';
            }
        }

        // 1. Toggle High-Level Layout (Landing vs Shell)
        const landingEl = document.getElementById('view-landing');
        const shellEl = document.getElementById('shell');

        if (viewId === 'landing') {
            landingEl.classList.remove('hidden');
            shellEl.classList.add('hidden');
            // Render landing logic
            this.renderView('landing');
            return;
        } else {
            landingEl.classList.add('hidden');
            shellEl.classList.remove('hidden');
        }

        // 2. Handle Shell Navigation (Sidebar Active State)
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.target === viewId);
        });

        // 3. Update Page Title
        const titles = {
            'dashboard': 'My Library',
            'input': 'New Analysis',
            'processing': 'Processing...',
            'output': 'Analysis Result'
        };
        const titleEl = document.getElementById('page-title');
        if (titleEl) titleEl.textContent = titles[viewId] || 'LectureLens';

        // 4. Toggle Inner Views
        const container = document.getElementById('view-container');
        // Hide all direct children views
        ['dashboard', 'input', 'processing', 'output'].forEach(id => {
            const el = document.getElementById(`view-${id}`);
            if (el) el.classList.add('hidden');
        });

        // Show target
        const target = document.getElementById(`view-${viewId}`);
        if (target) {
            target.classList.remove('hidden');
            this.renderView(viewId);
        }

        if (window.lucide) window.lucide.createIcons();
    }

    async renderView(viewId) {
        const container = document.getElementById(`view-${viewId}`);
        container.innerHTML = ''; // Clear previous content

        switch (viewId) {
            case 'landing':
                import(`./ui/landing.js?v=${Date.now()}`).then(module => {
                    module.renderLanding(container, this);
                });
                break;
            case 'dashboard':
                import('./ui/dashboard.js').then(module => module.renderDashboard(container, this));
                // container.innerHTML = '<h1>Dashboard (Coming Soon)</h1><button onclick="window.app.navigateTo(\'landing\')">Back</button>';
                break;
            case 'input':
                import('./ui/input.js').then(module => module.renderInput(container, this));
                break;
            case 'processing':
                import('./ui/processing.js').then(module => module.renderProcessing(container, this));
                break;
            case 'output':
                import('./ui/output.js').then(module => module.renderOutput(container, this));
                break;
            default:
                container.innerHTML = '<h1>404 View Not Found</h1>';
        }
    }

    showAuthModal() {
        const modalContainer = document.getElementById('modal-container');
        import('./ui/auth-modal.js').then(module => module.renderAuthModal(modalContainer));
    }
}

// Expose app instance globally for inline event handlers
window.app = new App();

// Global Event Listeners for Shell Navigation
document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Links
    document.querySelectorAll('.nav-link[data-target]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.dataset.target;
            window.app.navigateTo(target);
        });
    });

    // Logout
    document.getElementById('nav-logout').addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const { logout } = await import('./auth.js');
            await logout();
            window.app.navigateTo('landing');
        } catch (err) {
            console.error("Logout failed:", err);
        }
    });
});
