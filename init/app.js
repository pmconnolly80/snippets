(function () {

  angular.module('app', [])

    .factory('AppService', function ($http, $window, $document, $q) {

      var gapi,
          initComplete = $q.defer();  // Promise that will be resolved when our app has finished initializing

      // Trigger initialization
      init();

      // Public interface
      return {
        isReady: isReady
      };

      /**
       * Initialize the app:
       *   - Load Google SDK
       *   - Assign `gapi`
       *   - Check user auth status
       *sdfds
       *
       * And then resolve the promise indicating that our app has finished initializing.
       */
      function init() {
        var isGoogleLoaded;

        // Load the Google JavaScript client library.
        isGoogleLoaded = loadJsLibrary('google-jssdk', 'https://apis.google.com/js/client.js?onload=handleClientLoad', 'handleClientLoad');
        isGoogleLoaded.then(function() {
          console.log('Google loaded');
        });


        // gapi = $window.gapi;
      }

      /**
       * Return a promise that will be resolved when AppService is ready,
       * i.e. the Google SDK has been loaded and the user auth status has been checked.
       */
      function isReady() {
        return initComplete.promise;
      }

      /**
       * Load an external JS library.
       *
       * Create a global function that will act as the callback for the library being loaded.
       * When called, this function will resolve a promise and delete itself.
       */
      function loadJsLibrary(id, src, callback) {
        var deferred = $q.defer();
        $window[callback] = function() {
          deferred.resolve();
          delete $window[callback];
        };
        addScript(id, src);
        return deferred.promise;
      }

      /**
       * Load an external JS file by adding a <script> tag to the current page.
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

    .controller('AppCtrl', function(AppService) {

    });

})();
