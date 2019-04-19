/**
 * Created by Joe on 12/17/2017.
 */

/*=====================================================================
CSV Fields Property Sheet Elements
=====================================================================*/
var voterElements = [
  {label: "Bluestreet <-- Spreadsheet", type: "label"},
  {
    type: "combo",
    id: "last_name",
    label: "Last Name",
    options: []
  },
  {
    type: "combo",
    id: "first_name",
    label: "First Name",
    options: []
  },
  {
    type: "combo",
    id: "middle_name",
    label: "Middle Name",
    options: []
  },
  {
    type: "combo",
    id: "name_suffix",
    label: "Name Suffix",
    options: []
  },
  {
    type: "combo",
    id: "address",
    label: "Address",
    options: []
  },
  {
    type: "combo",
    id: "city",
    label: "City",
    options: []
  },
  {
    type: "combo",
    id: "zipcode",
    label: "Zip",
    options: []
  }
];

var contactElements = voterElements.concat([
  {
    type: "combo",
    id: "email",
    label: "Email",
    options: []
  },
  {
    type: "combo",
    id: "phone1",
    label: "Phone 1",
    options: []
  },
  {
    type: "combo",
    id: "phone2",
    label: "Phone 2",
    options: []
  },
  {
    type: "combo",
    id: "groups",
    label: "Groups",
    options: []
  },
  {
    type: "combo",
    id: "jurisdiction",
    label: "Jurisdiction",
    options: []
  },
  {
    type: "combo",
    id: "ward",
    label: "Ward",
    options: []
  },
  {
    type: "combo",
    id: "precinct",
    label: "Precinct",
    options: []
  }
]);

/*=====================================================================
CSV Fields Property Sheet
=====================================================================*/
var csvFldsPropSheet = {
  view: "property",
  id: "csvFldsPropSheet",
  autowidth: true,
  height: 400,
  elements: voterElements
};

/*=====================================================================
CSV Fields Property Sheet Controller
=====================================================================*/
var csvFldsPropSheetCtlr = {
  sheet: null,
  csvFlds: null,
  myOptions: [],

  init: function() {
    this.sheet = $$("csvFldsPropSheet");
    if (isContacts) {
      this.sheet.define("elements", contactElements);
    }
  },

  clear: function() {

  },

  load: function(csvFlds) {
    this.csvFlds = csvFlds;
    var values = {};
    csvFlds.forEach(function(csvFld) {
      if (/^last/.test(csvFld.toLowerCase())) {
        values["last_name"] = csvFld;
      }
      else if (/^first/.test(csvFld.toLowerCase())) {
        values["first_name"] = csvFld;
      }
      else if (/^mid/.test(csvFld.toLowerCase())) {
        values["middle_name"] = csvFld;
      }
      else if (csvFld.toLowerCase().indexOf("suf") != -1) {
        values["name_suffix"] = csvFld;
      }
      else if (/^add/.test(csvFld.toLowerCase())) {
        values["address"] = csvFld;
      }
      else if (/^city/.test(csvFld.toLowerCase())) {
        values["city"] = csvFld;
      }
      else if (/^zip/.test(csvFld.toLowerCase())) {
        values["zipcode"] = csvFld;
      }
      else if (/^email/.test(csvFld.toLowerCase())) {
        values["email"] = csvFld; // If voter flds nothing happens
      }
      else if (csvFld.replace(/ /g, "").toLowerCase() == "phone1") {
        values["phone1"] = csvFld; // If voter flds nothing happens
      }
      else if (csvFld.replace(/ /g, "").toLowerCase() == "phone2") {
        values["phone2"] = csvFld; // If voter flds nothing happens
      }
      else if (/^group/.test(csvFld.toLowerCase())) {
        values["groups"] = csvFld;
      }
      else if (/^jurisdiction/.test(csvFld.toLowerCase())) {
        values["jurisdiction"] = csvFld;
      }
      else if (/^ward/.test(csvFld.toLowerCase())) {
        values["ward"] = csvFld;
      }
      else if (/^precinct/.test(csvFld.toLowerCase())) {
        values["precinct"] = csvFld;
      }
    });

    this.sheet.setValues(values);

    this.sheet.config.elements.forEach(function(element) {
      if (element.type == "combo") {
        element.options = csvFlds;
      }
    });
  },

  save: function() {
    var mapping = {};
    var props = this.sheet.getValues();
    for (var p in props) {
      if (props[p]) {
        mapping[p] = "data" + this.csvFlds.indexOf(props[p]).toString();
      }
    }
    csvImportPanelCtlr.loadData(mapping);
    csvFldsPopupCtlr.hide();
  }

};

/*=====================================================================
CSV Fields Panel
=====================================================================*/
var csvFldsPanel = {
  rows: [csvFldsPropSheet]
};

/*=====================================================================
CSV Fields Panel Controller
=====================================================================*/
var csvFldsPanelCtlr = {
  init: function() {
    csvFldsPropSheetCtlr.init();
  }
};

/*=====================================================================
CSV Fields Popup
=====================================================================*/
var csvFldsPopup = {
  view: "window",
  id: "csvFldsPopup",
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
        label: "Assign Fields"
      },
      {
        view: "button",
        value: "Cancel",
        click: "$$('csvFldsPopup').hide();"
      },
      {
        view: "button",
        value: "OK",
        click: "csvFldsPropSheetCtlr.save();"
      }
    ]
  },
  body: {
    cols: [ csvFldsPanel ]
  }
};

/*=====================================================================
CSV Fields Popup Controller
=====================================================================*/
var csvFldsPopupCtlr = {
  popup: null,

  init: function() {
    this.popup = $$("csvFldsPopup");
    this.popup.hide();
    csvFldsPanelCtlr.init();
  },

  show: function(csvFlds) {
    csvFldsPropSheetCtlr.load(csvFlds);
    this.popup.show();
  },

  hide: function() {
    this.popup.hide();
  }
};
