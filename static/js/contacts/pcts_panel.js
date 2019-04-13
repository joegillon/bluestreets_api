/* conPctPanel: conGridPanel, conDetailPanel */

/*=====================================================================
Contact Grid Toolbar
=====================================================================*/
var conGridToolbar = {
  view: "toolbar",
  id: "conGridToolbar",
  height: 35,
  paddingY: 2,
  cols: [
    {
      view: "label",
      label: "Contacts"
    },
    {
      view: "search",
      id: "conGridFilter",
      placeholder: "Search...",
      width: 100,
      on: {
        onTimedKeyPress: function() {
          conGridCtlr.filter(this.getValue());
        }
      }
    },
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
      view: "button",
      type: "icon",
      icon: "save",
      width: 25,
      tooltip: "Save CSV",
      click: "conGridCtlr.export();"
    }
  ]
};

var conGridToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("conGridToolbar");
    this.load_precincts();
  },

  load_precincts: function() {
    var opts = streetsCollection.find(
      {$distinct: {pct_name: {$ne: ""}}},
      {$orderBy: {pct_name: 1}}
    ).map(function(street) {
      return street.pct_name;
    });
    opts.unshift("All Precincts");
    $$("pctSelect").define("options", opts);
    $$("pctSelect").refresh();
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

/*=====================================================================
Contact Grid
=====================================================================*/
var conGrid = {
  view: "datatable",
  id: "conGrid",
  height: 450,
  autowidth: true,
  select: true,
  resizeColumn: true,
  tooltip: true,
  columns: [
    {
      id: 'id',
      hidden: true
    },
    {
      id: "name",
      template: '#name.whole_name#',
      header: 'Name',
      width: 300,
      sort: sortByWholeName
    },
    {
      id: "address",
      template: '#address.whole_addr#',
      header: 'Address',
      width: 250
    },
    {
      id: "pct",
      template: "#voter_info.precinct_name#",
      header: "Precinct",
      width: 210,
      sort: sortByPrecinctName
    },
    {
      template: "#voter_info.congress#",
      header: "US",
      width: 60,
      sort: sortByCongressionalDistrict
    },
    {
      template: "#voter_info.senate#",
      header: {text: "State Senate", css: "multiline", height: 40},
      width: 60,
      sort: sortBySenateDistrict
    },
    {
      template: "#voter_info.house#",
      header: {text: "State House", css: "multiline"},
      width: 60,
      sort: sortByHouseDistrict
    }
  ],
  on: {
    onItemDblClick: function(id) {
      conFormCtlr.clear();
      conFormCtlr.loadContact(id.row, false);
      $$("detailView").show();
    }
  }
};

var conGridCtlr = {
  grid: null,
  recordSet: null,

  init: function() {
    this.grid = $$("conGrid");
    this.recordSet = contactsCollection.find({}, {$orderBy: {name: {whole_name: 1}}});
    this.load(this.recordSet);
    this.grid.adjust();
  },

  clear: function() {
    this.grid.clearAll();
  },

  load: function(data) {
    this.clear();
    this.grid.parse(data);
    this.grid.adjust();
  },

  filter: function(value) {
    this.grid.filter(function(obj) {
      return obj.name.whole_name.toLowerCase().indexOf(value.toLowerCase()) == 0;
    })
  },

  filter_pct: function(value) {
    this.grid.filter(function(obj) {
      return obj.voter_info.precinct_name.indexOf(value) == 0;
    })
  },

  getSelectionId: function() {
    return this.grid.getSelectedId();
  },

  showSelection: function(id) {
    this.grid.select(id);
    this.grid.showItem(id);
  },

  add: function(contact) {
    contactsCollection.insert(contact);
    var id = contact.id;
    addDisplay2Contacts();
    this.init();
    this.filter("");
    this.showSelection(id);
  },

  update: function(contact) {
    // TODO: update grid
  },

  drop: function(id) {
    this.grid.remove(id);
  }

};

/*=====================================================================
Contact Grid Panel
=====================================================================*/
var conGridPanel = {
  rows: [conGridToolbar, conGrid]
};

var conGridPanelCtlr = {
  init: function() {
    conGridToolbarCtlr.init();
    conGridCtlr.init();
  }
};

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
Contact Precinct Panel
=====================================================================*/
//var conPctPanel = {
//  cols: [conGridPanel, conDetailPanel]
//};

var conPctPanelCtlr = {
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
          options: [],
        },
        {
          cells: [gridView, detailView],
          autowidth: true
        }
      ]
    };

    webix.ui(conMgtUI);
  }

};

