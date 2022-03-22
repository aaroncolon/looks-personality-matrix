<?php
/**
 * Template part for displaying the custom login form
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package _s
 */
?>

<?php
$login_args = array(
  'echo'           => true,
  'remember'       => true,
  'redirect'       => ( is_ssl() ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'],
  'form_id'        => 'login-form',
  'id_username'    => 'user_login',
  'id_password'    => 'user_pass',
  'id_remember'    => 'rememberme',
  'id_submit'      => 'wp-submit',
  'label_username' => __( 'Username or Email' ),
  'label_password' => __( 'Password' ),
  'label_remember' => __( 'Remember Me' ),
  'label_log_in'   => __( 'Log In' ),
  'value_username' => '',
  'value_remember' => false
);
?>

<div class="login-form-wrap">
  <?php wp_login_form( $login_args ); ?>
  <p class="create-account-wrap"><a class="create-account-link" href="<?php echo wp_registration_url() ?>">Create Account</a></p>
</div>
