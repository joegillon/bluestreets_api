/**
* Created by Joe on 6/10/2017.
*/

var skins = [
  "Aircompact", "Antique", "Brownie", "Clouds", "Compact", "Dusty",
  "Eggplant", "Flamingo", "Flat", "Forest", "Light", "Mauve", "Metro", "Monkey",
  "Pinko", "QED", "Saints", "Sandy", "Tan", "Tangerine"
];

var menu_data = [
  {
    id: "login",
    icon: "sign-in",
    value: "Log in"
  },
  {
    id: "voter_lists",
    icon: "users",
    value: "Voters",
    submenu: [
      {id: "worksheet", value: "Worksheet"},
      {id: "voter_import", value: "Import Spreadsheet"}
    ]
  },
  {
    id: "contacts",
    icon: "address-card-o",
    value: "Contacts",
    submenu: [
      {id: "con_import", value: "Import Spreadsheet"},
      {id: "con_entry", value: "Direct Entry"},
      {id: "con_export", value: "Export List"},
      {id: "con_crewboard", value: "Battle Stations"}
    ]
  },
  {
    id: "groups",
    icon: "sitemap",
    value: "Groups"
  },
  {
    id: "cleaning",
    icon: "database",
    value: "Data Cleaning",
    submenu: [
      {id: "con_email_dups", value: "Email Duplicates"},
      {id: "con_phone_dups", value: "Phone Duplicates"},
      {id: "con_name_addr_dups", value: "Name + Address Duplicates"},
      {id: "con_name_dups", value: "Name Duplicates"},
      {id: "synchronize", value: "Sync with Voters"}
    ]
  },
  {
    id: "usermgt",
    icon: "key",
    value: "Users",
    submenu: [
      {id: "request_account", value: "Request Account"},
      {id: "change_pw", value: "Change Password"},
      {id: "user_mgt", value: "Manage Accounts"}
    ]
  },
  {
    id: "skins",
    icon: "",
    value: "Skins",
    submenu: skins
  }
];

var mainMenu = {
  view: "menu",
  id: "mainMenu",
  data: menu_data,
  type: {
    subsign: true,
    height: 50
  },
  on: {
    onMenuItemClick: function(id) {
      if (id == "login") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for('usr.login');
        return;
      }
      if (id == "user_mgt") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for('usr.user_mgt');
        return;
      }
      if (id == "change") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for('usr.change_pw');
        return;
      }
      if (id == "voter_import") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for('vtr.csv_import');
        return;
      }
      if (id == "worksheet") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for('vtr.worksheet');
        return;
      }
      if (id == "contacts") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for('con.grid');
        return;
      }
      if (id == "con_import") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("con.csv_import");
        return;
      }
      if (id == "con_entry") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("con.entry");
        return;
      }
      if (id == "con_export") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("con.csv_export");
        return;
      }
      if (id == "con_crewboard") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("con.crewboard");
        return;
      }
      if (id == "con_email_dups") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("con.email_duplicates");
        return;
      }
      if (id == "con_phone_dups") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("con.phone_duplicates");
        return;
      }
      if (id == "con_name_addr_dups") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("con.name_addr_duplicates");
        return;
      }
      if (id == "con_name_dups") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("con.name_duplicates");
        return;
      }
      if (id == "synchronize") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("con.synchronize");
        return;
      }
      if (id == "groups") {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        window.location.href = Flask.url_for("grp.groups");
        return;
      }
      if (skins.indexOf(id) != -1) {
        switch_skin(id);
        return false;
      }
      webix.message("Not yet implemented");
    }
  }
};
