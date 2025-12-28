let ProfileService = {

  init: function () {
    const token = localStorage.getItem("user_token");
    if (!token) {
      toastr.error("Please login");
      return;
    }

    ProfileService.load();

    $("#profile-form").validate({
      rules: {
        username: {
          required: true,
          minlength: 3,
          maxlength: 50
        },
        email: {
          required: true,
          email: true
        }
      },
      messages: {
        username: {
          required: "Please enter your username",
          minlength: "Username must be at least 3 characters",
          maxlength: "Username cannot exceed 50 characters"
        },
        email: {
          required: "Please enter your email address",
          email: "Please enter a valid email address"
        }
      }
    });

    $("#saveProfileBtn").off().on("click", function () {
      if ($("#profile-form").valid()) {
        ProfileService.save();
      }
    });

    $("#profile-logout-btn").off().on("click", function () {
      localStorage.clear();
      window.location.hash = "#home";
      location.reload();
    });
  },

  load: function () {
    $.blockUI({ message: '<h3>Loading profile...</h3>' });

    RestClient.get("users/self", 
      function (data) {
        $("#userId").val(data.id);
        $("#username").val(data.username);
        $("#email").val(data.email);
        $.unblockUI();
      }, 
      function () {
        $.unblockUI();
        toastr.error("Failed to load profile");
      }
    );
  },

  save: function () {
    const data = {
      username: $("#username").val(),
      email: $("#email").val()
    };

    $.blockUI({ message: '<h3>Updating profile...</h3>' });

    RestClient.put("users/self", data,
      function () {
        $.unblockUI();
        toastr.success("Profile updated successfully!");
      },
      function (err) {
        $.unblockUI();
        toastr.error(err.responseText || "Update failed");
      }
    );
  }
};