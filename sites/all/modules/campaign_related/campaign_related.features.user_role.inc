<?php
/**
 * @file
 * campaign_related.features.user_role.inc
 */

/**
 * Implements hook_user_default_roles().
 */
function campaign_related_user_default_roles() {
  $roles = array();

  // Exported role: campaign manager.
  $roles['campaign manager'] = array(
    'name' => 'campaign manager',
    'weight' => 3,
  );

  return $roles;
}
