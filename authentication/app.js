angular.module('myApp', [
  'ngRoute',
  'myApp.services',
  'myApp.directives'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'MainController',
        templateUrl: 'templates/main.html',
      })
      .otherwise({
        redirectTo: '/'
      });
  });

window.onLoadCallback = function() {
  // When the document is ready
  angular.element(document).ready(function() {
    // Bootstrap the oauth2 library
    gapi.client.load('oauth2', 'v2', function() {
      // Finally, bootstrap our angular app
      angular.bootstrap(document, ['myApp']);
    });
  });
};