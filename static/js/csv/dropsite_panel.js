/**
 * Created by Joe on 11/14/2017.
 */

/*=====================================================================
CSV Drop Site
=====================================================================*/
var csvDropsite = {
  view: "textarea",
  id: "csvDropsite",
  placeholder: "Drop spreadsheet here",
  labelAlign: "top",
  height: 200,
  on: {
    onTimedKeyPress: function() {
      var txt = this.getValue();
      if (txt)
        csvDropsiteCtlr.processData(txt);
    }
  }
};

/*=====================================================================
CSV Drop Site Controller
=====================================================================*/
var csvDropsiteCtlr = {
  dropsite: null,

  init: function () {
    this.dropsite = $$("csvDropsite");
  },

  clear: function () {
    this.dropsite.setValue("");
    csvGridPanelCtlr.clear();
  },

  processData: function(data) {
    csvImportPanelCtlr.theDelimiter = "\t";
    csvImportPanelCtlr.setData(data);
  }
};

/*=====================================================================
CSV Drop Site Toolbar
=====================================================================*/
var csvDropsiteToolbar = {
  view: "toolbar",
  id: "csvDropsiteToolbar",
  height: 300,
  css: "bluestreets_toolbar",
  rows: [
    {
      view: "button",
      value: "Clear",
      width: 100,
      click: "csvDropsiteCtlr.clear();"
    }
  ]
};

/*====================================================================
 CSV Drop Site Toolbar Controller
=====================================================================*/
var csvDropsiteToolbarCtlr = {
  dropsite: null,

  init: function() {
    this.dropsite = $$("csvDropsite");
  }

};

/*====================================================================
 CSV Drop Site Panel
=====================================================================*/
var csvDropsitePanel = {
  rows: [csvDropsite, csvDropsiteToolbar]
};

/*=====================================================================
CSV Drop Site Panel Controller
=====================================================================*/
var csvDropsitePanelCtlr = {
  init: function() {
    csvDropsiteCtlr.init();
    csvDropsiteToolbarCtlr.init();
  }
};
