angular.module('castify.playlist', [])

.controller('PlaylistController', function ($scope, $location, Playlist, Video) {
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
      $scope.selectPlaylist(0);
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  $scope.selectPlaylist = function(index) {
    $scope.data.currentPlaylist = $scope.data.playlists[index];

    Playlist.getSongList($scope.data.currentPlaylist)
    .then(function (songs) {
      $scope.data.songList = songs.data.items;
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  $scope.selectSong = function(index) {
    $scope.data.currentSong = $scope.data.songList[index];
    
    Video.getVideo($scope.data.currentSong)
    .then(function (song) {
      console.log('got song');
      console.log(song);
      // Video.playVideo(song);
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  initializePlaylists();
});