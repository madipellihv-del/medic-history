/* ============================================================
   Patient List Page — Zone-Based Organization
   Hospital: read-only; Admin: full access
   Autocomplete location filters (Country, State, District, Mandal, Village)
   ============================================================ */

const PatientListPage = {
    async render(params) {
        const session = Auth.getSession();
        if (!session || session.role === 'patient') {
            return `<div class="page-enter"><div class="card empty-state">
                <div class="empty-title">Access Denied</div>
                <div class="empty-text">Patient accounts can only access their own records.</div>
                <button class="btn btn-primary" data-route="dashboard">Return to Dashboard</button>
            </div></div>`;
        }

        const patients = (await MedicDB.getAllPatients()).filter(p => p.firstName);
        const isAdmin = session.role === 'admin';

        // Collect unique zones
        const districts = [...new Set(patients.map(p => p.district).filter(Boolean))].sort();

        return `
        <div class="page-enter">
            <div class="page-header">
                <h1>Patient Records</h1>
                <p>${patients.length} patient${patients.length !== 1 ? 's' : ''} registered in the system</p>
            </div>

            <!-- Search & Filters -->
            <div class="card mb-16">
                <div class="filter-bar">
                    <div class="search-container" style="flex:1; margin-bottom:0;">
                        <span class="search-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                        <input type="text" class="search-input" id="patient-search"
                               placeholder="Search by name, ID, blood group, phone...">
                    </div>
                    <input type="text" class="ac-filter-input" id="filter-country" placeholder="Country" autocomplete="off">
                    <input type="text" class="ac-filter-input" id="filter-state" placeholder="State" autocomplete="off">
                    <input type="text" class="ac-filter-input" id="filter-district" placeholder="District" autocomplete="off">
                    <input type="text" class="ac-filter-input" id="filter-mandal" placeholder="Mandal" autocomplete="off">
                    <input type="text" class="ac-filter-input" id="filter-village" placeholder="Village" autocomplete="off">
                    <select class="form-select filter-select" id="filter-blood">
                        <option value="">All Blood Groups</option>
                        ${['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => `<option value="${bg}">${bg}</option>`).join('')}
                    </select>
                    ${isAdmin ? `<button class="btn btn-primary" data-route="register">+ Add Patient</button>` : ''}
                </div>
            </div>

            <!-- Zone Summary -->
            ${districts.length > 0 ? `
            <div class="zone-summary mb-16">
                ${districts.map(d => {
                    const count = patients.filter(p => p.district === d).length;
                    return `<button class="zone-badge" data-district="${d}">${d} <span class="zone-count">${count}</span></button>`;
                }).join('')}
            </div>` : ''}

            <!-- Patient Table -->
            <div class="card" id="patient-list-container">
                ${patients.length === 0 ? `
                    <div class="empty-state">
                        <div class="empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
                        <div class="empty-title">No patient records</div>
                        <div class="empty-text">Register the first patient to get started.</div>
                        ${isAdmin ? `<button class="btn btn-primary" data-route="register">Register Patient</button>` : ''}
                    </div>
                ` : `
                    <div class="table-wrap">
                        <table class="data-table" id="patients-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Patient</th>
                                    <th>Blood</th>
                                    <th>District</th>
                                    <th>Mandal</th>
                                    <th>Phone</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="patients-tbody">
                                ${patients.map(p => patientRowHTML(p, isAdmin)).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div class="table-footer" id="table-footer">
                        <span id="result-count">${patients.length} patients</span>
                    </div>
                `}
            </div>

            <div class="security-notice mt-16">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>${isAdmin ? 'Administrator access — full record management enabled' : 'Hospital read-only access — patient verification required to view records'}</span>
            </div>
        </div>`;
    },

    afterRender() {
        const searchInput = document.getElementById('patient-search');
        const filterCountry = document.getElementById('filter-country');
        const filterState = document.getElementById('filter-state');
        const filterDistrict = document.getElementById('filter-district');
        const filterMandal = document.getElementById('filter-mandal');
        const filterVillage = document.getElementById('filter-village');
        const bloodFilter = document.getElementById('filter-blood');

        // Collect unique values from patient rows for autocomplete options
        const getUniqueFromRows = (attr, parentFilters = {}) => {
            const values = new Set();
            document.querySelectorAll('.patient-row').forEach(row => {
                // Check parent filters
                let match = true;
                for (const [key, val] of Object.entries(parentFilters)) {
                    if (val && (row.dataset[key] || '').toLowerCase() !== val.toLowerCase()) {
                        match = false;
                        break;
                    }
                }
                if (match && row.dataset[attr]) {
                    values.add(row.dataset[attr]);
                }
            });
            return [...values].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
        };

        const applyFilters = () => {
            const q = (searchInput?.value || '').toLowerCase();
            const country = (filterCountry?.value || '').toLowerCase();
            const state = (filterState?.value || '').toLowerCase();
            const district = (filterDistrict?.value || '').toLowerCase();
            const mandal = (filterMandal?.value || '').toLowerCase();
            const village = (filterVillage?.value || '').toLowerCase();
            const blood = bloodFilter?.value || '';
            let visible = 0;

            document.querySelectorAll('.patient-row').forEach(row => {
                const data = row.dataset;
                const matchSearch = !q || data.name.includes(q) || data.blood.includes(q)
                    || data.phone.includes(q) || data.id.includes(q) || (data.district || '').includes(q)
                    || (data.country || '').includes(q) || (data.state || '').includes(q);
                const matchCountry = !country || (data.country || '').toLowerCase() === country;
                const matchState = !state || (data.state || '').toLowerCase() === state;
                const matchDistrict = !district || (data.district || '').toLowerCase() === district;
                const matchMandal = !mandal || (data.mandal || '').toLowerCase() === mandal;
                const matchVillage = !village || (data.village || '').toLowerCase() === village;
                const matchBlood = !blood || data.blood === blood.toLowerCase();
                const show = matchSearch && matchCountry && matchState && matchDistrict && matchMandal && matchVillage && matchBlood;
                row.style.display = show ? '' : 'none';
                if (show) visible++;
            });

            const countEl = document.getElementById('result-count');
            if (countEl) countEl.textContent = `${visible} patients`;
        };

        // Initialize autocomplete on location filter inputs
        AutocompleteInput.init('filter-country',
            () => getUniqueFromRows('country'),
            (val) => {
                filterState.value = '';
                filterDistrict.value = '';
                filterMandal.value = '';
                filterVillage.value = '';
                applyFilters();
            }
        );

        AutocompleteInput.init('filter-state',
            () => getUniqueFromRows('state', { country: filterCountry?.value }),
            (val) => {
                filterDistrict.value = '';
                filterMandal.value = '';
                filterVillage.value = '';
                applyFilters();
            }
        );

        AutocompleteInput.init('filter-district',
            () => getUniqueFromRows('district', { country: filterCountry?.value, state: filterState?.value }),
            (val) => {
                filterMandal.value = '';
                filterVillage.value = '';
                applyFilters();
            }
        );

        AutocompleteInput.init('filter-mandal',
            () => getUniqueFromRows('mandal', { country: filterCountry?.value, state: filterState?.value, district: filterDistrict?.value }),
            (val) => {
                filterVillage.value = '';
                applyFilters();
            }
        );

        AutocompleteInput.init('filter-village',
            () => getUniqueFromRows('village', { country: filterCountry?.value, state: filterState?.value, district: filterDistrict?.value, mandal: filterMandal?.value }),
            (val) => {
                applyFilters();
            }
        );

        // Also apply filters when typing in autocomplete inputs (not just on select)
        [filterCountry, filterState, filterDistrict, filterMandal, filterVillage].forEach(input => {
            if (input) {
                input.addEventListener('input', applyFilters);
            }
        });

        searchInput?.addEventListener('input', applyFilters);
        bloodFilter?.addEventListener('change', applyFilters);

        // Zone badge clicks = filter by district
        document.querySelectorAll('.zone-badge').forEach(badge => {
            badge.addEventListener('click', () => {
                filterDistrict.value = badge.dataset.district;
                applyFilters();
            });
        });

        searchInput?.focus();

        // Row action delegation
        document.getElementById('patient-list-container')?.addEventListener('click', async (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;
            const id = Number(btn.dataset.id);

            switch (action) {
                case 'view-emergency': App.navigate('emergency-card', { id }); break;
                case 'view-history':   App.navigate('medical-history', { id }); break;
                case 'edit-patient':   App.navigate('register', { id }); break;
                case 'edit-history':   App.navigate('medical-history', { id }); break;
                case 'delete-patient':
                    App.showConfirm('Permanently delete this patient record?', async () => {
                        await MedicDB.deletePatient(id);
                        App.showToast('Record deleted', 'info');
                        App.navigate('patients');
                    });
                    break;
            }
        });
    }
};

function patientRowHTML(p, isAdmin) {
    const condBadges = (p.conditions || []).slice(0, 2).map(c =>
        `<span class="badge badge-info">${c}</span>`
    ).join(' ');

    // Hospital: view-only actions; Admin: full CRUD
    const actions = isAdmin ? `
        <button class="btn btn-outline btn-sm" data-action="view-emergency" data-id="${p.id}">Emergency</button>
        <button class="btn btn-outline btn-sm" data-action="edit-history" data-id="${p.id}">History</button>
        <button class="btn btn-outline btn-sm" data-action="edit-patient" data-id="${p.id}">Edit</button>
        <button class="btn btn-outline btn-sm btn-danger-text" data-action="delete-patient" data-id="${p.id}">Delete</button>
    ` : `
        <button class="btn btn-outline btn-sm" data-action="view-emergency" data-id="${p.id}">Emergency</button>
        <button class="btn btn-outline btn-sm" data-action="view-history" data-id="${p.id}">History</button>
    `;

    return `
    <tr class="patient-row"
        data-id="${p.id}"
        data-name="${(p.firstName + ' ' + p.lastName).toLowerCase()}"
        data-blood="${(p.bloodGroup || '').toLowerCase()}"
        data-country="${(p.country || '').toLowerCase()}"
        data-state="${(p.state || '').toLowerCase()}"
        data-district="${(p.district || '').toLowerCase()}"
        data-mandal="${(p.mandal || '').toLowerCase()}"
        data-village="${(p.village || '').toLowerCase()}"
        data-phone="${(p.phone || '').toLowerCase()}">
        <td class="td-id">${p.id}</td>
        <td>
            <div class="patient-info-cell">
                <div class="patient-avatar-sm">${(p.firstName?.[0] || '') + (p.lastName?.[0] || '')}</div>
                <div>
                    <div class="patient-name-text">${p.firstName} ${p.lastName}</div>
                    <div class="patient-sub-text">${p.gender || ''} · ${calcAge(p.dob)} yrs</div>
                </div>
            </div>
        </td>
        <td><span class="badge badge-danger">${p.bloodGroup || '—'}</span></td>
        <td>${p.district || '—'}</td>
        <td>${p.mandal || '—'}</td>
        <td>${p.phone || '—'}</td>
        <td>
            <div class="row-actions">${actions}</div>
        </td>
    </tr>`;
}

function filterPatients(query) {
    const q = query.toLowerCase();
    document.querySelectorAll('.patient-row').forEach(row => {
        const name = row.dataset.name || '';
        const blood = row.dataset.blood || '';
        const match = name.includes(q) || blood.includes(q);
        row.style.display = match ? '' : 'none';
    });
}
