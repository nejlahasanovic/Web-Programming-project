var UserService = {
  init: function () {
    var token = localStorage.getItem("user_token");
    if (token && token !== undefined) {
      window.location.replace("index.html");
      return;
    }

    $("#login-form").validate({
      submitHandler: function (form) {
        var entity = Object.fromEntries(new FormData(form).entries());
        UserService.login(entity);
      },
    });

    if ($("#register-form").length) {
      $("#register-form").validate({
        submitHandler: function (form) {
          var entity = Object.fromEntries(new FormData(form).entries());
          UserService.register(entity);
        },
      }); 
    }
  },

  login: function (entity) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "auth/login",
      type: "POST",
      data: JSON.stringify(entity),
      contentType: "application/json",
      dataType: "json",
      success: function (result) {
        localStorage.setItem("user_token", result.data.token);
        window.location.replace("index.html");
      },
      error: function (XMLHttpRequest) {
        toastr.error(XMLHttpRequest?.responseText ? XMLHttpRequest.responseText : "Error");
      },
    });
  },
  register: function (entity) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "auth/register",
      type: "POST",
      data: JSON.stringify(entity),
      contentType: "application/json",
      dataType: "json",
      success: function () {
        toastr.success("Uspješno registrovani! Sada se prijavite.");
        setTimeout(() => {
          window.location.replace("login.html");
        }, 1500);

      },
      error: function (XMLHttpRequest) {
        toastr.error(XMLHttpRequest?.responseText ? XMLHttpRequest.responseText : "Error");
      },
    });
  },


  logout: function () {
    localStorage.clear();
    window.location.replace("login.html");
  },

};
