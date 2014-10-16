<?php

// Variable initialization.
$out = array();

// HTTP status codes.
define('HTTP_CODE_OK', 200);
define('HTTP_CODE_BAD_REQUEST', 400);
define('HTTP_CODE_UNAUTHORIZED', 401);  // authentication is required and has failed
define('HTTP_CODE_FORBIDDEN', 403);     // valid request, but the server refuses to respond to it


/**
 * Send an HTTP response to the browser
 *
 * @param $http_code
 *   HTTP status code.
 * @param $body
 *   Associative array representing the body of the response.
 * @param $headers
 *   Associative array representing headers to add to the response:
 *     Array('Content-Type' => 'application/json')
 */
function response_send($http_code, $body = array(), $headers = NULL) {
  // Set the HTTP response code.
  http_response_code($http_code);

  // Process the headers.
  $base = array('Content-Type' => 'application/json;charset=utf-8');
  $headers = is_array($headers) ? array_merge($base, $headers) : $base;

  // Inject some params in the response body, mostly for debugging purpose.
  $body['status'] = $http_code;
  $body['debug_request'] = array(
    'method'       => $_SERVER['REQUEST_METHOD'],
    'query_string' => $_SERVER['QUERY_STRING'],
    'payload'      => payload_get(),
  );

  $callback = isset($_GET['callback']) ? htmlentities($_GET['callback']) : '';
  if (!$callback) {
    $json_str = json_encode($body);
  }
  else {
    $headers['Content-Type'] = 'text/javascript;charset=utf-8';
    $json_str = $callback.'('.json_encode($body).')';
  }

  // Send the headers.
  foreach ($headers as $key => $value) {
    header("$key: $value");
  }

  // Print and exit.
  echo $json_str;
  exit;
}

/**
 * Return a user object if a match was found for the given username/password.
 * 
 * For our purposes, only the following usernames/passwords are valid:
 *   - user/123 (role = user)
 *   - admin/123 (role = admin)
 *
 * In a real project, this function would query a datastore.
 */
function user_verify($username, $password) {
  if ($username == 'user' && $password == '123') {
    $user = array('name' => 'user', 'roles' => array('authenticated'));
  }
  if ($username == 'admin' && $password == '123') {
    $user = array('name' => 'admin', 'roles' => array('authenticated', 'admin'));
  }

  return isset($user) ? $user : NULL;
}

/**
 * Return the current user (if any).
 */
function user_get() {
  if (isset($_SESSION['user']) && is_array($_SESSION['user'])) {
    return $_SESSION['user'];
  }
}

/**
 * Set the current user.
 */
function user_set($user) {
  $_SESSION['user'] = $user;
}

/**
 * Delete the current user.
 */
function user_delete() {
  unset($_SESSION['user']);
  session_destroy();
}

/**
 * Return TRUE if the current user can execute the given action.
 */
function user_can($action) {
  // @TODO: check $user['roles']
  $user = user_get();
  return TRUE;
}

/**
 * Get the payload from an Ajax $http.post().
 *
 * $_POST is only set if the request has the following header:
 *   Content-Type: application/x-www-form-urlencoded
 *
 * But when POSTing, Angular's $http.post() uses this header:
 *   Content-Type: application/json;charset=UTF-8
 *
 * @param $var
 *   Name of a specific variable to get in the payload.
 *   If NULL, return the entire payload.
 */
function payload_get($var = NULL) {
  // Read raw data from the request body.
  // @see http://php.net/manual/wrappers.php.php
  $raw = file_get_contents('php://input');
  $payload = json_decode($raw, TRUE);

  if ($var) return isset($payload[$var]) ? $payload[$var] : NULL;

  return $payload;
}
