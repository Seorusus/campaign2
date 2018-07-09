<?php
/**
 * @file: front_slide_render.tpl.php
 * User: Duy
 * Date: 1/29/13
 * Time: 4:13 PM
 */
?>

<?php if (!isset($slide->settings["disabled"]) || !$slide->settings["disabled"]):?>
  <div class="md-slide-item slide-<?php print $index+1;?>" <?php print $data_properties;?>>
    <div class="md-mainimg" style="<?php print $background_style;?>">
      <?php if(isset($slide->settings['mp4_link']) && (trim($slide->settings['mp4_link']) || trim($slide->settings['webm_link']))){?>
        <video playsinline autoplay muted loop style="width:100%; height: auto;">              
          <source src="<?php print $slide->settings['webm_link'];?>" type="video/webm">
          <source src="<?php print $slide->settings['mp4_link'];?>" type="video/mp4">
        </video>
      <?php } else if (!empty($background_url)):?>
        <img src="<?php print $background_url;?>" alt="<?php print htmlentities($slide->settings["background_image_alt"], ENT_QUOTES, 'UTF-8');?>"<?php print $background_style;?> />
      <?php endif;?>
    </div>
    <?php if (isset($slide->settings['background_overlay']) && $slide->settings['background_overlay'] != ''): ?>
      <div class="md-slider-overlay" style="background: <?php print $slide->settings['background_overlay']; ?>">
      </div>
    <?php endif; ?>
    <div class="md-objects">
      <?php foreach ($slide->layers as $index => $layer):?>
        <?php print theme('front_layers_render', array('index' => $index, 'layer' => $layer));?>
      <?php endforeach;?>
    </div>
  </div>
<?php endif;?>
