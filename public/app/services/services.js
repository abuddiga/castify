var ALL_PLAYLISTS_URL = 'https://api.spotify.com/v1/me/playlists';
var CURRENT_PLAYLIST_URL = 'https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks';
var YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';
var YOUTUBE_API_KEY = 'AIzaSyCfYZqqCvViNHiH-9CdALkaDJ1BG8Niivc';


angular.module('castify.services', [])

.factory('Playlist', function($http, $window, Auth) {
  // var params = Auth.getHashParams();
  // var access_token = params.access_token,
  //     refresh_token = params.refresh_token,
  //     error = params.error;

  var getPlaylists = function() {
    if (localStorage.getItem('access_token')) {
      return $http({
        method: 'GET',
        url: ALL_PLAYLISTS_URL,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
      }).then(function (res) {
          return res;
      }).catch(function (err) {
        console.error(err);
      });
    } else{
      console.error('No access token');
      // else return something
    }
  };

  var getSongList = function(playlist) {
    if (localStorage.getItem('access_token')) {
      var playlistUrl = CURRENT_PLAYLIST_URL.replace(/{user_id}/, playlist.owner.id).replace(/{playlist_id}/, playlist.id);
      return $http({
        method: 'GET',
        url: playlistUrl,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        },
        params: {
          limit: 50
        }
      }).then(function (res) {
          return res;
      }).catch(function (err) {
        console.error(err);
      });
    } else{
      console.error('No access token');
      // else return something
    }
  };

  return {
    getPlaylists: getPlaylists,
    getSongList: getSongList
  };
})

.factory('Video', function($http) {
  var formatQuery = function(song) {
    var songName = song.track.name;
    var artist = song.track.artists[0].name;
    console.log('searching for: ', songName, artist);
    return songName + ' ' + artist;
  };

  var getVideo = function(song) {
    var query = formatQuery(song); 
    var options = {
      query: query,
      max: 5,
      key: YOUTUBE_API_KEY
    };

    return searchYouTube(options)
    .then(function (res) {
      console.log(res);
      return res;
    })
    .catch(function (err) {
      console.error(err);
    });
  };

  var searchYouTube = function(options) {
    return $http( {
      method: 'GET',
      url: YOUTUBE_API_URL,
      params: { 
        part: 'snippet',
        type: 'video', 
        videoEmbeddable: true, 
        q: options.query,
        maxResults: options.max, 
        key: options.key
      },
      contentType: 'application/json'
    } );
  };

  var playVideo = function(video) {
    window.player.videoId = video.id.videoId;
    window.player.cueVideoById(video.id.videoId);
    window.player.playVideo();
  };

  return {
    getVideo: getVideo,
    playVideo: playVideo
  };
})

.factory('Auth', function ($http, $location, $window) {
  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */

  var logout = function() {
    localStorage.setItem('access_token', 'undefined');
    localStorage.setItem('refresh_token', 'undefined');
  };

  var getHashParams = function () {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       console.log(e[1], ': ', hashParams[e[1]]);
    }
    return hashParams;
  };

  var generateAuth = function() {
    var userProfileSource = document.getElementById('user-profile-template').innerHTML,
        userProfileTemplate = Handlebars.compile(userProfileSource),
        userProfilePlaceholder = document.getElementById('user-profile');
    var oauthSource = document.getElementById('oauth-template').innerHTML,
        oauthTemplate = Handlebars.compile(oauthSource),
        oauthPlaceholder = document.getElementById('oauth');
    var params = getHashParams();
    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;
    if (error) {
      alert('There was an error during the authentication');
    } else {
      if (access_token) {
        // render oauth info
        oauthPlaceholder.innerHTML = oauthTemplate({
          access_token: access_token,
          refresh_token: refresh_token
        });
        $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
              userProfilePlaceholder.innerHTML = userProfileTemplate(response);
              $('#login').hide();
              $('#loggedin').show();
            }
        });
      } else {
          // render initial screen
          $('#login').show();
          $('#loggedin').hide();
      }
      document.getElementById('obtain-new-token').addEventListener('click', function() {
        $.ajax({
          url: '/refresh_token',
          data: {
            'refresh_token': refresh_token
          }
        }).done(function(data) {
          access_token = data.access_token;
          oauthPlaceholder.innerHTML = oauthTemplate({
            access_token: access_token,
            refresh_token: refresh_token
          });
        });
      }, false);
    }
  };

  return {
    getHashParams: getHashParams,
    generateAuth: generateAuth,
    logout: logout
  };
});



