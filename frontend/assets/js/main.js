"use strict";

(function ($) {

    const LOGO_DARK = "./assets/img/logo-dark.png";
    const LOGO_LIGHT = "./assets/img/logo-light.png";

    function updateLogo() {
        const newLogo = $("body").hasClass("light-mode") ? LOGO_LIGHT : LOGO_DARK;
        $(".logo-new img, .logo img").attr("src", newLogo);
    }

    function updateThemeIcon() {
        $("#themeToggle").html(
            $("body").hasClass("light-mode")
                ? '<i class="fa fa-moon-o"></i>'
                : '<i class="fa fa-lightbulb-o"></i>'
        );
    }

    const saved = localStorage.getItem("theme");
    if (saved === "light") $("body").addClass("light-mode");

    updateLogo();
    updateThemeIcon();

    $("#themeToggle").on("click", function () {
        $("body").toggleClass("light-mode");
        localStorage.setItem("theme", $("body").hasClass("light-mode") ? "light" : "dark");
        updateLogo();
        updateThemeIcon();
    });

    function sticky() {
        $("#mainHeader").toggleClass("scrolled", $(window).scrollTop() > 50);
    }
    $(window).on("scroll", sticky);
    sticky();

})(jQuery);
