<?php 

/*
 * Implements hook_admin().
 *
 */
function paystack_donate_admin() {
  $form = array();

  $form['paystack_donate_public_key'] = array(
    '#type' => 'textfield',
    '#title' => t('Paystack Public Key'),
    '#default_value' => variable_get('paystack_donate_public_key', ''),
    '#description' => t('Your pubic Key from Paystack. Use test key for test mode and live key for live mode'),
    '#required' => TRUE,
  );
  
  $form['paystack_donate_default_amount'] = array(
    '#type' => 'textfield',
    '#title' => t('Default Amount'),
    '#default_value' => variable_get('paystack_donate_default_amount', 1000),
    '#description' => t('Default Amount in the Amount Field. Defaults to 1000 Naira'),
  );
  
  $form['paystack_donate_success_message'] = array(
    '#type' => 'textfield',
    '#title' => t('Success Message'),
    '#default_value' => variable_get('paystack_donate_success_message', 'Thank you for your donation.'),
    '#description' => t('Success Message to show in a popup. Leave empty to show the default "Thank you for your donation"'),
  );
  
  $form['paystack_donate_link'] = array(
    '#type' => 'textfield',
    '#title' => t('Menu Link'),
    '#default_value' => variable_get('paystack_donate_link', 'donate'),
    '#description' => t('The default is /donate. However, feel free to change the link to any other you like, like \'contribute\' . You should flush your cache after changing this item because Drupal automatically caches menu links'),
    '#required' => TRUE,
  );
  
  $form['paystack_donate_submit_button_value'] = array(
    '#type' => 'textfield',
    '#title' => t('Submit Button Text'),
    '#default_value' => variable_get('paystack_donate_submit_button_value', 'Donate'),
    '#description' => t('Submit button text. Defaults to "donate".'),
    '#required' => TRUE,
  );
  
  
  return system_settings_form($form);
}