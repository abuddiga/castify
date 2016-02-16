var generateAuth = function() {
  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  if (!localStorage.access_token || localStorage.access_token === 'undefined') {
    var params = getHashParams();
    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;
    localStorage.access_token = access_token;
    localStorage.refresh_token = refresh_token;
    
    if (error) {
      alert('There was an error during the authentication');
    }
  }

  if (localStorage.access_token && localStorage.access_token !== 'undefined') {
    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + localStorage.access_token
        },
        success: function(response) {
          window.user = response;
          $('#login').hide();
          $('#loggedin').show();
        }
    });
  } else {
      // render initial screen
      $('#login').show();
      $('#loggedin').hide();
  }
    // document.getElementById('obtain-new-token').addEventListener('click', function() {
    //   $.ajax({
    //     url: '/refresh_token',
    //     data: {
    //       'refresh_token': refresh_token
    //     }
    //   }).done(function(data) {
    //     access_token = data.access_token;
    //     oauthPlaceholder.innerHTML = oauthTemplate({
    //       access_token: access_token,
    //       refresh_token: refresh_token
    //     });
    //   });
    // }, false);
};

if (!localStorage.access_token || localStorage.access_token === 'undefined') {
  generateAuth();
} else {
  $('#login').hide();
  $('#loggedin').show();
}