/**
 * Created by Joe on 11/14/2017.
 */

/*=====================================================================
Has Column Names Confirm Box
=====================================================================*/
var hasColnamesConfirm = {
  title: "Column Names",
  ok: "Yes",
  cancel: "No",
  text: "First line has column names",
  callback: function(reply) {
    csvImportPanelCtlr.mapFldsPopup(reply);
  }
};

/*=====================================================================
CSV Import Panel
=====================================================================*/
var csvImportPanel = {
  cols: [csvDropsitePanel, csvGridPanel]
};

/*=====================================================================
CSV Import Panel Controller
=====================================================================*/
var csvImportPanelCtlr = {
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  theData: null,
  theDelimiter: ",",
  hasColumns: false,

  init: function() {
    csvDropsitePanelCtlr.init();
    csvGridPanelCtlr.init();
  },

  setData: function(data) {
    this.theData = data.split("\n");
    webix.confirm(hasColnamesConfirm);
  },

  mapFldsPopup: function(hasColumnNames) {
    this.hasColumns = hasColumnNames;
    var csvFlds = this.theData[0].split(this.theDelimiter);
    if (!hasColumnNames) {
      var cols = [];
      for (var i=0; i<csvFlds.length; i++) {
        cols.push(this.alphabet[i]);
      }
      csvFlds = cols;
    } else {
      this.theData = this.theData.splice(1).join("\n").split("\n");
    }
    csvFldsPopupCtlr.show(csvFlds);
  },

  loadData: function(mapping) {
    var last_name_idx = parseInt(mapping.last_name.match(/\d+/)[0]);
    var first_name_idx = parseInt(mapping.first_name.match(/\d+/)[0]);
    var namedData = [];
    this.theData.forEach(function(line) {
      var flds = line.split("\t");
      if (flds[last_name_idx] != "" && flds[first_name_idx] != "")
        namedData.push(line);
    });
    csvGridCtlr.load(namedData.join("\n"), mapping, this.theDelimiter);
  }
};
