
export function showConfirmModal(message, onConfirm) {
    const modalId = 'confirm-modal-overlay';
    // Remove existing if any
    const existing = document.getElementById(modalId);
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = modalId;
    overlay.style.cssText = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.6);
        display: flex; align-items: center; justify-content: center; z-index: 2000;
        backdrop-filter: blur(4px);
        animation: fadeIn 0.2s ease-out;
    `;

    overlay.innerHTML = `
        <div class="glass-card animate-slide-up" style="
            padding: 2rem; width: 90%; max-width: 400px;
            text-align: center; border: 1px solid var(--glass-border);
        ">
            <div style="
                width: 60px; height: 60px; background: rgba(248, 113, 113, 0.1);
                color: var(--danger); border-radius: 50%; display: flex;
                align-items: center; justify-content: center; margin: 0 auto 1.5rem;
            ">
                <i data-lucide="alert-triangle" width="32" height="32"></i>
            </div>
            
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">Are you sure?</h3>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">
                ${message}
            </p>

            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="btn-cancel-confirm" class="btn-secondary" style="flex: 1;">
                    Cancel
                </button>
                <button id="btn-do-confirm" class="btn-primary" style="
                    flex: 1; background: var(--danger); border-color: var(--danger);
                    box-shadow: 0 4px 12px rgba(248, 113, 113, 0.3);
                ">
                    Delete
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    if (window.lucide) window.lucide.createIcons();

    // Handlers
    const close = () => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 200);
    };

    overlay.querySelector('#btn-cancel-confirm').addEventListener('click', close);
    overlay.querySelector('#btn-do-confirm').addEventListener('click', () => {
        onConfirm();
        close();
    });

    // Close on background click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });
}
