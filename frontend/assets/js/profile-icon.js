document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("user_token");

  const loginLink = document.getElementById("loginLink");
  const profileIcon = document.getElementById("profileIconNew");

  if (token) {
    if (loginLink) loginLink.style.display = "none";
    if (profileIcon) profileIcon.style.display = "inline-flex";
  } else {
    if (loginLink) loginLink.style.display = "inline-flex";
    if (profileIcon) profileIcon.style.display = "none";
  }
});

document.addEventListener("click", function (e) {
  if (e.target.id === "profile-logout-btn") {
    localStorage.clear();
    window.location.href = "/90minut/frontend/login.html";
  }
});


