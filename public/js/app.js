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

        // Update UI info
        if (user) {
            const initial = user.displayName ? user.displayName[0].toUpperCase() : 'U';
            document.getElementById('user-initial').textContent = initial;

            // Update Modal Info
            const modalInitial = document.getElementById('modal-user-initial');
            const modalName = document.getElementById('modal-user-name');
            const modalEmail = document.getElementById('modal-user-email');

            if (modalInitial) modalInitial.textContent = initial;
            if (modalName) modalName.textContent = user.displayName || 'Scholar';
            if (modalEmail) modalEmail.textContent = user.email;
        }

        // Re-render current view if needed (e.g. update nav bar)
        if (this.currentView === 'landing' || this.currentView === 'dashboard') {
            this.navigateTo(this.currentView);
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
                import(`./ui/dashboard.js?v=${Date.now()}`).then(module => module.renderDashboard(container, this));
                break;
            case 'input':
                import(`./ui/input.js?v=${Date.now()}`).then(module => module.renderInput(container, this));
                break;
            case 'processing':
                import(`./ui/processing.js?v=${Date.now()}`).then(module => module.renderProcessing(container, this));
                break;
            case 'output':
                import(`./ui/output.js?v=${Date.now()}`).then(module => module.renderOutput(container, this));
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
// Global Event Listeners for Shell Navigation
document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Bottom Nav Logic ---
    const mobileLinks = document.querySelectorAll('.mobile-link[data-target]');
    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.dataset.target;
            window.app.navigateTo(target);

            // Update Active State
            document.querySelectorAll('.mobile-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // --- Profile Modal Logic ---
    const modalOverlay = document.getElementById('profile-modal-overlay');

    const openModal = () => {
        if (modalOverlay) {
            modalOverlay.classList.remove('hidden');
            // Populate data if needed, though onAuthChange does it too
            const user = window.app.user;
            if (user) {
                const initial = user.displayName ? user.displayName[0].toUpperCase() : 'U';
                document.getElementById('modal-user-initial').textContent = initial;
                document.getElementById('modal-user-name').textContent = user.displayName || 'Scholar';
                document.getElementById('modal-user-email').textContent = user.email || '';
            }
        }
    };

    const closeModal = () => {
        if (modalOverlay) modalOverlay.classList.add('hidden');
    };

    // Triggers
    const btnProfile = document.getElementById('btn-profile'); // Desktop
    const mobileProfile = document.getElementById('mobile-profile-trigger'); // Mobile Nav

    if (btnProfile) btnProfile.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal();
    });

    if (mobileProfile) mobileProfile.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal();
    });

    // Close Actions
    const btnClose = document.querySelector('.btn-close-modal');
    if (btnClose) btnClose.addEventListener('click', closeModal);

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // --- Sidebar Links (Desktop) ---
    document.querySelectorAll('.nav-link[data-target]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.dataset.target;
            window.app.navigateTo(target);
        });
    });

    // --- Modal Actions ---
    const modalSettings = document.getElementById('modal-action-settings');
    if (modalSettings) {
        modalSettings.addEventListener('click', () => {
            alert("Settings feature coming soon!");
        });
    }

    const modalLogout = document.getElementById('modal-action-logout');
    if (modalLogout) {
        modalLogout.addEventListener('click', async () => {
            try {
                const { logout } = await import('./auth.js');
                await logout();
                closeModal();
                window.app.navigateTo('landing');
            } catch (err) {
                console.error("Logout failed:", err);
            }
        });
    }
});
