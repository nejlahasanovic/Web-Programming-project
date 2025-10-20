/*  ---------------------------------------------------
    Template Name: Specer
    Description: Specer Sport HTML Template
    Author: Colorlib
    Author URI: http://colorlib.com
    Version: 1.0
    Created: Colorlib
---------------------------------------------------------  */

'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");
    });

    /*------------------
        Background Set
    --------------------*/
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    /*------------------
        OLD Mobile Menu (Backup)
    --------------------*/
    $(".canvas-open").on('click', function () {
        $(".offcanvas-menu-wrapper").addClass("show-offcanvas-menu-wrapper");
        $(".offcanvas-menu-overlay").addClass("active");
    });

    $(".canvas-close, .offcanvas-menu-overlay").on('click', function () {
        $(".offcanvas-menu-wrapper").removeClass("show-offcanvas-menu-wrapper");
        $(".offcanvas-menu-overlay").removeClass("active");
    });

    /*------------------
        Search Model
    --------------------*/
    $('.search-switch').on('click', function () {
        $('.search-model').fadeIn(400);
    });

    $('.search-close-switch').on('click', function () {
        $('.search-model').fadeOut(400, function () {
            $('#search-input').val('');
        });
    });

    /*------------------
		Navigation
	--------------------*/
    
    $(".mobile-menu").slicknav({
        prependTo: '#mobile-menu-wrap',
        allowParentLinks: true
    });

    /*------------------
        News Slider
    --------------------*/
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

    /*------------------------
		Video Slider
    ----------------------- */
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
            0: {
                items: 1,
            },
            480: {
                items: 2,
            },
            768: {
                items: 3,
            },
            992: {
                items: 4,
            },
        }
    });

    /*------------------
        Magnific Popup
    --------------------*/
    $('.video-popup').magnificPopup({
        type: 'iframe'
    });

    // ========================================
    // THEME TOGGLE WITH LOGO SWAP
    // ========================================

    // Logo paths
    const LOGO_DARK = '/90minut/frontend/assets/img/logo-dark.png';   // BIJELI logo za dark mode
    const LOGO_LIGHT = '/90minut/frontend/assets/img/logo-light.png'; // CRNI logo za light mode

    // ===== CHECK SAVED THEME =====
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // ===== APPLY THEME ON PAGE LOAD =====
    if (currentTheme === 'light') {
        $('body').addClass('light-mode');
        updateLogo();
        updateThemeIcon();
    }

    // ===== THEME TOGGLE BUTTON =====
    $('#themeToggle').on('click', function() {
        console.log('Theme toggle clicked');
        
        $('body').toggleClass('light-mode');
        
        // Save preference
        if ($('body').hasClass('light-mode')) {
            localStorage.setItem('theme', 'light');
            console.log('Switched to LIGHT mode');
        } else {
            localStorage.setItem('theme', 'dark');
            console.log('Switched to DARK mode');
        }
        
        updateLogo();
        updateThemeIcon();
    });

    // ===== UPDATE LOGO BASED ON THEME =====
    function updateLogo() {
        const isLightMode = $('body').hasClass('light-mode');
        const newLogo = isLightMode ? LOGO_LIGHT : LOGO_DARK;
        
        // Update all logo images on the page
        $('.logo img, .logo-new img, .fs-logo .logo img').attr('src', newLogo);
        
        console.log('Logo updated to:', newLogo);
    }

    // ===== UPDATE THEME ICON =====
    function updateThemeIcon() {
        const themeToggle = $('#themeToggle');
        
        if ($('body').hasClass('light-mode')) {
            // Light mode je AKTIVAN - prikaži MJESEC (za switch na dark)
            themeToggle.html('<i class="fa fa-moon-o"></i>');
            themeToggle.attr('title', 'Tamna tema');
        } else {
            // Dark mode je AKTIVAN - prikaži SIJALICU (za switch na light)
            themeToggle.html('<i class="fa fa-lightbulb-o"></i>');
            themeToggle.attr('title', 'Svijetla tema');
        }
    }

    // ===== STICKY NAVBAR =====
    function stickyNavbar() {
        const header = $('#mainHeader');
        const scrollTop = $(window).scrollTop();

        if (scrollTop > 50) {
            header.addClass('scrolled');
        } else {
            header.removeClass('scrolled');
        }
    }

    // Run on scroll
    $(window).on('scroll', stickyNavbar);
    
    // Run on load
    stickyNavbar();

    // ========================================
    // MOBILE MENU TOGGLE - NEW (FIXED)
    // ========================================
    
    $('.canvas-open-new').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const wrapper = $('.offcanvas-menu-wrapper');
        const overlay = $('.offcanvas-menu-overlay');
        
        // Toggle - ako je otvoren zatvori, ako je zatvoren otvori
        if (wrapper.hasClass('show-offcanvas-menu-wrapper')) {
            // ZATVORI
            wrapper.removeClass('show-offcanvas-menu-wrapper');
            overlay.removeClass('active');
            console.log('Mobile menu CLOSED');
        } else {
            // OTVORI
            wrapper.addClass('show-offcanvas-menu-wrapper');
            overlay.addClass('active');
            console.log('Mobile menu OPENED');
        }
    });

    // Zatvori kad klikneš X dugme ili overlay
    $('.canvas-close, .offcanvas-menu-overlay').on('click', function(e) {
        e.preventDefault();
        $('.offcanvas-menu-wrapper').removeClass('show-offcanvas-menu-wrapper');
        $('.offcanvas-menu-overlay').removeClass('active');
        console.log('Mobile menu closed via X or overlay');
    });

  // ===== ACTIVE MENU =====
$('.main-menu-new a').click(function() {
    $('.main-menu-new li').removeClass('active');
    $(this).parent().addClass('active');
});

// Update logo on hash change
$(window).on('hashchange', function() {
    updateLogo();
});

// ========================================
    // ADMIN DASHBOARD INTEGRATION
    // ========================================
    
    // Re-initialize admin scripts when admin page loads
    $(window).on('hashchange', function() {
        const hash = window.location.hash.substring(1);
        
        if (hash && hash.startsWith('admin-')) {
            console.log('Admin page loaded - initializing admin scripts');
            
            // Wait for content to load, then init admin
            setTimeout(function() {
                if (typeof window.initAdminDashboard === 'function') {
                    window.initAdminDashboard();
                }
            }, 300);
        }
    });



})(jQuery);