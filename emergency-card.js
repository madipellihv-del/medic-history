/* ============================================================
   Emergency Card Page — Auth-Aware (Hospital: no edit btn)
   ============================================================ */

const EmergencyCardPage = {
    async render(params) {
        if (!params || !params.id) {
            return `<div class="page-enter"><div class="card empty-state">
                <div class="empty-title">No patient selected</div>
                <button class="btn btn-primary" data-route="dashboard">Return to Dashboard</button>
            </div></div>`;
        }

        const p = await MedicDB.getPatient(Number(params.id));
        if (!p) {
            return `<div class="page-enter"><div class="card empty-state">
                <div class="empty-title">Patient not found</div>
                <button class="btn btn-primary" data-route="dashboard">Return to Dashboard</button>
            </div></div>`;
        }

        const session = Auth.getSession();
        const isHospital = session && session.role === 'hospital';
        const isOwnCard = session && session.role === 'patient' && session.patientId === p.id;

        const allergiesHTML = (p.allergies && p.allergies.length > 0)
            ? p.allergies.map(a => `<span class="badge badge-danger">${a}</span>`).join(' ')
            : '<span class="text-muted">None recorded</span>';

        const conditionsHTML = (p.conditions && p.conditions.length > 0)
            ? p.conditions.map(c => `<span class="badge badge-info">${c}</span>`).join(' ')
            : '<span class="text-muted">None recorded</span>';

        const medicationsHTML = (p.medications && p.medications.length > 0)
            ? p.medications.map(m => `<div style="margin-bottom:4px;"><strong>${m.name}</strong> — ${m.dosage} · ${m.frequency}</div>`).join('')
            : '<span class="text-muted">None recorded</span>';

        const initials = (p.firstName?.[0] || '') + (p.lastName?.[0] || '');

        const backRoute = isOwnCard ? 'dashboard' : 'patients';

        return `
        <div class="page-enter">
            <div class="action-bar">
                <button class="btn btn-outline" data-route="${backRoute}">← Back</button>
                <div class="flex" style="gap:8px;">
                    <button class="btn btn-outline" id="print-card-btn">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                        Print Card
                    </button>
                    ${!isHospital ? `<button class="btn btn-primary" data-action="edit-history" data-id="${p.id}">Edit History</button>` : ''}
                </div>
            </div>

            <div class="emergency-card">
                <div class="emergency-header">
                    <h2>Emergency Medical Card</h2>
                    <p>Critical patient information for first responders</p>
                </div>
                <div class="emergency-body">
                    <div class="emergency-profile">
                        <div class="emergency-avatar">${p.photo ? `<img src="${p.photo}" alt="">` : initials}</div>
                        <div>
                            <div class="emergency-name">${p.firstName} ${p.lastName}</div>
                            <div class="emergency-meta">${p.gender || ''} · ${calcAge(p.dob)} years · ID: ${p.id}</div>
                            ${p.district ? `<div class="emergency-meta">${[p.village, p.mandal, p.district].filter(Boolean).join(', ')}</div>` : ''}
                        </div>
                    </div>

                    <div class="emergency-grid">
                        <div class="emergency-field">
                            <div class="emergency-field-label">Blood Group</div>
                            <div class="emergency-field-value blood-group">${p.bloodGroup || '—'}</div>
                        </div>
                        <div class="emergency-field">
                            <div class="emergency-field-label">Phone</div>
                            <div class="emergency-field-value">${p.phone || '—'}</div>
                        </div>
                    </div>

                    <div class="emergency-field mb-16">
                        <div class="emergency-field-label">⚠ Allergies</div>
                        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">${allergiesHTML}</div>
                    </div>

                    <div class="emergency-field mb-16">
                        <div class="emergency-field-label">Chronic Conditions</div>
                        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">${conditionsHTML}</div>
                    </div>

                    <div class="emergency-field mb-16">
                        <div class="emergency-field-label">Current Medications</div>
                        <div style="margin-top:6px;">${medicationsHTML}</div>
                    </div>

                    <div class="section-header" style="margin-top:20px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/></svg>
                        <h2>Emergency Contacts</h2>
                    </div>
                    <div class="emergency-contacts-list">
                        ${(p.emergencyContacts && p.emergencyContacts.length > 0)
                            ? p.emergencyContacts.map(c => `
                                <div class="emergency-contact-item">
                                    <div><div class="emergency-contact-name">${c.name}</div><div class="emergency-contact-relation">${c.relation}</div></div>
                                    <div class="emergency-contact-phone">${c.phone}</div>
                                </div>`).join('')
                            : '<div class="text-muted" style="padding:12px;">No emergency contacts recorded</div>'
                        }
                    </div>

                    <div class="qr-section">
                        <div id="qr-code"></div>
                        <p>Scan to access emergency info</p>
                    </div>
                </div>
            </div>
        </div>`;
    },

    async afterRender() {
        const params = App.currentParams;
        if (!params || !params.id) return;
        const p = await MedicDB.getPatient(Number(params.id));
        if (!p) return;

        const qrData = {
            name: `${p.firstName} ${p.lastName}`,
            dob: p.dob, blood: p.bloodGroup,
            allergies: (p.allergies||[]).join(', '),
            conditions: (p.conditions||[]).join(', '),
            meds: (p.medications||[]).map(m => m.name).join(', '),
            contacts: (p.emergencyContacts||[]).map(c => `${c.name}:${c.phone}`).join('; ')
        };

        const qrContainer = document.getElementById('qr-code');
        if (qrContainer && typeof QRCode !== 'undefined') {
            qrContainer.innerHTML = '';
            new QRCode(qrContainer, {
                text: JSON.stringify(qrData), width: 160, height: 160,
                colorDark: '#1a1f36', colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.M,
            });
        }

        document.getElementById('print-card-btn')?.addEventListener('click', () => window.print());
    }
};
