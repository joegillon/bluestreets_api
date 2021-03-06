/* conPctPanel: conGridPanel, conDetailPanel */

/*=============================================
Contact Precinct Panel
=============================================*/
const gridView = {
  id: "gridView",
  rows: [conGridPanel],
  autowidth: true
};

const detailView = {
  id: "detailView",
  rows: [conDetailPanel],
  autowidth: true
};

const conPctPanel = {
  container: "content_container",
  autowidth: true,
  rows: [
    {
      view: "segmented",
      id: "conPctPanel",
      value: "gridView",
      multiview: true,
      options: []
    },
    {
      cells: [gridView, detailView]
    }
  ]
};

const conPctPanelCtlr = {
  init: function() {
    try {
      this.buildDB();
    } catch (ex) {
      webix.message({type: "error", text: ex})
      return;
    }
    this.buildConFormCtlr();

    webix.ui(coaPopup);
    webix.ui(conPctPanel);

    conGridPanelCtlr.init();
    conDetailPanelCtlr.init();
  },

  buildDB: function() {
    buildPrecinctsCollection();
    buildStreetsCollection();
    buildCityZips();
    buildContactsCollection(CONTACT_REX);
  },

   buildConFormCtlr: function() {
    conFormCtlr.loadContact = function(contactId) {
      const contact = DB.contacts({id: contactId}).first();
      this.frm.setValues(contact, true);
      $$("chkKeep").setValue(false);
      this.locationReadOnly(true);
      conMatchGridCtlr.config("V");
      conMatchToolbarCtlr.voterMatch();
    }
  }
};

