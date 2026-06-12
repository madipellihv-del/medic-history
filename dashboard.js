/* ============================================================
   Dashboard Page — Role-Based Enterprise Views
   ============================================================ */

const DashboardPage = {
    async render() {
        const session = Auth.getSession();
        if (!session) return '';

        if (session.role === 'patient') return this.renderPatientDashboard(session);
        if (session.role === 'hospital') return this.renderHospitalDashboard(session);
        if (session.role === 'admin') return this.renderAdminDashboard(session);
        return '';
    },

    async renderPatientDashboard(session) {
        const patient = session.patientId ? await MedicDB.getPatient(session.patientId) : null;

        if (!patient || !patient.firstName) {
            return `
            <div class="page-enter">
                <div class="page-header"><h1>Welcome, ${session.username}</h1><p>Complete your profile to get started</p></div>
                <div class="card empty-state">
                    <div class="empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                    <div class="empty-title">Profile Incomplete</div>
                    <div class="empty-text">Complete your medical profile to generate your emergency card.</div>
                    <button class="btn btn-primary" data-route="register" data-params='{"id":${session.patientId}}'>Complete Profile</button>
                </div>
            </div>`;
        }

        return `
        <div class="page-enter">
            <div class="page-header"><h1>My Dashboard</h1><p>Welcome back, ${patient.firstName} ${patient.lastName}</p></div>

            <div class="stats-grid">
                ${statCard('Blood Group', patient.bloodGroup || '—', 'accent')}
                ${statCard('Allergies', (patient.allergies||[]).length, 'warning')}
                ${statCard('Conditions', (patient.conditions||[]).length, 'info')}
                ${statCard('Medications', (patient.medications||[]).length, 'success')}
            </div>

            <div class="dashboard-actions">
                <div class="card action-card" data-route="register" data-params='{"id":${session.patientId}}' style="cursor:pointer;">
                    <div class="action-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                    <h3>Edit Profile</h3>
                    <p>Update personal information and emergency contacts</p>
                </div>
                <div class="card action-card" data-route="medical-history" data-params='{"id":${session.patientId}}' style="cursor:pointer;">
                    <div class="action-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                    <h3>Medical History</h3>
                    <p>Manage conditions, allergies, medications</p>
                </div>
                <div class="card action-card" data-route="emergency-card" data-params='{"id":${session.patientId}}' style="cursor:pointer;">
                    <div class="action-icon emergency"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                    <h3>Emergency Card</h3>
                    <p>View and print your emergency medical card</p>
                </div>
            </div>

            ${(patient.allergies||[]).length > 0 ? `
            <div class="card">
                <div class="section-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                    <h2>Active Allergies</h2>
                </div>
                <div class="tag-list">${patient.allergies.map(a => `<span class="tag tag-danger">${a}</span>`).join('')}</div>
            </div>` : ''}
        </div>`;
    },

    async renderHospitalDashboard(session) {
        const patients = await MedicDB.getAllPatients();
        const active = patients.filter(p => p.firstName);
        const districts = [...new Set(active.map(p => p.district).filter(Boolean))];

        return `
        <div class="page-enter">
            <div class="page-header">
                <h1>Hospital Dashboard</h1>
                <p>${session.hospitalName || 'Hospital'} — Read-Only Access</p>
            </div>

            <div class="stats-grid">
                ${statCard('Total Patients', active.length, 'accent')}
                ${statCard('Districts', districts.length, 'info')}
                ${statCard('With Allergies', active.filter(p => (p.allergies||[]).length > 0).length, 'warning')}
                ${statCard('With Conditions', active.filter(p => (p.conditions||[]).length > 0).length, 'muted')}
            </div>

            <div class="card mb-16">
                <div class="section-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <h2>Patients by District</h2>
                </div>
                ${districts.length > 0 ? `
                <div class="zone-summary">
                    ${districts.map(d => {
                        const count = active.filter(p => p.district === d).length;
                        return `<span class="zone-badge">${d} <span class="zone-count">${count}</span></span>`;
                    }).join('')}
                </div>` : '<p style="color:var(--text-muted);font-size:0.85rem;">No location data available</p>'}
            </div>

            <div class="card">
                <div class="section-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <h2>Recent Patients</h2>
                </div>
                ${recentPatientsTable(active.slice(-5).reverse(), false)}
            </div>

            <div class="security-notice mt-16">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>Read-only access. Patient verification required before viewing records.</span>
            </div>
        </div>`;
    },

    async renderAdminDashboard(session) {
        const patients = await MedicDB.getAllPatients();
        const active = patients.filter(p => p.firstName);
        const now = new Date();
        const thisMonth = active.filter(p => {
            const d = new Date(p.createdAt);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;
        const districts = [...new Set(active.map(p => p.district).filter(Boolean))];

        return `
        <div class="page-enter">
            <div class="page-header">
                <h1>Administrator Dashboard</h1>
                <p>System management and oversight — Full access</p>
            </div>

            <div class="stats-grid">
                ${statCard('Total Patients', active.length, 'accent')}
                ${statCard('This Month', thisMonth, 'success')}
                ${statCard('Districts', districts.length, 'info')}
                ${statCard('With Allergies', active.filter(p => (p.allergies||[]).length > 0).length, 'warning')}
            </div>

            <div class="dashboard-actions">
                <div class="card action-card" data-route="register" style="cursor:pointer;">
                    <div class="action-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg></div>
                    <h3>Register Patient</h3>
                    <p>Add a new patient to the system</p>
                </div>
                <div class="card action-card" data-route="patients" style="cursor:pointer;">
                    <div class="action-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                    <h3>Manage Patients</h3>
                    <p>View, edit, and manage all patient records</p>
                </div>
            </div>

            <div class="card">
                <div class="section-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <h2>Recent Patients</h2>
                </div>
                ${recentPatientsTable(active.slice(-5).reverse(), true)}
            </div>
        </div>`;
    },

    afterRender() {}
};

function statCard(label, value, color) {
    return `
    <div class="card stat-card stat-${color}">
        <div class="stat-value">${value}</div>
        <div class="stat-label">${label}</div>
    </div>`;
}

function recentPatientsTable(patients, showActions) {
    if (patients.length === 0) return '<div class="empty-state"><div class="empty-title">No patient records yet</div></div>';
    return `
    <div class="table-wrap">
        <table class="data-table">
            <thead><tr><th>Patient</th><th>Blood</th><th>District</th><th>Registered</th>${showActions ? '<th>Actions</th>' : ''}</tr></thead>
            <tbody>
                ${patients.map(p => `
                <tr>
                    <td><div class="patient-info-cell"><div class="patient-avatar-sm">${(p.firstName?.[0]||'')+(p.lastName?.[0]||'')}</div><div><div class="patient-name-text">${p.firstName} ${p.lastName}</div><div class="patient-sub-text">${p.gender||''} · ${calcAge(p.dob)} yrs</div></div></div></td>
                    <td><span class="badge badge-danger">${p.bloodGroup||'—'}</span></td>
                    <td>${p.district||'—'}</td>
                    <td>${formatDate(p.createdAt)}</td>
                    ${showActions ? `<td><button class="btn btn-outline btn-sm" data-action="view-emergency" data-id="${p.id}">View</button></td>` : ''}
                </tr>`).join('')}
            </tbody>
        </table>
    </div>`;
}

function calcAge(dob) { if (!dob) return '—'; return Math.floor((Date.now()-new Date(dob).getTime())/(365.25*24*60*60*1000)); }
function formatDate(iso) { if (!iso) return '—'; return new Date(iso).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}); }
