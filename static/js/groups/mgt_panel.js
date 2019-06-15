/**
 * Created by Joe on 2/10/2019.
 */

/*=====================================================================
Group View Panel
=====================================================================*/
let grpViewPanel = {
  id: "grpViewPanel",
  cols: [grpListPanel, grpDetailsPanel],
  autowidth: true
};

let grpViewPanelCtlr = {
  panel: null,

  init: function() {
    this.panel = $$("grpViewPanel");
    grpListPanelCtlr.init();
    grpDetailsPanelCtlr.init();
    $$("grpDetailsForm").bind($$("grpList"));
  }
};

/*=====================================================================
Membership View Panel
=====================================================================*/
let memViewPanel = {
  id: "memViewPanel",
  cols: [memListPanel, memDetailsPanel],
  autowidth: true
};

let memViewPanelCtlr = {
  panel: null,

  init: function() {
    this.panel = $$("memViewPanel");
    memListPanelCtlr.init();
    memDetailsPanelCtlr.init();
    //$$("memForm").bind($$("memList"));
  }
};

/*=====================================================================
Group Management Panel
=====================================================================*/
let grpMgtPanel = {
  container: "content_container",
  rows: [
    {
      view: "segmented",
      id: "grpTabBar",
      value: "grpViewPanel",
      multiview: true,
      optionWidth: 80,
      align: "left",
      padding: 5,
      options: [
        {value: "Groups", id: "grpViewPanel"},
        {value: "Members", id: "memViewPanel"}
      ]
    },
    {height: 5},
    {
      cells: [grpViewPanel, memViewPanel],
      autowidth: true
    }
  ]
};

let grpMgtPanelCtlr = {
  panel: null,

  init: function() {
    this.panel = $$("grpMgtPanel");
    try {
      this.buildDB();
    } catch (ex) {
      webix.message({type: "error", text: ex});
      return;
    }

    this.buildUI();

    grpViewPanelCtlr.init();
    memViewPanelCtlr.init();

    $$("grpList").attachEvent("onAfterSelect", function(id) {
      memListCtlr.load(id);
      let group = DB.groups({id: id}).first();
      memFormToolbarCtlr.setLabel(group.name);
      memFormCtlr.enableContactSelect(false);
      memFormCtlr.clear();
    });

    $$("dropGroupBtn").attachEvent("onItemClick", function() {
      webix.confirm("Are you sure you want to drop this group?", "confirm-warning", function(yes) {
        if (yes) {
          let grp_id = grpListPanelCtlr.getSelectedGroupId();
          let url = Flask.url_for("grp.drop", {grp_id: grp_id});

          ajaxDao.get(url, function(data) {
            if (data.hasOwnProperty("error")) {
              webix.message({type: "error", text: data.error});
              return;
            }
            DB.groups({id: grp_id}).remove();
            grpListCtlr.load();
            grpDetailsFormCtlr.clear();
            webix.message("Group dropped!");
          });
        }
      });
    });

    $$("addGroupBtn").attachEvent("onItemClick", function() {
      grpDetailsFormCtlr.clear();
      memListCtlr.clear();
    });

    $$("saveGroupBtn").attachEvent("onItemClick", function() {
      let values = grpDetailsFormCtlr.getValues();

      if (values === null)
        return;

      if (values.id == "" && !grpDetailsFormCtlr.isUnique(values.name, values.code))
        return;

      if (values.hasOwnProperty('_id'))
        delete values._id;

      let op = (values.id == "") ? "grp.add" : "grp.update";

      //noinspection JSUnresolvedVariable,JSUnresolvedFunction
      let url = Flask.url_for(op);

      ajaxDao.post(url, values, function(data) {
        if (op == "grp.update") {
          DB.groups({id: values.id}).update(values);
        } else {
          values.id = data.grp_id;
          DB.groups.insert(values);
        }
        grpListCtlr.load();
        grpListCtlr.select(values.id);
        webix.message("Group saved!");
      });
    });

    $$("memList").attachEvent("onSelectChange", function() {
      memFormCtlr.enableContactSelect(false);
      let membership = $$("memList").getSelectedItem();
      $$("memForm").elements.contact_name.setValue(membership.contact_name);
      $$("memForm").elements.role.setValue(membership.role);
      $$("memForm").elements.comment.setValue(membership.comment);
      $$("memForm").elements.id.setValue(membership.id);
      $$("memForm").elements.group_id.setValue(membership.group_id);
      $$("memForm").elements.contact_id.setValue(membership.contact_id);
    });

    $$("dropMemberBtn").attachEvent("onItemClick", function(id) {
      webix.confirm("Are you sure you want to drop this membership?", "confirm-warning", function(yes) {
        if (yes) {
          let mem_id = parseInt($$("memList").getSelectedId());

          //noinspection JSUnresolvedVariable,JSUnresolvedFunction
          let url = Flask.url_for("mem.drop", {mem_id: mem_id});

          ajaxDao.get(url, function(data) {
            dropMembership(mem_id);
            memListCtlr.load(data["groups"]);
            memFormCtlr.clear();
            webix.message("Membership dropped!");
          });
        }
      });
    });

    $$("addMemberBtn").attachEvent("onItemClick", function() {
      let group_id = grpListPanelCtlr.getSelectedGroupId();
      memFormCtlr.clear();
      let nonmembers = getNonMembers(group_id);
      memDetailsPanelCtlr.loadContacts(nonmembers);
    });

    $$("saveMemberBtn").attachEvent("onItemClick", function() {
      let values = memFormCtlr.getValues();
      if (values !== null) {

        if (values.id == "") {
          grpMgtPanelCtlr.addMembership(values)
        } else {
          grpMgtPanelCtlr.updateMembership(values);
        }
      }
    });
  },

  buildDB: function() {
    //buildContactsCollection();
    buildGroupsCollections();
  },

  buildUI: function() {
    webix.ui(grpMgtPanel);
  },

  addMembership: function(values) {
    values.contact_id = values.contact_name;
    delete values.contact_name;
    values.group_id = grpListPanelCtlr.getSelectedGroupId();

    var url = Flask.url_for("mem.add");
    ajaxDao.post(url, values, function(data) {
      values.id = data.mem_id;
      addMembership(values);
      grpMgtPanelCtlr.reloadMembership(values);
      memListCtlr.load(values.group_id);
      webix.message("Member added!");

    })
  },

  updateMembership: function(values) {
    var url = Flask.url_for("mem.update");

    ajaxDao.post(url, values, function(data) {
      updateMembership(values);
      grpMgtPanelCtlr.reloadMembership(values);
      webix.message("Member updated!");
    });
  },

  reloadMembership: function(values) {
    memListCtlr.load(values.group_id);
//     $$("memList").select(values.id);
  }

};
