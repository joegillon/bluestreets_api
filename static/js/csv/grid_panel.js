/**
 * Created by Joe on 9/3/2017.
 */

/*=====================================================================
CSV Grid
=====================================================================*/
const csvGrid = {
  view: "datatable",
  id: "csvGrid",
  autoheight: true,
  autowidth: true,
  resizeColumn: true,
  datatype: "csv"
};

/*=====================================================================
CSV Grid Controller
=====================================================================*/
const csvGridCtlr = {
  grid: null,

  init: function () {
    this.grid = $$("csvGrid");
  },

  clear: function () {
    this.grid.clearAll();
  },

  load: function(data, delimiter) {
    this.clear();
    this.setColumns(data[0].split(delimiter));
    data.shift();
    webix.DataDriver.csv.cell = delimiter;
    webix.DataDriver.csv.row = "\n";
    this.grid.parse(data.join("\n"), "csv");
  },

  setColumns: function(csvCols) {
    let newCols = [];
    for (let i=0; i<csvCols.length; i++) {
      newCols.push({
        id: toTitleCase(csvCols[i]),
        map: "#data" + i.toString() + "#",
        header: toTitleCase(csvCols[i]),
        adjust: "data"
      })
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
      view: "uploader",
      id: "ss_uploader",
      autowidth: true,
      value: "Click Me or Drag File to Me",
      link: "mylist",
      autosend: false,
      multiple: false
    },
    {view: "list", id: "mylist", type: "uploader", autoheight: true, borderless: true},
    {
      view: "button",
      value: "Save",
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

    $$("ss_uploader").attachEvent("onBeforeFileAdd", function(upload) {
       if (!["xls", "csv"].includes(upload.type)) {
         webix.message({type: "error", text: "Excel or CSV files only!"});
         return false;
       }
      let file = upload.file;
      let reader = new FileReader();
      csvGridPanelCtlr.filetype = upload.type;
      reader.onload = function(e) {
        let data = e.target.result;
        if (csvGridPanelCtlr.filetype == "xls") {
          let cfb = XLS.CFB.read(data, {type: "binary"});
          let wb = XLS.parse_xlscfb(cfb);
          data = XLSX.utils.sheet_to_csv(wb.Sheets.Sheet1, {FS: "\t"});
        }

        csvGridPanelCtlr.importer.importData(data);

      };
      reader.readAsBinaryString(file);
    });

    $$("ss_uploader").attachEvent("onFileUploadError", function(file, response) {
      console.log(file);
      console.log(response);
    });
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
const csvGridPanelCtlr = {
  importer: null,
  filetype: null,

  init: function(importer) {
    this.importer = importer;
    csvGridToolbarCtlr.init();
    csvGridCtlr.init();
  }

};
