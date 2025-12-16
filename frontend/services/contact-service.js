
let ContactService = {

  init: function() {
    
    $(document)
      .off('submit', '#contactForm')
      .on('submit', '#contactForm', function(e) {
        e.preventDefault();

        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const message = $('#message').val().trim();

        if (!name || !email || !message) {
          toastr.error('Please fill in all fields');
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          toastr.error('Please enter a valid email address');
          return;
        }

        const subject = encodeURIComponent('Contact from ' + name);
        const body = encodeURIComponent(
          'Name: ' + name + '\n' +
          'Email: ' + email + '\n\n' +
          'Message:\n' + message
        );

        window.location.href =
          'mailto:info@90minut.ba?subject=' + subject + '&body=' + body;

        toastr.success('Opening your email client...');
        $('#contactForm')[0].reset();
      });
  }
};
