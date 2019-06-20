/**
 * Created by Joe on 2/9/2019.
 */

/*=====================================================================
Membership List Toolbar
=====================================================================*/
let memListToolbar = {
  view: "toolbar",
  id: "memListToolbar",
  height: 70,
  rows: [
    {
      cols: [
        {view: "label", label: "Members"},
        {
          view: "button",
          id: "dropMemberBtn",
          type: "icon",
          icon: "user-times",
          label: "Drop",
          autowidth: true
        },
        {
          view: "button",
          id: "addMemberBtn",
          type: "icon",
          icon: "user-plus",
          label: "Add",
          autowidth: true
        }
      ]
    },
    {
      view: "text",
      id: "memFilter",
      label: 'Filter',
      labelAlign: "right",
      width: 200,
      on: {
        onTimedKeyPress: function() {
          memListCtlr.filter(this.getValue().toLowerCase());
        }
      }
    }
  ]
};

let memListToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("memListToolbar")
  }

};

/*=====================================================================
Membership List
=====================================================================*/
let memList = {
  view: "list",
  id: "memList",
  height: 300,
  width: 300,
  select: true,
  template: "#contact_name#"
};

let memListCtlr = {
  list: null,
  filtrStr: "",
  filtrCtl: null,

  init: function() {
    this.list = $$("memList");
    this.filtrCtl = $$("memFilter");
  },

  clear: function() {
    this.list.clearAll();
    this.filtrCtl.setValue("");
  },

  filter: function(value) {
    this.list.filter(function(obj) {
      return obj.contact_name.toLowerCase().indexOf(value) == 0;
    })
  },

  load: function() {
    this.clear();
    let data = DB.groups({
      id: grpListPanelCtlr.getSelectedGroupId()
    }).first()["members"];
    if (typeof data === "undefined") return;
    this.list.parse(data);
    this.list.sort("contact_name")
  }

};

/*=====================================================================
Membership List Panel
=====================================================================*/
let memListPanel = {
  id: "memListPanel",
  rows: [memListToolbar, memList]
};

let memListPanelCtlr = {
  panel: null,

  init: function() {
    this.panel = $$("memListPanel");
    memListToolbarCtlr.init();
    memListCtlr.init();
  }
};
