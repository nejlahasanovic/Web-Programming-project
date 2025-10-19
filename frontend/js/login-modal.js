
(function($) {
    'use strict';

    console.log('=== LOGIN MODAL SCRIPT STARTING ===');

    let currentUser = null;

    // Hardcoded users for testing
    const users = [
        {
            email: 'admin@90minut.com',
            password: 'admin123',
            role: 'admin',
            name: 'Admin User'
        },
        {
            email: 'user@90minut.com',
            password: 'user123',
            role: 'user',
            name: 'Regular User'
        }
    ];

    // ======================================
    // USER MANAGEMENT FUNCTIONS
    // ======================================
    
    function isLoggedIn() {
        return currentUser !== null;
    }

    function getCurrentUser() {
        return currentUser;
    }

    function saveUser(user) {
        currentUser = user;
        console.log('✓ User saved:', user);
    }

    function logoutUser() {
        currentUser = null;
        console.log('✓ User logged out');
    }

    // ======================================
// UI UPDATE FUNCTION
// ======================================

function updateUI() {
    const user = getCurrentUser();
    
    console.log('Updating UI, current user:', user);
    
    // Pokušaj da pronađeš SVE profile linkove (i stare i nove)
    const profileLinks = document.querySelectorAll('#profileLink, #profileIconNew, a[href="#profile"]');
    const signInLinks = document.querySelectorAll('.signin-link, .signin-link-new');
    
    console.log('Found profile links:', profileLinks.length);
    console.log('Found sign in links:', signInLinks.length);
    
    if (user) {
        // User is logged in
        console.log('User logged in - updating UI');
        
        // Update old sign in button (if exists)
        const oldSignIn = document.querySelector('#openLoginModal');
        if (oldSignIn) {
            oldSignIn.textContent = user.name;
            oldSignIn.style.pointerEvents = 'none';
        }
        
        // Show ALL profile links (stari i novi)
        profileLinks.forEach(link => {
            link.style.display = 'flex';
            if (link.parentElement && link.parentElement.tagName === 'LI') {
                link.parentElement.style.display = 'list-item';
            }
        });
        
        // Hide ALL sign in links (stari i novi)
        signInLinks.forEach(link => {
            link.style.display = 'none';
        });
        
        // Add logout option if not already present
        if (!document.querySelector('#logoutBtn')) {
            console.log('Adding logout buttons...');
            
            // Desktop menu
            const desktopMenu = document.querySelector('.header__top .ht-info ul');
            if (desktopMenu) {
                const logoutLi = document.createElement('li');
                logoutLi.innerHTML = '<a href="#" id="logoutBtn"><i class="fa fa-sign-out"></i></a>';
                desktopMenu.appendChild(logoutLi);
            }
            
            // Mobile menu
            const mobileMenu = document.querySelector('.offcanvas-menu-wrapper .ht-info ul');
            if (mobileMenu) {
                const logoutLi = document.createElement('li');
                logoutLi.innerHTML = '<a href="#" id="logoutBtn-mobile"><i class="fa fa-sign-out"></i></a>';
                mobileMenu.appendChild(logoutLi);
            }
        }
    } else {
        // User is not logged in
        console.log('No user - hiding profile');
        
        // Reset old sign in button (if exists)
        const oldSignIn = document.querySelector('#openLoginModal');
        if (oldSignIn) {
            oldSignIn.textContent = 'Sign in';
            oldSignIn.style.pointerEvents = 'auto';
        }
        
        // Hide ALL profile links (stari i novi)
        profileLinks.forEach(link => {
            link.style.display = 'none';
            if (link.parentElement && link.parentElement.tagName === 'LI') {
                link.parentElement.style.display = 'none';
            }
        });
        
        // Show ALL sign in links (stari i novi)
        signInLinks.forEach(link => {
            link.style.display = 'flex';
        });
        
        // Remove logout buttons
        const logoutBtns = document.querySelectorAll('#logoutBtn, #logoutBtn-mobile');
        logoutBtns.forEach(btn => {
            if (btn.parentElement) {
                btn.parentElement.remove();
            }
        });
    }
    
    console.log('✓ UI updated');
}

    // ======================================
    // ATTACH ALL EVENT LISTENERS
    // ======================================
    
   function attachEventListeners() {
    console.log('Attaching event listeners...');
    
    // Open Login Modal - STARI buttons
    const openModalBtns = document.querySelectorAll('#openLoginModal');
    openModalBtns.forEach(btn => {
        btn.removeEventListener('click', handleOpenModal);
        btn.addEventListener('click', handleOpenModal);
    });
    
    // Open Login Modal - NOVI Sign in link u navbar-u
    const openModalNewBtns = document.querySelectorAll('#openLoginModalNew');
    openModalNewBtns.forEach(btn => {
        btn.removeEventListener('click', handleOpenModal);
        btn.addEventListener('click', handleOpenModal);
    });
    
    // Close Modal - X button
    const closeBtn = document.querySelector('#closeLoginModal');
    if (closeBtn) {
        closeBtn.removeEventListener('click', handleCloseModal);
        closeBtn.addEventListener('click', handleCloseModal);
    }
    
    // Close Modal - Overlay click
    const modal = document.querySelector('#loginModal');
    if (modal) {
        modal.removeEventListener('click', handleOverlayClick);
        modal.addEventListener('click', handleOverlayClick);
    }
    
    // Tab switching
    const tabs = document.querySelectorAll('.login-tab');
    tabs.forEach(tab => {
        tab.removeEventListener('click', handleTabSwitch);
        tab.addEventListener('click', handleTabSwitch);
    });
    
    // Login form
    const loginForm = document.querySelector('#loginForm');
    if (loginForm) {
        loginForm.removeEventListener('submit', handleLogin);
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup form
    const signupForm = document.querySelector('#signupForm');
    if (signupForm) {
        signupForm.removeEventListener('submit', handleSignup);
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Escape key
    document.removeEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleEscape);
    
    console.log('✓ Event listeners attached');
}

    // ======================================
    // EVENT HANDLER FUNCTIONS
    // ======================================
    
    function handleOpenModal(e) {
        e.preventDefault();
        console.log('>>> Open modal clicked');
        
        if (isLoggedIn()) {
            console.log('User already logged in');
            return;
        }
        
        const modal = document.querySelector('#loginModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('✓ Modal opened');
        } else {
            console.error('Modal not found!');
        }
    }
    
    function handleCloseModal(e) {
        e.preventDefault();
        const modal = document.querySelector('#loginModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            console.log('✓ Modal closed');
        }
    }
    
    function handleOverlayClick(e) {
        if (e.target.id === 'loginModal') {
            handleCloseModal(e);
        }
    }
    
    function handleTabSwitch(e) {
        const tabName = this.getAttribute('data-tab');
        console.log('Switching to tab:', tabName);
        
        document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        const loginForm = document.querySelector('.login-form');
        const signupForm = document.querySelector('.signup-form');
        const header = document.querySelector('.login-header');
        
        if (tabName === 'login') {
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
            header.querySelector('h2').textContent = 'Dobrodošli nazad';
            header.querySelector('p').textContent = 'Prijavite se da nastavite na 90 Minut';
        } else {
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
            header.querySelector('h2').textContent = 'Kreiraj nalog';
            header.querySelector('p').textContent = 'Pridružite se 90 Minut danas';
        }
    }
    
    function handleLogin(e) {
        e.preventDefault();
        console.log('>>> Login form submitted');
        
        const email = document.querySelector('#login-email').value;
        const password = document.querySelector('#login-password').value;
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            console.log('✓ Login successful:', user);
            
            saveUser(user);
            updateUI();
            
            const modal = document.querySelector('#loginModal');
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            
            if (user.role === 'admin') {
                alert(`Dobrodošli Admin! Preusmjeravanje na Dashboard...`);
                window.location.hash = '#admin-dashboard';
            } else {
                alert(`Dobrodošli ${user.name}! Sada možete komentarisati postove.`);
            }
        } else {
            console.log('✗ Login failed');
            alert('Neispravna email adresa ili lozinka!\n\nPokušajte:\nAdmin: admin@90minut.com / admin123\nKorisnik: user@90minut.com / user123');
        }
    }
    
    function handleSignup(e) {
        e.preventDefault();
        console.log('>>> Signup form submitted');
        
        const firstName = document.querySelector('#signup-firstname').value;
        const lastName = document.querySelector('#signup-lastname').value;
        const email = document.querySelector('#signup-email').value;
        const password = document.querySelector('#signup-password').value;
        const confirmPassword = document.querySelector('#signup-confirm').value;
        
        if (password !== confirmPassword) {
            alert('Lozinke se ne poklapaju!');
            return;
        }
        
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            alert('Korisnik sa ovim emailom već postoji!');
            return;
        }
        
        const newUser = {
            email: email,
            password: password,
            role: 'user',
            name: `${firstName} ${lastName}`
        };
        
        console.log('✓ Registration successful:', newUser);
        
        users.push(newUser);
        saveUser(newUser);
        updateUI();
        
        alert(`Nalog uspješno kreiran! Dobrodošli ${newUser.name}!`);
        
        const modal = document.querySelector('#loginModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function handleLogout(e) {
        e.preventDefault();
        console.log('>>> Logout clicked');
        
        if (confirm('Da li ste sigurni da želite da se odjavite?')) {
            logoutUser();
            updateUI();
            alert('Uspješno ste se odjavili.');
            window.location.hash = '#home';
        }
    }
    
    function handleEscape(e) {
        if (e.key === 'Escape') {
            const modal = document.querySelector('#loginModal');
            if (modal && modal.classList.contains('active')) {
                handleCloseModal(e);
            }
        }
    }

    // ======================================
    // INITIALIZE
    // ======================================
    
    function initialize() {
        console.log('Initializing login system...');
        attachEventListeners();
        updateUI();
        console.log('✓ Login system initialized');
    }

    // ======================================
    // RE-INITIALIZE ON PAGE CHANGE (for SPA)
    // ======================================
    
    function reinitialize() {
        console.log('Re-initializing for new page...');
        setTimeout(() => {
            attachEventListeners();
            updateUI();
        }, 100);
    }

    // Listen for page changes (hash change)
    window.addEventListener('hashchange', reinitialize);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Also initialize after a short delay (for SPA)
    setTimeout(initialize, 500);

    // ======================================
    // EXPOSE FUNCTIONS GLOBALLY
    // ======================================
    
    window.FootballPortal = window.FootballPortal || {};
    window.FootballPortal.isLoggedIn = isLoggedIn;
    window.FootballPortal.getCurrentUser = getCurrentUser;
    window.FootballPortal.logoutUser = function() {
        logoutUser();
        updateUI();
    };
    window.FootballPortal.updateUI = updateUI;
    window.FootballPortal.reinitialize = reinitialize;

    // Attach logout handler using event delegation
    document.addEventListener('click', function(e) {
        if (e.target.id === 'logoutBtn' || e.target.id === 'logoutBtn-mobile' || 
            (e.target.parentElement && (e.target.parentElement.id === 'logoutBtn' || e.target.parentElement.id === 'logoutBtn-mobile'))) {
            handleLogout(e);
        }
    });

    console.log('=== LOGIN MODAL SCRIPT LOADED ===');
    console.log('FootballPortal object:', window.FootballPortal);

})(jQuery);