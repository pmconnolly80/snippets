angular.module('auth')

  // You need to create an app in Facebook's app dashboard
  // https://developers.facebook.com/apps/
  .constant('FACEBOOK_APP_ID', '232589066944899')
  
  .provider('AuthFacebook', ['FACEBOOK_APP_ID', function(FACEBOOK_APP_ID) {
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

          // Load the Facebook SDK asynchronously.
          init: function () {
            (function(d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) return;
              js = d.createElement(s); js.id = id;
              js.src = "//connect.facebook.net/en_US/sdk.js";
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
          }
        };
      }
    };
  }]);

//
// Global functions
//

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);
}

// Will be called when the Facebook SDK has finished loading.
window.fbAsyncInit = function() {
  console.log('fbAsyncInit');
  FB.init({
    appId      : '1393793330859906',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.1' // use version 2.1
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  var scope = angular.element(document).scope();
  scope.$broadcast('sdkLoaded', 'facebook');
};
