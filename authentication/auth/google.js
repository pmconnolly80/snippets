angular.module('auth')

  // You need to create an app in Google Developers Console to obtain a client id.
  // https://console.developers.google.com/
  .constant('GOOGLE_CLIENT_ID', '939587948177-k89aubn3cltq81683dnnod3lkqddf179.apps.googleusercontent.com')
  
  .provider('AuthGoogle', ['GOOGLE_CLIENT_ID', function(GOOGLE_CLIENT_ID) {
    return {
      $get: function () {
        
        return {

          /**
           * Initiate the sign-in flow.
           */
          login: function () {
            // Note that the signin callback is defined as a page-level parameter.
            var signinParams = {
              'clientid': GOOGLE_CLIENT_ID,
              'cookiepolicy': 'single_host_origin',
              'requestvisibleactions': 'http://schema.org/AddAction',
              'scope': 'https://www.googleapis.com/auth/plus.login'
            };
            gapi.auth.signIn(signinParams);
          },
          
          logout: function (msg) {
            gapi.auth.signOut();
          },

          /**
           * Verify if the user still has an active session.
           *
           * @see https://developers.google.com/+/web/api/javascript#gapiauthchecksessionstatesessionparams_callback
           */
          checkSession: function (token) {
            var sessionParams = {
              'clientid': GOOGLE_CLIENT_ID,
              'session_state': token['session_state']
            };
            console.log('sessionParams', sessionParams);
            gapi.auth.checkSessionState(sessionParams, function(is_session_state_valid) {
              console.log(is_session_state_valid);
              if (is_session_state_valid) {
                console.log('Session is still valid.');
              }
              else {
                console.log('Session is no longer valid.');
              }
            });
          },

          /**
           * The user must be signed in to execute this!
           *
           * :param: cb
           *   Callback that will update the scope with the returned information.
           *
           * @see https://developers.google.com/+/web/people/#retrieve_profile_information
           */
          getUserInfo: function (cb) {
            gapi.client.load('plus','v1', function() {
              var request = gapi.client.plus.people.get({
                'userId': 'me'
              });
              request.execute(cb);
            });
          },

          // Load the Google+ script asynchronously.
          init: function () {
            // Create the following page-level configuration parameter:
            // '<meta name="google-signin-callback" content="googleSigninCallback" />'
            // https://developers.google.com/+/web/signin/reference#page-level_configuration_options
            var meta = document.createElement('meta');
            meta.name = 'google-signin-callback';
            meta.content = 'googleSigninCallback';
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(meta);

            // Create the script tag.
            var po = document.createElement('script');
            po.type = 'text/javascript'; po.async = true;
            po.src = 'https://apis.google.com/js/client:plusone.js?onload=googleSdkLoaded';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(po, s);
          }
        };
      }
    };
  }]);

//
// Global functions
//

// Will be called when the Google+ script has finished loading.
// Must be a global function...
var googleSdkLoaded = function () {
  // Broadcast the event that the SDK is loaded so AngularJS can respond.
  var scope = angular.element(document).scope();
  scope.$broadcast('sdkLoaded', 'google');
};

// The sign-in callback is called every time that the user's signed-in status changes,
// and not only when the user signs in. For this to work, the callback must be
// defined as a page-level configuration parameter:
// <meta name="google-signin-callback" content="signinCallback" />
// For that reason too, thus function must be global.
var googleSigninCallback = function(authResult) {
  // Broadcast the event that the SDK is loaded so AngularJS can respond.
  var scope = angular.element(document).scope();
  scope.$broadcast('sessionStateChanged', 'google', authResult);
};
