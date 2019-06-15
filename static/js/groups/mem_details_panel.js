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
      tooltip: "Save Membership",
      width: 25
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
  },

  drop: function() {
    var item = memListCtlr.getSelectedItem();
    if (item === undefined) return;

    webix.confirm(
      "Are you sure you want to drop this membership?",
      "confirm-warning",
      function(yes) {
        if (yes) {
          var mem_id = item.id;
          var url = Flask.url_for("mem.drop", {mem_id: mem_id});
          ajaxDao.get(url, function(data) {
            memListCtlr.drop(mem_id);
            memFormCtlr.clear();
            webix.message("Membership Dropped!");
          })
        }
      }
    );

  },

  save: function() {
    var vals = memFormCtlr.getValues();
    vals.contact_id = memPopupCtlr.contact_id;

    // The select's value is a string - happened at
    // loadMembership setValue
    vals.group_id = parseInt(vals.group_id);

    vals.id = memListCtlr.getMembershipId(vals.group_id);

    var url = Flask.url_for("mem.save");
    ajaxDao.post(url, vals, function(data) {
      if (vals.id === null) {
        vals.id = data["mem_id"];
        memListCtlr.add(vals);
        webix.message("Membership Added!");
      } else {
        memListCtlr.update(vals);
        webix.message("Membership Updated!");
      }
    });
  }

  //quit: function() {
  //  memPopupCtlr.hide();
  //}
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
          name: "contact_name",
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
    //this.loadGroups();
  },

  enableContactSelect: function(on) {
    if (on)
      this.form.elements.contact_name.enable();
    else
      this.form.elements.contact_name.disable();
  },

  loadGroups: function() {
//     var groups = groupsCollection.find({}, {$orderBy: {name: 1}});
//     var options = groups.map(function(group) {
//       return {id: group.id, value: group.name}
//     });
//     this.form.elements["group_id"].define("options", options);
//     this.form.elements["group_id"].refresh();
  },

  loadMembership: function() {
    var selection = memListCtlr.getSelectedItem();
    this.form.elements.group_id.setValue(selection.group_id);
    this.form.elements.role.setValue(selection.role);
    this.form.elements.comment.setValue(selection.comment);
  },

  getValues: function() {
    return this.form.getValues();
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
    this.form.elements.contact_name.define("suggest", contacts);
    this.form.elements.contact_name.refresh();
    memFormCtlr.enableContactSelect(true);
  }
};

