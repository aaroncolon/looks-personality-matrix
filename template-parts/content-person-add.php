<?php
/**
 * Template part for displaying the Person Add content in home.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package _s
 */
?>
<?php
$nonce = wp_create_nonce('create_post_nonce');
$user_people_names = _s_get_user_people_names();

if ($user_people_names) :
  $user_people_names_formatted = _s_get_user_people_names_formatted($user_people_names);
?>

  <script>
    const _s_page_data = {
      user_people_names: <?php echo json_encode($user_people_names_formatted) ?>,
      nonce: <?php echo json_encode($nonce) ?>
    };
  </script>
<?php endif; ?>
<div class="section-add-post">
  <h1 class="heading heading--section">Add Data</h1>

  <form id="form-person" action="" method="POST">
    <?php
    if ($user_people_names) {
    ?>
      <div class="form-group">
        <fieldset name="person-types">
          <legend>New or Existing Person?</legend>
          <div class="radio">
            <label>
              <input type="radio" name="person-type" id="person-type-new" value="new" checked aria-describedby="person-type-help">
              New Person
            </label>
          </div>
          <div class="radio">
            <label>
              <input type="radio" name="person-type" id="person-type-existing" value="existing" aria-describedby="person-type-help">
              Existing Person
            </label>
          </div>
        </fieldset>
      </div>
    <?php
    }
    ?>

    <div class="form-group form-group--person-name">
      <label for="person-name">New Name</label>
      <input class="form-control" type="text" id="person-name" name="person-name" required>
    </div>

    <?php
    if ($user_people_names) {
    ?>
      <div class="form-group form-group--person-name-existing">
        <label for="person-name-existing">Existing Names</label>
        <select class="form-control" id="person-name-existing" name="person-name-existing" required>
          <option value="">Select Existing Person...</option>
          <?php
          // Sort array alphabetically
          sort($user_people_names);
          for ($i = 0; $i < count($user_people_names); $i++) {
            echo '<option value="'.ucwords($user_people_names[$i]).'">'.ucwords($user_people_names[$i]).'</option>';
          }
          ?>
        </select>
      </div>
    <?php
    }
    ?>

    <div class="form-group">
      <label for="person-looks">Looks</label>
      <select class="form-control" id="person-looks" name="person-looks" required>
        <?php
        for ($i = 0; $i <= 10; $i++) {
          $selected = ($i === 5) ? 'selected' : '';
          echo '<option value="'. $i .'" '. $selected .'>'. $i .'</option>';
        }
        ?>
      </select>
    </div>

    <div class="form-group">
      <label for="person-personality">Personality</label>
      <select class="form-control" id="person-personality" name="person-personality" required>
        <?php
        for ($i = 0; $i <= 10; $i++) {
          $selected = ($i === 5) ? 'selected' : '';
          echo '<option value="'. $i .'" '. $selected .'>'. $i .'</option>';
        }
        ?>
      </select>
    </div>

    <!--
    <div class="form-group">
      <label for="person-zone">Zone</label>
      <input class="form-control" type="text" id="person-zone" name="person-zone" disabled autocomplete="off">
    </div>
    -->

    <div class="form-group">
      <label for="person-notes">Notes</label>
      <textarea class="form-control" id="person-notes" rows="3" maxlength="500"></textarea>
    </div>

    <div class="form-group">
      <label for="post-date">Date</label>
      <input class="form-control" type="date" id="post-date" name="post-date" required pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}">
    </div>

    <div class="form-group">
      <input id="nonce" type="hidden" name="nonce" value="<?php echo $nonce; ?>">
      <input id="submit-post" type="submit" value="Add">
    </div>
  </form>
</div>
