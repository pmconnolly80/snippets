/**
 * @file
 * Controllers for the "auth" app.
 * 
 */

angular.module('auth')

  .controller('navCtrl', ['$rootScope', '$scope', '$location', 'AuthService', 'USER_ROLES', function($rootScope, $scope, $location, AuthService, USER_ROLES) {
      $scope.user = AuthService.user;
      $scope.roles = USER_ROLES;

      $scope.isLoggedIn = function() {
        return AuthService.isLoggedIn();
      };

      $scope.logout = function() {
        AuthService.logout(function() {
          $location.path('/login');
        }, function() {
          $rootScope.error = "Failed to logout";
        });
      };
  }])

  .controller('loginCtrl', ['$rootScope', '$scope', '$location', 'AuthApis', 'AuthService', 'AUTH_EVENTS',
                      function($rootScope, $scope, $location, AuthApis, AuthService, AUTH_EVENTS) {
    
    // List of APIs used to demonstrate authentication.
    $scope.apis = AuthApis.getAll();

    // Login Form
    $scope.credentials = {
      username: '',
      password: ''
    };
    
    $scope.login = function (credentials) {
      AuthService.login(
        credentials,
        function (user) {
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
          // $scope.setCurrentUser(user);
          // Redirecting to the authenticated home.
          $location.path('/');
        },
        function (err) {
          $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
          $rootScope.error = err.message;
        });
    };
  
  }])

  .controller('AuthenticatedCtrl', ['$rootScope', '$scope', '$http',
    function($rootScope, $scope, $http) {
    
    $scope.items = [];

    $scope.refresh = function() {
      console.log('refresh');
      $http.get('server/protected.php')
        .success(function (resp) {
          $scope.items = resp.items;
        })
        .error(function (err) {
          $scope.items = [];
          $rootScope.error = err.message;
        });
    };

    $scope.refresh();
  }])

  .controller('AdminCtrl', ['$rootScope', '$scope', '$http',
    function($rootScope, $scope, $http) {
    
    $scope.persons = [];
    
    $scope.refresh = function() {
      $http.get('server/protected_admin.php')
        .success(function (resp) {
          $scope.persons = resp.persons;
        })
        .error(function (err) {
          $scope.persons = [];
          $rootScope.error = err.message;
        });
    };
    
    $scope.refresh();
  }]);

