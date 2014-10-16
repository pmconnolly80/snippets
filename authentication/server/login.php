<?php
/**
 * @file
 * Login endpoint.
 *
 * Send a POST request to this script to sign the user in.
 * Send a GET request to check the current user status.
 */
 
 
include('helpers.php');

session_start();
ob_start("ob_gzhandler");


switch ($_SERVER['REQUEST_METHOD']) {

  case 'GET':  // A GET request can be used to check if a user is currently signed in.
    if ($user = user_get()) {
      $out['message'] = 'A user is signed in';
      $out['user'] = $user;
    }
    else {
      $out['message'] = 'No signed in user';
    }
    response_send(HTTP_CODE_OK, $out);

  case 'POST':  // If method = POST, consider this an attempt to sign in.
    $username = payload_get('username');
    $password = payload_get('password');

    if (!$username || !$password) {
      $out['message'] = 'Missing username or password';
      response_send(HTTP_CODE_BAD_REQUEST, $out);
    }
    
    if ($user = user_verify($username, $password)) {
      user_set($user);
      $out['user'] = $user;
      $out['message'] = 'User is authenticated';
      response_send(HTTP_CODE_OK, $out);
    }
    else {  // Wrong user
      //
      // --- THIS IS TRICKY ---
      //
      // - A response status code between 200 and 299 will considered a success status
      //   and will result in the success callback being called by $http.post().
      // - On the other hand, status codes 401 (unauthorized) and 403 (forbidden)
      //   are intercepted by our $httpProvider.interceptor which redirects
      //   to the login page (but we're already trying to log in...).
      //
      //  ==> Let's introduce a special header in the response
      //      that our HTTP interceptor will check.
      //      If our header is present, the interceptor won't redirect.
      //
      $headers = array('IsSigningIn' => 'true');
      $out['message'] = 'Wrong username or password';
      response_send(HTTP_CODE_UNAUTHORIZED, $out, $headers);
    }
}
