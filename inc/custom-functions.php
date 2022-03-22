<?php
/**
 * Custom functions for this theme
 *
 * @package _s
 */

function _s_get_user_people() {
  return get_user_meta(get_current_user_id(), 'ac_people', true);
}

function _s_get_user_people_names() {
  $user_people = _s_get_user_people();
  return (!empty($user_people)) ? array_column($user_people, 'name') : null;
}

function _s_get_user_people_names_formatted() {
  $formatted_names = array();
  $user_people_names = _s_get_user_people_names();
  if ($user_people_names) :
    sort($user_people_names);
    for ($i = 0; $i < count($user_people_names); $i++) {
      $formatted_names[] = ucwords($user_people_names[$i]);
    }
  endif;
  return $formatted_names;
}

/**
 * REST API Customization
 */

/**
 * The dynamic part of the filter $this->post_type refers to the post type slug for the controller.
 *
 * This filter registers the collection parameter, but does not map the collection parameter to an internal WP_Query parameter. 
 * Use the `rest_{$this->post_type}_query` filter to set WP_Query parameters.
 * 
 * https://developer.wordpress.org/reference/hooks/rest_this-post_type_collection_params/
 */
add_filter( 'rest_post_collection_params', '_s_custom_rest_post_collection_params' );
function _s_custom_rest_post_collection_params( $query_params ) {
  // $query_params[''] = [
  //   'description' => __( 'Limit response to posts published after a given ISO8601 compliant date.' ),
  //   'type'        => 'string',
  //   'format'      => 'date-time',
  // ];
  return $query_params;
}

/**
 * Enables adding extra arguments or setting defaults for a post collection request.
 *
 * URL: https://developer.wordpress.org/reference/hooks/rest_this-post_type_query/
 */
add_filter( 'rest_post_query', '_s_custom_rest_post_query', 10, 2 );
function _s_custom_rest_post_query( $args, $request ) {
  return $args;
}

/**
 * Adds Custom Post Types
 */
function _s_register_cpt() {
  $_s_people_labels = array(
    'name'               => _x( 'People', 'post type general name', '_s-textdomain' ),
    'singular_name'      => _x( 'Person', 'post type singular name', '_s-textdomain' ),
    'menu_name'          => _x( 'People', 'admin menu', '_s-textdomain' ),
    'name_admin_bar'     => _x( 'Person', 'add new on admin bar', '_s-textdomain' ),
    'add_new'            => _x( 'Add New', 'Person', '_s-textdomain' ),
    'add_new_item'       => __( 'Add New Person', '_s-textdomain' ),
    'new_item'           => __( 'New Person', '_s-textdomain' ),
    'edit_item'          => __( 'Edit Person', '_s-textdomain' ),
    'view_item'          => __( 'View Person', '_s-textdomain' ),
    'all_items'          => __( 'All People', '_s-textdomain' ),
    'search_items'       => __( 'Search People', '_s-textdomain' ),
    'parent_item_colon'  => __( 'Parent People:', '_s-textdomain' ),
    'not_found'          => __( 'No People found.', '_s-textdomain' ),
    'not_found_in_trash' => __( 'No People found in Trash.', '_s-textdomain' )
  );

  register_post_type('_s_people', array(
    'labels'          => $_s_people_labels,
    'description'     => '',
    'has_archive'     => true,
    'public'          => true,
    'show_ui'         => true,
    'show_in_menu'    => true,
    'menu_position'   => 7,
    'capability_type' => 'post',
    'map_meta_cap'    => true,
    'hierarchical'    => false,
    'rewrite'         => array('slug' => 'people', 'with_front' => false),
    'query_var'       => true,
    'supports'        => array('title', 'editor', 'thumbnail', 'custom-fields'),
  ));
} // _s_register_cpt()
add_action( 'init', '_s_register_cpt' );


/**
 * Custom Taxonomies
 */
// function _s_register_people_taxonomy() {
//   $labels = array(
//     'name' => 'People',
//     'singular_name' => 'Person',
//     'search_items' =>  'Search People',
//     'all_items' => 'All People',
//     'edit_item' => 'Edit Person',
//     'update_item' => 'Update Person',
//     'add_new_item' => 'Add New Person',
//     'new_item_name' => 'New Person Name'
//   );

//   $args = array(
//     'hierarchical' => true,
//     'labels' => $labels,
//     'show_ui' => true,
//     'show_admin_column' => true,
//     'show_in_rest' => true
//   );

//   register_taxonomy( '_s_people', array('_s_people'), $args );
// }
// add_action('init', '_s_register_people_taxonomy');
