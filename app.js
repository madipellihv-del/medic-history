/* ============================================================
   MedicHistory — Enterprise App Router (3-Role Auth)
   ============================================================ */

const App = (() => {
    const contentEl = () => document.getElementById('app-content');
    let _currentParams = {};
    let _currentRoute = '';

    const routes = {
        'login':            LoginPage,
        'signup':           SignupPage,
        'dashboard':        DashboardPage,
        'register':         RegisterPage,
        'medical-history':  MedicalHistoryPage,
        'patients':         PatientListPage,
        'emergency-card':   EmergencyCardPage,
        'verify-patient':   VerifyPatientPage,
    };

    const publicRoutes = ['login', 'signup'];

    // Page titles for breadcrumbs
    const routeTitles = {
        'dashboard':       'Dashboard',
        'register':        'Patient Registration',
        'patients':        'Patient Records',
        'medical-history': 'Medical History',
        'emergency-card':  'Emergency Card',
        'verify-patient':  'Patient Verification',
    };

    // --- Navigation ---
    async function navigate(route, params = {}) {
        const page = routes[route];
        if (!page) { console.warn('Unknown route:', route); return; }

        // Auth guard
        if (!publicRoutes.includes(route) && !Auth.isLoggedIn()) {
            navigate('login');
            return;
        }

        // Logged in? Don't show login/signup
        if (publicRoutes.includes(route) && Auth.isLoggedIn()) {
            navigate('dashboard');
            return;
        }

        const session = Auth.getSession();
        if (session) {
            const role = session.role;

            // Patient: can't access patient list or register (except own profile)
            if (role === 'patient' && route === 'patients') {
                navigate('dashboard');
                return;
            }

            // Hospital: READ-ONLY — block register, edit pages
            if (role === 'hospital' && route === 'register') {
                showToast('Hospital accounts have read-only access', 'error');
                navigate('dashboard');
                return;
            }

            // Hospital: needs verification before viewing patient details
            if (role === 'hospital' && ['emergency-card', 'medical-history'].includes(route) && params.id) {
                const pid = Number(params.id);
                if (!Auth.isPatientVerified(pid)) {
                    navigate('verify-patient', { id: pid, action: route });
                    return;
                }
            }

            // Admin: needs verification for patient details (same as hospital)
            if (role === 'admin' && ['emergency-card', 'medical-history'].includes(route) && params.id) {
                const pid = Number(params.id);
                if (!Auth.isPatientVerified(pid)) {
                    navigate('verify-patient', { id: pid, action: route });
                    return;
                }
            }

            // Patient: only edit own record
            if (role === 'patient' && route === 'register' && params.id) {
                if (Number(params.id) !== session.patientId) {
                    showToast('You can only edit your own profile', 'error');
                    navigate('dashboard');
                    return;
                }
            }
        }

        _currentParams = params;
        _currentRoute = route;

        const container = contentEl();
        container.style.opacity = '0';
        container.style.transform = 'translateY(8px)';

        await new Promise(r => setTimeout(r, 120));

        const html = await page.render(params);
        container.innerHTML = html;

        requestAnimationFrame(() => {
            container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        });

        if (page.afterRender) {
            setTimeout(() => page.afterRender(), 50);
        }

        updateShell(route);
        closeSidebar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- Update sidebar, topbar, breadcrumb ---
    function updateShell(activeRoute) {
        const sidebar = document.getElementById('sidebar');
        const sidebarNav = document.getElementById('sidebar-nav');
        const sidebarFooter = document.getElementById('sidebar-footer');
        const topbar = document.getElementById('topbar');
        const breadcrumb = document.getElementById('breadcrumb');
        const topbarRight = document.getElementById('topbar-right');
        const mainWrapper = document.getElementById('main-wrapper');

        const session = Auth.getSession();

        // Hide shell on auth pages
        if (publicRoutes.includes(activeRoute)) {
            sidebar.classList.add('hidden');
            topbar.classList.add('hidden');
            mainWrapper.classList.add('no-sidebar');
            return;
        } else {
            sidebar.classList.remove('hidden');
            topbar.classList.remove('hidden');
            mainWrapper.classList.remove('no-sidebar');
        }

        if (!session) return;

        const role = session.role;
        const links = buildNavLinks(role, session);

        // Sidebar nav
        sidebarNav.innerHTML = links.map(l => {
            if (l.divider) return '<div class="sidebar-divider"></div>';
            if (l.heading) return `<div class="sidebar-heading">${l.heading}</div>`;
            const isActive = activeRoute === l.route;
            const paramsAttr = l.params ? `data-params='${JSON.stringify(l.params)}'` : '';
            return `
                <a href="#" class="sidebar-link ${isActive ? 'active' : ''}"
                   data-route="${l.route}" ${paramsAttr}>
                    ${l.icon}
                    <span>${l.label}</span>
                </a>`;
        }).join('');

        // Sidebar footer (user + logout)
        const roleBadgeClass = role === 'admin' ? 'role-admin' : (role === 'hospital' ? 'role-hospital' : 'role-patient');
        const roleLabel = role === 'admin' ? 'Administrator' : (role === 'hospital' ? 'Hospital Staff' : 'Patient');

        sidebarFooter.innerHTML = `
            <div class="sidebar-user">
                <div class="sidebar-user-avatar">${session.username[0].toUpperCase()}</div>
                <div class="sidebar-user-info">
                    <div class="sidebar-user-name">${session.username}</div>
                    <div class="sidebar-user-role"><span class="role-badge ${roleBadgeClass}">${roleLabel}</span></div>
                </div>
            </div>
            <button class="btn btn-outline btn-sm w-full" id="logout-btn">Sign Out</button>
        `;

        // Breadcrumb
        const title = routeTitles[activeRoute] || 'Dashboard';
        breadcrumb.innerHTML = `
            <span class="breadcrumb-item" data-route="dashboard">Home</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span class="breadcrumb-current">${title}</span>
        `;

        // Topbar right (role badge)
        topbarRight.innerHTML = `
            <span class="role-badge ${roleBadgeClass}">${roleLabel}</span>
            ${role === 'hospital' ? `<span class="topbar-org">${session.hospitalName || ''}</span>` : ''}
        `;
    }

    // Build nav links based on role
    function buildNavLinks(role, session) {
        let links = [];

        links.push({
            route: 'dashboard',
            label: 'Dashboard',
            icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'
        });

        if (role === 'patient') {
            links.push({ divider: true });
            links.push({ heading: 'MY RECORDS' });
            links.push({
                route: 'register',
                label: 'My Profile',
                params: { id: session.patientId },
                icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
            });
            links.push({
                route: 'medical-history',
                label: 'Medical History',
                params: { id: session.patientId },
                icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
            });
            links.push({
                route: 'emergency-card',
                label: 'Emergency Card',
                params: { id: session.patientId },
                icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
            });
        }

        if (role === 'hospital') {
            links.push({ divider: true });
            links.push({ heading: 'PATIENT ACCESS' });
            links.push({
                route: 'patients',
                label: 'Patient Records',
                icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
            });
        }

        if (role === 'admin') {
            links.push({ divider: true });
            links.push({ heading: 'MANAGEMENT' });
            links.push({
                route: 'patients',
                label: 'All Patients',
                icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
            });
            links.push({
                route: 'register',
                label: 'Register Patient',
                icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>'
            });
        }

        return links;
    }

    // --- Sidebar mobile ---
    function openSidebar() {
        document.getElementById('sidebar')?.classList.add('open');
        document.getElementById('sidebar-overlay')?.classList.add('open');
    }

    function closeSidebar() {
        document.getElementById('sidebar')?.classList.remove('open');
        document.getElementById('sidebar-overlay')?.classList.remove('open');
    }

    // --- Toast ---
    function showToast(message, type = 'info') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const icons = { success: '✓', error: '✕', info: 'i' };
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span class="toast-icon">${icons[type] || 'i'}</span><span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // --- Confirm modal ---
    function showConfirm(message, onConfirm) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal">
                <h3>Confirm Action</h3>
                <p>${message}</p>
                <div class="modal-actions">
                    <button class="btn btn-outline modal-cancel">Cancel</button>
                    <button class="btn btn-danger modal-confirm">Confirm</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        overlay.querySelector('.modal-cancel').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
        overlay.querySelector('.modal-confirm').addEventListener('click', () => {
            overlay.remove();
            onConfirm();
        });
    }

    // --- Init ---
    function init() {
        // Global click delegation
        document.addEventListener('click', (e) => {
            if (e.target.id === 'logout-btn' || e.target.closest('#logout-btn')) {
                e.preventDefault();
                Auth.logout();
                showToast('Signed out successfully', 'info');
                navigate('login');
                return;
            }

            const routeEl = e.target.closest('[data-route]');
            if (routeEl) {
                e.preventDefault();
                const route = routeEl.dataset.route;
                let params = {};
                if (routeEl.dataset.params) {
                    try { params = JSON.parse(routeEl.dataset.params); } catch (ex) {}
                }
                if (routeEl.dataset.id) params.id = routeEl.dataset.id;
                navigate(route, params);
                return;
            }

            const actionEl = e.target.closest('[data-action]');
            if (actionEl) {
                const action = actionEl.dataset.action;
                const id = actionEl.dataset.id;
                if (action === 'view-emergency') navigate('emergency-card', { id });
                else if (action === 'edit-patient') navigate('register', { id });
                else if (action === 'edit-history') navigate('medical-history', { id });
            }
        });

        // Sidebar toggle
        document.getElementById('topbar-hamburger')?.addEventListener('click', openSidebar);
        document.getElementById('sidebar-close-btn')?.addEventListener('click', closeSidebar);
        document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);

        // Boot
        if (Auth.isLoggedIn()) {
            navigate('dashboard');
        } else {
            navigate('login');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        navigate,
        showToast,
        showConfirm,
        get currentParams() { return _currentParams; },
        get currentRoute() { return _currentRoute; },
    };
})();
