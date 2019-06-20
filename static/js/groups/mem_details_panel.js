/**
 * Created by Joe on 2/9/2019.
 */

/*=====================================================================
Membership Form Toolbar
=====================================================================*/
var memFormToolbar = {
  view: "toolbar",
  id: "memFormToolbar",
  height: 35,
  elements: [
    {view: "label", id: "memFormToolbarLbl", label: "Details"},
    {
      view: "button",
      "id": "saveMemberBtn",
      type: "icon",
      icon: "database",
      label: "Save",
      tooltip: "Save Membership",
      autowidth: true
    }
  ]
};

var memFormToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("memFormToolbar");
  },

  setLabel: function(name) {
    $$("memFormToolbarLbl").setValue(name);
  }

};

/*=====================================================================
Membership Form
=====================================================================*/
var memForm = {
  view: "form",
  id: "memForm",
  tooltip: true,
  width: 425,
  elements: [
    {
      cols: [
        {
          view: "combo",
          label: "Contacts",
          name: "name",
          width: 200
        },
        {
          view: "text",
          label: "Role",
          name: "role",
          width: 200
        }
      ]
    },
    {
      cols: [
        {
          view: "textarea",
          label: "Comment",
          name: "comment",
          width: 400,
          height: 100
        },
        {view: "text", name: "id", hidden: true},
        {view: "text", name: "group_id", hidden: true},
        {view: "text", name: "contact_id", hidden: true}
      ]
    }
  ],
  elementsConfig: {
    labelPosition: "top",
    attributes: {autocomplete: "new-password"}
  }
};

var memFormCtlr = {
  form: null,

  init: function() {
    this.form = $$("memForm");
    this.loadGroups();
  },

  clear: function() {
    this.form.clear();
  },

  enableContactSelect: function(on) {
     if (on)
       this.form.elements.name.enable();
     else
       this.form.elements.name.disable();
  },

  loadMembership: function() {
    var selection = memListCtlr.getSelectedItem();
    this.form.elements.group_id.setValue(selection.group_id);
    this.form.elements.role.setValue(selection.role);
    this.form.elements.comment.setValue(selection.comment);
  },

  getValues: function() {
    let vals = this.form.getValues();
    vals.group_id = grpListPanelCtlr.getSelectedGroupId();
    if (vals.contact_id == "") vals.contact_id = vals.name;
    delete vals.name;
    return vals;
  }
};
/*=====================================================================
Membership Details Panel
=====================================================================*/
var memDetailsPanel = {
  rows: [memFormToolbar, memForm]
};

var memDetailsPanelCtlr = {
  panel: null,
  toolbar: null,
  form: null,

  init: function() {
    this.panel = $$("memDetailsPanel");
    this.toolbar = $$("memFormToolbar");
    this.form = $$("memForm");
    memFormToolbarCtlr.init();
    memFormCtlr.init();
  },

  loadContacts: function(contacts) {
    let suggestions = contacts.map(c => ({id: c.id, value: c.name}));
    this.form.elements.name.define("suggest", suggestions);
    this.form.elements.name.refresh();
    memFormCtlr.enableContactSelect(true);
  }
};

