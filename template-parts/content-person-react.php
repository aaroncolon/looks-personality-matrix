<?php
/**
 * Template part for displaying the Person React content in home.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package _s
 */
?>
<?php
$nonce_create_post = wp_create_nonce('create_post_nonce');
$nonce_get_people  = wp_create_nonce('get_people_nonce');
$nonce_get_post    = wp_create_nonce('get_post_nonce');
$user_people_names_formatted = _s_get_user_people_names_formatted();
?>

<script>
  const _s_page_data = {
    user_people_names: <?php echo json_encode($user_people_names_formatted) ?>,
    nonce_create_post: <?php echo json_encode($nonce_create_post) ?>,
    nonce_get_post:    <?php echo json_encode($nonce_get_post) ?>,
    nonce_get_people:  <?php echo json_encode($nonce_get_people) ?>
  };
</script>

<div class="section-react">
  <div id="react-root-new"></div>
</div>
