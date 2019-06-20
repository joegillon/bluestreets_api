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
      let group = DB.groups({id: parseInt(id)}).first();
      memFormToolbarCtlr.setLabel(group.name);
      memFormCtlr.enableContactSelect(false);
      memFormCtlr.clear();
    });

    $$("dropGroupBtn").attachEvent("onItemClick", function() {
      webix.confirm("Are you sure you want to drop this group?", "confirm-warning", function(yes) {
        if (yes) {
          let grp_id = grpListPanelCtlr.getSelectedGroupId();

          //noinspection JSUnresolvedVariable,JSUnresolvedFunction
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
      let frmElems = $$("memForm").elements;
      frmElems.name.setValue(membership["contact_name"]);
      frmElems.role.setValue(membership["role"]);
      frmElems.comment.setValue(membership["comment"]);
      frmElems.id.setValue(membership.id);
      frmElems.group_id.setValue(membership.group_id);
      frmElems.contact_id.setValue(membership.contact_id);
    });

    $$("dropMemberBtn").attachEvent("onItemClick", function(id) {
      webix.confirm("Are you sure you want to drop this membership?", "confirm-warning", function(yes) {
        if (yes) {
          let mem_id = parseInt($$("memList").getSelectedId());

          //noinspection JSUnresolvedVariable,JSUnresolvedFunction
          let url = Flask.url_for("grp.drop_member", {mem_id: mem_id});

          ajaxDao.get(url, function(data) {
            let grp = DB.groups({id: grpListPanelCtlr.getSelectedGroupId()}).first();
            grp.members = grp.members.filter(m => m.id != mem_id);

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
    DB.groups = TAFFY(GROUP_REX);
    DB.contact_names = TAFFY(CONTACT_REX);
  },

  buildUI: function() {
    webix.ui(grpMgtPanel);
  },

  addMembership: function(values) {

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("grp.add_member");
    ajaxDao.post(url, values, function(data) {
      values.id = data.mem_id;
      DB.groups({id: values.group_id}).first().members.push(
        {
          contact_id: values.contact_id,
          contact_name: DB.contact_names({id: values.contact_id}).first().name,
          comment: values.comment
        }
      );
      grpMgtPanelCtlr.reloadMembership(values);
      memListCtlr.load(values.group_id);
      webix.message("Member added!");

    })
  },

  updateMembership: function(values) {
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("grp.update_member");

    ajaxDao.post(url, values, function(data) {
      let membership = DB.groups({id: values.group_id}).first().members.filter(m => m.id == values.id)[0];
      membership.comment = values.comment;
      membership.role = values.role;
      grpMgtPanelCtlr.reloadMembership(values);
      webix.message("Member updated!");
    });
  },

  reloadMembership: function(values) {
    memListCtlr.load(values.group_id);
  }

};
