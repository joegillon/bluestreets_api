/**
 * Created by Joe on 11/14/2017.
 */

/*=====================================================================
Has Column Names Confirm Box
=====================================================================*/
const hasColnamesConfirm = {
  title: "Column Names",
  ok: "Yes",
  cancel: "No",
  text: "First line has column names",
  callback: function(reply) {
    csvImportPanelCtlr.mapFields(reply);
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
  lines: null,
  delimiter: "\t",
  mapping: null,
  csvFlds: null,
  csvJurisdictions: [],

  init: function() {
    try {
      this.buildDB();
    } catch (ex) {
      webix.message({type: "error", text: ex});
      return;
    }

    this.buildUI();

    $$("csvDropsite").attachEvent("onTimedKeyPress", function() {
      let data = $$("csvDropsite").getValue();
      if (data) {
        csvImportPanelCtlr.importData(data);
      }
    })
  },

  buildDB: function() {
    DB.groups = TAFFY(GROUP_REX);
    DB.jurisdictions = TAFFY(JURISDICTION_REX);
  },

  buildUI: function() {
    webix.ui(csvFldsPopup);
    webix.ui(grpMapperPopup);

    webix.ui({
      container: "content_container",
      type: "space",
      rows: [csvImportPanel]
    });

    csvFldsPopupCtlr.init();
    grpMapperPopupCtlr.init();
    csvDropsiteCtlr.init();
    csvGridPanelCtlr.init();
  },

  importData: function(data) {
    this.lines = data.split("\n");
    webix.confirm(hasColnamesConfirm);
  },

  mapFields: function(hasColnames) {
    let csvFlds = this.lines[0].split(this.delimiter);

    if (hasColnames) {
      this.lines.shift();
    } else {
      let numFlds = csvFlds.length;
      csvFlds = [];
      for (let i = 0; i < numFlds; i++) {
        csvFlds.push(this.alphabet[i]);
      }
    }

    this.csvFlds = csvFlds;
    csvFldsPopupCtlr.show(this.cleanData);
  },

  cleanData: function(mapping) {
    csvImportPanelCtlr.mapping = mapping;

    let last_name_idx = parseInt(mapping.last_name.match(/\d+/)[0]);
    let first_name_idx = parseInt(mapping.first_name.match(/\d+/)[0]);
    let linesWithNames = [];

    let csvGroups = [];
    let grpIndexes = (mapping.groups != "") ?
      mapping.groups.split(",").map(x => parseInt(x.match(/\d+/g))) : -1;

    let jurisIdx = (mapping.jurisdiction != "") ?
      parseInt(mapping.jurisdiction.match(/\d+/)[0]) : -1;

    for (let line of csvImportPanelCtlr.lines) {
      if (line == "") continue;
      let flds = line.split(csvImportPanelCtlr.delimiter);

      if (mapping.groups != "") {
        for (let gidx of grpIndexes) {
          let grpName = toTitleCase(flds[gidx]);
          if (grpName != "" && csvGroups.indexOf(grpName) == -1) 
            csvGroups.push(grpName);
        }
      }

      if (mapping.jurisdiction != "") {
        let jurisName = toTitleCase(flds[jurisIdx]);
        if (csvImportPanelCtlr.csvJurisdictions.indexOf(jurisName) == -1)
          csvImportPanelCtlr.csvJurisdictions.push(jurisName);
      }

      if (flds[last_name_idx] != "" && flds[first_name_idx] != "")
        linesWithNames.push(line);
    }

    csvImportPanelCtlr.lines = linesWithNames;

    let callback = (csvImportPanelCtlr.csvJurisdictions.length > 0) ?
      csvImportPanelCtlr.mapJurisdictions : csvImportPanelCtlr.loadData;

    if (csvGroups.length > 0)
      grpMapperPopupCtlr.show(Object.values(csvGroups), callback);
  },

  mapJurisdictions: function() {
    if (csvImportPanelCtlr.csvJurisdictions.length > 0) {
      jurisMapperPopupCtlr.show(Object.values(csvImportPanelCtlr.csvJurisdictions, csvImportPanelCtlr.loadData));
    }
  },

  loadData: function() {
    csvGridCtlr.load(csvImportPanelCtlr.lines.join("\n"), csvImportPanelCtlr.mapping, csvImportPanelCtlr.delimiter);
  }
};
