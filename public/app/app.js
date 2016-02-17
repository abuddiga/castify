angular.module('castify', [
  'castify.services',
  'castify.playlist',
  'ngRoute'
])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/playlist', {
      templateUrl: 'app/playlist/playlist.html',
      controller: 'PlaylistController',
    })
    .otherwise({
      redirectTo: '/playlist'
    });
});
