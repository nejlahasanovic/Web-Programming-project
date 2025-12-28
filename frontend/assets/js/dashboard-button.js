document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("user_token");

  const adminBtn = document.getElementById("adminDashboardBtn");

  if (adminBtn) adminBtn.style.display = "none";

  if (!token) return;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const user = payload.user;

    if (user && user.role === "admin") {
      if (adminBtn) adminBtn.style.display = "inline-flex";
    }
  } catch (e) {
    console.log("Token nije validan");
  }
  
});

document.addEventListener("click", function (e) {
  if (e.target.closest("#admin-dashboard")) {
    window.location.hash = "#admin-dashboard";
  }
});
document.addEventListener("click", function (e) {
  if (e.target.closest("fa fa-sign-out")) {
    localStorage.clear();                
    window.location.href = "/90minut/frontend/index.html";  
  }
});

