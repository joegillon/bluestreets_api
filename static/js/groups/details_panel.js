/**
 * Created by Joe on 2/9/2019.
 */

/*=====================================================================
Group Details Toolbar
=====================================================================*/
let grpDetailsToolbar = {
  view: "toolbar",
  id: "grpDetailsToolbar",
  height: 35,
  cols: [
    {view: "label", label: "Details"},
    {
      view: "button",
      id: "saveGroupBtn",
      type: "icon",
      icon: "database",
      label: "Save",
      autowidth: true
    }
  ]
};

/*=====================================================================
Group Details Form
=====================================================================*/
let grpDetailsForm = {
  view: "form",
  id: "grpDetailsForm",
  elements: [
    {view: "text", name: "id", hidden: true},
    {
      view: "text",
      label: "Name",
      labelAlign: "right",
      name: "name",
      width: 300,
      required: true,
      invalidMessage: "Group name is required!"
    },
    {
      view: "text",
      label: "Code",
      labelAlign: "right",
      name: "code",
      width: 300,
      required: true,
      invalidMessage: "Code code is required!",
      on: {
        onTimedKeyPress: function() {
          this.setValue(this.getValue().toUpperCase());
        }
      }
    },
    {
      view: "textarea",
      label: "Description",
      labelAlign: "right",
      name: "description",
      width: 300,
      height: 100
    }
  ],
  rules: {
    "name": webix.rules.isNotEmpty,
    "code": webix.rules.isNotEmpty
  }
};

let grpDetailsFormCtlr = {
  frm: null,

  init: function() {
    this.frm = $$("grpDetailsForm");
  },

  clear: function() {
    this.frm.clear();
    this.frm.focus("name");
  },

  getValues: function() {
    if (!this.frm.validate()) {
      return null;
    }
    return this.frm.getValues({hidden: true});
  },

  isUnique: function(name, code) {
    let match = DB.groups({name: name}).first();
    if (match) {
      webix.message({type: "error", text: "Group named " + name + " already exists!"});
      return false;
    }

    match = DB.groups({code: code}).first();
    if (match) {
      webix.message({type: "error", text: "Group code " + code + " already exists!"});
      return false;
    }

    return true;
  }

};

/*=====================================================================
Group Details Panel
=====================================================================*/
let grpDetailsPanel = {
  id: "grpDetailsPanel",
  rows: [grpDetailsToolbar, grpDetailsForm]
};

let grpDetailsPanelCtlr = {
  panel: null,
  toolbar: null,
  form: null,

  init: function() {
    this.panel = $$("grpDetailsPanel");
    this.toolbar = $$("grpDetailsToolbar");
    this.form = $$("grpDetailsForm");
    grpDetailsFormCtlr.init();
  }
};

