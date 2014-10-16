/**
 * @file
 * Service to handle authentication and authorization
 * 
 */
angular.module('auth', [])

  .factory('AuthService', ['$http', 'AuthStorage', 'USER_ROLES',
                    function ($http, AuthStorage, USER_ROLES) {
   
    var currentUser = AuthStorage.get() || { name: '', roles: [USER_ROLES.anonymous] };

    function init() {
      // Refresh the user session (the user session could have expired).
      $http.get('server/login.php')
        .success(function (resp) {
          if (resp.user) {
            AuthStorage.store(resp.user);
            changeUser(resp.user);
          }
          else {
            AuthStorage.remove();
          }
        })
        .error(function (err) {
          // Fail silently
        });
    }
    init();

    // AuthStorage.remove();

    function changeUser(user) {
      angular.extend(currentUser, user);
    }

    return {
      
      login: function (credentials, success, error) {
        $http.post('server/login.php', credentials)
          .success(function (resp) {
            var user = resp.user;
            AuthStorage.store(user);
            changeUser(user);
            success(user);
          })
          .error(error);
      },
   
      logout: function(success, error) {
        $http.post('server/logout.php')
          .success(function(){
            AuthStorage.remove();
            changeUser({ name: '', roles: [USER_ROLES.anonymous] });
            success();
          })
          .error(error);
      },
      
      /**
       * Return true if the current user has the given requiredRole.
       */
      authorize: function(requiredRole, userRoles) {
        if (userRoles === undefined) {
          userRoles = currentUser.roles;
        }

        // console.log('AUTHORIZE: Does the required role "', requiredRole, '" belong to any of the current user roles', userRoles);

        // If the anonymous role is required, access is always granted.
        // PROBLEM: this will show the login button if when the user is signed in...
        if (requiredRole == USER_ROLES.anonymous) {
          return true;
        }

        // Does the user have the required role?
        if (angular.isArray(userRoles)) {
          return (userRoles.indexOf(requiredRole) !== -1);
        }

        return false;
      },
      
      isLoggedIn: function (user) {
        if (user === undefined) {
          user = currentUser;
        }
        return this.authorize(USER_ROLES.authenticated, user.roles);
      },

      user: currentUser
    };
   
  }]);