/* conMgtPanel: conGridPanel, conDetailPanel */

/*=====================================================================
Contact Globals
=====================================================================*/
var contactsCollection;
var groupsCollection;
var membershipsCollection;
var streetsCollection;
var zipcodeOptions;
var cityOptions;
var ordinalStreets;
var digitMappings;

/*=====================================================================
Contact Management Panel
=====================================================================*/
var conMgtPanel = {
  cols: [conGridPanel, conDetailPanel]
};

var conMgtPanelCtlr = {
  init: function() {
    build_db();
    conGridPanelCtlr.init();
    conDetailPanelCtlr.init();

    // Need this because form onblur events occur prior to the clear
    // button click.
    webix.attachEvent("onFocusChange", function(cur_view) {
      if (cur_view === null) return;
      if (cur_view.config.id == "conFormClearBtn") {
        conFormCtlr.clear();
      }
    })
  }

};

