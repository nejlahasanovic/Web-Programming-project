let ContactService = {

  init: function() {
    
    $("#contactForm").validate({
      rules: {
        name: {
          required: true,
          minlength: 3,
          maxlength: 100
        },
        email: {
          required: true,
          email: true
        },
        message: {
          required: true,
          minlength: 10,
          maxlength: 1000
        }
      },
      messages: {
        name: {
          required: "Please enter your name",
          minlength: "Name must be at least 3 characters",
          maxlength: "Name cannot exceed 100 characters"
        },
        email: {
          required: "Please enter your email address",
          email: "Please enter a valid email address"
        },
        message: {
          required: "Please enter your message",
          minlength: "Message must be at least 10 characters",
          maxlength: "Message cannot exceed 1000 characters"
        }
      },
      submitHandler: function(form) {
        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const message = $('#message').val().trim();

        $.blockUI({ message: '<h3>Preparing email...</h3>' });

        const subject = encodeURIComponent('Contact from ' + name);
        const body = encodeURIComponent(
          'Name: ' + name + '\n' +
          'Email: ' + email + '\n\n' +
          'Message:\n' + message
        );

        setTimeout(function() {
          $.unblockUI();
          
          window.location.href =
            'mailto:info@90minut.ba?subject=' + subject + '&body=' + body;

          toastr.success('Opening your email client...');
          $('#contactForm')[0].reset();
        }, 500);
      }
    });
  }
};