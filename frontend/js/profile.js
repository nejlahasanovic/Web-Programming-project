// Profile Page JavaScript - 90 Minut
(function() {
    'use strict';

    console.log('Profile.js loaded');

    // Initialize profile page
    function initProfilePage() {
        // Check if we're on profile page
        if (!document.getElementById('profileForm')) {
            return;
        }

        console.log('Initializing profile page...');

        loadUserData();
        setupAvatarSelector();
        setupFormSubmit();
        setupLogoutButton();
        setupDeleteAccount();
        setupCopyUsernameLink();
    }

    // Load user data from FootballPortal
    function loadUserData() {
        if (window.FootballPortal && window.FootballPortal.getCurrentUser) {
            const user = window.FootballPortal.getCurrentUser();
            
            if (user) {
                console.log('Loading user data:', user);
                
                // Set email
                const emailInput = document.getElementById('email');
                if (emailInput && user.email) {
                    emailInput.value = user.email;
                }
                
                // Set username (generate from name)
                const usernameInput = document.getElementById('username');
                if (usernameInput && user.name) {
                    const username = user.name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
                    usernameInput.value = username;
                }
            } else {
                console.warn('No user logged in - redirecting to home');
                // If not logged in, redirect to home
                setTimeout(() => {
                    window.location.hash = '#home';
                    alert('Morate biti prijavljeni da pristupite profilu.');
                }, 100);
            }
        }
    }

    // Setup avatar color selector
    function setupAvatarSelector() {
        const avatarOptions = document.querySelectorAll('.avatar-option');
        
        avatarOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected from all
                avatarOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected to clicked
                this.classList.add('selected');
                
                console.log('Avatar color selected:', this.getAttribute('data-color'));
            });
        });
    }

    // Setup form submission
    function setupFormSubmit() {
        const form = document.getElementById('profileForm');
        
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                console.log('Profile form submitted');
                
                // Get form values
                const username = document.getElementById('username').value;
                const email = document.getElementById('email').value;
                const canton = document.getElementById('canton').value;
                const gender = document.querySelector('input[name="gender"]:checked').value;
                const selectedAvatar = document.querySelector('.avatar-option.selected');
                const avatarColor = selectedAvatar ? selectedAvatar.getAttribute('data-color') : null;
                
                // Validate
                if (!username || !email) {
                    alert('Molimo popunite sva obavezna polja!');
                    return;
                }
                
                if (canton === 'izaberi') {
                    alert('Molimo izaberite kanton/općinu!');
                    return;
                }
                
                // Show success message
                alert('Profil je uspješno sačuvan!');
                
                console.log('Profile saved:', {
                    username,
                    email,
                    canton,
                    gender,
                    avatarColor
                });
            });
        }
    }

    // Setup logout button
    function setupLogoutButton() {
        const logoutBtn = document.getElementById('profile-logout-btn');
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                console.log('Logout from profile page');
                
                if (confirm('Da li ste sigurni da želite da se odjavite?')) {
                    // Use FootballPortal logout
                    if (window.FootballPortal && window.FootballPortal.logoutUser) {
                        window.FootballPortal.logoutUser();
                    }
                    
                    alert('Uspješno ste se odjavili.');
                    window.location.hash = '#home';
                }
            });
        }
    }

    // Setup delete account button
    function setupDeleteAccount() {
        const deleteBtn = document.getElementById('deleteAccountBtn');
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                console.log('Delete account clicked');
                
                if (confirm('Da li ste sigurni da želite da obrišete nalog?\nOva akcija se ne može poništiti!')) {
                    if (confirm('POSLJEDNJE UPOZORENJE!\n\nSvi vaši podaci će biti trajno obrisani.\nDa li želite da nastavite?')) {
                        // In real app, this would call API
                        alert('Nalog je obrisan. (Demo mode - nalog nije stvarno obrisan)');
                        
                        // Logout user
                        if (window.FootballPortal && window.FootballPortal.logoutUser) {
                            window.FootballPortal.logoutUser();
                        }
                        
                        window.location.hash = '#home';
                    }
                }
            });
        }
    }

    // Setup copy username link button
    function setupCopyUsernameLink() {
        const copyBtn = document.querySelector('.username-link-btn');
        
        if (copyBtn) {
            copyBtn.addEventListener('click', function() {
                const usernameInput = document.getElementById('username');
                const prefix = document.querySelector('.username-prefix').textContent;
                const fullUrl = prefix + usernameInput.value;
                
                // Copy to clipboard
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(fullUrl).then(() => {
                        // Show feedback
                        const icon = this.querySelector('i');
                        const originalClass = icon.className;
                        
                        icon.className = 'fa fa-check';
                        this.style.color = '#2ecc71';
                        
                        setTimeout(() => {
                            icon.className = originalClass;
                            this.style.color = '';
                        }, 2000);
                        
                        console.log('Username link copied:', fullUrl);
                    }).catch(err => {
                        console.error('Failed to copy:', err);
                        alert('Link: ' + fullUrl);
                    });
                } else {
                    // Fallback for older browsers
                    alert('Link: ' + fullUrl);
                }
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProfilePage);
    } else {
        initProfilePage();
    }

    // Re-initialize on hash change (for SPA)
    window.addEventListener('hashchange', function() {
        if (window.location.hash === '#profile') {
            setTimeout(initProfilePage, 100);
        }
    });

    // Expose reinit function for SPA router
    window.ProfilePage = {
        init: initProfilePage
    };

    console.log('Profile module ready');

})();