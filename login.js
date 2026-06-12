/* ============================================================
   Login Page — Enterprise Split-Screen
   ============================================================ */

const LoginPage = {
    async render() {
        return `
        <div class="auth-layout">
            <div class="auth-brand-panel">
                <div class="auth-brand-content">
                    <svg class="auth-brand-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    <h1>Medic<span>History</span></h1>
                    <p class="auth-brand-tagline">Enterprise Medical Records Platform</p>

                    <div class="auth-features">
                        <div class="auth-feature">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            <div>
                                <strong>Bank-Grade Security</strong>
                                <span>SHA-256 encrypted credentials, session-based access control</span>
                            </div>
                        </div>
                        <div class="auth-feature">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                            <div>
                                <strong>Emergency Ready</strong>
                                <span>Instant QR-coded emergency cards for first responders</span>
                            </div>
                        </div>
                        <div class="auth-feature">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            <div>
                                <strong>Role-Based Access</strong>
                                <span>Patients, hospitals, and administrators — each with precise permissions</span>
                            </div>
                        </div>
                    </div>

                    <div class="auth-trust">
                        <span class="auth-trust-badge">HIPAA</span>
                        <span class="auth-trust-badge">ISO 27001</span>
                        <span class="auth-trust-badge">SOC 2</span>
                    </div>
                </div>
            </div>

            <div class="auth-form-panel">
                <div class="auth-form-container">
                    <div class="auth-form-header">
                        <h2>Sign In</h2>
                        <p>Access your medical records securely</p>
                    </div>

                    <form id="login-form" autocomplete="off">
                        <div class="form-group">
                            <label class="form-label" for="login-username">Username</label>
                            <input class="form-input" type="text" id="login-username" required
                                   placeholder="Enter your username" autocomplete="username">
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="login-password">Password</label>
                            <div class="password-wrap">
                                <input class="form-input" type="password" id="login-password" required
                                       placeholder="Enter your password" autocomplete="current-password">
                                <button type="button" class="password-toggle" id="toggle-password" tabindex="-1">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="login-role">Sign In As</label>
                            <select class="form-select" id="login-role">
                                <option value="patient">Patient</option>
                                <option value="hospital">Hospital Staff</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>

                        <div id="login-error" class="auth-error hidden"></div>

                        <button type="submit" class="btn btn-primary w-full" id="login-submit">
                            Sign In
                        </button>
                    </form>

                    <div class="auth-form-footer">
                        <p>Don't have an account? <a href="#" data-route="signup" class="auth-link">Create Account</a></p>
                    </div>
                </div>
            </div>
        </div>`;
    },

    afterRender() {
        document.getElementById('toggle-password')?.addEventListener('click', () => {
            const input = document.getElementById('login-password');
            input.type = input.type === 'password' ? 'text' : 'password';
        });

        document.getElementById('login-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const errorEl = document.getElementById('login-error');
            errorEl.classList.add('hidden');

            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value;
            const role = document.getElementById('login-role').value;

            if (!username || !password) {
                errorEl.textContent = 'Please enter your credentials';
                errorEl.classList.remove('hidden');
                return;
            }

            const submitBtn = document.getElementById('login-submit');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Signing in...';

            try {
                const session = await Auth.login(username, password);
                if (session.role !== role) {
                    Auth.logout();
                    errorEl.textContent = `This account is registered as "${session.role}", not "${role}"`;
                    errorEl.classList.remove('hidden');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Sign In';
                    return;
                }
                App.showToast(`Welcome back, ${session.username}`, 'success');
                App.navigate('dashboard');
            } catch (err) {
                errorEl.textContent = err.message;
                errorEl.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign In';
            }
        });
    }
};
