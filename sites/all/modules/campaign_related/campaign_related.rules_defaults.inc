<?php
/**
 * @file
 * campaign_related.rules_defaults.inc
 */

/**
 * Implements hook_default_rules_configuration().
 */
function campaign_related_default_rules_configuration() {
  $items = array();
  $items['rules_become_campaign_manager'] = entity_import('rules_config', '{ "rules_become_campaign_manager" : {
      "LABEL" : "Become Campaign Manager",
      "PLUGIN" : "reaction rule",
      "OWNER" : "rules",
      "REQUIRES" : [ "rules" ],
      "ON" : { "node_insert--campaign" : { "bundle" : "campaign" } },
      "IF" : [ { "node_is_published" : { "node" : [ "node" ] } } ],
      "DO" : [
        { "user_add_role" : { "account" : [ "node:author" ], "roles" : { "value" : { "4" : "4" } } } },
        { "mail" : {
            "to" : [ "node:author:mail" ],
            "subject" : "Campaign Page Successfully Created",
            "message" : "Hello [site:current-user:field-first-name]\\r\\n\\r\\nYour Campaign Page has been successfully created and the link to it is - [node:url]\\r\\n\\r\\nYou can also get a custom domain name to direct users to this page from - {SHOP_URL} \\r\\n\\r\\nTo view all activities and perform all actions related to your Campaign Page, please visit - {CAMPAIGN_ADMIN_URL}. From here you can \\r\\n\\tview donations made to your campaign\\r\\n\\tget a list of people who have volunteered for your campaign \\r\\n\\tcreate press releases\\/posts\\/blogs\\/articles on the CampaignDOTng Platform \\r\\n\\tadd your campaign events\\r\\n\\tadd Your pictures\\r\\n\\tadminister comments made on your page\\r\\n\\r\\nIf you have any question or need help for anything please feel free to send an email to info@campaigndotng.org or call\\/SMS\\/WhatsApp 08166120866.\\r\\n\\r\\nGood luck in your quest to serve Nigeria and we shall always be here to support you.\\r\\n\\r\\n\\r\\nUche Chuta\\r\\nCampaignDOTng Founder\\/Co-Ordinator",
            "from" : "info@campaigndotng.org",
            "language" : [ "" ]
          }
        }
      ]
    }
  }');
  return $items;
}
