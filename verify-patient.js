/* ============================================================
   Verify Patient Page (Hospital & Admin Verification Gate)
   ============================================================ */

const VerifyPatientPage = {
    targetPatientId: null,
    targetAction: null,

    async render(params) {
        this.targetPatientId = params && params.id ? Number(params.id) : null;
        this.targetAction = params && params.action ? params.action : 'emergency-card';

        const patient = this.targetPatientId ? await MedicDB.getPatient(this.targetPatientId) : null;

        return `
        <div class="page-enter">
            <div style="max-width:480px; margin:0 auto;">
                <div class="card">
                    <div style="text-align:center; margin-bottom:24px;">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5" style="margin-bottom:12px;">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            <polyline points="9 12 11 14 15 10"/>
                        </svg>
                        <h1 style="font-size:1.4rem; font-weight:700;">Patient Verification</h1>
                        <p style="color:var(--text-secondary); font-size:0.85rem; margin-top:4px;">Verify patient identity to access medical records</p>
                    </div>

                    ${patient ? `
                        <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--bg-tertiary);border-radius:var(--radius-md);border:1px solid var(--border-color);margin-bottom:20px;">
                            <div class="patient-avatar-sm">${(patient.firstName?.[0] || '?') + (patient.lastName?.[0] || '')}</div>
                            <div>
                                <div class="patient-name-text">${patient.firstName || 'Unknown'} ${patient.lastName || ''}</div>
                                <div class="patient-sub-text">Patient ID: ${patient.id}${patient.district ? ` · ${patient.district}` : ''}</div>
                            </div>
                        </div>
                    ` : ''}

                    <form id="verify-form" autocomplete="off">
                        <div class="form-group" style="margin-bottom:14px;">
                            <label class="form-label" for="verify-patient-id">Patient ID *</label>
                            <input class="form-input" type="number" id="verify-patient-id" required
                                   placeholder="Enter patient ID number"
                                   value="${this.targetPatientId || ''}">
                        </div>

                        <div class="form-group" style="margin-bottom:14px;">
                            <label class="form-label" for="verify-phone">Patient's Registered Phone *</label>
                            <input class="form-input" type="tel" id="verify-phone" required
                                   placeholder="Phone number on file">
                        </div>

                        <div id="verify-error" class="auth-error hidden" style="margin-bottom:14px;"></div>

                        <button type="submit" class="btn btn-primary w-full" id="verify-submit" style="margin-top:8px;">
                            Verify & Access Records
                        </button>

                        <button type="button" class="btn btn-outline w-full" data-route="patients" style="margin-top:8px;">
                            ← Back to Patient List
                        </button>
                    </form>

                    <div class="security-notice" style="margin-top:20px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        <span>Verification protects patient records from unauthorized access</span>
                    </div>
                </div>
            </div>
        </div>`;
    },

    afterRender() {
        document.getElementById('verify-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const errorEl = document.getElementById('verify-error');
            errorEl.classList.add('hidden');

            const patientId = Number(document.getElementById('verify-patient-id').value);
            const phone = document.getElementById('verify-phone').value.trim();

            if (!patientId || !phone) {
                errorEl.textContent = 'Please fill in all fields';
                errorEl.classList.remove('hidden');
                return;
            }

            const submitBtn = document.getElementById('verify-submit');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Verifying...';

            try {
                const patient = await MedicDB.getPatient(patientId);

                if (!patient) {
                    throw new Error('Patient not found with this ID');
                }

                const normalize = (p) => p.replace(/[\s\-\(\)]/g, '');
                const patientPhone = normalize(patient.phone || '');
                const inputPhone = normalize(phone);

                if (!patientPhone || patientPhone !== inputPhone) {
                    throw new Error('Phone number does not match our records');
                }

                Auth.addVerifiedPatient(patientId);
                App.showToast(`Access granted for ${patient.firstName} ${patient.lastName}`, 'success');

                const action = this.targetAction || 'emergency-card';
                App.navigate(action, { id: patientId });

            } catch (err) {
                errorEl.textContent = err.message;
                errorEl.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Verify & Access Records';
            }
        });
    }
};
