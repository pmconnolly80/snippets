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

    if (!$user || !in_array('admin', $user['roles'])) {
      $out['message'] = 'User must be logged in and admin to access this endpoint.';
      response_send(HTTP_CODE_FORBIDDEN, $out);
    }
    else {
      $out['persons'] = array(
        array('name' => 'Ray Donovan', 'credit_card' => '5687345933554477'),
        array('name' => 'Abby Donovan', 'credit_card' => '5687345933554477'),
        array('name' => 'Marvin Gaye', 'credit_card' => '5687345933554477'),
        array('name' => 'Vince Carré', 'credit_card' => '5687345933554477'),
      );
      response_send(HTTP_CODE_OK, $out);
    }
}
