<?php
/**
 * Template part for displaying the Person Chart content in home.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package _s
 */
?>

<?php
$nonce = wp_create_nonce('get_post_nonce');
$user_people = get_user_meta(get_current_user_id(), 'ac_people', true);
$user_people_names = (!empty($user_people)) ? array_column($user_people, 'name') : null;
?>
<div class="section-person-summary">

  <h1 class="heading heading--section">Person Summary</h1>

  <div class="person-select-wrap">
    <?php
    if ($user_people_names):
    ?>

      <form id="form-summary" action="" method="POST">

        <div class="form-group">
          <label for="person-options">Select Person</label>
          <select class="form-control" id="person-options" name="person-options" required>
            <option value="">Select Person...</option>
            <?php
            // Sort array alphabetically
            sort($user_people_names);
            for ($i = 0; $i < count($user_people_names); $i++) {
              echo '<option value="'.esc_html($user_people_names[$i]).'">'.esc_html(ucwords($user_people_names[$i])).'</option>';
            }
            ?>
          </select>
        </div>

        <div class="form-group">
          <label for="timeframe">Timeframe</label>
          <select class="form-control" id="timeframe" name="timeframe" required>
            <?php
            for ($i = 1; $i <= 24; $i++) {
              $selected = ($i === 1) ? 'selected' : '';
              $month = ($i > 1) ? 'Months' : 'Month';
              $text = $i .' '. $month;
              echo '<option value="'. $i .'" '. $selected .'>'. $text .'</option>';
            }
            ?>
          </select>
        </div>

        <div class="form-group">
          <input id="nonce" type="hidden" value="<?php echo $nonce ?>">
          <input id="submit" type="submit" value="Search">
        </div>

      </form>
    <?php
    endif;
    ?>
  </div>

  <div class="person-summary">
    <h2 class="person-summary__name"></h2>
    <dl class="person-summary__list">
      <dt>Looks Average</dt>
      <dd class="person-summary__looks"></dd>

      <dt>Personality Average</dt>
      <dd class="person-summary__personality"></dd>

      <dt>Zone Average</dt>
      <dd class="person-summary__zone"></dd>
    </dl>
  </div>

  <div class="section-chart">
    <canvas id="person-chart-scatter"></canvas>
  </div>

  <div class="section-chart">
    <canvas id="person-chart-pie"></canvas>
  </div>

</div>
