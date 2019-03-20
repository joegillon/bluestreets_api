/**
 * Created by Joe on 10/2/2017.
 */

/*=====================================================================
CSV Export Table
=====================================================================*/
var csvExportTable = {
  view: "datatable",
  id: "csvExportTable",
  datatype: "csv"
};

var csvExportTableCtlr = {
  tbl: null,

  init: function () {
    this.tbl = $$("csvExportTable");
    this.tbl.hide();
  },

  clear: function () {
    this.tbl.clearAll();
  },

  load: function(jsonData) {
    this.clear();
    this.tbl.parse(jsonData);
  },

  export: function(filename, jsonData, columns, ignore) {
    this.tbl.define("columns", columns);
    this.tbl.refreshColumns();
    this.load(jsonData);
    webix.csv.delimiter.rows = "\n";
    webix.csv.delimiter.cols = ",";
    webix.toCSV(this.tbl, {
      ignore: ignore,
      filename: filename
    });
  }

};