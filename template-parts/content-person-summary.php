<?php
/**
 * Template part for displaying the Person Summary content in home.php
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

  <div class="person-form-wrap">
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
            for ($j = 1; $j <= 24; $j++) :
              $sel    = ($j == 12) ? 'selected' : '';
              $months = ($j == 1) ? 'Month' : 'Months';
              echo '<option value="'. $j .'" '. $sel .'>'. $j .' '. $months .'</option>';
            endfor;
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
    <div class="clearfix">
      <dl class="person-summary__list">
        <dt>Looks Average</dt>
        <dd class="person-summary__looks"></dd>
      </dl>
      <dl class="person-summary__list">
        <dt>Personality Average</dt>
        <dd class="person-summary__personality"></dd>
      </dl>
      <dl class="person-summary__list">
        <dt>Zone Average</dt>
        <dd class="person-summary__zone"></dd>
      </dl>
    </div>
  </div>

  <div class="section-chart">
    <h2 class="section-title section-title--center">Zone Distribution</h2>
    <div id="person-chart-pie--google" class="person-chart-pie--google"></div>
  </div>

  <div class="section-chart">
    <h2 class="section-title section-title--center">Looks / Personality Over Time</h2>
    <div id="person-chart-line--google" class="person-chart-line--google"></div>
  </div>

  <!--
  <div class="section-chart">
    <div id="person-chart-scatter--google" class="person-chart-scatter--google"></div>
  </div>
  -->

  <!--
  <div class="section-chart">
    <canvas id="person-chart-scatter"></canvas>
  </div>

  <div class="section-chart">
    <canvas id="person-chart-pie"></canvas>
  </div>
  -->

  <div class="person-table-wrap">
    <h2 class="section-title section-title--center">Person Details</h2>
    <?php
    if (!empty($user_people)):
    ?>
      <table id="person-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Looks</th>
            <th>Personality</th>
            <th>Zone</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>

        </tbody>
      </table>
    <?php
    else:
      echo '<p>No data yet. <a href="/?view=add">Add some people</a>!</p>';
    endif;
    ?>
  </div>

</div>
