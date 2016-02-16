var YOUTUBE_VIDEO_URL = "https://www.youtube.com/embed/{videoId}?autoplay=1"

angular.module('castify.playlist', [])

.controller('PlaylistController', function ($scope, $location, $sce, Playlist, Video) {
  $scope.data = {
    playlists: [],
    currentPlaylist: {},
    songList: [],
    currentSong: {},
    currentSongIndex: 0
  };

  var initializePlaylists = function () {
    Playlist.getPlaylists()
    .then(function (playlists) {
      $scope.data.playlists = playlists.data.items;
      $scope.selectPlaylist(0)
      .then(function() {
        $scope.data.currentSongIndex = 0;
        $scope.selectSong($scope.data.currentSongIndex)
        .then(function() {
          window.player = initializePlayer($scope.data.currentSong);
        })
      })
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
      $scope.selectSong($scope.data.currentSongIndex);
    }
  };

  $scope.selectPlaylist = function(index) {
    $scope.data.currentPlaylist = $scope.data.playlists[index];

    return Playlist.getSongList($scope.data.currentPlaylist)
      .then(function (songs) {
        $scope.data.songList = songs.data.items;
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.selectSong = function(index) {
    var selectedSong = $scope.data.songList[index];

    return Video.getVideo(selectedSong)
    .then(function (song) {
      var song = song.data.items[0];
      var videoSrc = YOUTUBE_VIDEO_URL.replace(/{videoId}/, song.id.videoId);
      song.src = $sce.trustAsResourceUrl(videoSrc);
      $scope.data.currentSong = song;

      Video.playVideo(song);
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  initializePlaylists();
});