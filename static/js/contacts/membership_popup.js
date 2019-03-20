/**
 * Created by Joe on 2/3/2019.
 */
/* memList, memToolbar, memForm */

/*=====================================================================
Membership List Toolbar
=====================================================================*/
var memListToolbar = {
  view: "toolbar",
  id: "memListToolbar",
  height: 35,
  elements: [
    {
      view: "label",
      label: "Memberships"
    },
    {
      view: "button",
      type: "icon",
      icon: "user-times",
      tooltip: "Drop Membership",
      width: 25,
      click: "memFormToolbarCtlr.drop();"
    },
    {
      view: "button",
      type: "icon",
      icon: "user-plus",
      tooltip: "Add Membership",
      width: 25,
      click: "memFormToolbarCtlr.add();"
    }
  ]
};

/*=====================================================================
Membership List
=====================================================================*/
var memList = {
  rows: [
    {
      view: "list",
      id: "memList",
      template: "#group_name#",
      readonly: true,
      select: true,
      width: 200,
      height: 300,
      on: {
        onSelectChange: function() {
          memFormCtlr.loadMembership();
        }
      }
    }
  ]
};

var memListCtlr = {
  list: null,

  init: function() {
    this.list = $$("memList");
  },

  clear: function() {
    this.list.clearAll();
  },

  load: function(data) {
    this.clear();
    this.list.parse(data);
    this.list.refresh();
  },

  getSelectedItem: function() {
    return this.list.getSelectedItem();
  },

  add: function(membership) {
    membership.group_name = groupsCollection.findOne({id: membership.group_id}).name;
    membershipsCollection.insert(membership);
    this.load(membershipsCollection.find({contact_id: memPopupCtlr.contact_id}));
  },

  update: function(membership) {
    membershipsCollection.update(membership, {id: membership.id});
    this.load(membershipsCollection.find({contact_id: memPopupCtlr.contact_id}));
  },

  drop: function(membership_id) {
    membershipsCollection.remove({id: membership_id});
    this.load(membershipsCollection.find({contact_id: memPopupCtlr.contact_id}));
  },

  getMembershipId: function(group_id) {
    var items = Object.values(this.list.data.pull).filter(function(item) {
      return item.group_id == group_id;
    });
    if (items.length == 0) return null;
    return items[0].id;
  }
};

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

/*=====================================================================
Membership Panel
=====================================================================*/
var memPanel = {
  id: "memPanel",
  type: "space",
  autowidth: true,
  cols: [
    {
      rows: [memListToolbar, memList]
    },
    {
      rows: [memFormToolbar, memForm]
    }
  ]
};

var memPanelCtlr = {
  panel: null,

  init: function() {
    this.panel = $$("memPanel");
    memListCtlr.init();
    memFormToolbarCtlr.init();
    memFormCtlr.init();
  },

  clear: function() {
    memListCtlr.clear();
    memFormCtlr.clear();
  }
};

/*=====================================================================
Membership Popup
=====================================================================*/
var memPopup = {
  view: "window",
  id: "memPopup",
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
        label: "Memberships"
      },
      {
        view: "button",
        type: "icon",
        icon: "times-circle",
        width: 25,
        click: "memPopupCtlr.hide();"
      }
    ]
  },
  body: {
    cols: [memPanel]
  }
};

var memPopupCtlr = {
  popup: null,
  contact_id: null,

  init: function() {
    this.popup = $$("memPopup");
    memPanelCtlr.init();
  },

  show: function(contact_id) {
    this.contact_id = contact_id;
    memListCtlr.load(membershipsCollection.find({contact_id: contact_id}));
    this.popup.show();
  },

  hide: function() {
    conFormCtlr.loadMemberships(this.contact_id);
    memPanelCtlr.clear();
    this.popup.hide();
  },

  submit: function() {
    var values = memFormCtlr.getValues();
  }
};


