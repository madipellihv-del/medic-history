/* ============================================================
   Patient Registration Page (Enterprise, Auth-Aware)
   Zone-based: Country, State, District, Mandal, Village
   ============================================================ */

const RegisterPage = {
    editingId: null,

    async render(params) {
        let patient = null;
        const session = Auth.getSession();

        // Hospital role blocked
        if (session && session.role === 'hospital') {
            return `<div class="page-enter"><div class="card empty-state">
                <div class="empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
                <div class="empty-title">Access Restricted</div>
                <div class="empty-text">Hospital accounts have read-only access. Contact an administrator to modify records.</div>
                <button class="btn btn-primary" data-route="dashboard">Return to Dashboard</button>
            </div></div>`;
        }

        if (params && params.id) {
            patient = await MedicDB.getPatient(Number(params.id));
            this.editingId = patient ? patient.id : null;
        } else {
            this.editingId = null;
        }

        // Patient can only edit own
        if (session && session.role === 'patient' && this.editingId && this.editingId !== session.patientId) {
            return `<div class="page-enter"><div class="card empty-state">
                <div class="empty-title">Access Denied</div>
                <div class="empty-text">You can only edit your own profile.</div>
                <button class="btn btn-primary" data-route="dashboard">Return to Dashboard</button>
            </div></div>`;
        }

        const isEdit = !!patient;
        const isOwnProfile = session && session.role === 'patient' && this.editingId === session.patientId;
        const p = patient || {};

        const pageTitle = isOwnProfile ? 'My Profile' : (isEdit ? 'Edit Patient' : 'Register New Patient');
        const pageDesc = isOwnProfile ? 'Update your personal information and emergency contacts' : (isEdit ? 'Update patient record' : 'Add a new patient to the system');

        return `
        <div class="page-enter">
            <div class="page-header">
                <h1>${pageTitle}</h1>
                <p>${pageDesc}</p>
            </div>

            <form id="register-form" class="card" autocomplete="off">
                <!-- Photo Upload -->
                <div class="photo-upload mb-24">
                    <label class="photo-preview" id="photo-preview-label" title="Upload photo">
                        ${p.photo ? `<img src="${p.photo}" alt="">` : '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>'}
                    </label>
                    <input type="file" id="photo-input" accept="image/*">
                    <input type="hidden" id="photo-data" value="${p.photo || ''}">
                    <span class="form-hint">Click to upload photo</span>
                </div>

                <!-- Personal Info -->
                <div class="section-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <h2>Personal Information</h2>
                </div>
                <div class="form-grid mb-24">
                    <div class="form-group">
                        <label class="form-label" for="reg-firstName">First Name *</label>
                        <input class="form-input" type="text" id="reg-firstName" required value="${p.firstName || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="reg-lastName">Last Name *</label>
                        <input class="form-input" type="text" id="reg-lastName" required value="${p.lastName || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="reg-dob">Date of Birth *</label>
                        <input class="form-input" type="date" id="reg-dob" required value="${p.dob || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="reg-gender">Gender</label>
                        <select class="form-select" id="reg-gender">
                            <option value="">Select</option>
                            <option value="Male" ${p.gender === 'Male' ? 'selected' : ''}>Male</option>
                            <option value="Female" ${p.gender === 'Female' ? 'selected' : ''}>Female</option>
                            <option value="Other" ${p.gender === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="reg-bloodGroup">Blood Group *</label>
                        <select class="form-select" id="reg-bloodGroup" required>
                            <option value="">Select</option>
                            ${['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg =>
                                `<option value="${bg}" ${p.bloodGroup === bg ? 'selected' : ''}>${bg}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="reg-phone">Phone *</label>
                        <input class="form-input" type="tel" id="reg-phone" value="${p.phone || ''}" placeholder="+91 XXXXX XXXXX">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="reg-email">Email</label>
                        <input class="form-input" type="email" id="reg-email" value="${p.email || ''}">
                    </div>
                </div>

                <!-- Zone / Location -->
                <div class="section-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <h2>Location (Zone)</h2>
                </div>
                <div class="form-grid mb-24">
                    <div class="form-group">
                        <label class="form-label" for="reg-country">Country *</label>
                        <input class="form-input" type="text" id="reg-country" value="${p.country || ''}" placeholder="Type to search..." autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="reg-state">State *</label>
                        <input class="form-input" type="text" id="reg-state" value="${p.state || ''}" placeholder="Select country first..." autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="reg-district">District *</label>
                        <input class="form-input" type="text" id="reg-district" value="${p.district || ''}" placeholder="Select state first..." autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="reg-mandal">Mandal</label>
                        <input class="form-input" type="text" id="reg-mandal" value="${p.mandal || ''}" placeholder="Select district first..." autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="reg-village">Village / Town</label>
                        <input class="form-input" type="text" id="reg-village" value="${p.village || ''}" placeholder="Select mandal first..." autocomplete="off">
                    </div>
                    <div class="form-group full-width">
                        <label class="form-label" for="reg-address">Full Address</label>
                        <textarea class="form-textarea" id="reg-address" rows="2">${p.address || ''}</textarea>
                    </div>
                </div>

                <!-- Emergency Contacts -->
                <div class="section-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/></svg>
                    <h2>Emergency Contacts</h2>
                </div>
                <div id="emergency-contacts-list" class="dynamic-list mb-24">
                    ${(p.emergencyContacts && p.emergencyContacts.length > 0
                        ? p.emergencyContacts
                        : [{ name: '', relation: '', phone: '' }]
                    ).map((c, i) => emergencyContactRow(c, i)).join('')}
                </div>
                <button type="button" class="btn btn-outline btn-sm" id="add-contact-btn">+ Add Contact</button>

                <div class="mt-32 flex" style="gap:12px; justify-content:flex-end;">
                    <button type="button" class="btn btn-outline" data-route="dashboard">Cancel</button>
                    <button type="submit" class="btn btn-primary" id="register-submit">
                        ${isEdit ? 'Save Changes' : 'Register Patient'}
                    </button>
                </div>
            </form>
        </div>`;
    },

    afterRender() {
        const photoInput = document.getElementById('photo-input');
        const photoPreview = document.getElementById('photo-preview-label');
        const photoData = document.getElementById('photo-data');

        photoPreview.addEventListener('click', () => photoInput.click());
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                photoData.value = ev.target.result;
                photoPreview.innerHTML = `<img src="${ev.target.result}" alt="">`;
            };
            reader.readAsDataURL(file);
        });

        // --- Cascading Autocomplete for Location ---
        const getVal = (id) => document.getElementById(id)?.value?.trim() || '';

        // Country
        AutocompleteInput.init('reg-country',
            () => LocationData.getCountries(),
            (val) => {
                // Clear children
                document.getElementById('reg-state').value = '';
                document.getElementById('reg-district').value = '';
                document.getElementById('reg-mandal').value = '';
                document.getElementById('reg-village').value = '';
                document.getElementById('reg-state').placeholder = 'Type to search...';
            }
        );

        // State
        AutocompleteInput.init('reg-state',
            () => LocationData.getStates(getVal('reg-country')),
            (val) => {
                document.getElementById('reg-district').value = '';
                document.getElementById('reg-mandal').value = '';
                document.getElementById('reg-village').value = '';
                document.getElementById('reg-district').placeholder = 'Type to search...';
            }
        );

        // District
        AutocompleteInput.init('reg-district',
            () => LocationData.getDistricts(getVal('reg-country'), getVal('reg-state')),
            (val) => {
                document.getElementById('reg-mandal').value = '';
                document.getElementById('reg-village').value = '';
                document.getElementById('reg-mandal').placeholder = 'Type to search...';
            }
        );

        // Mandal
        AutocompleteInput.init('reg-mandal',
            () => LocationData.getMandals(getVal('reg-country'), getVal('reg-state'), getVal('reg-district')),
            (val) => {
                document.getElementById('reg-village').value = '';
                document.getElementById('reg-village').placeholder = 'Type to search...';
            }
        );

        // Village
        AutocompleteInput.init('reg-village',
            () => LocationData.getVillages(getVal('reg-country'), getVal('reg-state'), getVal('reg-district'), getVal('reg-mandal')),
            null
        );

        // Emergency contacts
        document.getElementById('add-contact-btn').addEventListener('click', () => {
            const list = document.getElementById('emergency-contacts-list');
            const div = document.createElement('div');
            div.innerHTML = emergencyContactRow({ name: '', relation: '', phone: '' }, list.children.length);
            list.appendChild(div.firstElementChild);
        });

        document.getElementById('emergency-contacts-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-contact-btn') || e.target.closest('.remove-contact-btn')) {
                const list = document.getElementById('emergency-contacts-list');
                if (list.children.length > 1) {
                    e.target.closest('.dynamic-item').remove();
                } else {
                    App.showToast('At least one emergency contact required', 'error');
                }
            }
        });

        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit();
        });
    },

    async handleSubmit() {
        const session = Auth.getSession();
        const patient = {
            firstName: document.getElementById('reg-firstName').value.trim(),
            lastName: document.getElementById('reg-lastName').value.trim(),
            dob: document.getElementById('reg-dob').value,
            gender: document.getElementById('reg-gender').value,
            bloodGroup: document.getElementById('reg-bloodGroup').value,
            phone: document.getElementById('reg-phone').value.trim(),
            email: document.getElementById('reg-email').value.trim(),
            country: document.getElementById('reg-country').value.trim(),
            state: document.getElementById('reg-state').value.trim(),
            district: document.getElementById('reg-district').value.trim(),
            mandal: document.getElementById('reg-mandal').value.trim(),
            village: document.getElementById('reg-village').value.trim(),
            address: document.getElementById('reg-address').value.trim(),
            photo: document.getElementById('photo-data').value || '',
            emergencyContacts: [],
        };

        document.querySelectorAll('.ec-row').forEach(row => {
            const name = row.querySelector('.ec-name').value.trim();
            const relation = row.querySelector('.ec-relation').value.trim();
            const phone = row.querySelector('.ec-phone').value.trim();
            if (name || phone) patient.emergencyContacts.push({ name, relation, phone });
        });

        if (!patient.firstName || !patient.lastName || !patient.dob || !patient.bloodGroup) {
            App.showToast('Please fill all required fields', 'error');
            return;
        }

        try {
            if (this.editingId) {
                patient.id = this.editingId;
                const existing = await MedicDB.getPatient(this.editingId);
                patient.conditions = existing.conditions || [];
                patient.allergies = existing.allergies || [];
                patient.medications = existing.medications || [];
                patient.surgeries = existing.surgeries || [];
                patient.vaccinations = existing.vaccinations || [];
                patient.familyHistory = existing.familyHistory || [];
                patient.createdAt = existing.createdAt;
                await MedicDB.updatePatient(patient);
                App.showToast('Patient updated', 'success');

                if (session && session.role === 'patient') {
                    App.navigate('dashboard');
                } else {
                    App.navigate('patients');
                }
            } else {
                const newId = await MedicDB.addPatient(patient);
                App.showToast('Patient registered', 'success');
                setTimeout(() => App.navigate('medical-history', { id: newId }), 400);
            }
        } catch (err) {
            App.showToast('Error: ' + err.message, 'error');
        }
    }
};

function emergencyContactRow(contact, index) {
    return `
    <div class="dynamic-item ec-row">
        <input class="form-input ec-name" type="text" placeholder="Contact Name" value="${contact.name || ''}">
        <input class="form-input ec-relation" type="text" placeholder="Relation" value="${contact.relation || ''}" style="max-width:140px;">
        <input class="form-input ec-phone" type="tel" placeholder="Phone Number" value="${contact.phone || ''}">
        <button type="button" class="btn btn-outline btn-icon remove-contact-btn" title="Remove">✕</button>
    </div>`;
}
