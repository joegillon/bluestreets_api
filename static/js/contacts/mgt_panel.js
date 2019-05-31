var mgtToolbarCols = [
  {
    view: "icon",
    icon: "map",
    tooltip: "Filter by precinct ->"
  },
  {
    view: "select",
    id: "pctSelect",
    width: 100,
    options: [],
    on: {
      onChange: function(newv) {
        if (newv == "All Precincts") newv = "";
        conGridCtlr.filter_pct(newv);
      }
    }
  },
  {
    view: "icon",
    icon: "sitemap",
    tooltip: "Filter by group ->"
  },
  {
    view: "select",
    id: "grpSelect",
    width: 100,
    options: [],
    on: {
      onChange: function(newv) {
        if (newv == "0") newv = "All Groups";
        conGridCtlr.filter_grp(newv);
      }
    }
  },
  {
    view: "button",
    type: "icon",
    icon: "envelope",
    width: 25,
    tooltip: "Send Email",
    click: ""
  },
  {
    view: "button",
    type: "icon",
    icon: "user-times",
    width: 25,
    tooltip: "Drop Contact",
    click: "conGridToolbarCtlr.drop();"
  },
  {
    view: "button",
    type: "icon",
    icon: "user-plus",
    width: 25,
    tooltip: "New Contact",
    click: function() {
      conFormCtlr.clear();
      $$("detailView").show();
    }
  }
];

var conGridToolbarCtlr = {
  toolbar: null,
  csvFile: null,

  init: function() {
    this.toolbar = $$("conGridToolbar");
    this.load_precincts();
    this.load_groups();
  },

  load_precincts: function() {
    let opts = DB.pcts().map(pct => pct.display).sort();
    opts.unshift("All Precincts");
    $$("pctSelect").define("options", opts);
    $$("pctSelect").refresh();
  },

  load_groups: function() {
    var opts = [{id: 0, value: "All Groups"}];
    DB.groups().each(function(grp) {
      opts.push({
        id: grp.id,
        value: grp.name
      });
    });
    $$("grpSelect").define("options", opts);
    $$("grpSelect").refresh();
  },

  drop: function() {
    var id = conGridCtlr.getSelectionId();
    if (id === undefined) return;
    id = parseInt(id);

    webix.confirm(
      "Are you sure you want to drop this contact?",
      "confirm-warning",
      function(yes) {
        if (yes) {
          //noinspection JSUnresolvedVariable,JSUnresolvedFunction
          var url = Flask.url_for("con.drop", {contact_id: id});

          ajaxDao.get(url, function(data) {
            if (data.hasOwnProperty("error")) {
              webix.message({type: "error", text: data["error"]})
            } else {
              contactsCollection.remove({id: id});
              conGridCtlr.drop(id);
              webix.message("Contact Dropped!");
            }
          });
        }
      }
    );
  }
};

var mgtGridCols = [
  {
    id: "pct",
    template: "#display_pct#",
    header: "Precinct",
    width: 210,
    sort: sortByPrecinctName
  },
  {
    template: "#congress#",
    header: "US",
    width: 60,
    sort: sortByCongressionalDistrict
  },
  {
    template: "#senate#",
    header: {text: "State Senate", css: "multiline", height: 40},
    width: 60,
    sort: sortBySenateDistrict
  },
  {
    template: "#house#",
    header: {text: "State House", css: "multiline"},
    width: 60,
    sort: sortByHouseDistrict
  }
];

var mgtFormToolbarCols = [
  {
    view: "button",
    type: "icon",
    icon: "users",
    width: 25,
    tooltip: "Manage Groups",
    click: "conFormToolbarCtlr.groups();"
  }
];

//var mgtFormRow = {
//  cols: [
//    {
//      rows: [
//        {
//          view: "label",
//          label: "Groups"
//        },
//        {
//          view: "list",
//          id: "groupList",
//          template: "#group_name#",
//          tooltip: {
//            template: "#role#"
//          },
//          readonly: true,
//          height: 100
//        }
//      ]
//    },
//    {
//      rows: [
//        {
//          view: "label",
//          label: "Tags"
//        },
//        {
//          view: "list",
//          label: "Tags",
//          name: "tags",
//          readonly: true,
//          height: 100
//        }
//      ]
//    }
//  ]
//};

/*=====================================================================
Contact Management Panel
=====================================================================*/
var conMgtPanelCtlr = {
  init: function() {
    try {
      this.buildDB();
    } catch (ex) {
      webix.message({type: "error", text: ex})
      return;
    }
    this.buildUI();

    conGridPanelCtlr.init();
    conDetailPanelCtlr.init();
    memPopupCtlr.init();

    // Need this because form onblur events occur prior to the clear
    // button click.
    webix.attachEvent("onFocusChange", function(cur_view) {
      if (cur_view === null) return;
      if (cur_view.config.id == "conFormClearBtn") {
        $$("groupList").clearAll();
        conFormCtlr.clear();
      }
    })
  },

  buildDB: function() {
    buildPrecinctsCollection();
    buildStreetsCollection();
    buildCityZips();
    buildContactsCollection(CONTACT_REX);
    buildGroupsCollections();
  },

  buildUI: function() {

    // Build conGridPanel
    conGridToolbar.cols = conGridToolbar.cols.concat(mgtToolbarCols);
    conGrid.columns = conGrid.columns.concat(mgtGridCols);
    this.buildConGridCtlr();

    // Build conDetailPanel
    //conForm.elements = conForm.elements.concat(mgtFormRow);
    insertArrayAt(conFormToolbar.elements, 1, mgtFormToolbarCols);
    this.buildConFormCtlr();

    // Build conMgtUI
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
      rows: [
        {
          view: "segmented",
          id: "conMgtUI",
          value: "gridView",
          multiview: true,
          options: []
        },
        {
          cells: [gridView, detailView],
          autowidth: true
        }
      ]
    };

    webix.ui(conCGrid);
    webix.ui(conVGrid);
    webix.ui(conSGrid);
    webix.ui(coaPopup);
    webix.ui(memPopup);
    webix.ui(conMgtUI);
  },

  buildConGridCtlr: function() {

    conGridCtlr.filter_pct = function(value) {
      if (value == "All Precincts") {
        conGridCtlr.load(conGridCtlr.recordSet);
        return;
      }
      $$("conGrid").filter(function(obj) {
        return obj.display_pct.indexOf(value) == 0;
      })
    };

    conGridCtlr.filter_grp = function(value) {
      if (value == "All Groups") {
        conGridCtlr.load(conGridCtlr.recordSet);
        return;
      }
      let contact_ids = DB.memberships({group_id: parseInt(value)}).
          map(membership => membership.contact_id );
      let subset = [];
      conGridCtlr.recordSet.forEach(function(contact) {
        if (contact_ids.indexOf(contact.id) != -1) {
          subset.push(contact);
        }
      });
      conGridCtlr.load(subset);
    };

    conGridCtlr.drop = function(id) {
      $$("conGrid").remove(id);
    };

    conGridCtlr.add = function(contact) {
      contactsCollection.insert(contact);
      var id = contact.id;
      addDisplay2Contacts();
      conGridCtlr.init();
      conGridCtlr.filter("");
      conGridCtlr.showSelection(id);
    };
  },

  buildConFormCtlr: function() {
//     conFormCtlr.loadMemberships = function(contactId) {
//       $$("groupList").clearAll();
//       $$("groupList").parse(
//         DB.memberships({contact_id: contactId}).get()
//       )
//     };

    conFormCtlr.loadContact = function(contactId) {
//       this.loadMemberships(contactId);
      let contact = DB.contacts({id: contactId}).first();
      this.frm.setValues(contact, true);
      this.locationReadOnly(true);
      conMatchGridCtlr.config("C");
      conMatchToolbarCtlr.contactMatch(contact);
    }
  }

};

