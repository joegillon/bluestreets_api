/*=====================================================================
CSV Jurisdiction Property Sheet
=====================================================================*/
const csvJurisPropSheet = {
  view: "property",
  id: "csvJurisPropSheet",
  width: 400,
  height: 400,
  nameWidth: 200,
  elements: []
};

const csvJurisPropSheetCtlr = {
  sheet: null,
  csvJurisdictions: null,

  init: function() {
    this.sheet = $$("csvJurisPropSheet");
  },

  bstJurisOpts: function() {
    return DB.jurisdictions().map(j => ({id: j.id, value: j.name}));
  },

  load: function(csvJurisdictions) {
    this.csvJurisdictions = csvJurisdictions;
    let bstJurisdictions = this.bstJurisOpts();
    let elements = [];
    let matchOpts = {
      scorer: fuzzball.ratio,
      processor: choice => choice.value,
      limit: 1
    };
    for (let csvJurisdiction of csvJurisdictions) {
      let bestMatch = fuzzball.extract(csvJurisdiction, bstJurisdictions, matchOpts)[0][0];
      let element = {
        type: "combo",
        id: csvJurisdiction,
        label: csvJurisdiction,
        value: bestMatch.id,
        options: bstJurisdictions
      };
      elements.push(element);
    }
    this.sheet.define("elements", elements);
  }
};

/*=====================================================================
Jurisdiction Mapper Panel
=====================================================================*/
const jurisMapperPanel = {
  id: "jurisMapperPanel",
  cols: [csvJurisPropSheet]
};

const jurisMapperPanelCtlr = {
  panel: null,

  init: function() {
    this.panel = $$("jurisMapperPanel");
    csvJurisPropSheetCtlr.init();
  }
};

/*=====================================================================
Jurisdiction Mapper Popup
=====================================================================*/
const jurisMapperPopup = {
  view: "window",
  id: "jurisMapperPopup",
  move: true,
  resize: true,
  top: 20,
  left: 20,
  autowidth: true,
  autoheight: true,
  position: "center",
  modal: true,
  head: {
    cols: [
      {
        view: "label",
        css: "popup_header",
        label: "Map Jurisdictions"
      },
      {
        view: "button",
        value: "Cancel",
        click: "$$('jurisMapperPopup').hide();"
      },
      {
        view: "button",
        value: "OK",
        click: "jurisMapperPopupCtlr.done();"
      }
    ]
  },
  body: {
    cols: [ jurisMapperPanel ]
  }
};

const jurisMapperPopupCtlr = {
  popup: null,
  callback: null,

  init: function() {
    this.popup = $$("jurisMapperPopup");
    this.popup.hide();
    jurisMapperPanelCtlr.init();
  },

  show: function(csvJurisdictions, callback) {
    this.callback = callback;
    csvJurisPropSheetCtlr.load(csvJurisdictions);
    this.popup.show();
  },

  done: function() {
    this.callback();
    this.popup.hide();
  }
};
