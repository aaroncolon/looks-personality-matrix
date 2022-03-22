<?php
/**
 * Template Name: Home Page
 *
 * The template for displaying the home page
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package _s
 */

get_header();
?>

  <div id="primary" class="content-area">
    <main id="main" class="site-main">
      <?php if ( !is_user_logged_in() ): ?>
        <div class="section-login">
          <h1 class="site-title site-title--hero"><?php bloginfo( 'name' ); ?></h1>
          <?php
          $_s_description = get_bloginfo( 'description', 'display' );
          if ($_s_description):
          ?>
            <h2 class="site-description site-description--hero"><?php echo $_s_description; /* WPCS: xss ok. */ ?></h2>
          <?php endif; ?>
      <?php get_template_part('template-parts/content', 'custom-login'); ?>
        </div>
      <?php
      else:
        if ( !empty($_GET['view']) ):
          switch($_GET['view']) {
            case 'add':
              get_template_part('template-parts/content', 'notifications');
              get_template_part('template-parts/content', 'person-add');
              break;
            case 'summary':
              get_template_part('template-parts/content', 'notifications');
              get_template_part('template-parts/content', 'person-summary');
              break;
            case 'chart':
              get_template_part('template-parts/content', 'notifications');
              get_template_part('template-parts/content', 'person-chart');
              break;
            case 'react-add':
            case 'react-summary':
              get_template_part('template-parts/content', 'person-react');
              break;
          }
        else :
          get_template_part('template-parts/content', 'person-react');
        endif;

      endif; // End is_user_logged_in()
      ?>

    </main><!-- #main -->
  </div><!-- #primary -->

<?php
// get_sidebar();
get_footer();
