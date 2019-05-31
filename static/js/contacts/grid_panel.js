/* conGridPanel: conGridToolbar, conGrid */

/*=====================================================================
Contact Grid Toolbar
=====================================================================*/
var conGridToolbarCols = [
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
  }
];

var conGridToolbar = {
  view: "toolbar",
  id: "conGridToolbar",
  height: 35,
  paddingY: 2,
  cols: conGridToolbarCols
};

var conGridToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("conGridToolbar");
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
      template: '#display_name#',
      header: 'Name',
      width: 300,
      sort: sortByWholeName
    },
    {
      id: "address",
      template: '#display_addr#',
      header: 'Address',
      width: 250
    }
  ],
  on: {
    onItemDblClick: function(id) {
      conFormCtlr.clear();
      conFormCtlr.loadContact(id.row, true);
      $$("detailView").show();
    }
  }
};

var conGridCtlr = {
  grid: null,
  recordSet: null,

  init: function() {
    this.grid = $$("conGrid");
    this.recordSet = DB.contacts().order("display_name").get();
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
      return obj.display_name.toLowerCase().indexOf(value.toLowerCase()) == 0;
    })
  },

  getSelectionId: function() {
    return this.grid.getSelectedId();
  },

  showSelection: function(id) {
    this.grid.select(id);
    this.grid.showItem(id);
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


