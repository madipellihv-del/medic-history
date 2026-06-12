/* ============================================================
   MedicHistory — IndexedDB Data Layer (v2)
   ============================================================ */

const MedicDB = (() => {
    const DB_NAME = 'MedicHistoryDB';
    const DB_VERSION = 2;
    const STORE_NAME = 'patients';

    function open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true,
                    });
                    store.createIndex('lastName', 'lastName', { unique: false });
                    store.createIndex('bloodGroup', 'bloodGroup', { unique: false });
                    store.createIndex('createdAt', 'createdAt', { unique: false });
                }
                // Users store created by auth.js
                if (!db.objectStoreNames.contains('users')) {
                    const uStore = db.createObjectStore('users', {
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

    async function addPatient(patient) {
        const now = new Date().toISOString();
        patient.createdAt = now;
        patient.updatedAt = now;

        patient.conditions = patient.conditions || [];
        patient.allergies = patient.allergies || [];
        patient.medications = patient.medications || [];
        patient.surgeries = patient.surgeries || [];
        patient.vaccinations = patient.vaccinations || [];
        patient.familyHistory = patient.familyHistory || [];
        patient.emergencyContacts = patient.emergencyContacts || [];

        const db = await open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.add(patient);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async function getPatient(id) {
        const db = await open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(id);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async function getAllPatients() {
        const db = await open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => reject(req.error);
        });
    }

    async function updatePatient(patient) {
        patient.updatedAt = new Date().toISOString();
        const db = await open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.put(patient);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async function deletePatient(id) {
        const db = await open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.delete(id);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }

    async function getCount() {
        const db = await open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.count();
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    return { open, addPatient, getPatient, getAllPatients, updatePatient, deletePatient, getCount };
})();
