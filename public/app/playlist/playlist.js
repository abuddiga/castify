angular.module('castify.playlist', [])

.controller('PlaylistController', function ($scope, $location, Playlist) {
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
      selectPlaylist(0);
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  var selectPlaylist = function(index) {
    $scope.data.currentPlaylist = $scope.data.playlists[index];

    Playlist.getSongList($scope.data.currentPlaylist)
    .then(function (songs) {
      console.log(songs.data.items);
      $scope.data.songList = songs.data.items;
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  initializePlaylists();
});