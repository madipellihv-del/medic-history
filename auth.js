/* ============================================================
   MedicHistory — Authentication Layer
   Uses Web Crypto API for password hashing, IndexedDB for user
   storage, and sessionStorage for session management.
   ============================================================ */

const Auth = (() => {
    const DB_NAME = 'MedicHistoryDB';
    const DB_VERSION = 2; // bumped for users store
    const USERS_STORE = 'users';
    const SESSION_KEY = 'medic_session';

    // Track verified patients for hospital sessions
    const VERIFIED_KEY = 'medic_verified_patients';

    // --- Database ---
    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;

                // Create patients store if not exists (from db.js v1)
                if (!db.objectStoreNames.contains('patients')) {
                    const pStore = db.createObjectStore('patients', {
                        keyPath: 'id',
                        autoIncrement: true,
                    });
                    pStore.createIndex('lastName', 'lastName', { unique: false });
                    pStore.createIndex('bloodGroup', 'bloodGroup', { unique: false });
                    pStore.createIndex('createdAt', 'createdAt', { unique: false });
                }

                // Create users store
                if (!db.objectStoreNames.contains(USERS_STORE)) {
                    const uStore = db.createObjectStore(USERS_STORE, {
                        keyPath: 'id',
                        autoIncrement: true,
                    });
                    uStore.createIndex('username', 'username', { unique: true });
                    uStore.createIndex('role', 'role', { unique: false });
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // --- Crypto ---
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + '_medic_salt_2026');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // --- User Operations ---
    async function register(userData) {
        const db = await openDB();
        const passwordHash = await hashPassword(userData.password);

        const user = {
            username: userData.username.toLowerCase().trim(),
            passwordHash,
            role: userData.role, // 'patient', 'hospital', or 'admin'
            patientId: userData.patientId || null,
            hospitalName: userData.hospitalName || '',
            hospitalRegNo: userData.hospitalRegNo || '',
            createdAt: new Date().toISOString(),
        };

        return new Promise((resolve, reject) => {
            const tx = db.transaction(USERS_STORE, 'readwrite');
            const store = tx.objectStore(USERS_STORE);
            const req = store.add(user);
            req.onsuccess = () => {
                user.id = req.result;
                resolve(user);
            };
            req.onerror = () => {
                if (req.error && req.error.name === 'ConstraintError') {
                    reject(new Error('Username already exists'));
                } else {
                    reject(req.error);
                }
            };
        });
    }

    async function login(username, password) {
        const db = await openDB();
        const passwordHash = await hashPassword(password);

        return new Promise((resolve, reject) => {
            const tx = db.transaction(USERS_STORE, 'readonly');
            const store = tx.objectStore(USERS_STORE);
            const index = store.index('username');
            const req = index.get(username.toLowerCase().trim());

            req.onsuccess = () => {
                const user = req.result;
                if (!user) {
                    reject(new Error('User not found'));
                    return;
                }
                if (user.passwordHash !== passwordHash) {
                    reject(new Error('Incorrect password'));
                    return;
                }
                // Create session
                const session = {
                    userId: user.id,
                    username: user.username,
                    role: user.role,
                    patientId: user.patientId,
                    hospitalName: user.hospitalName,
                    loginAt: new Date().toISOString(),
                };
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
                sessionStorage.removeItem(VERIFIED_KEY);
                resolve(session);
            };
            req.onerror = () => reject(req.error);
        });
    }

    function logout() {
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(VERIFIED_KEY);
    }

    function getSession() {
        const data = sessionStorage.getItem(SESSION_KEY);
        return data ? JSON.parse(data) : null;
    }

    function isLoggedIn() {
        return !!getSession();
    }

    function getRole() {
        const session = getSession();
        return session ? session.role : null;
    }

    // --- Patient Verification (Hospital) ---
    function getVerifiedPatients() {
        const data = sessionStorage.getItem(VERIFIED_KEY);
        return data ? JSON.parse(data) : [];
    }

    function addVerifiedPatient(patientId) {
        const verified = getVerifiedPatients();
        if (!verified.includes(patientId)) {
            verified.push(patientId);
            sessionStorage.setItem(VERIFIED_KEY, JSON.stringify(verified));
        }
    }

    function isPatientVerified(patientId) {
        // Patients always have access to their own record
        const session = getSession();
        if (session && session.role === 'patient' && session.patientId === patientId) {
            return true;
        }
        return getVerifiedPatients().includes(patientId);
    }

    // --- Update user's linked patientId ---
    async function linkPatient(userId, patientId) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(USERS_STORE, 'readwrite');
            const store = tx.objectStore(USERS_STORE);
            const getReq = store.get(userId);
            getReq.onsuccess = () => {
                const user = getReq.result;
                if (!user) { reject(new Error('User not found')); return; }
                user.patientId = patientId;
                const putReq = store.put(user);
                putReq.onsuccess = () => {
                    // Update session too
                    const session = getSession();
                    if (session && session.userId === userId) {
                        session.patientId = patientId;
                        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
                    }
                    resolve();
                };
                putReq.onerror = () => reject(putReq.error);
            };
            getReq.onerror = () => reject(getReq.error);
        });
    }

    // --- Permission helpers ---
    function canEditPatients() {
        const role = getRole();
        return role === 'admin' || role === 'patient';
    }

    function canDeletePatients() {
        return getRole() === 'admin';
    }

    function canRegisterPatients() {
        return getRole() === 'admin';
    }

    return {
        openDB, register, login, logout, getSession, isLoggedIn, getRole,
        hashPassword, getVerifiedPatients, addVerifiedPatient, isPatientVerified,
        linkPatient, canEditPatients, canDeletePatients, canRegisterPatients,
    };
})();
