/**
 * Created by Joe on 11/14/2017.
 */

/*=====================================================================
CSV Import Panel
=====================================================================*/
var csvImportPanel = {
  cols: [csvGridPanel]
};

/*=====================================================================
CSV Import Panel Controller
=====================================================================*/
var csvImportPanelCtlr = {
  lines: null,
  delimiter: "\t",

  init: function() {
    try {
      this.buildDB();
    } catch (ex) {
      webix.message({type: "error", text: ex});
      return;
    }

    this.buildUI();

    //$$("csvDropsite").attachEvent("onTimedKeyPress", function() {
    //  let data = $$("csvDropsite").getValue();
    //  if (data) {
    //    csvImportPanelCtlr.importData(data);
    //  }
    //})
  },

  buildDB: function() {
    DB.groups = TAFFY(GROUP_REX);
    DB.jurisdictions = TAFFY(JURISDICTION_REX);
  },

  buildUI: function() {

    webix.ui({
      container: "content_container",
      type: "space",
      rows: [csvImportPanel]
    });

    //csvDropsiteCtlr.init();
    csvGridPanelCtlr.init();
  },

  importData: function(data) {
    this.lines = data.split("\n");
    let invalidFlds = this.checkValidFlds();
    if (invalidFlds != "") {
      webix.message({type: "error", text: "Invalid fields: " + invalidFlds});
      return;
    }
    this.lines = this.noBlanks();

    csvGridCtlr.load(this.lines, this.delimiter);
  },

  checkValidFlds: function() {
    let flds = this.lines[0].split(this.delimiter).map(fld => fld.toUpperCase());
    if (!flds.includes("LAST")) return "Field 'Last' required";
    if (!flds.includes("FIRST")) return "Field 'First' required";
    let validFlds = [
      "LAST", "FIRST", "MIDDLE", "SUFFIX", "NICKNAME", "ALIAS",
      "GENDER", "EMAIL", "PHONE1", "PHONE2",
      "ADDRESS", "CITY", "ZIP", "JURISDICTION", "WARD", "PRECINCT",
      "GROUPS"
    ];
    return flds.filter(fld => !validFlds.includes(fld)).join();
  },

  noBlanks: function() {
    let last_name_idx = 0;
    let first_name_idx = 1;
    let linesWithNames = [];

    for (let line of this.lines) {
      if (line == "") continue;
      let flds = line.split(this.delimiter);
      if (flds[last_name_idx] != "" && flds[first_name_idx] != "")
        linesWithNames.push(line);
    }

    return linesWithNames;
  }
};
