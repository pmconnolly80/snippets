(function () {

  angular.module('app', [])

    // Google OAuth Client ID ("ng-workshop" project)
    .constant('GAPI_CLIENT_ID', '178943113374-d5f5mska0vvb956jb1e8sstf8dgqbqrh.apps.googleusercontent.com')

    .factory('AppService', function ($window, $document, $q, $timeout, GAPI_CLIENT_ID) {

      var initComplete = $q.defer();  // Global promise that wraps all initialization promises

      // This is how you would trigger initialization in a real app.
      // For this tutorial, the user must manually call `startInit`.
      // init();

      // Public interface
      return {
        isReady: isReady,
        startInit: startInit
      };

      /**
       * Return a promise that will be resolved when everything is initialized.
       */
      function isReady() {
        return initComplete.promise;
      }

      /**
       * You wouldn't normally expose the init() method in a real app,
       * but we want to let the user trigger initialization for the tutorial.
       */
      function startInit() {
        init();
      }

      /**
       * Initialize the app:
       *   - Load Google SDK
       *   - Load Facebook SDK
       *   - Check if user is authenticated with Google
       *
       * When all three tasks are complete, the global initialization promise will be resolved.
       */
      function init() {
        var GoogleSdkLoaded, FacebookSdkLoaded,
            GoogleUserStatusDeferred = $q.defer();

        // Load the Google JS SDK.
        GoogleSdkLoaded = loadJsLibrary('google-jssdk', 'https://apis.google.com/js/client.js?onload=handleClientLoad', 'handleClientLoad');

        // If Google SDK was loaded, get the user auth status
        // from Google using "immediate mode" (no UI is shown).
        GoogleSdkLoaded.then(function() {
          var authParams = {client_id: GAPI_CLIENT_ID, scope: 'profile', immediate: true};
          $window.gapi.auth.authorize(authParams, function(authResult) {
            GoogleUserStatusDeferred.resolve(authResult);
          });
        });

        // Load the Facebook JS SDK.
        FacebookSdkLoaded = loadJsLibrary('facebook-jssdk', '//connect.facebook.net/en_US/sdk.js', 'fbAsyncInit');

        // Resolve the global initialization promise if all three sub-promises are resolved,
        // or reject it if one sub-promise is rejected.
        $q.all([GoogleSdkLoaded, FacebookSdkLoaded, GoogleUserStatusDeferred.promise]).then(function() {
          // We pass the resolve values of all promises (in `arguments`) to the master promise.
          initComplete.resolve(arguments);
        }, function() {
          initComplete.reject();
        });
      }

      /**
       * Helper function. Load an external JS library.
       *
       * Create a global function that will act as the callback for the library being loaded.
       * When called, this function will resolve a promise and delete itself.
       */
      function loadJsLibrary(id, src, callback) {
        var deferred = $q.defer();
        $window[callback] = function() {
          deferred.resolve('Library loaded: ' + src);
          delete $window[callback];
        };
        addScript(id, src);
        // If the JS library hasn't called the callback after 5 seconds, the promise will be rejected.
        // $timeout(function() {
        //   deferred.reject();
        // }, 5000);
        return deferred.promise;
      }

      /**
       * Helper function. Load an external JS file by adding a <script> tag to the current page.
       * Once loaded, the JS file should invoke a global callback function.
       *
       * Based on https://developers.facebook.com/docs/javascript/quickstart
       */
      function addScript(id, src) {
        var d = $document[0], s = 'script',
            js, fjs = d.getElementsByTagName(s)[0];
        if (!d.getElementById(id)) {
          js = d.createElement(s); js.id = id;
          js.src = src;
          fjs.parentNode.insertBefore(js, fjs);
        }
      }
    })

    .controller('AppCtrl', function($scope, AppService) {
      // Log useful info to the screen.
      $scope.log = 'Doing nothing. Please click startInit().';

      // This method is just for the tutorial. Don't do this in a real app.
      $scope.startInit = function() {
        $scope.log = 'Initializing...';
        AppService.startInit();
      };

      AppService.isReady().then(function(outcomes) {
        $scope.log = outcomes[0];
        // console.log('Google & Facebook SDKs loaded. Google authResult is:', authResult);
      }, function() {
        $scope.log = 'ERROR: The app could not be initialized.';
      });

    });

})();
