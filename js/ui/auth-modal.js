import { login, signup, loginWithGoogle } from '../auth.js';

let isLoginMode = true;

export function renderAuthModal(container) {
    container.innerHTML = `
        <div style="
            position: fixed; inset: 0; background: rgba(0,0,0,0.6);
            display: flex; alignItems: center; justify-content: center; z-index: 1000;
            backdrop-filter: blur(8px);
        " id="auth-modal-overlay">
            <div class="glass-card animate-slide-up" style="
                padding: 2.5rem; width: 100%; max-width: 400px;
                position: relative; border: 1px solid var(--glass-border);
            ">
                <button id="btn-close-modal" style="
                    position: absolute; top: 1rem; right: 1rem;
                    background: none; border: none; color: var(--text-muted); cursor: pointer;
                ">
                    <i data-lucide="x"></i>
                </button>

                <h2 style="text-align: center; margin-bottom: 0.5rem; font-weight: 700;">
                    ${isLoginMode ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p style="text-align: center; color: var(--text-secondary); margin-bottom: 2rem; font-size: 0.9rem;">
                    ${isLoginMode ? 'Enter your details to access your notes.' : 'Sign up to start saving your lectures.'}
                </p>

                <div id="auth-error" style="
                    display: none; background: rgba(248, 113, 113, 0.1); border: 1px solid rgba(248, 113, 113, 0.2);
                    color: var(--danger); padding: 0.75rem; borderRadius: var(--radius-sm);
                    font-size: 0.85rem; margin-bottom: 1.5rem;
                "></div>

                <form id="auth-form" style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="position: relative;">
                        <i data-lucide="mail" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); width: 18px;"></i>
                        <input type="email" id="auth-email" placeholder="Email Address" required style="
                            width: 100%; padding: 0.8rem 1rem 0.8rem 3rem;
                            background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border);
                            border-radius: var(--radius-md); color: white; outline: none; font-family: inherit;
                        ">
                    </div>
                    <div style="position: relative;">
                        <i data-lucide="lock" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); width: 18px;"></i>
                        <input type="password" id="auth-password" placeholder="Password" required style="
                            width: 100%; padding: 0.8rem 1rem 0.8rem 3rem;
                            background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border);
                            border-radius: var(--radius-md); color: white; outline: none; font-family: inherit;
                        ">
                    </div>

                    <button type="submit" class="btn-primary" id="btn-submit" style="margin-top: 0.5rem;">
                        ${isLoginMode ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div style="display: flex; align-items: center; gap: 0.5rem; margin: 1.5rem 0; color: var(--text-muted); font-size: 0.8rem;">
                    <div style="flex: 1; height: 1px; background: var(--glass-border);"></div>
                    OR
                    <div style="flex: 1; height: 1px; background: var(--glass-border);"></div>
                </div>

                <button id="btn-google" class="btn-secondary" style="width: 100%; justify-content: center;">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style="width: 18px; height: 18px;">
                    Continue with Google
                </button>

                <p style="text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                    ${isLoginMode ? "Don't have an account? " : "Already have an account? "}
                    <button id="btn-toggle-mode" style="
                        background: none; border: none; color: var(--primary-light); 
                        font-weight: 600; cursor: pointer; font-family: inherit;
                    ">
                        ${isLoginMode ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Elements
    const form = container.querySelector('#auth-form');
    const emailInput = container.querySelector('#auth-email');
    const passInput = container.querySelector('#auth-password');
    const errorBox = container.querySelector('#auth-error');
    const submitBtn = container.querySelector('#btn-submit');

    // Close Modal
    const closeModal = () => {
        container.innerHTML = '';
    };

    container.querySelector('#btn-close-modal').addEventListener('click', closeModal);
    container.querySelector('#auth-modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'auth-modal-overlay') closeModal();
    });

    // Toggle Mode
    container.querySelector('#btn-toggle-mode').addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        renderAuthModal(container); // Re-render
    });

    // Handle Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorBox.style.display = 'none';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        try {
            if (isLoginMode) {
                await login(emailInput.value, passInput.value);
            } else {
                await signup(emailInput.value, passInput.value);
            }
            closeModal();
        } catch (err) {
            console.error(err);
            errorBox.style.display = 'block';
            errorBox.textContent = getErrorMessage(err.code) || err.message || "An unknown error occurred.";
            submitBtn.disabled = false;
            submitBtn.textContent = isLoginMode ? 'Sign In' : 'Sign Up';
        }
    });

    // Google Login
    container.querySelector('#btn-google').addEventListener('click', async () => {
        try {
            await loginWithGoogle();
            closeModal();
            closeModal();
        } catch (err) {
            console.error("Google Login Error:", err);
            errorBox.style.display = 'block';
            errorBox.textContent = getErrorMessage(err.code) || err.message;
        }
    });
}

function getErrorMessage(code) {
    switch (code) {
        case 'auth/wrong-password':
            return "Incorrect password.";
        case 'auth/user-not-found':
            return "No account found with this email.";
        case 'auth/email-already-in-use':
            return "This email is already registered. Try logging in.";
        case 'auth/weak-password':
            return "Password should be at least 6 characters.";
        case 'auth/invalid-email':
            return "Please enter a valid email address.";
        case 'auth/popup-closed-by-user':
            return "Sign-in popup was closed.";
        case 'auth/network-request-failed':
            return "Network error. Check your internet connection.";
        case 'auth/too-many-requests':
            return "Too many failed attempts. Please try again later.";
        case 'auth/account-exists-with-different-credential':
            return "An account already exists with the same email address but different sign-in credentials.";
        default:
            return null; // Fallback to err.message or generic
    }
}
