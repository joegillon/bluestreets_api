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
              suggest: [],
              on: {
                onBlur: function() {
                  coaFormCtlr.setStreets(this.getValue());
                }
              }
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
              label: "House #",
              on: {
                onBlur: function() {
                  coaFormCtlr.process();
                }
              }
            },
            {
              view: "text",
              name: "unit",
              label: "Unit"
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
    this.frm.elements["zipcode"].define("suggest", zipcodeOptions);
    this.frm.elements["city"].define("suggest", cityOptions);
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
    var city = streetsCollection.findOne(
      {zipcode: zipcode}
    ).city;
    this.frm.elements.city.setValue(city);
    this.setStreets(zipcode);
    this.set_focus("street");
  },

  setStreets: function(value) {
    if (value == "") return;
    var cond = {zipcode: value};
    if (!isDigit(value[0])) {
      cond = {city: value};
    }
    var rex = streetsCollection.find(cond);
    rex = rex.map(function(rec) {
      return rec.display_name;
    });
    var s = new Set(rex);
    var streets = Array.from(s).sort();;
    this.frm.elements.street.define("suggest", streets);
    this.frm.elements.street.refresh();
    this.set_focus("street");
  },

  process: function() {
    var vals = this.frm.getValues();
    var addr = vals["house_number"] + " " + vals["street"] + ", " +
        vals["city"] + " " + vals.zipcode;
    this.frm.elements.address.setValue(addr);

    var house_number = parseInt(vals.house_number);
    var odd_even = (house_number % 2 == 0) ? "E": "O";
    var p = streetsCollection.findOne({
      zipcode: vals.zipcode,
      display_name: vals.street,
      house_num_low: {'$lte': house_number},
      house_num_high: {'$gte': house_number},
      odd_even: {'$in': ["B", odd_even]}
    });
    if (p)
    {
      this.frm.elements.precinct.setValue(p.pct_name);
      this.frm.elements.precinct_id.setValue(p.precinct_id);
    } else {
      this.frm.elements.precinct.setValue("Invalid address!");
    }
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
  }
};
