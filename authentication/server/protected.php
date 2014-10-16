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

  case 'GET':
    $user = user_get();
    
    if ($user) {
      $out['items'] = array(
        array('title' => 'Book 1', 'price' => '12.80'),
        array('title' => 'Book 2', 'price' => '39.95'),
        array('title' => 'Book 3', 'price' => '6.67'),
        array('title' => 'Book 4', 'price' => '97.00'),
      );
      response_send(HTTP_CODE_OK, $out);
    }
    else {
      $out['message'] = 'User must be logged in to access this endpoint.';
      response_send(HTTP_CODE_FORBIDDEN, $out);
    }
}
