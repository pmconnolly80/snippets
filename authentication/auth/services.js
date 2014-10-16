/**
 * @file
 * Contains miscellaneous services to support the main AuthService.
 */

angular.module('auth')
  
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  })

  .constant('USER_ROLES', {
    all: '*',
    anonymous: 'anonymous',
    authenticated: 'authenticated',
    admin: 'admin'
  })

  // List of APIs supported for authentication (Google, Facebook...)
  .factory('AuthApis', function() {
    return {
      getAll: function () {
        return [
          {
            key: 'custom_server',
            name: 'Custom Server',
            ready: true
          },
          {
            key: 'google',
            name: 'Google',
            credentials: {
              google_client_id: 'toto'
            },
            ready: false
          },
          {
            key: 'facebook',
            name: 'Facebook',
            credentials: {
              facebook_app_id: 'toto'
            },
            ready: false
          },
        ];
      }
    };
  });
