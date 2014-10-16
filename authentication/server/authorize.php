<?php
/**
 * @file
 * Authorization endpoint.
 *
 * Send a POST request to this script with the name of an action to authorize.
 *
 */
 
 
include('helpers.php');

session_start();
ob_start("ob_gzhandler");


switch ($_SERVER['REQUEST_METHOD']) {

  case 'POST':
    $user = user_get();
    
    if (!$user) {
      $out['message'] = 'No signed in user';
      response_send(HTTP_CODE_UNAUTHORIZED, $out);
    }
    
    $action = payload_get('action');  // The action to authorize for the current user
    
    if (user_can($action)) {
      $out['message'] = 'Action is allowed';
      response_send(HTTP_CODE_OK, $out);
    }
    else {
      $out['message'] = 'Action is forbidden';
      response_send(HTTP_CODE_FORBIDDEN, $out);
    }
}
