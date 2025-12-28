
// Complete Admin Panel with ALL Functionality
(function() {
    'use strict';

    console.log('=== ADMIN DASHBOARD COMPLETE SCRIPT LOADING ===');

    // ========================================
    // GLOBAL STATE
    // ========================================
    
    let adminTheme = 'dark'; // DEFAULT DARK MODE

    // ========================================
    // HELPER FUNCTIONS
    // ========================================
    
    function isAdminPage() {
        const hash = window.location.hash.substring(1);
        return hash && hash.startsWith('admin-');
    }

    function getCurrentAdminPage() {
        return window.location.hash.substring(1);
    }

    // ========================================
    // SIDEBAR TOGGLE (Mobile)
    // ========================================
    
    function initSidebarToggle() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('adminSidebar');
        
        if (!sidebarToggle || !sidebar) {
            console.log('Sidebar elements not found');
            return;
        }
        
        // Check if already initialized
        if (sidebarToggle.dataset.initialized === 'true') {
            console.log('⏭️ Sidebar toggle already initialized');
            return;
        }
        
        // Toggle sidebar
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            console.log('Sidebar toggled');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 991) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
        
        // Mark as initialized
        sidebarToggle.dataset.initialized = 'true';
        console.log('✓ Sidebar toggle initialized');
    }

    // ========================================
    // THEME TOGGLE (Dark/Light Mode)
    // ========================================
    
    function initThemeToggle() {
        const themeToggle = document.getElementById('adminThemeToggle');
        const body = document.body;
        
        if (!themeToggle) {
            console.log('Theme toggle button not found');
            return;
        }
        
        // Check if already initialized
        if (themeToggle.dataset.initialized === 'true') {
            console.log('⏭️ Theme toggle already initialized');
            return;
        }
        
        console.log('✓ Theme toggle button found');
        
        // Set initial theme to DARK (default)
        body.classList.remove('admin-light-mode');
        adminTheme = 'dark';
        
        // Set initial icon
        updateThemeIcon();
        
        // Add click event
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🌙 Theme toggle clicked!');
            
            body.classList.toggle('admin-light-mode');
            
            if (body.classList.contains('admin-light-mode')) {
                adminTheme = 'light';
                console.log('✓ LIGHT mode enabled');
            } else {
                adminTheme = 'dark';
                console.log('✓ DARK mode enabled');
            }
            
            updateThemeIcon();
        });
        
        // Mark as initialized
        themeToggle.dataset.initialized = 'true';
        console.log('✓ Theme toggle initialized (default: DARK)');
    }

    function updateThemeIcon() {
        const themeToggle = document.getElementById('adminThemeToggle');
        const body = document.body;
        
        if (!themeToggle) return;
        
        if (body.classList.contains('admin-light-mode')) {
            // Light mode active - show MOON icon (to switch to dark)
            themeToggle.innerHTML = '<i class="fa fa-moon-o"></i>';
        } else {
            // Dark mode active - show SUN icon (to switch to light)
            themeToggle.innerHTML = '<i class="fa fa-sun-o"></i>';
        }
    }

    // ========================================
    // ACTIVE MENU HIGHLIGHT
    // ========================================
    
    function updateActiveMenu() {
        const hash = window.location.hash.substring(1) || 'admin-dashboard';
        
        // Remove active from all
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active to current page
        const activeLink = document.querySelector(`.nav-item a[href="#${hash}"]`);
        if (activeLink) {
            activeLink.parentElement.classList.add('active');
        }
      
    }

    // ========================================
    // CHARTS - Chart.js Integration
    // ========================================
    
    function initCharts() {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded - charts will not render');
            return;
        }

        // Dashboard Charts
        initDashboardCharts();
        
        // Analytics Charts (if on analytics page)
        if (getCurrentAdminPage() === 'admin-analytics') {
            initAnalyticsCharts();
        }
    }

    function initDashboardCharts() {
        // Visitor Trends Chart
        const visitorCtx = document.getElementById('visitorChart');
        if (visitorCtx) {
            if (visitorCtx.dataset.chartInitialized === 'true') {
                console.log('⏭️ Visitor chart already initialized');
                return;
            }
            
            new Chart(visitorCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Visitors',
                        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
                        borderColor: '#dd1515',
                        backgroundColor: 'rgba(221, 21, 21, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#dd1515',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#1a1a1a',
                            padding: 12,
                            titleFont: { size: 14, weight: 'bold' },
                            bodyFont: { size: 13 },
                            borderColor: '#dd1515',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value.toLocaleString();
                                },
                                color: '#a0a0a0'
                            },
                            grid: { color: 'rgba(255,255,255,0.1)' }
                        },
                        x: {
                            ticks: { color: '#a0a0a0' },
                            grid: { display: false }
                        }
                    }
                }
            });
            
            visitorCtx.dataset.chartInitialized = 'true';
            console.log('✓ Visitor chart initialized');
        }

        // Top Countries Chart
        const countriesCtx = document.getElementById('countriesChart');
        if (countriesCtx) {
            if (countriesCtx.dataset.chartInitialized === 'true') {
                console.log('⏭️ Countries chart already initialized');
                return;
            }
            
            new Chart(countriesCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Bosnia & Herzegovina', 'Serbia', 'Croatia', 'Montenegro', 'Other'],
                    datasets: [{
                        data: [45, 25, 15, 8, 7],
                        backgroundColor: ['#dd1515', '#3498db', '#2ecc71', '#f39c12', '#95a5a6'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { 
                                padding: 15, 
                                font: { size: 12 }, 
                                usePointStyle: true,
                                color: '#a0a0a0'
                            }
                        },
                        tooltip: {
                            backgroundColor: '#1a1a1a',
                            padding: 12,
                            titleFont: { size: 14, weight: 'bold' },
                            bodyFont: { size: 13 },
                            callbacks: {
                                label: function(context) {
                                    return context.label + ': ' + context.parsed + '%';
                                }
                            }
                        }
                    }
                }
            });
            
            countriesCtx.dataset.chartInitialized = 'true';
            console.log('✓ Countries chart initialized');
        }
    }

    function initAnalyticsCharts() {
        console.log('🎨 Initializing Analytics Charts...');

        // Traffic Overview Chart
        const trafficCtx = document.getElementById('trafficChart');
        if (trafficCtx && !trafficCtx.dataset.chartInitialized) {
            new Chart(trafficCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Visitors',
                        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
                        borderColor: '#dd1515',
                        backgroundColor: 'rgba(221, 21, 21, 0.05)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointBackgroundColor: '#dd1515',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        borderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#1a1a1a',
                            padding: 12,
                            displayColors: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value >= 1000 ? (value/1000) + 'K' : value;
                                },
                                color: '#a0a0a0'
                            },
                            grid: { color: 'rgba(255,255,255,0.05)' }
                        },
                        x: {
                            ticks: { color: '#a0a0a0' },
                            grid: { display: false }
                        }
                    }
                }
            });
            trafficCtx.dataset.chartInitialized = 'true';
            console.log('✓ Traffic chart initialized');
        }

        // Traffic Sources Chart
        const sourcesCtx = document.getElementById('sourcesChart');
        if (sourcesCtx && !sourcesCtx.dataset.chartInitialized) {
            new Chart(sourcesCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Direct', 'Organic Search', 'Social Media', 'Referral'],
                    datasets: [{
                        data: [42.3, 31.5, 16.8, 9.4],
                        backgroundColor: ['#3498db', '#2ecc71', '#f39c12', '#e74c3c'],
                        borderWidth: 0,
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#1a1a1a',
                            padding: 12,
                            callbacks: {
                                label: function(context) {
                                    return context.label + ': ' + context.parsed + '%';
                                }
                            }
                        }
                    }
                }
            });
            sourcesCtx.dataset.chartInitialized = 'true';
            console.log('✓ Sources chart initialized');
        }

        // Sparklines
        initSparklines();
    }

    function initSparklines() {
        const sparklines = [
            { id: 'sparkline1', data: [12, 15, 14, 18, 16, 20, 19], color: '#3498db' },
            { id: 'sparkline2', data: [8, 11, 9, 13, 12, 15, 14], color: '#2ecc71' },
            { id: 'sparkline3', data: [5, 7, 6, 8, 7, 9, 8], color: '#f39c12' },
            { id: 'sparkline4', data: [15, 13, 14, 12, 13, 11, 12], color: '#9b59b6' }
        ];

        sparklines.forEach(spark => {
            const ctx = document.getElementById(spark.id);
            if (ctx && !ctx.dataset.chartInitialized) {
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['', '', '', '', '', '', ''],
                        datasets: [{
                            data: spark.data,
                            borderColor: spark.color,
                            borderWidth: 2,
                            fill: false,
                            tension: 0.4,
                            pointRadius: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false }, tooltip: { enabled: false } },
                        scales: {
                            x: { display: false },
                            y: { display: false }
                        }
                    }
                });
                ctx.dataset.chartInitialized = 'true';
            }
        });

        console.log('✓ Sparklines initialized');
    }

    // ========================================
    // STATISTICS COUNTER ANIMATION
    // ========================================
    
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            if (counter.dataset.animated === 'true') {
                return;
            }
            
            const target = counter.textContent.replace(/,/g, '');
            
            if (!isNaN(target.replace('M', '').replace('K', ''))) {
                let multiplier = 1;
                let suffix = '';
                
                if (target.includes('M')) {
                    multiplier = 1000000;
                    suffix = 'M';
                } else if (target.includes('K')) {
                    multiplier = 1000;
                    suffix = 'K';
                }
                
                const finalValue = parseFloat(target.replace('M', '').replace('K', '')) * multiplier;
                const duration = 2000;
                const steps = 60;
                const stepValue = finalValue / steps;
                let current = 0;
                
                const timer = setInterval(() => {
                    current += stepValue;
                    
                    if (current >= finalValue) {
                        current = finalValue;
                        clearInterval(timer);
                    }
                    
                    let displayValue = current;
                    if (suffix === 'M') {
                        displayValue = (current / 1000000).toFixed(1) + 'M';
                    } else if (suffix === 'K') {
                        displayValue = (current / 1000).toFixed(0) + 'K';
                    } else {
                        displayValue = Math.floor(current).toLocaleString();
                    }
                    
                    counter.textContent = displayValue;
                }, duration / steps);
                
                counter.dataset.animated = 'true';
            }
        });
        
        console.log('✓ Counter animations started');
    }

    // ========================================
    // SETTINGS TAB SWITCHING
    // ========================================
    
    function initSettingsTabs() {
        const tabButtons = document.querySelectorAll('.settings-tab');
        const tabContents = document.querySelectorAll('.settings-content');
        
        if (tabButtons.length === 0) {
            return;
        }

        tabButtons.forEach(button => {
            if (button.dataset.tabInitialized === 'true') {
                return;
            }

            button.addEventListener('click', function() {
                const targetTab = this.dataset.tab;
                
                // Remove active from all
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active to clicked
                this.classList.add('active');
                
                // Show content
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
                
                console.log('✓ Tab switched to:', targetTab);
            });

            button.dataset.tabInitialized = 'true';
        });

        console.log('✓ Settings tabs initialized');
    }

    // ========================================
    // SETTINGS THEME SELECTION
    // ========================================
    
    function initThemeSelection() {
        const themeOptions = document.querySelectorAll('.theme-option');
        
        themeOptions.forEach(option => {
            if (option.dataset.themeInitialized === 'true') {
                return;
            }

            option.addEventListener('click', function() {
                themeOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                console.log('✓ Theme selected');
            });

            option.dataset.themeInitialized = 'true';
        });

        if (themeOptions.length > 0) {
            console.log('✓ Theme selection initialized');
        }
    }

    // ========================================
    // SETTINGS COLOR SELECTION
    // ========================================
    
    function initColorSelection() {
        const colorOptions = document.querySelectorAll('.color-option');
        
        colorOptions.forEach(option => {
            if (option.dataset.colorInitialized === 'true') {
                return;
            }

            option.addEventListener('click', function() {
                colorOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                console.log('✓ Color selected');
            });

            option.dataset.colorInitialized = 'true';
        });

        if (colorOptions.length > 0) {
            console.log('✓ Color selection initialized');
        }
    }

    // ========================================
    // SAVE BUTTONS
    // ========================================
    
    function initSaveButtons() {
        const saveButtons = document.querySelectorAll('.btn-save');
        
        saveButtons.forEach(button => {
            if (button.dataset.saveInitialized === 'true') {
                return;
            }

            button.addEventListener('click', function(e) {
                e.preventDefault();
                alert('✓ Settings saved successfully!\n\n(Backend integration needed)');
                console.log('Save button clicked');
            });

            button.dataset.saveInitialized = 'true';
        });

        if (saveButtons.length > 0) {
            console.log('✓ Save buttons initialized');
        }
    }

    // ========================================
    // DUMMY DATA (for future backend integration)
    // ========================================
    
    window.adminDummyData = {
        articles: [
            { id: 1, title: "Messi's Hat-trick Leads Argentina to Victory", views: 45231, date: '2 hours ago' },
            { id: 2, title: "Champions League Draw Results", views: 32145, date: '5 hours ago' },
            { id: 3, title: "Transfer News: Mbappé to Real Madrid?", views: 28943, date: '1 day ago' },
            { id: 4, title: "Premier League Top Scorers 2024/25", views: 21567, date: '1 day ago' }
        ],
        
        users: [
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active' },
            { id: 3, name: 'Spam User', email: 'spam@test.com', role: 'user', status: 'banned' }
        ],
        
        matches: [
            { id: 1, home: 'Real Madrid', away: 'Barcelona', date: '2025-10-25', league: 'La Liga' },
            { id: 2, home: 'Liverpool', away: 'Man United', date: '2025-10-26', league: 'Premier League' },
            { id: 3, home: 'Bayern', away: 'Dortmund', date: '2025-10-27', league: 'Bundesliga' }
        ],
        
        leagues: [
            { id: 1, name: 'Premier League', country: 'England', teams: 20 },
            { id: 2, name: 'La Liga', country: 'Spain', teams: 20 },
            { id: 3, name: 'Serie A', country: 'Italy', teams: 20 },
            { id: 4, name: 'Bundesliga', country: 'Germany', teams: 18 },
            { id: 5, name: 'Ligue 1', country: 'France', teams: 18 }
        ],
        
        analytics: {
            totalVisitors: 2400000,
            todayVisitors: 45231,
            activeUsers: 8456,
            pageViews: 12500000,
            bounceRate: 42.5,
            avgSessionTime: '3m 25s'
        }
    };

    // ========================================
    // GLOBAL FUNCTIONS (for onclick attributes)
    // ========================================
    
    window.exitAdminPanel = function() {
        if (confirm('Are you sure you want to exit Admin Panel?')) {
            window.location.hash = '#home';
            console.log('Exited admin panel');
        }
    };

    window.adminLogout = function() {
        if (confirm('Are you sure you want to logout?')) {
            if (window.FootballPortal && window.FootballPortal.logoutUser) {
                window.FootballPortal.logoutUser();
            }
            window.location.hash = '#home';
            console.log('Admin logged out');
        }
    };

    // ========================================
    // MAIN INITIALIZATION
    // ========================================
    
    function init() {
        console.log('🔧 Attempting to initialize admin dashboard...');
        
        // Check if admin elements exist
        const adminSidebar = document.getElementById('adminSidebar');
        if (!adminSidebar) {
            console.log('⏭️ Admin elements not found - skipping init');
            return;
        }
        
        console.log('✓ Admin page detected - initializing...');
        
        // Initialize all components
        initSidebarToggle();
        initThemeToggle();
        updateActiveMenu();
        
        // Initialize charts if Chart.js is loaded
        if (typeof Chart !== 'undefined') {
            setTimeout(initCharts, 300);
        }
        
        // Animate counters
        setTimeout(animateCounters, 500);
        
        // Initialize settings tabs and features (if on settings page)
        if (getCurrentAdminPage() === 'admin-settings') {
            setTimeout(() => {
                initSettingsTabs();
                initThemeSelection();
                initColorSelection();
                initSaveButtons();
            }, 100);
        }
        
        console.log('✅ Admin dashboard fully initialized');
    }

    // ========================================
    // EVENT LISTENERS & AUTO-INIT
    // ========================================
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (isAdminPage()) {
                setTimeout(init, 100);
            }
        });
    } else {
        if (isAdminPage()) {
            setTimeout(init, 100);
        }
    }

    // Re-initialize when navigating to admin pages (SPA support)
    window.addEventListener('hashchange', function() {
        if (isAdminPage()) {
            console.log('📍 Hash changed to admin page');
            setTimeout(init, 300);
        }
    });

    // Expose init function globally for manual triggering
    window.initAdminDashboard = init;

    console.log('=== ADMIN COMPLETE SCRIPT LOADED ===');

})();