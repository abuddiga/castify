var YOUTUBE_VIDEO_URL = "https://www.youtube.com/embed/{videoId}?autoplay=1"

angular.module('castify.playlist', [])

.controller('PlaylistController', function ($scope, $location, $sce, Playlist, Video) {
  $scope.data = {
    playlists: [],
    currentPlaylist: {},
    songList: [],
    currentSong: {}
  };

  var initializePlaylists = function () {
    Playlist.getPlaylists()
    .then(function (playlists) {
      $scope.data.playlists = playlists.data.items;
      $scope.selectPlaylist(0)
      .then(function() {
        $scope.selectSong(0);
      })
    })
    .catch(function (error) {
      console.error(error);
    });
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

    Video.getVideo(selectedSong)
    .then(function (song) {
      console.log('got songs: ', song.data.items.length);
      var song = song.data.items[0];
      var videoSrc = YOUTUBE_VIDEO_URL.replace(/{videoId}/, song.id.videoId);
      song.src = $sce.trustAsResourceUrl(videoSrc);
      $scope.data.currentSong = song;

      // Video.playVideo(song);
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  initializePlaylists();
});