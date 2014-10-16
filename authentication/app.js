angular.module('myApp', ['ui.router', 'ngCookies', 'auth'])

  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', 'USER_ROLES',
    function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, USER_ROLES) {

    var roles = USER_ROLES;

    // Public routes
    $stateProvider
      .state('public', {
        abstract: true,
        template: "<ui-view/>",
        data: {
          access: roles.anonymous
        }
      })
      .state('public.404', {
        url: '/404',
        templateUrl: 'auth/partials/404.tpl.html'
      });

    // Anonymous routes
    $stateProvider
      .state('anon', {
        abstract: true,
        template: "<ui-view/>",
        data: {
          access: roles.anonymous
        }
      })
      .state('anon.login', {
        url: '/login',
        templateUrl: 'auth/partials/login_container.tpl.html',
        controller: 'loginCtrl'
      })
      .state('anon.login.custom_server', {
        url: '/custom_server',
        templateUrl: 'auth/partials/login_form.tpl.html'
      })
      .state('anon.login.google', {
        url: '/google',
        templateUrl: 'auth/partials/google.tpl.html'
      })
      .state('anon.login.facebook', {
        url: '/facebook',
        templateUrl: 'auth/partials/facebook.tpl.html'
      });

    // Regular user routes
    $stateProvider
      .state('user', {
        abstract: true,
        template: "<ui-view/>",
        data: {
          access: roles.authenticated
        }
      })
      .state('user.home', {
        url: '/',
        templateUrl: 'auth/partials/authenticated.tpl.html',
        controller: 'AuthenticatedCtrl',
      });

    // Admin routes
    $stateProvider
      .state('admin', {
        abstract: true,
        template: "<ui-view/>",
        data: {
          access: roles.admin
        }
      })
      .state('admin.admin', {
        url: '/admin',
        templateUrl: 'auth/partials/admin.tpl.html',
        controller: 'AdminCtrl',
      });

    $urlRouterProvider.otherwise('/login');

    // $locationProvider.html5Mode(true);

    // Intercept unauthorized and forbidden responses.
    // We redirect the user to the login page
    // if our custom header 'IsSigningIn' is NOT SET
    // (if it were, the user would already be signing in).
    // @see https://code.angularjs.org/1.2.23/docs/api/ng/service/$http#interceptors
    $httpProvider.interceptors.push(function($q, $location) {
      return {
        'responseError': function(response) {
          if ((response.status === 401 || response.status === 403) && !response.headers('IsSigningIn')) {
            $location.path('/login');
          }
          return $q.reject(response);
        }
      };
    });

  }])

  .run(['$rootScope', '$state', 'AuthService', 'USER_ROLES', function ($rootScope, $state, AuthService, USER_ROLES) {

    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
      
      // Role required to access the next state (by default, require "anonymous").
      var requiredRole = (toState.data && toState.data.access) ? toState.data.access : USER_ROLES.anonymous;

      if (!AuthService.authorize(requiredRole)) {
        $rootScope.error = "Seems like you tried accessing a route you don't have access to...";
        event.preventDefault();

        // If the user has entered the URL directly, there is no fromState.url
        // and preventDefault() will leave him stranded on a route he can't access...
        // Try to redirect the user to a more useful page.

        if (fromState.url === '^') {
          if (AuthService.isLoggedIn()) {
            $state.go('user.home');
          }
          else {
            $rootScope.error = null;
            $state.go('anon.login');
          }
        }
      }

      // If the user is trying to access the login page
      // and they are already logged in.
      if (toState.name == 'anon.login' && AuthService.isLoggedIn()) {
        console.log('yeah');
        $state.go('user.home');
      }
    });

  }]);