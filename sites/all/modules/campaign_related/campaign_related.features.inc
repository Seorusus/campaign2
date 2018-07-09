<?php
/**
 * @file
 * campaign_related.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function campaign_related_ctools_plugin_api($module = NULL, $api = NULL) {
  if ($module == "field_group" && $api == "field_group") {
    return array("version" => "1");
  }
}

/**
 * Implements hook_views_api().
 */
function campaign_related_views_api($module = NULL, $api = NULL) {
  return array("api" => "3.0");
}

/**
 * Implements hook_flag_default_flags().
 */
function campaign_related_flag_default_flags() {
  $flags = array();
  // Exported flag: "Volunteer".
  $flags['volunteer'] = array(
    'entity_type' => 'node',
    'title' => 'Volunteer',
    'global' => 0,
    'types' => array(
      0 => 'campaign',
    ),
    'flag_short' => 'Volunteer for this [current-page:title] Campaign',
    'flag_long' => 'Volunteer for this Campaign',
    'flag_message' => 'Volunteered for [current-page:title] Campaign',
    'unflag_short' => 'Not Interested',
    'unflag_long' => 'Not Interested in Campaign',
    'unflag_message' => 'Not Interested in [current-page:title] Campaign',
    'unflag_denied_text' => '',
    'link_type' => 'toggle',
    'weight' => 0,
    'show_in_links' => array(
      'full' => 'full',
      'teaser' => 'teaser',
      'rss' => 'rss',
      'search_index' => 'search_index',
      'search_result' => 'search_result',
      'token' => 'token',
    ),
    'show_as_field' => 1,
    'show_on_form' => 0,
    'access_author' => '',
    'show_contextual_link' => 0,
    'i18n' => 0,
    'api_version' => 3,
    'module' => 'campaign_related',
    'locked' => array(
      0 => 'name',
    ),
  );
  return $flags;

}

/**
 * Implements hook_node_info().
 */
function campaign_related_node_info() {
  $items = array(
    'campaign' => array(
      'name' => t('Campaign Page'),
      'base' => 'node_content',
      'description' => '',
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}

/**
 * Implements hook_paragraphs_info().
 */
function campaign_related_paragraphs_info() {
  $items = array(
    'education' => array(
      'name' => 'Education',
      'bundle' => 'education',
      'locked' => '1',
    ),
  );
  return $items;
}
