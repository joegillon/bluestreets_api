/**
 * Created by Joe on 2/11/2019.
 */

/*=====================================================================
Membership Form Toolbar
=====================================================================*/
var memFormToolbar = {
  view: "toolbar",
  id: "memFormToolbar",
  height: 35,
  elements: [
    {view: "label", label: "Details"},
    {
      view: "button",
      type: "icon",
      icon: "database",
      tooltip: "Save Membership",
      width: 25,
      click: "memFormToolbarCtlr.save();"
    }
  ]
};

var memFormToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("memFormToolbar");
  },

  add: function() {
    memFormCtlr.clear();
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
  },

  quit: function() {
    memPopupCtlr.hide();
  }
};

/*=====================================================================
Membership Form
=====================================================================*/
var memForm = {
  view: "form",
  id: "memForm",
  tooltip: true,
  width: 600,
  elements: [
    {
      cols: [
        {
          view: "select",
          label: "Group",
          name: "group_id",
          width: 200,
          options: []
        },
        {
          view: "text",
          label: "Role",
          name: "role",
          width: 200,
          options: []
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
        }
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
    this.loadGroups();
  },

  loadGroups: function() {
    var groups = groupsCollection.find({}, {$orderBy: {name: 1}});
    var options = groups.map(function(group) {
      return {id: group.id, value: group.name}
    });
    this.form.elements["group_id"].define("options", options);
    this.form.elements["group_id"].refresh();
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
