  .controller('mainController',
      ['$scope', '$cookieStore', 'AuthApis', 'AuthGoogle', 'AuthFacebook',
      function($scope, $cookieStore, AuthApis, AuthGoogle, AuthFacebook) {
    
    // List of APIs used to demonstrate authentication.
    $scope.apis = AuthApis.getAll();

    // Cache of logged-in users.
    $scope.users = {};

    $scope.getUserDisplay = function(api) {
      if (angular.isDefined($scope.users[api])) {
        var status = $scope.users[api];
        if (status.logged_in) {
          return 'Logged in as ' + status.name;
        }
        if (status.error) {
          return 'Error: ' + status.error;
        }
      }
      return 'Logged out';
    };

    $scope.checkSession = function(api) {
      // Do we have an existing access token?
      var token = $cookieStore.get(api + '_token');

      switch (api) {
        case 'google':
          // Try to restore the existing token.
          if (token) {
            gapi.auth.setToken('token', token);
            $scope.$emit('sessionStateChanged', 'google', token);
          }
          break;
      }
    };

    $scope.getUserInfo = function(api) {
      AuthGoogle.getUserInfo(function(resp) {
        var user = {};
        if (resp) {
          user.name = resp.displayName;
          user.image = resp.image.url;
        }
        $scope.$apply(function() {
          $scope.users[api] = user;
        });
      });
    };
    
    $scope.login = function(api) {
      switch (api) {
        case 'google':
          return AuthGoogle.login();
      }
    };

    $scope.logout = function(api) {
      // Clear the users cache.
      $scope.users[api] = {};
      // Clear the cookie.
      $cookieStore.remove(api + '_token');

      switch (api) {
        case 'google':
          return AuthGoogle.logout();
      }
    };

    // Monitor changes in session state.
    // Will be called the first time the user logs in
    // but also if user performs actions like loggin out
    // in another tab (depending on the SDK).
    $scope.$on('sessionStateChanged', function(e, api_key, info) {
      console.log('sessionStateChanged', api_key, info);
      var data;
      switch (api_key) {
        case 'google':
          if (info['status']['signed_in']) {  // User is logged in!
            // Store access token in a cookie.
            $cookieStore.put(api_key + '_token', info);
            $scope.getUserInfo(api_key);
          } else {
            data = {
              error: info['error']
            };
          }
      }
    });

    // Monitor when SDKs have finished loading asynchronously.
    // When an SDK is loaded, enable to buttons to login/logout with that SDK.
    $scope.$on('sdkLoaded', function(e, api_key) {
      $scope.$apply(function() {
        angular.forEach($scope.apis, function(api, index) {
          if (api.key == api_key) {
            $scope.apis[index].ready = true;
          }
        });
      });
    });

    $scope.init = function() {
      // AuthGoogle.init();
      // AuthFacebook.init();
    };

    // Load all the SDKs.
    $scope.init();
  }]);

// angular.module('myApp', ['ngRoute', 'myApp.login'])
  
//   .controller('appCtrl', function ($scope,
//                                    USER_ROLES,
//                                    AuthService) {
//     $scope.currentUser = null;
//     $scope.userRoles = USER_ROLES;
//     $scope.isAuthorized = AuthService.isAuthorized;
   
//     // The $scope.currentUser property can't simply be assigned a new value
//     // from a child scope because that would result in a shadow property.
//     $scope.setCurrentUser = function (user) {
//       $scope.currentUser = user;
//     };
//   });
  
  // .config(function($routeProvider) {
  //   $routeProvider
  //     .when('/', {
  //       controller: 'MainController',
  //       templateUrl: 'auth/partials/templates/main.html',
  //     })
  //     .otherwise({
  //       redirectTo: '/'
  //     });
  // });
