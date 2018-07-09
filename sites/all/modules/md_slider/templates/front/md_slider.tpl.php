<?php
/**
 * @file: md-slider.tpl.php
 * User: Duy
 * Date: 1/29/13
 * Time: 3:01 PM
 */
?>
<div id="md-slider-<?php print $slider->slid;?>-<?php print $type;?>" class="md-slide-items" <?php print $data_properties;?>>
    <div class="wrap-loader-slider animated">
        <div class="wrap-cube">
            <div class="sk-cube-grid">
                <div class="sk-cube sk-cube1"></div>
                <div class="sk-cube sk-cube2"></div>
                <div class="sk-cube sk-cube3"></div>
                <div class="sk-cube sk-cube4"></div>
                <div class="sk-cube sk-cube5"></div>
                <div class="sk-cube sk-cube6"></div>
                <div class="sk-cube sk-cube7"></div>
                <div class="sk-cube sk-cube8"></div>
                <div class="sk-cube sk-cube9"></div>
            </div>
        </div>
    </div>
    <?php foreach ($slides as $index => $slide):?>
      <?php print theme('front_slide_render', array('index' => $index, 'slide' => $slide, 'slider_settings' => $slider->settings));?>
    <?php endforeach;?>
</div>
