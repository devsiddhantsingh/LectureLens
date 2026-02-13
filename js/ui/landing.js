export function renderLanding(container, app) {
    const isUserLoggedIn = !!app.user;
    const userName = app.user?.displayName?.split(' ')[0] || 'My';

    container.innerHTML = `
        <div style="min-height: 100vh; display: flex; flex-direction: column;">
            <!-- Navigation -->
            <nav class="container" style="
                display: flex; justify-content: space-between; align-items: center;
                padding: 1.5rem 2rem; position: fixed; top: 0; left: 0; right: 0; z-index: 100;
                background: rgba(3, 4, 7, 0.8); backdrop-filter: blur(16px);
                border-bottom: 1px solid var(--glass-border);
            ">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div class="logo-mark">L</div>
                    <span style="font-size: 1.3rem; font-weight: 700; letter-spacing: -0.3px; color: white;">
                        Lecture<span class="gradient-text">Lens</span>
                    </span>
                </div>
                <div style="display: flex; gap: 1rem; align-items: center;">
                    ${!isUserLoggedIn ? `
                        <button id="btn-login-nav" class="btn-secondary" style="font-size: 0.9rem; padding: 0.6rem 1.2rem;">Log In</button>
                    ` : ''}
                    <button id="btn-dashboard-nav" class="btn-primary" style="padding: 0.6rem 1.4rem; font-size: 0.9rem;">
                        ${isUserLoggedIn ? `Dashboard` : 'Get Started'}
                    </button>
                </div>
            </nav>

            <!-- Hero Section -->
            <main id="hero-bg" style="
                min-height: 100vh; display: flex; flex-direction: column;
                align-items: center; justify-content: center;
                text-align: center; padding: 8rem 2rem 6rem;
                position: relative; overflow: hidden;
            ">
                <!-- Overlay Gradient -->
                <div style="
                    position: absolute; inset: 0;
                    background: radial-gradient(circle at 50% 50%, transparent 0%, var(--bg-deep) 100%);
                    z-index: 1; pointer-events: none;
                "></div>

                <div style="position: relative; z-index: 2; max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; align-items: center;">
                    
                    <a href="https://github.com/yourusername/LectureLens" target="_blank" class="badge-pill animate-fade-in" style="
                        margin-bottom: 2rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;
                        background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border);
                        padding: 0.5rem 1rem; border-radius: 99px; transition: all 0.2s; cursor: pointer;
                    ">
                        <span style="color: var(--accent);">✨ New v2.0</span> 
                        <span style="color: var(--text-secondary);">Now with PDF Export & Cloud Sync</span>
                        <i data-lucide="arrow-right" style="width: 14px; color: var(--text-muted);"></i>
                    </a>

                    <h1 class="animate-slide-up" style="
                        font-size: clamp(3.5rem, 8vw, 6rem); font-weight: 800; line-height: 1.1;
                        letter-spacing: -2px; margin-bottom: 2rem;
                        background: linear-gradient(180deg, #fff 0%, #94a3b8 100%);
                        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                    ">
                        Stop Compiling.<br>Start <span class="gradient-text">Understanding.</span>
                    </h1>

                    <p class="animate-slide-up" style="
                        font-size: 1.25rem; color: var(--text-muted); max-width: 650px;
                        line-height: 1.7; animation-delay: 0.1s; margin-bottom: 3.5rem;
                    ">
                        Turn hours of lectures into minutes of insight. Upload audio, video, or slides and let AI generate your study guide, summaries, and quizzes instantly.
                    </p>

                    <div class="animate-slide-up" style="display: flex; gap: 1rem; animation-delay: 0.2s; flex-wrap: wrap; justify-content: center;">
                        <button id="btn-start-hero" class="btn-primary" style="
                            padding: 1.2rem 3rem; font-size: 1.1rem; box-shadow: 0 0 40px rgba(99, 102, 241, 0.4);
                        ">
                            🚀 Launch App
                        </button>
                        <button id="btn-demo" class="btn-secondary" style="padding: 1.2rem 2.5rem; font-size: 1.1rem;">
                            View Demo
                        </button>
                    </div>


                </div>
            </main>

            <!-- Problem / Solution Section -->
            <section class="container" style="padding: 6rem 2rem; position: relative; z-index: 2;">
                <div style="text-align: center; margin-bottom: 4rem;">
                    <h2 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem;">The Old Way vs. The New Way</h2>
                    <p style="color: var(--text-secondary);">Why spend hours manually transcribing when you can automate it?</p>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                    <!-- The Old Way -->
                    <div class="glass-card" style="background: rgba(239, 68, 68, 0.05); border-color: rgba(239, 68, 68, 0.1);">
                        <div style="margin-bottom: 1.5rem; color: var(--danger); display: flex; align-items: center; gap: 0.5rem;">
                            <i data-lucide="x-circle"></i>
                            <span style="font-weight: 700;">The Old Way</span>
                        </div>
                        <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 1rem; color: var(--text-muted);">
                            <li style="display: flex; gap: 0.75rem;"><i data-lucide="x" style="width: 18px;"></i> 2 hours of re-watching lectures</li>
                            <li style="display: flex; gap: 0.75rem;"><i data-lucide="x" style="width: 18px;"></i> Messy, disorganized handwritten notes</li>
                            <li style="display: flex; gap: 0.75rem;"><i data-lucide="x" style="width: 18px;"></i> Missed key concepts & definitions</li>
                        </ul>
                    </div>

                    <!-- The LectureLens Way -->
                    <div class="glass-card" style="background: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.2); position: relative; overflow: hidden;">
                        <div style="position: absolute; top: 0; right: 0; background: var(--success); color: black; font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.75rem; border-bottom-left-radius: 10px;">RECOMMENDED</div>
                        <div style="margin-bottom: 1.5rem; color: var(--success); display: flex; align-items: center; gap: 0.5rem;">
                            <i data-lucide="check-circle-2"></i>
                            <span style="font-weight: 700;">The LectureLens Way</span>
                        </div>
                         <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 1rem; color: var(--text-primary);">
                            <li style="display: flex; gap: 0.75rem;"><i data-lucide="check" style="width: 18px; color: var(--success);"></i> <strong>Instant</strong> summaries & transcripts</li>
                            <li style="display: flex; gap: 0.75rem;"><i data-lucide="check" style="width: 18px; color: var(--success);"></i> Structured, topic-wise bullet points</li>
                            <li style="display: flex; gap: 0.75rem;"><i data-lucide="check" style="width: 18px; color: var(--success);"></i> Auto-generated quizzes for active recall</li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Bento Grid Features -->
            <section id="features" class="container" style="padding: 4rem 2rem 6rem; position: relative; z-index: 2;">
                <div style="text-align: center; margin-bottom: 4rem;">
                    <span class="tag" style="margin-bottom: 1rem; color: var(--accent);">POWERFUL FEATURES</span>
                    <h2 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem;">Everything you need to ace the exam</h2>
                </div>

                <div style="
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                ">
                    <!-- Feature 1: Universal Input (Wide) -->
                    <div class="glass-card" style="grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 2rem;">
                        <div style="flex: 1; min-width: 300px; padding: 1rem;">
                            <div style="width: 48px; height: 48px; background: rgba(99, 102, 241, 0.1); border-radius: 12px; display: grid; place-items: center; margin-bottom: 1.5rem;">
                                <i data-lucide="layers" style="color: var(--primary);"></i>
                            </div>
                            <h3 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 0.75rem; color: white;">Universal Input</h3>
                            <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">Whether it's a PDF, PowerPoint, MP3 audio recording, or MP4 video lecture—we analyze it all. Our multi-modal engine handles any format you throw at it.</p>
                        </div>
                        <div style="flex: 1; min-width: 300px; display: flex; gap: 1rem; justify-content: center; opacity: 0.8;">
                             <!-- Mock Icons -->
                             <div class="glass-card" style="width: 80px; height: 80px; display: grid; place-items: center;"><i data-lucide="file-text" width="32"></i></div>
                             <div class="glass-card" style="width: 80px; height: 80px; display: grid; place-items: center;"><i data-lucide="mic" width="32"></i></div>
                             <div class="glass-card" style="width: 80px; height: 80px; display: grid; place-items: center;"><i data-lucide="video" width="32"></i></div>
                        </div>
                    </div>

                    <!-- Feature 2: Quiz -->
                    <div class="glass-card" style="padding: 2rem; min-height: 300px; display: flex; flex-direction: column;">
                         <div style="width: 48px; height: 48px; background: rgba(16, 185, 129, 0.1); border-radius: 12px; display: grid; place-items: center; margin-bottom: 1.5rem;">
                            <i data-lucide="check-circle-2" style="color: var(--success);"></i>
                        </div>
                        <h3 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 0.75rem; color: white;">Instant Quiz</h3>
                        <p style="font-size: 1rem; color: var(--text-muted); flex: 1;">Stop passively reading. Test yourself immediately with AI-generated multiple choice questions derived directly from your lecture material.</p>
                    </div>

                    <!-- Feature 3: Export -->
                    <div class="glass-card" style="padding: 2rem; min-height: 300px; display: flex; flex-direction: column;">
                         <div style="width: 48px; height: 48px; background: rgba(236, 72, 153, 0.1); border-radius: 12px; display: grid; place-items: center; margin-bottom: 1.5rem;">
                            <i data-lucide="file-output" style="color: var(--secondary);"></i>
                        </div>
                        <h3 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 0.75rem; color: white;">PDF Export</h3>
                        <p style="font-size: 1rem; color: var(--text-muted); flex: 1;">Need to study offline or print your notes? Export a beautifully formatted PDF study guide with one click.</p>
                    </div>

                    <!-- Feature 4: Cloud Sync -->
                    <div class="glass-card" style="grid-column: 1 / -1; display: flex; align-items: center; position: relative; overflow: hidden; padding: 3rem;">
                        <div style="position: relative; z-index: 2; max-width: 600px;">
                            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                                <i data-lucide="cloud" style="color: var(--accent); width: 32px; height: 32px;"></i>
                                <h3 style="font-size: 1.8rem; font-weight: 700; color: white;">Cloud Sync</h3>
                            </div>
                            <p style="color: var(--text-muted); font-size: 1.1rem;">Your library follows you. Log in from any device to access your saved summaries, quizzes, and notes. Powered by secure Firebase infrastructure.</p>
                        </div>
                         <div style="position: absolute; right: -50px; top: -50px; width: 300px; height: 300px; background: radial-gradient(closest-side, rgba(6, 182, 212, 0.15), transparent); pointer-events: none;"></div>
                    </div>
                </div>
            </section>

            <!-- How It Works (Timeline) -->
            <section class="container" style="padding: 6rem 2rem;">
                <div style="text-align: center; margin-bottom: 5rem;">
                     <span class="tag" style="color: var(--primary-light); background: rgba(99, 102, 241, 0.1); border-color: rgba(99, 102, 241, 0.2);">WORKFLOW</span>
                    <h2 style="font-size: 2.5rem; font-weight: 800; margin-top: 1rem;">From Chaos to Clarity</h2>
                </div>

                <div class="timeline-steps" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 3rem; position: relative;">
                    ${[
            { num: '01', icon: 'upload-cloud', title: 'Upload', desc: 'Drag & drop any file format.' },
            { num: '02', icon: 'zap', title: 'Process', desc: 'AI analyzes content in seconds.' },
            { num: '03', icon: 'book-open', title: 'Review', desc: 'Read summary & take quiz.' },
            { num: '04', icon: 'download', title: 'Export', desc: 'Save as PDF or to Cloud.' }
        ].map((step, i) => `
                        <div style="position: relative; z-index: 1; flex: 1; min-width: 200px; text-align: center;">
                            <div style="
                                width: 64px; height: 64px; margin: 0 auto 1.5rem;
                                background: var(--bg-surface); border: 1px solid var(--glass-border);
                                border-radius: 50%; display: grid; place-items: center;
                                box-shadow: 0 0 20px rgba(0,0,0,0.5); font-weight: 700; color: white;
                                position: relative;
                            ">
                                <i data-lucide="${step.icon}" width="24"></i>
                                <div style="
                                    position: absolute; top: -5px; right: -5px; width: 24px; height: 24px;
                                    background: var(--primary); border-radius: 50%; font-size: 0.75rem;
                                    display: grid; place-items: center; border: 2px solid var(--bg-deep);
                                ">${i + 1}</div>
                            </div>
                            <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem; color: white;">${step.title}</h3>
                            <p style="color: var(--text-muted); font-size: 0.95rem;">${step.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </section>



             <!-- CTA Section -->
            <section style="padding: 6rem 2rem; text-align: center;">
                <div class="container glass-card" style="padding: 5rem 2rem; background: linear-gradient(180deg, var(--bg-card) 0%, rgba(99, 102, 241, 0.15) 100%); border: 1px solid rgba(124, 110, 240, 0.3);">
                    <h2 style="font-size: 3rem; font-weight: 800; margin-bottom: 1.5rem; line-height: 1.2;">
                        Ready to upgrade your grades?
                    </h2>
                    <p style="color: var(--text-muted); font-size: 1.2rem; margin-bottom: 3rem; max-width: 600px; margin-left: auto; margin-right: auto;">
                        Join thousands of students using AI to study smarter, not harder. Get started for free today.
                    </p>
                    <button id="btn-cta-end" class="btn-primary" style="padding: 1.2rem 3.5rem; font-size: 1.2rem;">
                        Start Analysing Now
                    </button>
                    <p style="margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-faint);">No credit card required • Free Demo Mode</p>
                </div>
            </section>

            <!-- Footer -->
            <footer style="border-top: 1px solid var(--glass-border); padding: 5rem 2rem 2rem; background: rgba(3,4,7,0.8);">
                <div class="container" style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 4rem;">
                    <div style="max-width: 300px;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
                            <div class="logo-mark" style="width: 32px; height: 32px; font-size: 1.1rem;">L</div>
                            <span style="font-size: 1.5rem; font-weight: 700; color: white;">LectureLens</span>
                        </div>
                        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.7;">
                            Empowering students with AI-driven insights. Built for the future of education.
                        </p>
                    </div>
                    
                    <div style="display: flex; gap: 5rem; flex-wrap: wrap;">
                         <div>
                            <h4 style="color: white; font-size: 1rem; font-weight: 700; margin-bottom: 1.5rem;">Legal</h4>
                            <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.75rem;">
                                <li><span style="color: var(--text-muted);">Privacy Policy</span></li>
                                <li><span style="color: var(--text-muted);">Terms of Service</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="container" style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--glass-border); text-align: center; color: var(--text-faint); font-size: 0.9rem;">
                    &copy; ${new Date().getFullYear()} LectureLens AI. All rights reserved.
                </div>
            </footer>
        </div>
    `;

    // Initialize Vanta (Refined for Deep Space)
    try {
        if (window.VANTA) {
            window.VANTA.FOG({
                el: "#hero-bg",
                mouseControls: true, touchControls: true, gyroControls: false,
                minHeight: 200.00, minWidth: 200.00,
                // Electric Deep Space Colors
                highlightColor: 0x06b6d4, // Neon Cyan (Accent)
                midtoneColor: 0x6366f1,   // Indigo (Primary)
                lowlightColor: 0x0c0e14,  // Dark Blue-Grey
                baseColor: 0x030407,      // Deepest Black
                blurFactor: 0.60,
                speed: 1.80,
                zoom: 1.20
            });
        }
    } catch (e) {
        console.warn("Vanta JS failed to load", e);
    }

    // Initialize Icons
    if (window.lucide) window.lucide.createIcons();

    // Event Listeners
    const inputs = ['btn-start-hero', 'btn-cta-end', 'btn-dashboard-nav'];
    inputs.forEach(id => {
        const el = container.querySelector('#' + id);
        if (el) el.addEventListener('click', () => navigateToDashboard(app));
    });

    const loginBtn = container.querySelector('#btn-login-nav');
    if (loginBtn) loginBtn.addEventListener('click', () => app.showAuthModal());

    const demoBtn = container.querySelector('#btn-demo');
    if (demoBtn) demoBtn.addEventListener('click', () => {
        container.querySelector('#features').scrollIntoView({ behavior: 'smooth' });
    });
}

function navigateToDashboard(app) {
    if (app.user) {
        app.navigateTo('dashboard');
    } else {
        app.showAuthModal();
    }
}
