let ProfileService = {

  init: function () {
    const token = localStorage.getItem("user_token");
    if (!token) {
      toastr.error("Please login");
      return;
    }

    ProfileService.load();

    $("#saveProfileBtn").off().on("click", function () {
      ProfileService.save();
    });

    $("#profile-logout-btn").off().on("click", function () {
      localStorage.clear();
      window.location.hash = "#home";
      location.reload();
    });
  },

  load: function () {
    RestClient.get("users/self", function (data) {
      $("#userId").val(data.id);
      $("#username").val(data.username);
      $("#email").val(data.email);
    }, function () {
      toastr.error("Failed to load profile");
    });
  },

  save: function () {
    const data = {
      username: $("#username").val(),
      email: $("#email").val()
    };

    RestClient.put("users/self", data,
      function () {
        toastr.success("Profile updated");
      },
      function (err) {
        toastr.error(err.responseText || "Update failed");
      }
    );
  }
};
