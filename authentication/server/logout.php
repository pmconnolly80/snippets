<?php
/**
 * @file
 * Logout endpoint.
 *
 * Send a POST request to this script to log the user out.
 */
 
 
include('helpers.php');

session_start();
ob_start("ob_gzhandler");


switch ($_SERVER['REQUEST_METHOD']) {

  case 'GET':
  case 'POST':
    user_delete();
    $out['message'] = 'User has been logged out';
    response_send(HTTP_CODE_OK, $out);

}
