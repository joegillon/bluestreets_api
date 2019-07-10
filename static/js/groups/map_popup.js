/*=====================================================================
CSV Group Property Sheet
=====================================================================*/
const csvGrpPropSheet = {
  view: "property",
  id: "csvGrpPropSheet",
  width: 400,
  height: 400,
  nameWidth: 200,
  elements: []
};

const csvGrpPropSheetCtlr = {
  sheet: null,
  csvGroups: null,

  init: function() {
    this.sheet = $$("csvGrpPropSheet");
  },

  bstGrpOpts: function() {
    return DB.groups().map(g => ({id: g.id, value: g.name}));
  },

  load: function(csvGroups) {
    this.csvGroups = csvGroups;
    let bstGroups = this.bstGrpOpts();
    let elements = [];
    let matchOpts = {
      scorer: fuzzball.ratio, 
      processor: choice => choice.value,
      limit: 1
    };
    for (let csvGrp of csvGroups) {
      let bestMatch = fuzzball.extract(csvGrp, bstGroups, matchOpts)[0][0];
      let element = {
        type: "combo",
        id: csvGrp,
        label: csvGrp,
        value: bestMatch.id,
        options: bstGroups
      };
      elements.push(element);
    }
    this.sheet.define("elements", elements);
  },

  reloadOpts: function() {
    let bstGroups = this.bstGrpOpts();
    for (let element of this.sheet.config.elements) {
      element.collection.define("data", bstGroups);
    }
    this.sheet.refresh();
  }
};

/*=====================================================================
Group Form Toolbar
=====================================================================*/
const grpMapperFormToolbar = {
  view: "toolbar",
  id: "grpMapperFormToolbar",
  height: 35,
  cols: [
    {view: "label", label: "Create New Group"},
    {
      view: "button",
      id: "saveGroupBtn",
      type: "icon",
      icon: "database",
      label: "Save",
      autowidth: true,
      click: "grpMapperFormCtlr.save()"
    }
  ]
};

/*=====================================================================
Group Mapper Form
=====================================================================*/
const grpMapperForm = {
  view: "form",
  id: "grpMapperForm",
  elements: [
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

const grpMapperFormCtlr = {
  frm: null,

  init: function() {
    this.frm = $$("grpMapperForm");
  },

  clear: function() {
    this.frm.clear();
    this.frm.focus("name");
  },

  getValues: function() {
    if (!this.frm.validate()) {
      return null;
    }
    return this.frm.getValues();
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
  },

  save: function() {
    let values = this.frm.getValues();

    if (values === null)
      return;

    if (values.id == "" && !this.isUnique(values.name, values.code))
      return;

    if (values.hasOwnProperty('_id'))
      delete values._id;

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    let url = Flask.url_for("grp.add");

    ajaxDao.post(url, values, function(data) {
      values.id = data.grp_id;
      DB.groups.insert(values);
      csvGrpPropSheetCtlr.reloadOpts();
      webix.message("Group saved!");
    });
  }

};

/*=====================================================================
Group Mapper Form Panel
=====================================================================*/
const grpMapperFormPanel = {
  id: "grpMapperFormPanel",
  rows: [grpMapperFormToolbar, grpMapperForm]
};

/*=====================================================================
Group Mapper Panel
=====================================================================*/
const grpMapperPanel = {
  id: "grpMapperPanel",
  cols: [csvGrpPropSheet, grpMapperFormPanel]
};

const grpMapperPanelCtlr = {
  panel: null,

  init: function() {
    this.panel = $$("grpMapperPanel");
    csvGrpPropSheetCtlr.init();
    grpMapperFormCtlr.init();
  }
};

/*=====================================================================
Group Mapper Popup
=====================================================================*/
const grpMapperPopup = {
  view: "window",
  id: "grpMapperPopup",
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
        label: "Map Groups"
      },
      {
        view: "button",
        value: "Cancel",
        click: "$$('grpMapperPopup').hide();"
      },
      {
        view: "button",
        value: "OK",
        click: "grpMapperPopupCtlr.done();"
      }
    ]
  },
  body: {
    cols: [ grpMapperPanel ]
  }
};

const grpMapperPopupCtlr = {
  popup: null,
  callback: null,

  init: function() {
    this.popup = $$("grpMapperPopup");
    this.popup.hide();
    grpMapperPanelCtlr.init();
  },

  show: function(csvFlds, callback) {
    this.callback = callback;
    csvGrpPropSheetCtlr.load(csvFlds);
    this.popup.show();
  },

  done: function() {
    this.callback();
    this.popup.hide();
  }
};
