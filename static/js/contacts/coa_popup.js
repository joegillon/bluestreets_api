/**
 * Created by Joe on 12/25/2018.
 */

/*=====================================================================
Change of Address Form
=====================================================================*/
var coaForm = {
  view: "form",
  id: "coaForm",
  width: 550,
  elements: [
    {
      rows: [
        {
          cols: [
            {
              view: "text",
              name: "zipcode",
              label: "Zipcode",
              //width: 200,
              suggest: [],
              on: {
                onChange: function(value) {
                  if (value.length == 5)
                    coaFormCtlr.setCity(value);
                }
              }
            },
            {
              view: "text",
              name: "city",
              label: "City",
              //width: 300,
              suggest: []
//               on: {
//                 onBlur: function() {
//                   coaFormCtlr.setStreets(this.getValue());
//                 }
//               }
            }
          ]
        },
        {
          view: "text",
          name: "street",
          label: "Street",
          suggest: []
        },
        {
          cols: [
            {
              view: "text",
              name: "house_number",
              label: "House #"
            },
            {
              view: "text",
              name: "unit",
              label: "Unit",
              on: {
                onBlur: function() {
                  coaFormCtlr.process();
                }
              }
            }
          ]
        },
        {
          view: "text",
          name: "address",
          label: "Address",
          readonly: true
        },
        {
          view: "text",
          name: "precinct",
          label: "Precinct",
          readonly: true
        },
        {
          view: "text",
          name: "precinct_id",
          hidden: "true"
        }
      ]
    }
  ],
  elementsConfig: {
    labelPosition: "top",
    attributes: {autocomplete: "new-password"}
  }

};

var coaFormCtlr = {
  frm: null,

  init: function() {
    this.frm = $$("coaForm");
    this.frm.elements["zipcode"].define("suggest", DB.zipcodes);
    this.frm.elements["city"].define("suggest", DB.cities);
  },

  clear: function() {
    var theForm = this.frm;
    ["zipcode", "city", "street"].forEach(function(ctl) {
      theForm.elements[ctl].define("suggest", []);
    });
    theForm.clear();
  },
  
  set_focus: function(ctl) {
    this.frm.focus(ctl);
  },

  setCity: function(zipcode) {
    if (zipcode == "") return;
    let city = DB.streets({zipcode: zipcode}).first().city;
    this.frm.elements.city.setValue(city);
    this.setStreets(zipcode);
    this.set_focus("street");
  },

  setStreets: function(value) {
    if (value == "") return;
    let streetNames = [];
    if (isDigit(value[0])) {
      streetNames = DB.streets({zipcode: value}).distinct("display").sort();
    } else {
      streetNames = DB.streets({city: value}).distinct("display").sort();
    }
    this.frm.elements.street.define("suggest", streetNames);
    this.frm.elements.street.refresh();
    this.set_focus("street");
  },

  process: function() {
    let vals = this.frm.getValues();
    let addr = vals["house_number"] + " " + vals["street"];
    if (vals.unit != "") addr += ", UNIT " + vals.unit;
    this.frm.elements.address.setValue(addr);

    let house_number = parseInt(vals.house_number);
    let odd_even = (house_number % 2 == 0) ? "E": "O";
    odd_even = "[B," + odd_even + "]";
    let street = DB.streets({
      zipcode: vals.zipcode,
      display: vals.street,
      house_num_low: {lte: house_number},
      house_num_high: {gte: house_number},
      street_side: {regex: new RegExp(odd_even)}
    }).first();
    if (street)
    {
      this.frm.elements.precinct.setValue(street.display_pct);
      this.frm.elements.precinct_id.setValue(street.precinct_id);
    } else {
      this.frm.elements.precinct.setValue("Invalid address!");
    }
  },

  getValues: function() {
    return this.frm.getValues();
  }
};

/*=====================================================================
Change of Address Popup
=====================================================================*/
var coaPopup = {
  view: "window",
  id: "coaPopup",
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
        label: "Change of Address"
      },
      {
        view: "button",
        value: "Cancel",
        click: "coaPopupCtlr.hide();"
      },
      {
        view: "button",
        value: "Submit",
        click: "coaPopupCtlr.submit();"
      }
    ]
  },
  body: {
    cols: [coaForm]
  }
};

var coaPopupCtlr = {
  popup: null,

  init: function() {
    this.popup = $$("coaPopup");
    coaFormCtlr.init();
  },

  show: function() {
//     coaFormCtlr.init();
    this.popup.show();
    coaFormCtlr.set_focus("zipcode");
  },

  hide: function() {
    coaFormCtlr.clear();
    this.popup.hide();
  },

  submit: function() {
    var values = coaFormCtlr.getValues();
    var currentItem = conDupsGridCtlr.getSelectedItem();
    currentItem.address = values.address;
    currentItem.zipcode = values.zipcode;
    currentItem.precinct_id = values.precinct_id;
    currentItem.pct_name = values.precinct;
    conDupsGridCtlr.updateSelectedItem(currentItem);
    this.hide();
  }
};
