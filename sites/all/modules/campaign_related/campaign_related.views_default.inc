<?php
/**
 * @file
 * campaign_related.views_default.inc
 */

/**
 * Implements hook_views_default_views().
 */
function campaign_related_views_default_views() {
  $export = array();

  $view = new view();
  $view->name = 'positions_selection';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'node';
  $view->human_name = 'positions selection';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['title'] = 'positions selection';
  $handler->display->display_options['use_more_always'] = FALSE;
  $handler->display->display_options['access']['type'] = 'perm';
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'full';
  $handler->display->display_options['pager']['options']['items_per_page'] = '10';
  $handler->display->display_options['style_plugin'] = 'default';
  $handler->display->display_options['row_plugin'] = 'node';
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = '';
  $handler->display->display_options['fields']['title']['alter']['word_boundary'] = FALSE;
  $handler->display->display_options['fields']['title']['alter']['ellipsis'] = FALSE;
  /* Sort criterion: Content: Post date */
  $handler->display->display_options['sorts']['created']['id'] = 'created';
  $handler->display->display_options['sorts']['created']['table'] = 'node';
  $handler->display->display_options['sorts']['created']['field'] = 'created';
  $handler->display->display_options['sorts']['created']['order'] = 'DESC';
  /* Filter criterion: Content: Published */
  $handler->display->display_options['filters']['status']['id'] = 'status';
  $handler->display->display_options['filters']['status']['table'] = 'node';
  $handler->display->display_options['filters']['status']['field'] = 'status';
  $handler->display->display_options['filters']['status']['value'] = 1;
  $handler->display->display_options['filters']['status']['group'] = 1;
  $handler->display->display_options['filters']['status']['expose']['operator'] = FALSE;
  /* Filter criterion: Content: Has taxonomy terms (with depth; Simple hierarchical select) */
  $handler->display->display_options['filters']['shs_term_node_tid_depth_4']['id'] = 'shs_term_node_tid_depth_4';
  $handler->display->display_options['filters']['shs_term_node_tid_depth_4']['table'] = 'node';
  $handler->display->display_options['filters']['shs_term_node_tid_depth_4']['field'] = 'shs_term_node_tid_depth';
  $handler->display->display_options['filters']['shs_term_node_tid_depth_4']['exposed'] = TRUE;
  $handler->display->display_options['filters']['shs_term_node_tid_depth_4']['expose']['operator_id'] = 'shs_term_node_tid_depth_4_op';
  $handler->display->display_options['filters']['shs_term_node_tid_depth_4']['expose']['label'] = 'Has taxonomy terms (with depth; Simple hierarchical select)';
  $handler->display->display_options['filters']['shs_term_node_tid_depth_4']['expose']['operator'] = 'shs_term_node_tid_depth_4_op';
  $handler->display->display_options['filters']['shs_term_node_tid_depth_4']['expose']['identifier'] = 'shs_term_node_tid_depth_4';
  $handler->display->display_options['filters']['shs_term_node_tid_depth_4']['expose']['remember_roles'] = array(
    2 => '2',
    1 => 0,
    3 => 0,
  );
  $handler->display->display_options['filters']['shs_term_node_tid_depth_4']['vocabulary'] = 'elective_nigeria3_912';
  $handler->display->display_options['filters']['shs_term_node_tid_depth_4']['depth'] = '0';

  /* Display: Page */
  $handler = $view->new_display('page', 'Page', 'page');
  $handler->display->display_options['path'] = 'positions-selection';
  $export['positions_selection'] = $view;

  return $export;
}
