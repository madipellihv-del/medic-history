/* ============================================================
   Signup Page — Enterprise (3 Roles)
   ============================================================ */

const ADMIN_ACCESS_CODE = 'MEDIC-ADMIN-2026';

const SignupPage = {
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
                    <p class="auth-brand-tagline">Create your account to get started</p>

                    <div class="auth-features">
                        <div class="auth-feature">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            <div>
                                <strong>Patient Account</strong>
                                <span>Manage your own medical records and emergency cards</span>
                            </div>
                        </div>
                        <div class="auth-feature">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                            <div>
                                <strong>Hospital Account</strong>
                                <span>Read-only access to verified patient records</span>
                            </div>
                        </div>
                        <div class="auth-feature">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            <div>
                                <strong>Administrator</strong>
                                <span>Full system management with admin access code</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="auth-form-panel">
                <div class="auth-form-container" style="max-width:480px;">
                    <div class="auth-form-header">
                        <h2>Create Account</h2>
                        <p>Select your role and fill in your details</p>
                    </div>

                    <form id="signup-form" autocomplete="off">
                        <!-- Role Selection -->
                        <div class="role-picker mb-24">
                            <button type="button" class="role-option active" data-role="patient">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                <span class="role-name">Patient</span>
                            </button>
                            <button type="button" class="role-option" data-role="hospital">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                <span class="role-name">Hospital</span>
                            </button>
                            <button type="button" class="role-option" data-role="admin">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                <span class="role-name">Admin</span>
                            </button>
                        </div>
                        <input type="hidden" id="signup-role" value="patient">

                        <div class="form-grid">
                            <div class="form-group full-width">
                                <label class="form-label" for="signup-username">Username *</label>
                                <input class="form-input" type="text" id="signup-username" required
                                       placeholder="Choose a unique username" autocomplete="off">
                            </div>

                            <div class="form-group">
                                <label class="form-label" for="signup-password">Password *</label>
                                <input class="form-input" type="password" id="signup-password" required
                                       placeholder="Min 6 characters" minlength="6" autocomplete="new-password">
                                <div class="password-strength" id="password-strength">
                                    <div class="strength-bar" id="strength-bar"></div>
                                </div>
                                <span class="form-hint" id="strength-text">Enter a password</span>
                            </div>

                            <div class="form-group">
                                <label class="form-label" for="signup-confirm">Confirm Password *</label>
                                <input class="form-input" type="password" id="signup-confirm" required
                                       placeholder="Re-enter password" autocomplete="new-password">
                            </div>
                        </div>

                        <!-- Hospital-specific fields -->
                        <div id="hospital-fields" class="hidden mt-16">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label" for="signup-hospital-name">Hospital Name *</label>
                                    <input class="form-input" type="text" id="signup-hospital-name"
                                           placeholder="e.g. City General Hospital">
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="signup-hospital-reg">Registration No. *</label>
                                    <input class="form-input" type="text" id="signup-hospital-reg"
                                           placeholder="Hospital registration number">
                                </div>
                            </div>
                        </div>

                        <!-- Admin-specific fields -->
                        <div id="admin-fields" class="hidden mt-16">
                            <div class="form-group">
                                <label class="form-label" for="signup-admin-code">Admin Access Code *</label>
                                <input class="form-input" type="password" id="signup-admin-code"
                                       placeholder="Enter the admin access code">
                                <span class="form-hint">Contact your system administrator for the access code</span>
                            </div>
                        </div>

                        <div id="signup-error" class="auth-error hidden mt-16"></div>

                        <button type="submit" class="btn btn-primary w-full mt-24" id="signup-submit">
                            Create Account
                        </button>
                    </form>

                    <div class="auth-form-footer">
                        <p>Already have an account? <a href="#" data-route="login" class="auth-link">Sign In</a></p>
                    </div>
                </div>
            </div>
        </div>`;
    },

    afterRender() {
        const roleInput = document.getElementById('signup-role');
        const hospitalFields = document.getElementById('hospital-fields');
        const adminFields = document.getElementById('admin-fields');
        const roleBtns = document.querySelectorAll('.role-option');

        roleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                roleBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                roleInput.value = btn.dataset.role;

                hospitalFields.classList.add('hidden');
                adminFields.classList.add('hidden');

                if (btn.dataset.role === 'hospital') hospitalFields.classList.remove('hidden');
                if (btn.dataset.role === 'admin') adminFields.classList.remove('hidden');
            });
        });

        // Password strength
        const passInput = document.getElementById('signup-password');
        const strengthBar = document.getElementById('strength-bar');
        const strengthText = document.getElementById('strength-text');

        passInput.addEventListener('input', () => {
            const strength = calcPasswordStrength(passInput.value);
            strengthBar.style.width = strength.percent + '%';
            strengthBar.className = 'strength-bar ' + strength.level;
            strengthText.textContent = strength.text;
        });

        // Submit
        document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const errorEl = document.getElementById('signup-error');
            errorEl.classList.add('hidden');

            const username = document.getElementById('signup-username').value.trim();
            const password = document.getElementById('signup-password').value;
            const confirm = document.getElementById('signup-confirm').value;
            const role = roleInput.value;

            if (!username || !password || !confirm) {
                showError(errorEl, 'Please fill in all required fields'); return;
            }
            if (username.length < 3) {
                showError(errorEl, 'Username must be at least 3 characters'); return;
            }
            if (password.length < 6) {
                showError(errorEl, 'Password must be at least 6 characters'); return;
            }
            if (password !== confirm) {
                showError(errorEl, 'Passwords do not match'); return;
            }

            if (role === 'hospital') {
                const hn = document.getElementById('signup-hospital-name').value.trim();
                const hr = document.getElementById('signup-hospital-reg').value.trim();
                if (!hn || !hr) { showError(errorEl, 'Hospital details are required'); return; }
            }

            if (role === 'admin') {
                const code = document.getElementById('signup-admin-code').value.trim();
                if (code !== ADMIN_ACCESS_CODE) {
                    showError(errorEl, 'Invalid admin access code'); return;
                }
            }

            const submitBtn = document.getElementById('signup-submit');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating account...';

            try {
                const userData = {
                    username, password, role,
                    hospitalName: role === 'hospital' ? document.getElementById('signup-hospital-name').value.trim() : '',
                    hospitalRegNo: role === 'hospital' ? document.getElementById('signup-hospital-reg').value.trim() : '',
                };

                await Auth.register(userData);
                const session = await Auth.login(username, password);

                if (role === 'patient') {
                    const patientId = await MedicDB.addPatient({
                        firstName: '', lastName: '', dob: '', gender: '', bloodGroup: '',
                        phone: '', email: '', address: '', photo: '',
                        emergencyContacts: [{ name: '', relation: '', phone: '' }],
                    });
                    await Auth.linkPatient(session.userId, patientId);
                    App.showToast('Account created. Please complete your profile.', 'success');
                    App.navigate('register', { id: patientId });
                } else {
                    App.showToast('Account created successfully', 'success');
                    App.navigate('dashboard');
                }
            } catch (err) {
                showError(errorEl, err.message);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Account';
            }
        });
    }
};

function showError(el, msg) { el.textContent = msg; el.classList.remove('hidden'); }

function calcPasswordStrength(password) {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
        { percent: 0, level: '', text: 'Enter a password' },
        { percent: 20, level: 'weak', text: 'Weak' },
        { percent: 40, level: 'fair', text: 'Fair' },
        { percent: 60, level: 'good', text: 'Good' },
        { percent: 80, level: 'strong', text: 'Strong' },
        { percent: 100, level: 'very-strong', text: 'Very Strong' },
    ];
    return levels[Math.min(score, levels.length - 1)];
}
