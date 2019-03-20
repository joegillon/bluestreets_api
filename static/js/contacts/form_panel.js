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
      icon: "users",
      width: 25,
      tooltip: "Manage Groups",
      click: "conFormToolbarCtlr.groups();"
    },
    {
      view: "button",
      type: "icon",
      icon: "tags",
      width: 25,
      tooltip: "Tag Contact",
      click: "conFormToolbarCtlr.tags();"
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
    var values = this.getValues();
    if (values.id == "") {
      this.clear();
      return;
    }
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

    if (contactsCollection.findOne({id: vals.id}) === undefined)
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
  complexData: true,
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
          label: "Email",
          name: "contact_info.email",
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
          name: "contact_info.phone1",
          attributes: [
            {type: "tel"},
            {pattern: "[0-9]{3}-[0-9]{3}-[0-9]{4}"}
          ],
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
          name: "contact_info.phone2",
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
          name: "name.last",
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
          name: "name.first",
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
          name: "name.middle",
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
          name: "name.suffix",
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
          name: "name.nickname",
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
          name: "address.whole_addr",
          width: 300,
          invalidMessage: "Address does not exist!",
          on: {
            onTimedKeyPress: function() {
              this.setValue(this.getValue().toUpperCase());
            }          }
        },
        {
          view: "select",
          label: "City",
          name: "address.city",
          width: 100,
          options: []
        },
        {
          view: "select",
          label: "Zip",
          name: "address.zipcode",
          width: 70,
          options: []
        }
      ]
    },
    {
      cols: [
        {
          view: "text",
          label: "Precinct",
          name: "voter_info.precinct_name",
          readonly: true
        }
      ]
    },
    {
      cols: [
        {
          rows: [
            {
              view: "label",
              label: "Groups"
            },
            {
              view: "list",
              id: "groupList",
              template: "#group_name#",
              tooltip: {
                template: "#role#"
              },
              readonly: true,
              height: 100
            }
          ]
        },
        {
          rows: [
            {
              view: "label",
              label: "Tags"
            },
            {
              view: "list",
              label: "Tags",
              name: "tags",
              readonly: true,
              height: 100
            }
          ]
        }
      ]
    }
  ],
  rules: {
    "contact_info.email": function(value, values, name) {
      return isEmail(values.contact_info.email);
    },
    "contact_info.phone1": function(value, values, name) {
      return isPhone(values.contact_info.phone1);
    },
    "contact_info.phone2": function(value, values, name) {
      return isPhone(values.contact_info.phone2);
    },
    "address.whole_addr": function(value, values, name) {
      return value == "" || isValidAddress(
        values.address.whole_addr,
        this.elements["address.city"].getValue(),
        this.elements["address.zipcode"].getValue()
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
    this.frm.elements["address.city"].define("options", cityOptions);
    this.frm.elements["address.city"].refresh();
    this.frm.elements["address.zipcode"].define("options", zipcodeOptions);
    this.frm.elements["address.zipcode"].refresh();
  },

  // This func is called by the global event handler in the mgt panel
  clear: function() {
    $$("groupList").clearAll();
    this.frm.clear();
    this.frm.clearValidation();
    conMatchPanelCtlr.clear();
    this.locationReadOnly(false);
  },

  locationReadOnly: function(value) {
    var theForm = this.frm;
    ["address.whole_addr", "address.city", "address.zipcode"].forEach(function(ctl) {
      if (value) {
        theForm.elements[ctl].disable();
      } else {
        theForm.elements[ctl].enable();
      }
      theForm.elements[ctl].refresh();
    });
  },

  loadMemberships: function(contactId) {
    $$("groupList").clearAll();
    $$("groupList").parse(
      membershipsCollection.find({contact_id: contactId})
    )
  },

  loadContact: function(contactId) {
    this.loadMemberships(contactId);
    var contact = contactsCollection.findOne({id: contactId});
    this.frm.setValues(contact, true);
    this.locationReadOnly(true);
    conMatchGridCtlr.config("C");
  },

  loadVoter: function(voter) {
    var contact_id = this.frm.elements.id.getValue();
    if (contact_id != "") {
      voter.id = contact_id;
    }
    this.frm.setValues(voter, true);
    this.locationReadOnly(true);

    // TODO: set name fields to readonly
  },

  loadStreet: function(street) {
    var vals = {
      address: {
        whole_addr: rebuildAddress(
          this.frm.elements["address.whole_addr"].getValue(),
          street.display_name
        ),
        city: street.city,
        zipcode: street.zipcode
      },
      voter_info: {
        precinct_id: street.precinct_id,
        precinct_name: street.pct_name
      }
    };
    this.frm.setValues(vals, true);
  },

  validate: function() {
    return this.frm.validate();
  },

  getValues: function() {
    var vals = this.frm.getValues();
    vals.contact_info.phone1 = phone_uglify(vals.contact_info.phone1);
    vals.contact_info.phone2 = phone_uglify(vals.contact_info.phone2);
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
