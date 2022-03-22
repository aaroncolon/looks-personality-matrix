<?php
/**
 * Custom functions for this theme
 *
 * @package _s
 */

/**
 * AJAX Posts for Person
 */
function _s_person_add_event_handler() {
  // Verify nonce
  check_ajax_referer('create_post_nonce', 'nonce');

  // Set defaults
  $result = [];
  $result['new_person'] = false;

  // Validate Person Name
  $person_name = strtolower(sanitize_text_field( $_POST['person_name'] ));
  $user        = wp_get_current_user();
  $user_id     = $user->ID;
  $user_people = get_user_meta($user_id, 'ac_people', true);

  // Person ID
  $person_id = get_user_meta($user_id, 'ac_person_id', true);
  if (empty($person_id)) {
    // Initialize person_id = 0
    $person_id = 0;
    update_user_meta($user_id, 'ac_person_id', $person_id);
  }

  // If there are existing People
  if (! empty($user_people)) {
    // If selected Person is new
    $user_people_names = array_column($user_people, 'name');
    $key = array_search($person_name, $user_people_names, true);

    if ($key === false || $key === null) {
      // Increment person_id
      $person_id++;
      update_user_meta($user_id, 'ac_person_id', $person_id);

      // Add person to array
      $user_people[] = array(
        'id'   => $person_id,
        'name' => $person_name
      );

      // Adds Key if doesn't exist
      update_user_meta( $user_id, 'ac_people', $user_people );

      // Add Person to $result array to update Existing People select
      $result['new_person'] = true;
    }
    // Else person already exists, do nothing
  }
  // If there are no existing People
  else {
    // Create a new array with the selected Person
    $user_people = array();
    $user_people[] = array(
      'id'   => $person_id, // initialized as 0
      'name' => $person_name
    );

    // @NOTE Adds Key if doesn't exist
    update_user_meta( $user_id, 'ac_people', $user_people );

    $result['new_person'] = true;
  }

  // Gather form data to create post with
  $person_gender      = sanitize_text_field( $_POST['person_gender'] );
  $person_looks       = sanitize_text_field( $_POST['person_looks'] );
  $person_personality = sanitize_text_field( $_POST['person_personality'] );
  $person_notes       = sanitize_textarea_field( $_POST['person_notes'] );
  $post_date          = sanitize_text_field( $_POST['post_date'] );
  $timestamp          = time();

  // Gather the data to create the Post
  $post_data = array(
    'post_type'    => '_s_people',
    'post_title'   => $person_name .' '. $post_date,
    'post_content' => $timestamp,
    'post_status'  => 'draft', // 'publish' requires post content
    'meta_input'   => array(
      'ac_gender'      => $person_gender,
      'ac_id'          => $person_id,
      'ac_name'        => $person_name,
      'ac_looks'       => $person_looks,
      'ac_personality' => $person_personality,
      'ac_notes'       => $person_notes,
      'ac_post_date'   => $post_date,
      'ac_timestamp'   => $timestamp,
    ),
    'comment_status' => 'closed',
    'ping_status'    => 'closed',
  );

  // Add the Person Post
  wp_insert_post($post_data);

  // Get the Result
  $result['personality'] = $person_personality;
  $result['looks']       = $person_looks;
  $result['date']        = $post_date;
  $result['name']        = $person_name;
  $result['id']          = $person_id;
  $result['timestamp']   = $timestamp;
  $result['time']        = date('Y-m-j h:i:s A', $timestamp);
  $result['user_email']  = $user->user_email;
  $result['user_id']     = $user->ID;
  $result['user_people'] = $user_people;

  echo json_encode($result);

  exit();
}
add_action('wp_ajax__s_person_add_event', '_s_person_add_event_handler');
add_action('wp_ajax_nopriv__s_person_add_event', '_s_person_add_event_handler');


/**
 * AJAX Posts for Person Get
 */
function _s_person_get_event_handler() {
  // Verify nonce
  check_ajax_referer('get_post_nonce', 'nonce');

  // Validate submitted person data
  $person            = sanitize_text_field( $_POST['person_name'] );
  $user_people       = get_user_meta(get_current_user_id(), 'ac_people', true);
  $user_people_names = array_column($user_people, 'name');
  $search_key        = array_search($person, $user_people_names, true);

  // Validate person
  if ( $search_key === false || $search_key === null ):
    echo json_encode( array(
      'person_name' => $person,
      'user_people' => $user_people,
      'msg' => 'Unable to get person. Person does not exist.'
      )
    );
    exit();
  endif;

  // Validate timeframe
  if ( !is_numeric(sanitize_text_field($_POST['timeframe'])) ) {
    echo json_encode('Form validation error. Invalid timeframe.');
    exit();
  }

  $timeframe = intval(sanitize_text_field($_POST['timeframe']));
  $paged = ( isset($_POST['paged']) && !empty($_POST['paged']) ) ? intval($_POST['paged']) : 1;

  // Build the query
  $args = array(
    'post_type'      => '_s_people',
    'status'         => array('draft', 'publish'),
    'author'         => get_current_user_id(),
    'posts_per_page' => 15,
    'paged'          => $paged,
    'meta_key'       => 'ac_post_date', // for orderby
    'orderby'        => 'meta_value',
    'order'          => 'ASC',
    'meta_query'     => array(
      'relation' => 'AND',
      array(
        'key'   => 'ac_name',
        'value' => $person,
      ),
      array(
        'key'     => 'ac_post_date',
        'value'   => date('Y-m-d', $timeframe),
        'compare' => '>=',
        'type'    => 'DATE',
      )
    ),
  );

  $person_data = array();

  $people_query = new WP_Query($args);

  if ($people_query->have_posts()) :
    while ($people_query->have_posts()) : $people_query->the_post();
      // build array of person custom field data
      $person_data[] = array(
        'gender'         => get_post_meta(get_the_ID(), 'ac_gender',      true),
        'name'           => get_post_meta(get_the_ID(), 'ac_name',        true),
        'looks'          => get_post_meta(get_the_ID(), 'ac_looks',       true),
        'personality'    => get_post_meta(get_the_ID(), 'ac_personality', true),
        'notes'          => get_post_meta(get_the_ID(), 'ac_notes',     true),
        'post_date'      => get_post_meta(get_the_ID(), 'ac_post_date', true),
        'post_date_unix' => strtotime(get_post_meta(get_the_ID(), 'ac_post_date', true)),
        'timestamp'      => get_post_meta(get_the_ID(), 'ac_timestamp', true),
      );
    endwhile;
    wp_reset_postdata();
  endif;

  // Get the Result
  $result                  = [];
  $result['person_name']   = $person;
  $result['person_data']   = $person_data; // array of objects
  $result['paged']         = $paged;
  $result['max_num_pages'] = $people_query->max_num_pages;

  // echo json_encode($result);
  echo json_encode($result);

  exit();
}

add_action('wp_ajax__s_person_get_event', '_s_person_get_event_handler');
add_action('wp_ajax_nopriv__s_person_get_event', '_s_person_get_event_handler');
