angular.module('castify.playlist', [])

.controller('PlaylistController', function ($scope, $location, Playlist) {
  $scope.data = {};

  var initializePlaylists = function () {
    Playlist.getPlaylists()
    .then(function (playlists) {
      $scope.data.playlists = playlists.data.items;
      window.playlists = playlists.data.items;
    })
    .catch(function (error) {
      console.error(error);
    });
  };

  initializePlaylists();
});