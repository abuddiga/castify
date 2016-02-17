var YOUTUBE_VIDEO_URL = "https://www.youtube.com/embed/{videoId}?autoplay=1"

angular.module('castify.playlist', [])

.controller('PlaylistController', function ($scope, $location, $window, $sce, Playlist, Video, Auth) {
  $scope.data = {
    playlists: [],
    currentPlaylist: {},
    currentPlaylistIndex: 0,
    songList: [],
    // currentSong: {},
    currentVideo: {},
    currentSongIndex: 0
  };

  var initializePlaylists = function () {
    Playlist.getPlaylists()
    .then(function (playlists) {
      $scope.data.playlists = playlists.data.items;
      $scope.data.currentPlaylistIndex = 0;
      return $scope.selectPlaylist($scope.data.currentPlaylistIndex);
    })
    .then(function() {
      $scope.data.currentSongIndex = 0;
      return $scope.selectSong($scope.data.currentSongIndex)
    })
    .then(function(song) {
      window.player = initializePlayer(song);
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  initializePlayer = function(song) {
    console.log(song);
    return new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: song.id.videoId,
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  };

  var onPlayerReady = function(event) {
      event.target.playVideo();
  };

  var onPlayerStateChange = function (event) {
    // fires if song has ended
    if(event.data === 0) {
      if ($scope.data.currentSongIndex + 1 < $scope.data.songList.length) {
        $scope.data.currentSongIndex++;
      } else {
        $scope.data.currentSongIndex = 0;
      }
      $scope.selectSong($scope.data.currentSongIndex)
      .then(function(video) {
        Video.playVideo(video);
      });
    }
  };

  $scope.selectPlaylist = function(index) {
    $scope.data.currentPlaylistIndex = index;
    $scope.data.currentPlaylist = $scope.data.playlists[index];

    return Playlist.getSongList($scope.data.currentPlaylist)
      .then(function (songs) {
        $scope.data.songList = songs.data.items;
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.changeSong = function(index) {
    $scope.data.currentSongIndex = index;
    $scope.selectSong(index)
    .then(function(video) {
      Video.playVideo(video);
    });
  }

  $scope.selectSong = function(index) {
    var selectedSong = $scope.data.songList[index];

    return Video.getVideo(selectedSong)
    .then(function (videos) {
      var video = videos.data.items[0];
      $scope.data.currentVideo = video;
      return video;
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  $scope.logout = function() {
    console.log('controller');
    Auth.logout();
    $window.location.reload();
  }

  if (localStorage.getItem('access_token')) {
    initializePlaylists();
  }
});