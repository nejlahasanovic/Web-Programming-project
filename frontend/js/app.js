
(function() {
    'use strict';

    // Configuration
    const config = {
        defaultPage: 'home',
        viewsPath: '/90minut/frontend/views/',
        contentContainer: '#app-content'
    };

    // Page mapping - connects routes to view files
    const routes = {
    'home': 'home.html',
    'club': 'club.html',
    'schedule': 'schedule.html',
    'results': 'result.html',
    'players': 'latest_news.html',  // Privremeno koristi club.html dok ne napravimo players
    'blog': 'blog.html',
    'contact': 'contact.html',
    'profile': 'profile.html',
    'admin-dashboard': 'admin-dashboard.html', 
    'admin-articles': 'admin-articles.html',
    'admin-users': 'admin-users.html',
    'admin-analytics': 'admin-analytics.html',
    'admin-marketing': 'admin-marketing.html',
    'admin-matches': 'admin-matches.html',
    'admin-leagues': 'admin-leagues.html',
    'admin-settings': 'admin-settings.html'
};

    // Initialize the app
    function init() {
        console.log('Football Portal SPA Initialized');
        
        // Set up navigation click handlers
        setupNavigation();
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', handlePopState);
        
        // Load initial page
        const initialPage = getPageFromURL() || config.defaultPage;
        loadPage(initialPage, false);
    }

    // Setup navigation link handlers
    function setupNavigation() {
        document.querySelectorAll('a[data-page]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = this.getAttribute('data-page');
                loadPage(page, true);
                
                // Update active nav item
                updateActiveNav(this);
            });
        });
    }

    // Update active navigation item
    function updateActiveNav(activeLink) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        // Add active class to clicked nav item
        activeLink.classList.add('active');
    }

    // Load page content
    function loadPage(page, pushState = true) {
        const viewFile = routes[page];
        
        if (!viewFile) {
            console.error(`Page "${page}" not found in routes`);
            loadPage(config.defaultPage, false);
            return;
        }

        console.log(`Loading page: ${page}`);
        
        // Show loading spinner
        showLoading();
        

        // Fetch the view content
        fetch(config.viewsPath + viewFile)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                // Extract only the body content from the loaded HTML
                const bodyContent = extractBodyContent(html);
                
                // Insert content into container
                document.querySelector(config.contentContainer).innerHTML = bodyContent;
                
                // Update URL without page reload
                if (pushState) {
                    const newURL = `#${page}`;
                    window.history.pushState({ page: page }, '', newURL);
                }
                
                // Re-initialize any scripts/plugins that need to run on new content
                reinitializePlugins();
                
                console.log(`Page "${page}" loaded successfully`);
            })
            .catch(error => {
                console.error('Error loading page:', error);
                showError(page);
            });
            updateActiveNav(page);
    }

    // Extract body content from HTML string
    function extractBodyContent(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const body = doc.querySelector('body');
        return body ? body.innerHTML : html;
    }

    // Show loading spinner
    function showLoading() {
        document.querySelector(config.contentContainer).innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-danger" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <p class="mt-3">Loading content...</p>
            </div>
        `;
    }

    // Show error message
    function showError(page) {
        document.querySelector(config.contentContainer).innerHTML = `
            <div class="container py-5">
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">Error Loading Page</h4>
                    <p>Unable to load the "${page}" page. Please try again.</p>
                    <hr>
                    <p class="mb-0">
                        <a href="#home" class="btn btn-danger" data-page="home">Return to Home</a>
                    </p>
                </div>
            </div>
        `;
        // Re-setup navigation for the error page button
        setupNavigation();
    }

    // Get page from URL hash
    function getPageFromURL() {
        const hash = window.location.hash.substring(1); // Remove the '#'
        return hash || null;
    }

    // Handle browser back/forward buttons
    function handlePopState(event) {
        const page = event.state ? event.state.page : getPageFromURL() || config.defaultPage;
        loadPage(page, false);
    }

   function reinitializePlugins() {
    // Re-initialize background images (data-setbg)
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    // Re-initialize Canvas Menu (Hamburger)
    $(".canvas-open").off('click').on('click', function () {
        $(".offcanvas-menu-wrapper").addClass("show-offcanvas-menu-wrapper");
        $(".offcanvas-menu-overlay").addClass("active");
    });

    $(".canvas-close, .offcanvas-menu-overlay").off('click').on('click', function () {
        $(".offcanvas-menu-wrapper").removeClass("show-offcanvas-menu-wrapper");
        $(".offcanvas-menu-overlay").removeClass("active");
    });

    // Re-initialize Search Model
    $('.search-switch').off('click').on('click', function () {
        $('.search-model').fadeIn(400);
    });

    $('.search-close-switch').off('click').on('click', function () {
        $('.search-model').fadeOut(400, function () {
            $('#search-input').val('');
        });
    });

    // Re-initialize Mobile Menu (SlickNav)
    if (typeof $.fn.slicknav !== 'undefined') {
        // Remove existing slicknav if present
        $('.mobile-menu').slicknav('destroy');
        
        // Reinitialize
        $(".mobile-menu").slicknav({
            prependTo: '#mobile-menu-wrap',
            allowParentLinks: true
        });
    }
        
    // Re-initialize Owl Carousel if present
    if (typeof $.fn.owlCarousel !== 'undefined') {
        // News Slider
        $(".news-slider").owlCarousel({
            loop: true,
            nav: true,
            items: 1,
            dots: false,
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
            smartSpeed: 1200,
            autoHeight: false,
            autoplay: true,
            mouseDrag: false
        });

        // Video Slider
        $(".video-slider").owlCarousel({
            items: 4,
            dots: false,
            autoplay: false,
            margin: 0,
            loop: true,
            smartSpeed: 1200,
            nav: true,
            navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
            responsive: {
                0: { items: 1 },
                480: { items: 2 },
                768: { items: 3 },
                992: { items: 4 }
            }
        });

    }

    // Re-initialize Magnific Popup if present
    if (typeof $.fn.magnificPopup !== 'undefined') {
        $('.video-popup').magnificPopup({
            type: 'iframe'
        });
    }

    // Re-attach any navigation handlers in the newly loaded content
    setupNavigation();

    // Re-initialize admin dashboard if needed
    const hash = window.location.hash.substring(1);
    if (hash && hash.startsWith('admin-')) {
        console.log('📢 Admin page loaded - triggering re-init');
        setTimeout(function() {
            if (typeof window.initAdminDashboard === 'function') {
                window.initAdminDashboard();
            }
        }, 400);
    }
}

    // Start the application when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Update active navigation state
function updateActiveNav(activePage) {
    // Remove active class from all nav links
    document.querySelectorAll('.main-menu li').forEach(li => {
        li.classList.remove('active');
    });
    
    // Add active class to current page link
    const activeLink = document.querySelector(`.main-menu a[href="#${activePage}"]`);
    if (activeLink) {
        activeLink.parentElement.classList.add('active');
    }
}

// ========================================
    // ADMIN CHECK - Hide navbar on admin pages
    // ========================================
    function checkAdminPage() {
        const hash = window.location.hash.substring(1);
        const mainHeader = document.querySelector('.header-section-new');
        
        if (hash && hash.startsWith('admin-')) {
            // Hide main site navbar
            if (mainHeader) {
                mainHeader.style.display = 'none';
            }
            console.log('Admin page detected - navbar hidden');
        } else {
            // Show main site navbar
            if (mainHeader) {
                mainHeader.style.display = 'block';
            }
        }
    }
    
    // Call on hash change
    window.addEventListener('hashchange', checkAdminPage);
    
    // Call on load
    checkAdminPage();

    // ========================================
// ADMIN CHECK - Hide navbar and footer on admin pages
// ========================================
function checkAdminPage() {
    const hash = window.location.hash.substring(1);
    const mainHeader = document.querySelector('.header-section-new');
    const footer = document.querySelector('.footer-section');
    
    if (hash && hash.startsWith('admin-')) {
        // Hide main site navbar and footer
        if (mainHeader) {
            mainHeader.style.display = 'none';
        }
        if (footer) {
            footer.style.display = 'none';
        }
        
        // Add admin class to body
        document.body.classList.add('admin-active');
        
        console.log('Admin page detected - navbar and footer hidden');
    } else {
        // Show main site navbar and footer
        if (mainHeader) {
            mainHeader.style.display = 'block';
        }
        if (footer) {
            footer.style.display = 'block';
        }
        
        // Remove admin class from body
        document.body.classList.remove('admin-active');
    }
}

// Call on hash change
window.addEventListener('hashchange', checkAdminPage);

// Call on load
checkAdminPage();
})();