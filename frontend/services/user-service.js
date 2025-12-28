var UserService = {
  init: function () {
    var token = localStorage.getItem("user_token");
    if (token && token !== undefined) {
      window.location.replace("index.html");
      return;
    }

    $("#login-form").validate({
      rules: {
        email: {
          required: true,
          email: true
        },
        password: {
          required: true,
          minlength: 8
        }
      },
      messages: {
        email: {
          required: "Please enter your email address",
          email: "Please enter a valid email address"
        },
        password: {
          required: "Please enter your password",
          minlength: "Password must be at least 6 characters"
        }
      },
      submitHandler: function (form) {
        var entity = Object.fromEntries(new FormData(form).entries());
        UserService.login(entity);
      },
    });

    if ($("#register-form").length) {
      $("#register-form").validate({
        rules: {
          username: {
            required: true,
            minlength: 7,
            maxlength: 50
          },
          email: {
            required: true,
            email: true
          },
          password: {
            required: true,
            minlength: 8,
            maxlength: 20
          },
          confirm_password: {
            required: true,
            equalTo: "#password"
          }
        },
        messages: {
          username: {
            required: "Please enter your username",
            minlength: "Username must be at least 7 characters",
            maxlength: "Username cannot exceed 50 characters"
          },
          email: {
            required: "Please enter your email address",
            email: "Please enter a valid email address"
          },
          password: {
            required: "Please enter a password",
            minlength: "Password must be at least 6 characters",
            maxlength: "Password cannot exceed 20 characters"
          },
          confirm_password: {
            required: "Please confirm your password",
            equalTo: "Passwords do not match"
          }
        },
        submitHandler: function (form) {
          var entity = Object.fromEntries(new FormData(form).entries());
          UserService.register(entity);
        },
      }); 
    }
  },

  login: function (entity) {
    $.blockUI({ message: '<h3>Logging in...</h3>' });

    $.ajax({
      url: Constants.PROJECT_BASE_URL + "auth/login",
      type: "POST",
      data: JSON.stringify(entity),
      contentType: "application/json",
      dataType: "json",
      success: function (result) {
        $.unblockUI();
        localStorage.setItem("user_token", result.data.token);
        window.location.replace("index.html");
      },
      error: function (XMLHttpRequest) {
        $.unblockUI();
        toastr.error(XMLHttpRequest?.responseText ? XMLHttpRequest.responseText : "Error");
      },
    });
  },

  register: function (entity) {
    $.blockUI({ message: '<h3>Creating account...</h3>' });

    $.ajax({
      url: Constants.PROJECT_BASE_URL + "auth/register",
      type: "POST",
      data: JSON.stringify(entity),
      contentType: "application/json",
      dataType: "json",
      success: function () {
        $.unblockUI();
        toastr.success("Uspješno registrovani! Sada se prijavite.");
        setTimeout(() => {
          window.location.replace("login.html");
        }, 1500);

      },
      error: function (XMLHttpRequest) {
        $.unblockUI();
        toastr.error(XMLHttpRequest?.responseText ? XMLHttpRequest.responseText : "Error");
      },
    });
  },


  logout: function () {
    localStorage.clear();
    window.location.replace("login.html");
  },

};