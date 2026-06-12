/* ============================================================
   Medical History Page — Read-Only for Hospital
   ============================================================ */

const MedicalHistoryPage = {
    patientId: null,

    async render(params) {
        if (!params || !params.id) {
            return `<div class="page-enter"><div class="card empty-state">
                <div class="empty-title">No patient selected</div>
                <button class="btn btn-primary" data-route="dashboard">Return to Dashboard</button>
            </div></div>`;
        }

        this.patientId = Number(params.id);
        const p = await MedicDB.getPatient(this.patientId);
        if (!p) {
            return `<div class="page-enter"><div class="card empty-state">
                <div class="empty-title">Patient not found</div>
                <button class="btn btn-primary" data-route="dashboard">Return to Dashboard</button>
            </div></div>`;
        }

        const session = Auth.getSession();
        const readOnly = session && session.role === 'hospital';
        const canEdit = session && (session.role === 'admin' || (session.role === 'patient' && session.patientId === this.patientId));

        if (readOnly) {
            return this.renderReadOnly(p, session);
        }

        return `
        <div class="page-enter">
            <div class="page-header">
                <h1>Medical History</h1>
                <p>Managing records for <strong>${p.firstName} ${p.lastName}</strong> · ${p.bloodGroup} · ID: ${p.id}</p>
            </div>

            <form id="medical-history-form">
                ${medicalSection('Chronic Conditions', 'conditions', p.conditions||[], 'danger', '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>')}
                ${medicalSection('Allergies', 'allergies', p.allergies||[], 'warning', '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>')}

                <div class="card mb-16">
                    <div class="section-header">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--info)" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                        <h2>Current Medications</h2>
                    </div>
                    <div class="dynamic-list" id="medications-list">
                        ${(p.medications||[]).map((m,i) => medicationRow(m,i)).join('')}
                    </div>
                    <button type="button" class="btn btn-outline btn-sm mt-16" id="add-medication-btn">+ Add Medication</button>
                </div>

                <div class="card mb-16">
                    <div class="section-header">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <h2>Past Surgeries</h2>
                    </div>
                    <div class="dynamic-list" id="surgeries-list">
                        ${(p.surgeries||[]).map((s,i) => surgeryRow(s,i)).join('')}
                    </div>
                    <button type="button" class="btn btn-outline btn-sm mt-16" id="add-surgery-btn">+ Add Surgery</button>
                </div>

                <div class="card mb-16">
                    <div class="section-header">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        <h2>Vaccinations</h2>
                    </div>
                    <div class="dynamic-list" id="vaccinations-list">
                        ${(p.vaccinations||[]).map((v,i) => vaccinationRow(v,i)).join('')}
                    </div>
                    <button type="button" class="btn btn-outline btn-sm mt-16" id="add-vaccination-btn">+ Add Vaccination</button>
                </div>

                ${medicalSection('Family History', 'family', p.familyHistory||[], 'muted', '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>')}

                <div class="flex mt-24" style="gap:12px; justify-content:flex-end;">
                    <button type="button" class="btn btn-outline" data-route="dashboard">Cancel</button>
                    <button type="button" class="btn btn-primary" id="save-medical-btn">Save Medical History</button>
                </div>
            </form>
        </div>`;
    },

    renderReadOnly(p, session) {
        const tagList = (items, color) => items.length > 0
            ? items.map(i => `<span class="badge badge-${color}">${i}</span>`).join(' ')
            : '<span class="text-muted">None recorded</span>';

        return `
        <div class="page-enter">
            <div class="page-header">
                <h1>Medical History</h1>
                <p>Viewing records for <strong>${p.firstName} ${p.lastName}</strong> · ${p.bloodGroup} · ID: ${p.id}</p>
            </div>

            <div class="security-notice mb-16">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>Read-only view — Hospital accounts cannot modify patient records</span>
            </div>

            <div class="card mb-16">
                <div class="section-header"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg><h2>Chronic Conditions</h2></div>
                <div class="tag-list">${tagList(p.conditions||[], 'info')}</div>
            </div>

            <div class="card mb-16">
                <div class="section-header"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg><h2>Allergies</h2></div>
                <div class="tag-list">${tagList(p.allergies||[], 'danger')}</div>
            </div>

            <div class="card mb-16">
                <div class="section-header"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--info)" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/></svg><h2>Medications</h2></div>
                ${(p.medications||[]).length > 0 ? `
                <div class="table-wrap"><table class="data-table"><thead><tr><th>Medication</th><th>Dosage</th><th>Frequency</th></tr></thead><tbody>
                ${p.medications.map(m => `<tr><td>${m.name}</td><td>${m.dosage||'—'}</td><td>${m.frequency||'—'}</td></tr>`).join('')}
                </tbody></table></div>` : '<p class="text-muted">No medications recorded</p>'}
            </div>

            <div class="card mb-16">
                <div class="section-header"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg><h2>Surgeries</h2></div>
                ${(p.surgeries||[]).length > 0 ? `
                <div class="table-wrap"><table class="data-table"><thead><tr><th>Procedure</th><th>Date</th><th>Notes</th></tr></thead><tbody>
                ${p.surgeries.map(s => `<tr><td>${s.name}</td><td>${s.date||'—'}</td><td>${s.notes||'—'}</td></tr>`).join('')}
                </tbody></table></div>` : '<p class="text-muted">No surgeries recorded</p>'}
            </div>

            <div class="card mb-16">
                <div class="section-header"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><h2>Vaccinations</h2></div>
                ${(p.vaccinations||[]).length > 0 ? `
                <div class="table-wrap"><table class="data-table"><thead><tr><th>Vaccine</th><th>Date</th></tr></thead><tbody>
                ${p.vaccinations.map(v => `<tr><td>${v.name}</td><td>${v.date||'—'}</td></tr>`).join('')}
                </tbody></table></div>` : '<p class="text-muted">No vaccinations recorded</p>'}
            </div>

            <div class="card mb-16">
                <div class="section-header"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg><h2>Family History</h2></div>
                <div class="tag-list">${tagList(p.familyHistory||[], 'muted')}</div>
            </div>

            <div class="flex mt-16" style="gap:12px; justify-content:flex-end;">
                <button class="btn btn-outline" data-route="patients">← Back to Patients</button>
                <button class="btn btn-primary" data-action="view-emergency" data-id="${p.id}">View Emergency Card</button>
            </div>
        </div>`;
    },

    afterRender() {
        const session = Auth.getSession();
        if (session && session.role === 'hospital') return; // Read-only, no JS needed

        setupTagAdder('conditions-input', 'add-conditions-btn', 'conditions-tags', 'conditions');
        setupTagAdder('allergies-input', 'add-allergies-btn', 'allergies-tags', 'allergies');
        setupTagAdder('family-input', 'add-family-btn', 'family-tags', 'family');

        document.querySelectorAll('.tag-list').forEach(list => {
            list.addEventListener('click', (e) => {
                if (e.target.classList.contains('tag-remove')) e.target.closest('.tag').remove();
            });
        });

        ['medication', 'surgery', 'vaccination'].forEach(type => {
            document.getElementById(`add-${type}-btn`)?.addEventListener('click', () => {
                const list = document.getElementById(`${type}s-list`);
                const div = document.createElement('div');
                if (type === 'medication') div.innerHTML = medicationRow({name:'',dosage:'',frequency:''}, list.children.length);
                if (type === 'surgery') div.innerHTML = surgeryRow({name:'',date:'',notes:''}, list.children.length);
                if (type === 'vaccination') div.innerHTML = vaccinationRow({name:'',date:''}, list.children.length);
                list.appendChild(div.firstElementChild);
            });
        });

        document.querySelectorAll('.dynamic-list').forEach(list => {
            list.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-dynamic-btn') || e.target.closest('.remove-dynamic-btn')) {
                    e.target.closest('.dynamic-item').remove();
                }
            });
        });

        document.getElementById('save-medical-btn')?.addEventListener('click', () => this.handleSave());
    },

    async handleSave() {
        const patient = await MedicDB.getPatient(this.patientId);
        if (!patient) { App.showToast('Patient not found', 'error'); return; }

        patient.conditions = collectTags('conditions-tags');
        patient.allergies = collectTags('allergies-tags');
        patient.familyHistory = collectTags('family-tags');

        patient.medications = [];
        document.querySelectorAll('.med-row').forEach(row => {
            const name = row.querySelector('.med-name').value.trim();
            const dosage = row.querySelector('.med-dosage').value.trim();
            const frequency = row.querySelector('.med-frequency').value.trim();
            if (name) patient.medications.push({ name, dosage, frequency });
        });

        patient.surgeries = [];
        document.querySelectorAll('.surg-row').forEach(row => {
            const name = row.querySelector('.surg-name').value.trim();
            const date = row.querySelector('.surg-date').value;
            const notes = row.querySelector('.surg-notes').value.trim();
            if (name) patient.surgeries.push({ name, date, notes });
        });

        patient.vaccinations = [];
        document.querySelectorAll('.vacc-row').forEach(row => {
            const name = row.querySelector('.vacc-name').value.trim();
            const date = row.querySelector('.vacc-date').value;
            if (name) patient.vaccinations.push({ name, date });
        });

        try {
            await MedicDB.updatePatient(patient);
            App.showToast('Medical history saved', 'success');
        } catch (err) {
            App.showToast('Error: ' + err.message, 'error');
        }
    }
};

function medicalSection(title, key, items, color, svgPath) {
    return `
    <div class="card mb-16">
        <div class="section-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--${color})" stroke-width="2">${svgPath}</svg>
            <h2>${title}</h2>
        </div>
        <div class="tag-list mb-16" id="${key}-tags">
            ${items.map(t => tagHTML(t, key)).join('')}
        </div>
        <div class="tag-input-wrap">
            <input type="text" class="tag-input" id="${key}-input" placeholder="Add ${title.toLowerCase()}...">
            <button type="button" class="btn btn-outline btn-sm" id="add-${key}-btn">Add</button>
        </div>
    </div>`;
}

function tagHTML(text, type) {
    return `<span class="tag" data-type="${type}"><span class="tag-text">${text}</span><span class="tag-remove">✕</span></span>`;
}

function medicationRow(med, i) {
    return `<div class="dynamic-item med-row">
        <input class="form-input med-name" type="text" placeholder="Medication" value="${med.name||''}">
        <input class="form-input med-dosage" type="text" placeholder="Dosage" value="${med.dosage||''}" style="max-width:120px;">
        <input class="form-input med-frequency" type="text" placeholder="Frequency" value="${med.frequency||''}" style="max-width:140px;">
        <button type="button" class="btn btn-outline btn-icon remove-dynamic-btn">✕</button>
    </div>`;
}

function surgeryRow(surg, i) {
    return `<div class="dynamic-item surg-row">
        <input class="form-input surg-name" type="text" placeholder="Surgery" value="${surg.name||''}">
        <input class="form-input surg-date" type="date" value="${surg.date||''}" style="max-width:160px;">
        <input class="form-input surg-notes" type="text" placeholder="Notes" value="${surg.notes||''}">
        <button type="button" class="btn btn-outline btn-icon remove-dynamic-btn">✕</button>
    </div>`;
}

function vaccinationRow(vacc, i) {
    return `<div class="dynamic-item vacc-row">
        <input class="form-input vacc-name" type="text" placeholder="Vaccine" value="${vacc.name||''}">
        <input class="form-input vacc-date" type="date" value="${vacc.date||''}" style="max-width:160px;">
        <button type="button" class="btn btn-outline btn-icon remove-dynamic-btn">✕</button>
    </div>`;
}

function setupTagAdder(inputId, btnId, listId, type) {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    const list = document.getElementById(listId);
    if (!input || !btn || !list) return;

    const add = () => {
        const val = input.value.trim();
        if (!val) return;
        const span = document.createElement('span');
        span.className = 'tag';
        span.setAttribute('data-type', type);
        span.innerHTML = `<span class="tag-text">${val}</span><span class="tag-remove">✕</span>`;
        list.appendChild(span);
        input.value = '';
        input.focus();
    };

    btn.addEventListener('click', add);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
}

function collectTags(listId) {
    const tags = [];
    document.querySelectorAll(`#${listId} .tag .tag-text`).forEach(el => {
        const text = el.textContent.trim();
        if (text) tags.push(text);
    });
    return tags;
}
