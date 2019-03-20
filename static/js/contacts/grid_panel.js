/* conGridPanel: conGridToolbar, conGrid */

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
      view: "icon",
      icon: "tags",
      tooltip: "Filter by tag ->"
    },
    {
      view: "select",
      id: "tagSelect",
      width: 100,
      options: [],
      on: {
        onChange: function(newv) {
          if (newv == "0") newv = "All";
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
      icon: "save",
      width: 25,
      tooltip: "Save CSV",
      click: "conGridCtlr.export();"
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
  ]
};

var conGridToolbarCtlr = {
  toolbar: null,
  csvFile: null,

  init: function() {
    this.toolbar = $$("conGridToolbar");
    this.load_precincts();
    this.load_groups();
    this.load_tags();
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

  load_groups: function() {
    var opts = [{id: 0, value: "All Groups"}];
    groupsCollection.find().forEach(function(grp) {
      opts.push({
        id: grp.id,
        value: grp.name
      });
    });
    $$("grpSelect").define("options", opts);
    $$("grpSelect").refresh();
  },

  load_tags: function() {
    var opts = [{id: 0, value: "All Tags"}];
    $$("tagSelect").define("options", opts);
    $$("tagSelect").refresh();
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
      conFormCtlr.loadContact(id.row);
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

  filter_grp: function(value) {
    if (value == "All Groups") {
      this.load(this.recordSet);
    } else {
      var contact_ids = membershipsCollection.find({group_id: parseInt(value)}).
          map(function (obj) {return obj.contact_id;});
      var subset = [];
      this.recordSet.forEach(function(contact) {
        if (contact_ids.indexOf(contact.id) != -1) {
          subset.push(contact);
        }
      });
      this.load(subset);
    }
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
  },

  export: function() {

    var filename = prompt("Enter a filename", "Data");
    if (filename === null) {
      return;
    }

    var mapfun = function(left, right) {
      return {code: right.code, contact_id: left.contact_id};
    };

    var data = [];
    this.grid.eachRow(function(row_id) {
      const row = $$("conGrid").getItem(row_id);

      var grps = membershipsCollection.chain().eqJoin(groups, "group_id", "id", mapfun).
        find({contact_id: row.id}).data().map(function(rec) {return rec.code;});

      data.push({
        name: row.name,
        last_name: row.last_name,
        first_name: row.first_name,
        middle_name: row.middle_name,
        name_suffix: row.name_suffix,
        nickname: row.nickname,
        gender: "",
        birthyear: "",
        email: row.email,
        phone1: row.phone1,
        phone2: row.phone2,
        address: row.address,
        city: row.city,
        zipcode: row.zipcode,
        precinct: row.pct.replace(/,/g, ':'),
        districts: row.congress + ":" + row.senate + ":" + row.house,
        groups: grps.join(":"),
        tags: ""
      });
    });
    data = data.sort(function(a, b) {
      return (a.name < b.name) ? -1 : 0;
    });

    csvExportTableCtlr.export(filename, data, exportColumns, exportIgnore);
  }
};

/*=====================================================================
Export Columns
=====================================================================*/
var exportColumns = [
  {id: "last_name", header: "Last Name"},
  {id: "first_name", header: "First Name"},
  {id: "middle_name", header: "Middle Name"},
  {id: "name_suffix", header: "Name Suffix"},
  {id: "nickname", header: "Nickname"},
  {id: "gender", header: "Gender"},
  {id: "birthyear", header: "Birth Yr"},
  {id: "email", header: "Email"},
  {id: "phone1", header: "Phone 1"},
  {id: "phone2", header: "Phone 2"},
  {id: "address", header: "Address"},
  {id: "city", header: "City"},
  {id: "zipcode", header: "Zip"},
  {id: "precinct", header: "Precinct"},
  {id: "districts", header: "Districts"},
  {id: "groups", header: "Groups"},
  {id: "tags", header: "Tags"}
];

var exportIgnore = {
  $loki: true, first_name_meta: true, id: true, last_name_meta: true,
  precinct_id: true, street_meta: true
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


