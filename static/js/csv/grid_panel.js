/**
 * Created by Joe on 9/3/2017.
 */

/*=====================================================================
CSV Columns
=====================================================================*/
var csvVoterColumns = [
  {
    id: "last_name",
    map: "#data0#",
    header: "Last Name",
    adjust: "data"
  },
  {
    id: "first_name",
    map: "#data1#",
    header: "First Name",
    adjust: "data"
  },
  {
    id: "middle_name",
    map: "#data2#",
    header: "Middle",
    adjust:"data"
  },
  {
    id: "name_suffix",
    map: "#data3#",
    header: "Suffix",
    adjust: "header"
  },
  {
    id: "address",
    map: "#data4#",
    header: "Address",
    adjust: "data"
  },
  {
    id: "city",
    map: "#data5#",
    header: "City",
    adjust: "data"
  },
  {
    id: "zipcode",
    map: "#data6#",
    header: "Zip",
    adjust: "data"
  }
];

var csvContactColumns = csvVoterColumns.concat([
  {
    id: "email",
    map: "#data7#",
    header: "Email",
    adjust: "data"
  },
  {
    id: "phone1",
    map: "#data8#",
    header: "Phone 1",
    adjust: "data"
  },
  {
    id: "phone2",
    map: "#data9#",
    header: "Phone 2",
    adjust: "data"
  },
  {
    id: "groups",
    map: "#data10#",
    header: "Groups",
    adjust: "data"
  },
  {
    id: "jurisdiction",
    map: "#data11#",
    header: "Jurisdiction",
    adjust: "data"
  },
  {
    id: "ward",
    map: "#data12#",
    header: "Ward",
    adjust: "data"
  },
  {
    id: "precinct",
    map: "#data13#",
    header: "Precinct",
    adjust: "data"
  }
]);

/*=====================================================================
CSV Grid
=====================================================================*/
var csvGrid = {
  view: "datatable",
  id: "csvGrid",
  autoconfig: true,
  resizeColumn: true,
  datatype: "csv"
};

/*=====================================================================
CSV Grid Controller
=====================================================================*/
var csvGridCtlr = {
  grid: null,

  init: function () {
    this.grid = $$("csvGrid");
  },

  clear: function () {
    this.grid.clearAll();
  },

  load: function(data, mapping, delimiter) {
    this.clear();
    this.setMappings(mapping);
    webix.DataDriver.csv.cell = delimiter;
    webix.DataDriver.csv.row = "\n";
    this.grid.parse(data, "csv");
  },

  setMappings: function(fldMappings) {
    var cols = {};
    var colSet = (isContacts) ? csvContactColumns : csvVoterColumns;
    colSet.forEach(function(col) {
      cols[col.id] = col;
    });

    var newCols = [];
    if (fldMappings) {
      for (var fld in fldMappings) {
        newCols.push({
          id: fld,
          map: "#" + fldMappings[fld] + "#",
          header: cols[fld].header,
          adjust: cols[fld].adjust
        })
      }
    } else {
      newCols = colSet;
    }
    this.grid.define("columns", newCols);
    this.grid.refreshColumns();
  },

  pull: function() {
    var gridData = Object.values(this.grid.data.pull);
    var gridCols = this.grid.config.columns;
    var data = [];
    gridData.forEach(function(row) {
      if (row.last_name == "" || row.first_name == "") {
        return;
      }
      var obj = {};
      gridCols.forEach(function(col) {
        obj[col.id] = row[col.map.replace(/#/g, "")];
      });
      data.push(obj);
    });
    return data;
  }
};

/*=====================================================================
CSV Grid Toolbar
=====================================================================*/
var csvGridToolbar = {
  view: "toolbar",
  id: "csvGridToolbar",
  height: 35,
  cols: [
    {view: "label", label: "Spreadsheet Import"},
    {
      view: "template",
      template: '<input id="fileUpload" name="files[]" type="file">'
    },
    {
      view: "button",
      value: "Import",
      click: function() {
        csvGridToolbarCtlr.import()
      }
    }
  ]
};

/*=====================================================================
CSV Grid Toolbar Controller
=====================================================================*/
var csvGridToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("csvGridToolbar");
    document.getElementById("fileUpload").addEventListener(
        "change", this.fileSelect, false);
  },

  fileSelect: function(e) {
    var reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.onload = (function(fileData) {
      csvImportPanelCtlr.setData(fileData.target.result);
    })
  },

  import: function() {
    var data = csvGridCtlr.pull();
    if (!data) return;

    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    var url = Flask.url_for("con.csv_import");

    ajaxDao.post(url, data, function(result) {
      webix.message("Import successful!");
    });
  },

  validate: function(data) {

  }
};

/*=====================================================================
CSV Grid Panel
=====================================================================*/
var csvGridPanel = {
  rows: [csvGridToolbar, csvGrid]
};

/*=====================================================================
CSV Grid Panel Controller
=====================================================================*/
var csvGridPanelCtlr = {
  init: function() {
    csvGridToolbarCtlr.init();
    csvGridCtlr.init();
  },

  load: function(data, mapping) {
    csvGridCtlr.load(data, mapping);
  },

  clear: function() {
    csvGridCtlr.clear();
  }
};
