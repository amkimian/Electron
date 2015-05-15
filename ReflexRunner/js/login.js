
$(function() {
  $.ajaxSetup({
  xhrFields: {
    withCredentials: true
  }
});

    $('#loginLink').click(function() {
           $('#loginForm').modal('show');
    });

    $('#doLogin').click(function() {

      require('./rapture');


        var site = $('#login-url').val();
        var userName = $('#login-name').val();
        var pass = $('#login-pass').val();

        $.rapture.login(site, userName, pass, function(status) {
            alert('hello');
        });

/*
        var endPoint = site + "/login/login";
        var md5pass = MD5(pass);
        var vals = {};

        vals['user'] = userName;
        vals['password'] = md5pass;
        vals['redirect'] = "repl.html";

        $.ajax({
            url : endPoint,
            dataType : 'json',
            type : 'GET',
            data : vals,

            success : function(data, status, xhr) {
                alert(document.cookie);

                if (data.redirect) {
                    // Do something new here?
                    window.location.replace(data.redirect);
                } else {
                    // data.message
                    $('#error').text(data.message);
                }
               // $('#loginForm').modal('hide');
            },
            error   : function(data) {
                alert(data);
            }
        });
*/
    });
});
