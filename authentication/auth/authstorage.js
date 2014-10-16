/**
 * @file
 * Store authentication parameters.
 *
 * Usage:
 *   - After user has signed in:
 *       AuthStorage.store(idToken, accessToken, state, refreshToken);
 *   - When user signs out or doesn't have access:
 *       AuthStorage.remove();
 *   - To check user's status:
 *       AuthStorage.get();
 *
 * Borrowed from https://github.com/auth0/auth0-angular/blob/master/src/auth0-angular.js
 *
 *
 *  --- 29-AUG-2014 ---
 *
 *   localStorage can only store string key/value pairs!!
 *   I was trying to do localStorage.setItem('user', {username: 'Vince'})
 *   which resulted in my "user" object being converted into a string...
 *
 */

angular.module('auth')

  .service('AuthStorage', function($injector) {
    // Sets storage to use
    var put, get, remove = null;
    // if (localStorage) {
    //   put = function(what, value) {
    //     return localStorage.setItem(what, value);
    //   };
    //   get = function(what) {
    //     return localStorage.getItem(what);
    //   };
    //   remove = function(what) {
    //     return localStorage.removeItem(what);
    //   };
    // }
    // else {
    var $cookieStore = $injector.get('$cookieStore');
    put = function(what, value) {
      return $cookieStore.put(what, value);
    };
    get = function(what) {
      return $cookieStore.get(what);
    };
    remove = function(what) {
      return $cookieStore.remove(what);
    };
    // }

    this.store = function(user) {
      put('user', user);
      // if (accessToken) {
      //   put('accessToken', accessToken);
      // }
      // if (state) {
      //   put('state', state);
      // }
      // if (refreshToken) {
      //  put('refreshToken', refreshToken);
      // }
    };

    this.get = function() {
      return get('user');

      // return {
      //   user: get('user')
      //   accessToken: get('accessToken'),
      //   state: get('state'),
      //   refreshToken: get('refreshToken')
      // };
    };

    this.remove = function() {
      remove('user');
      // remove('accessToken');
      // remove('state');
      // remove('refreshToken');
    };
  });