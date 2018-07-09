<?php

/**
 *  Form constructor for the example form.
 */
function paystack_donate_form($form, &$form_state) {
  drupal_add_js('https://js.paystack.co/v1/inline.js', 'external');
  // Provide a text field.
  $form['paystack_donate_email'] = array(
    '#title' => t('Email'),
    '#type' => 'textfield',
    '#required' => TRUE,
    '#attributes' => array(
      'id' => 'paystack_donate_email',
    ),
  );
  
  $form['paystack_donate_amount'] = array(
    '#title' => t('Amount'),
    '#type' => 'textfield',
    '#required' => TRUE,
    '#default_value' => variable_get('paystack_donate_default_amount', 1000),
    '#attributes' => array(
      'id' => 'paystack_donate_amount',
    ),
  );
  
  $form['paystack_donate_currency'] = array(
    '#title' => t('Currency'),
    '#type' => 'select',
    '#required' => TRUE,
    '#options' => array(
        0 => t('NGN'),
    ),
    '#default_value' => 0,
    '#attributes' => array(
      'id' => 'paystack_donate_currency',
    ), 
  );
  
  
  
  // Provide a submit button.
  $form['paystack_donate_buton'] = array(
    '#type' => 'button',
    '#value' => variable_get('paystack_donate_submit_button_value', 'Donate'),
    '#attributes' => array(
      'onclick' => 'javascript:var s=this;setTimeout(function(){s.value="Please wait...";s.disabled=true;},0.3); payWithPaystack();',
      'id' => 'paystack_donate_form_button',
    ),
  );
  
  drupal_add_js(drupal_get_path('module', 'paystack_donate') . '/paystack_donate.js', 'file');
  drupal_add_js(array('paystack_donate' => array(
    'paystack_key' => variable_get('paystack_donate_public_key'),
    'success_message' => variable_get('paystack_donate_success_message', 'Thank you for your donation.'),
  )), 'setting');
  
  $form['#attributes'] = array(
    'onsubmit' => 'return false', 
    'class' => 'donate-form',
  );
  
  return $form;
}