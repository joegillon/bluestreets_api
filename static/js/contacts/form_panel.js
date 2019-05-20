/* conFormPanel: conFormToolbar, conForm */

/*=====================================================================
Contact Form Toolbar
=====================================================================*/
var conFormToolbar = {
  view: "toolbar",
  id: "conFormToolbar",
  height: 35,
  elements: [
    {view: "label", label: "Details"},
    {
      view: "button",
      type: "icon",
      icon: "eraser",
      id: "conFormClearBtn",
      tooltip: "Clear Form",
      width: 25
    },
    {
      view: "button",
      type: "icon",
      icon: "envelope",
      width: 25,
      tooltip: "Email Contact",
      click: "conFormToolbarCtlr.email();"
    },
    {
      view: "button",
      type: "icon",
      icon: "address-card",
      width: 25,
      tooltip: "Change of Address",
      click: "conFormToolbarCtlr.coa();"
    },
    {
      view: "button",
      type: "icon",
      icon: "save",
      width: 25,
      tooltip: "Save Record",
      click: "conFormToolbarCtlr.submit();"
    },
    {
      view: "button",
      type: "icon",
      icon: "arrow-circle-left",
      width: 25,
      tooltip: "Back to Grid",
      click: function() {
        $$("gridView").show();
      }
    }
  ]
};

var conFormToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("conFormToolbar");
  },

  email: function() {
    webix.message("Not yet implemented");
//     var values = this.getValues();
//     if (values.id == "") {
//       this.clear();
//       return;
//     }
    // TODO: email contact
  },

  coa: function() {
    coaPopupCtlr.show();
  },

  groups: function() {
    var contact_id = conFormCtlr.getValues().id;
    if (contact_id)
      memPopupCtlr.show(conFormCtlr.getValues().id);
  },

  submit: function() {
    if (!conFormCtlr.validate()) return;
    var vals = conFormCtlr.getValues({hidden: true});

    if (db.contacts({id: {has: vals.id}}))
      vals.id = -1;
      
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("con.grid");

    ajaxDao.post(url, vals, function(data) {
      vals.id = data["contact_id"];
      $$("conForm").elements.id.setValue(vals.id);
      conGridCtlr.add(vals);
    });

    // TODO: check if address change -> precinct change

    //conFormCtlr.add(contact);
    // conFormCtlr.update(contact);
  }
};

/*=====================================================================
Contact Form
=====================================================================*/
var conForm = {
  view: "form",
  id: "conForm",
  tooltip: true,
  elements: [
    {
      cols: [
        {
          view: "text",
          hidden: true,
          name: "id"
        },
        {
          view: "text",
          type: "email",
          label: "Email",
          name: "email",
          width: 200,
          invalidMessage: "Invalid email address!",
          on: {
            onBlur: function() {
              conMatchPanelCtlr.emailMatch(this.getValue());
            }
          }
        },
        {
          view: "text",
          label: "Phone 1",
          name: "phone1",
          type: "tel",
          attributes: {pattern: "[0-9]{3}-[0-9]{3}-[0-9]{4}"},
          width: 130,
          invalidMessage: "Invalid phone 1!",
          on: {
            onTimedKeypress: function() {
              this.setValue(phoneMask(this.getValue()));
            },
            onBlur: function() {
              conMatchPanelCtlr.phoneMatch(phone_uglify(this.getValue()));
            }
          }
        },
        {
          view: "text",
          label: "Phone 2",
          name: "phone2",
          type: "tel",
          attributes: {pattern: "[0-9]{3}-[0-9]{3}-[0-9]{4}"},
          width: 130,
          invalidMessage: "Invalid phone 2!",
          on: {
            onTimedKeypress: function() {
              this.setValue(phoneMask(this.getValue()));
            },
            onBlur: function() {
              conMatchPanelCtlr.phoneMatch(phone_uglify(this.getValue()));
            }
          }
        }
      ]
    },
    {
      cols: [
        {
          view: "text",
          label: "Last",
          name: "last_name",
          required: true,
          invalidMessage: "Last name is required!",
          on: {
            onKeyPress: function(code) {
              return handleNameInput(code, this);
            },
            onBlur: function() {
              conMatchPanelCtlr.lastNameMatch(this.getValue());
            }
          }
        },
        {
          view: "text",
          label: "First",
          name: "first_name",
          width: 180,
          required: true,
          invalidMessage: "First name is required!",
          on: {
            onKeyPress: function(code) {
              return handleNameInput(code, this);
            }
          }
        }
      ]
    },
    {
      cols: [
        {
          view: "text",
          label: "Middle",
          name: "middle_name",
          width: 180,
          invalidMessage: "Invalid middle name characters!",
          on: {
            onKeyPress: function(code) {
              return handleNameInput(code, this);
            }
          }
        },
        {
          view: "text",
          label: "Suffix",
          name: "name_suffix",
          width: 60,
          on: {
            onTimedKeyPress: function() {
              this.setValue(this.getValue().toUpperCase());
            }
          }
        },
        {
          view: "text",
          label: "Nickname",
          name: "nickname",
          invalidMessage: "Invalid nickname characters!",
          on: {
            onKeyPress: function(code) {
              return handleNameInput(code, this);
            }
          }
        }
      ]
    },
    {
      cols: [
        {
          view: "text",
          label: "Address",
          name: "display_addr",
          width: 260,
          invalidMessage: "Address does not exist!",
          on: {
            onTimedKeyPress: function() {
              this.setValue(this.getValue().toUpperCase());
            }          }
        },
        {
          view: "select",
          label: "City",
          name: "city",
          width: 100,
          options: []
        },
        {
          view: "select",
          label: "Zip",
          name: "zipcode",
          width: 70,
          options: []
        },
        {
          view: "checkbox",
          label: "Keep",
          id: "chkKeep"
        }
      ]
    },
    {
      cols: [
        {
          view: "text",
          label: "Precinct",
          name: "display_pct",
          readonly: true
        }
      ]
    },
    {
      cols: [
        {
          view: "text",
          label: "Last Modified",
          name: "updated_at",
          readonly: true
        }
      ]
    }
  ],
  rules: {
    "contact_info.email": function(value, values, name) {
      return isEmail(values.email);
    },
    "contact_info.phone1": function(value, values, name) {
      return isPhone(values.phone1);
    },
    "contact_info.phone2": function(value, values, name) {
      return isPhone(values.phone2);
    },
    "address.display": function(value, values, name) {
      return value == "" || isValidAddress(
        values.display_addr,
        this.elements["city"].getValue(),
        this.elements["zipcode"].getValue()
      );
    }
  },
  elementsConfig: {
    labelPosition: "top",
    attributes: {autocomplete: "new-password"}
  }
};

var conFormCtlr = {
  frm: null,

  init: function() {
    this.frm = $$("conForm");
    this.frm.elements["city"].define("options", db.cities);
    this.frm.elements["city"].refresh();
    this.frm.elements["zipcode"].define("options", db.zipcodes);
    this.frm.elements["zipcode"].refresh();
  },

  // This func is called by the global event handler in the mgt panel
  clear: function() {
    this.frm.clear();
    this.frm.clearValidation();
    conMatchPanelCtlr.clear();
    this.locationReadOnly(false);
  },

  locationReadOnly: function(value) {
    var theForm = this.frm;
    ["display_addr", "city", "zipcode"].forEach(function(ctl) {
      if (value) {
        theForm.elements[ctl].disable();
      } else {
        theForm.elements[ctl].enable();
      }
      theForm.elements[ctl].refresh();
    });
  },

  loadVoter: function(voter) {
    var contact_id = this.frm.elements.id.getValue();
    if (contact_id != "") {
      voter.id = contact_id;
    }
    const contact = jsonCopy(voter);
    if ($$("chkKeep").getValue() == 1) {
      var addr = new Address(this.getValues());
      var street_matches = addr.getMatches(db.streets);
      if (street_matches.length != 1) {
        webix.message({type: "error", text: "Unable to resolve contact address to a precinct!"});
        return;
      }
      contact.city = street_matches[0].city;
      contact.street_prefix = street_matches[0].street_prefix;
      contact.street_name = street_matches[0].street_name;
      contact.street_type = street_matches[0].street_type;
      contact.street_suffix = street_matches[0].street_suffix;
      contact.display_addr = street_matches[0].display;
      contact.zipcode = street_matches[0].zipcode;
      if (contact.precinct_id != street_matches[0].precinct_id)
        contact.voter_id = contact.voter_id * -1;
      contact.precinct_id = street_matches[0].precinct_id;
      contact.display_pct = db.pcts({id: street_matches[0].precinct_id}).first().display;
    }

    this.frm.setValues(contact, true);
    this.locationReadOnly(true);


    // TODO: set name fields to readonly
  },

  loadStreet: function(street) {
    let curVals = this.getValues();
    let display_addr = curVals.house_number + " " + street.display;
    if (curVals.unit) display_addr += " UNIT " + curVals.unit;
    let vals = {
      display_addr: display_addr,
      street_prefix: street.street_prefix,
      street_name: street.street_name,
      street_type: street.street_type,
      street_suffix: street.street_suffix,
      unit: curVals.unit,
      street_side: street.street_side,
      street_metaphone: street.street_metaphone,
      city: street.city,
      zipcode: street.zipcode,
      precinct_id: street.precinct_id,
      display_pct: db.pcts({id: street.precinct_id}).first().display
    };
    this.frm.setValues(vals, true);
  },

  validate: function() {
    return this.frm.validate();
  },

  getValues: function() {
    var vals = this.frm.getValues();
    vals.phone1 = phone_uglify(vals.phone1);
    vals.phone2 = phone_uglify(vals.phone2);
    return vals;
  }

};

/*=====================================================================
Contact Form Panel
=====================================================================*/
var conFormPanel = {
  rows: [conFormToolbar, conForm]
};

var conFormPanelCtlr = {
  init: function() {
    conFormToolbarCtlr.init();
    conFormCtlr.init();
  }
};
