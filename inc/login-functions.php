<?php
/**
 * Custom login functions for this theme
 *
 * @package _s
 */

/**
 * Remove toolbar for non-admin users
 */
function _s_remove_toolbar() {
  if ( ! current_user_can( 'manage_options' ) && ! current_user_can('administrator') && ! is_admin() ) {
    show_admin_bar( false );
    add_filter('show_admin_bar', '__return_false');
  }
}
add_action('after_setup_theme', '_s_remove_toolbar');

function _s_restrict_admin_access() {
  if (! current_user_can('administrator') && ! current_user_can('manage_options') && ! defined('DOING_AJAX')) {
    wp_redirect(home_url('/'));
    exit;
  }
}
add_action('admin_init', '_s_restrict_admin_access');

function _s_my_login_logo() {
?>
  <style type="text/css">
    .login h1 {
      margin-bottom: 25px;
    }

    #login h1 a,
    .login h1 a {
      background-image: none;
      background-size: auto;
      background-position: center top;
      background-repeat: no-repeat;
      color: #444;
      display: inline-block;
      height: auto;
      font-size: 20px;
      line-height: 1.3em;
      margin: 0 auto;
      outline: 0;
      padding: 0;
      text-indent: 0;
      width: auto;
    }
  </style>
<?php
}
add_action( 'login_enqueue_scripts', '_s_my_login_logo' );

function _s_my_login_logo_url() {
    return home_url();
}
add_filter( 'login_headerurl', '_s_my_login_logo_url' );

function _s_my_login_logo_url_title() {
    return 'Looks / Personality Matrix';
}
add_filter( 'login_headertext', '_s_my_login_logo_url_title' );

function _s_custom_user_registration_form() {
  ?>

  <div class="registration-form-wrap">
    <form id="registration-form" action="" method="POST">
      <div class="form-group">
        <label for="user-email">Email</label>
        <input class="form-control" type="email" id="user-email" name="user-email" placeholder="Email" required maxlength="60" minlength="6">
      </div>
      <div class="form-group">
        <label for="user-password">Password</label>
        <input class="form-control" type="password" id="user-password" name="user-password" placeholder="Password" required maxlength="40" minlength="8">
      </div>
      <div class="form-group">
        <input type="submit" id="user-submit" name="user-submit" value="Create Account">
      </div>
    </form>
  </div>

  <?php

  if (isset($_POST['user-submit']) && !empty($_POST['user-submit'])) {
    _s_insert_user();
  }
}

function _s_validate_user_registration() {
  if (!isset($_POST['user-email']) || !isset($_POST['user-password']) || empty($_POST['user-email']) || empty($_POST['user-password'])) {
    return new WP_Error('fields', 'One or more required fields are empty');
  }

  $email    = sanitize_email($_POST['user-email']);
  $password = $_POST['user-password'];

  if ( !is_email($email) ) {
    return new WP_Error('email', 'Email contains invalid characters');
  }

  if ( strlen($email) < 6 ) {
    return new WP_Error('email', 'Email length must be at least 6 characters');
  }

  if ( email_exists($email) !== false ) {
    return new WP_Error('email_exists', 'Email is already in use');
  }

  if ( strlen($password) < 8 ) {
    return new WP_Error('password', 'Password length must be at least 8 characters');
  }
}

function _s_insert_user() {
  if (is_wp_error(_s_validate_user_registration())) {
    echo '<div class="form-message-wrap">';
      echo '<p class="form-message form-message--error">' . _s_validate_user_registration()->get_error_message() . '</p>';
    echo '</div>';
  }
  else {
    $user_data = array(
      'user_login' => sanitize_email($_POST['user-email']),
      'user_email' => sanitize_email($_POST['user-email']),
      'user_pass'  => $_POST['user-password']
    );

    $user_id = wp_insert_user($user_data);

    if ( !is_wp_error($user_id) ) {
      // Log them in...
      echo '<div class="form-message-wrap">';
        echo '<p class="form-message form-message--success"><a href="'. wp_login_url() .'">Login</a></p>';
      echo '</div>';
    }
    else {
      echo '<div class="form-message-wrap">';
        echo '<p class="form-message form-message--error">'. $user_id->get_error_message() .'</p>';
      echo '</div>';
    }
  }
}
