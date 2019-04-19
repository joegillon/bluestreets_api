/* conPctPanel: conGridPanel, conDetailPanel */

/*=====================================================================
Database
=====================================================================*/
var contactsCollection;
var streetsCollection;
var zipcodeOptions;
var cityOptions;
var ordinalStreets;
var digitMappings;

/*=====================================================================
Contact Precinct UI Controller
=====================================================================*/
var conPctUICtlr = {
  init: function() {
    this.buildDB();
    this.buildUI();

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
  },

  buildDB: function() {
    build_streets_db();
    build_contacts_db();
  },

  buildUI: function() {

    this.buildConFormCtlr();

    webix.ui(coaPopup);

    var gridView = {
      id: "gridView",
      rows: [conGridPanel],
      autowidth: true
    };

    var detailView = {
      id: "detailView",
      rows: [conDetailPanel],
      autowidth: true
    };

    var conMgtUI = {
      container: "content_container",
      autowidth: true,
      rows: [
        {
          view: "segmented",
          id: "conMgtUI",
          value: "gridView",
          multiview: true,
          options: [],
        },
        {
          cells: [gridView, detailView]
        }
      ]
    };

    webix.ui(conMgtUI);
  },

  buildConFormCtlr: function() {
    conFormCtlr.loadContact = function(contactId) {
      var contact = contactsCollection.findOne({id: contactId});
      this.frm.setValues(contact, true);
      $$("chkKeep").setValue(false);
      this.locationReadOnly(true);
      conMatchGridCtlr.config("V");
      conMatchToolbarCtlr.voterMatch();
    }
  }

};

