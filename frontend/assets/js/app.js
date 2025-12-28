(function () {
    'use strict';

    const config = {
        defaultPage: "home",
        viewsPath: "./views/",
        container: "#app-content"
    };

    const routes = {
        home: "home.html",
        article: "article-detail.html",
        club: "club.html",
        schedule: "schedule.html",
        results: "result.html",
        players: "latest_news.html",
        blog: "blog.html",
        contact: "contact.html",
        profile: "profile.html",

        "admin-dashboard": "admin-dashboard.html",
        "admin-articles": "admin-articles.html",
        "admin-users": "admin-users.html",
        "admin-analytics": "admin-analytics.html",
        "admin-marketing": "admin-marketing.html",
        "admin-matches": "admin-matches.html",
        "admin-leagues": "admin-leagues.html",
        "admin-settings": "admin-settings.html"
    };

    function getPageFromHash() {
        if (!window.location.hash) return config.defaultPage;
        const hash = window.location.hash.substring(1);
        return hash.split("?")[0] || config.defaultPage;
    }

    function extractBody(html) {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.innerHTML;
    }

    function showLoader() {
        const container = document.querySelector(config.container);
        if (!container) return;
        container.innerHTML = `
            <div class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
                <div class="spinner-border text-danger" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        `;
    }

    function showError(message) {
        const container = document.querySelector(config.container);
        if (!container) return;
        container.innerHTML = `
            <div class="container py-5">
                <div class="alert alert-danger text-center">
                    ${message}
                </div>
            </div>
        `;
    }

    function setupNavigation() {
        document.addEventListener("click", function (e) {
            const link = e.target.closest("a[data-page]");
            if (!link) return;

            e.preventDefault();
            const page = link.dataset.page;
            if (!page) return;

            const targetHash = "#" + page;

            if (window.location.hash === targetHash) {
                loadPage(page);
            } else {
                window.location.hash = targetHash;
            }
        });
    }

    function updateActiveNav(page) {
        document.querySelectorAll(".main-menu-new li").forEach(li => {
            li.classList.remove("active");
        });

        const link = document.querySelector(`.main-menu-new a[data-page="${page}"]`);
        if (link && link.parentElement) {
            link.parentElement.classList.add("active");
        }
    }

    function checkAdminLayout() {
        const isAdmin = window.location.hash.includes("admin-");
        const header = document.getElementById("mainHeader");
        const footer = document.querySelector("footer");

        if (header) header.style.display = isAdmin ? "none" : "block";
        if (footer) footer.style.display = isAdmin ? "none" : "block";

        if (isAdmin) {
            document.body.classList.add("admin-active");
        } else {
            document.body.classList.remove("admin-active");
        }
    }

    function reinitializePlugins() {
        
        $(".set-bg").each(function () {
            $(this).css("background-image", "url(" + $(this).data("setbg") + ")");
        });

        $(".search-switch").off("click").on("click", () => {
            $(".search-model").fadeIn(400);
        });

        $(".search-close-switch").off("click").on("click", () => {
            $(".search-model").fadeOut(400);
        });

        $(".canvas-open, .canvas-open-new").off("click").on("click", function () {
            $(".offcanvas-menu-wrapper").addClass("show-offcanvas-menu-wrapper show-offcanvas-menu");
            $(".offcanvas-menu-overlay").addClass("active");
        });

        $(".canvas-close, .offcanvas-menu-overlay").off("click").on("click", function () {
            $(".offcanvas-menu-wrapper").removeClass("show-offcanvas-menu-wrapper show-offcanvas-menu");
            $(".offcanvas-menu-overlay").removeClass("active");
        });

        if ($(".mobile-menu").length && typeof $.fn.slicknav !== "undefined") {
            if ($(".slicknav_menu").length) {
                $(".slicknav_menu").remove();
            }

            $(".mobile-menu").slicknav({
                prependTo: "#mobile-menu-wrap",
                allowParentLinks: true,
                closedSymbol: '<i class="fa fa-angle-right"></i>',
                openedSymbol: '<i class="fa fa-angle-down"></i>'
            });
        }

        if ($(".news-slider").length && typeof $.fn.owlCarousel !== "undefined") {
            $(".news-slider").owlCarousel({
                loop: true,
                items: 1,
                autoplay: true,
                nav: false,
                dots: true,
                animateOut: 'fadeOut',
                animateIn: 'fadeIn',
                smartSpeed: 1200
            });
        }

        if ($(".video-slider").length && typeof $.fn.owlCarousel !== "undefined") {
            $(".video-slider").owlCarousel({
                loop: true,
                items: 4,
                margin: 20,
                autoplay: false,
                nav: true,
                dots: false,
                navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
                responsive: {
                    0: { items: 1 },
                    576: { items: 2 },
                    992: { items: 3 },
                    1200: { items: 4 }
                }
            });
        }

        if (typeof $.fn.magnificPopup !== "undefined") {
            $(".video-popup").magnificPopup({
                type: "iframe"
            });
        }
    }

    function loadPage(page) {
        const file = routes[page];

        if (!file) {
            console.warn("Unknown route:", page);
            showError(`Unknown page: ${page}`);
            return;
        }

        showLoader();

        fetch(config.viewsPath + file)
            .then(res => {
                if (!res.ok) throw new Error("HTTP " + res.status);
                return res.text();
            })
            .then(html => {
                const container = document.querySelector(config.container);
                if (!container) return;

                container.innerHTML = extractBody(html);

                updateActiveNav(page);
                checkAdminLayout();
                reinitializePlugins();

               
                if (page.startsWith("admin-") && typeof window.initAdminDashboard === "function") {
                    setTimeout(() => window.initAdminDashboard(), 50);
                }

                if (page === "admin-articles" && typeof ArticleService !== "undefined") {
                    setTimeout(() => ArticleService.init(), 100);
                }

                if (page === "admin-users" && typeof UserManagementService !== "undefined") {
                    setTimeout(() => UserManagementService.init(), 100);
                }

                if (page === "home" && typeof HomeService !== "undefined") {
                    setTimeout(() => HomeService.init(), 100);
                }

                if (page === "blog" && typeof NewsService !== "undefined") {
                    setTimeout(() => NewsService.init(), 100);
                }

                if (page === "players" && typeof LatestNewsService !== "undefined") {
                    setTimeout(() => LatestNewsService.init(), 100);
                }

                if (page.startsWith("article") && typeof ArticleDetailService !== "undefined") {
                    const params = new URLSearchParams(window.location.hash.split("?")[1]);
                    const articleId = params.get("id");
                    if (articleId) {
                        setTimeout(() => ArticleDetailService.init(articleId), 100);
                    } else {
                        console.error("Article ID not found in URL!");
                    }
                }

                if (page === "contact" && typeof ContactService !== "undefined") {
                    setTimeout(() => ContactService.init(), 100);
                }

                if (page === "profile" && typeof ProfileService !== "undefined") {
                    setTimeout(() => ProfileService.init(), 100);
                }
            })
            .catch(err => {
                console.error("Error loading page:", err);
                showError(`Cannot load page: ${page}`);
            });
    }

    document.addEventListener("DOMContentLoaded", () => {
        console.log("90 Minut SPA Initialized");

        setupNavigation();

        const initialPage = getPageFromHash();

        if (!window.location.hash) {
            window.location.hash = "#" + initialPage;
        } else {
            loadPage(initialPage);
        }

        checkAdminLayout();
    });

    window.addEventListener("hashchange", () => {
        const page = getPageFromHash();
        loadPage(page);
    });

})();