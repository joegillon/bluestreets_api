/**
 * Created by Joe on 6/15/2017.
 */

/*=====================================================================
Duplicates Grid
=====================================================================*/
var conDupsGrid = {
  view: "datatable",
  id: "conDupsGrid",
  editable: true,
  editaction: "dblclick",
  multiselect: true,
  select: true,
  height: 200,
  autoWidth: true,
  resizeColumn: true,
  drag: true,
  columns: [
    {id: "id", header: "ID", adjust: true, readonly: true},
    {id: "name", header: "Name", adjust: "data", sort: "string"},
    {id: "address", header: "Address", adjust: true, sort: "string"},
    {id: "zipcode", header: "Zip", sort: "string", width: 50},
    {id: "email", header: "Email", adjust: "data", sort: "string", editor: "text"},
    {id: "phone1", header: "Phone 1", sort: "string", editor: "text"},
    {id: "phone2", header: "Phone 2", sort: "string", editor: "text"},
    {id: "birth_year", header: "BYr", editor: "text", sort: "string", width: 50},
    {id: "gender", header: "Sex", adjust: "header", editor: "upperCaseEditor", sort: "string", width: 50},
    {id: "voter_id", header: "Voter ID", adjust: "data", readonly: true, sort: "string"},
    {id: "pct_name", header: "Pct", adjust: "data", readonly: true, sort: "string"}
  ]
};

/*=====================================================================
Duplicates Grid Controller
=====================================================================*/
var conDupsGridCtlr = {
  grid: null,
  sourceColumn: null,
  sourceValue: "",

  init: function() {
    this.grid = $$("conDupsGrid");
    this.keyIdx = -1;

    this.grid.attachEvent("onBeforeDrag", function(context, ev) {
      var sourceInfo = this.locate(ev);

      this.sourceValue = this.getText(sourceInfo.row, sourceInfo.column);
      if (isEmpty(this.sourceValue)) {
        webix.message({type: "error", text: "Can't drag empty field!"});
        return false;
      }

      if (conDupsGridCtlr.isVoterRec(sourceInfo.row)) {
        webix.message({type: "error", text: "Can't drag from voter record!"});
        return false;
      }

      if (isIn(sourceInfo.column, ['id', 'voter_id', 'precinct_id'])) {
        var hdrText = this.getColumnConfig(sourceInfo.column).header[0].text;
        webix.message({type: "error", text: "Can't drag " + hdrText + "!"});
        return false;
      }

      this.sourceColumn = sourceInfo.column;

      context.html = "<div style='padding: 8px;'>" + this.sourceValue + "<br></div>";
    });

    this.grid.attachEvent("onBeforeDrop", function(context, ev) {
      var targetInfo = this.locate(ev);

      if (conDupsGridCtlr.isCrossColumns(this.sourceColumn, targetInfo.column)) {
        webix.message({type: "error", text: "Can't drag across columns!"});
        return false;
      }

      var isVoterRec = conDupsGridCtlr.isVoterRec(targetInfo.row);

      if (isVoterRec && isIn(targetInfo.column, ["name", "address", "zipcode"])) {
        webix.message({type: "error", text: "Must use Change of Name or Address buttons!"});
        return false;
      }

      if (isVoterRec && isIn(targetInfo.column, ["birth_year", "gender"])) {
        webix.message({type: "error", text: "Can't drag Byr or Sex onto voter record!"});
        return false;
      }

      var targetValue = this.getText(targetInfo.row, targetInfo.column);
      if (this.sourceValue == targetValue) {
        return false;
      }

      var newItem = this.getItem(targetInfo.row);
      newItem[targetInfo.column] = this.sourceValue;
      this.updateItem(targetInfo.row, newItem);
    });

    this.grid.attachEvent("onAfterDrop", function(context) {
      var targetItem = $$("conDupsGrid").getItem(context.target.row);
      conDupsPanelCtlr.updates.push(targetItem.row);
      $$("conDupsGrid").sort("#id#", "asc", "int");
    });

    this.grid.attachEvent("onAfterEditStop", function(state, editor, ignoreUpdate) {
      if (editor.column == "email") {
        if (state.value != "" && !isEmail(state.value)) {
          webix.message({type: "error", text:"Invalid email!"});
          this.editCell(editor.row, editor.column, true, false);
          return false;
        }
      }

      if (isIn(editor.column, ["phone1", "phone2"])) {
        if (state.value != "" && !isPhone(state.value)) {
          webix.message({type: "error", text:"Invalid phone #!"});
          this.editCell(editor.row, editor.column, true, false);
          return false;
        }
      }

      if (editor.column == "birth_year") {
        if (state.value != "" && !isValidByr(state.value)) {
          webix.message({type: "error", text:"Invalid BYr!"});
          this.editCell(editor.row, editor.column, true, false);
          return false;
        }
      }

      if (editor.column == "gender") {
        if (state.value != "" && !isIn(state.value, ["M", "F"])) {
          webix.message({type: "error", text:"Invalid sex!"});
          this.editCell(editor.row, editor.column, true, false);
          return false;
        }

      }
      if (state.value != state.old) {
        conDupsPanelCtlr.updates.push(editor.row);
      }
    });

    this.grid.attachEvent("onItemDblClick", function(id, e, node) {

      var grid = $$("conDupsGrid");
//       grid.editStop();

      var isVoterRec = conDupsGridCtlr.isVoterRec(id.row);

      if (id.column == "name") {
        if (isVoterRec) {
          webix.confirm(
            "Are you sure you want to change this voter record name?",
            "confirm-warning",
            function (yes) {
              if (yes) {
                conNameFormPopupCtlr.show();
              }
            }
          );
        } else {
          conNameFormPopupCtlr.show();
        }
      }

      if (isIn(id.column, ["address", "zipcode"])) {
        if (isVoterRec) {
          webix.confirm(
            "Are you sure you want to change this voter record address?",
            "confirm-warning",
            function (yes) {
              if (yes) {
                coaPopupCtlr.show();
              }
            }
          );
        } else {
          coaPopupCtlr.show();
        }
      }

      if (isIn(id.column, ["email", "phone1", "phone2"])) {
        grid.editCell(id.row, id.column, false, false)
      }
    });
  },

  clear: function() {
    this.grid.clearAll();
  },

  filter: function(value) {
    this.grid.filter(function(obj) {
      return obj.name.toLowerCase().indexOf(value) == 0;
    })
  },

  next: function() {
    this.keyIdx += 1;
    if (this.keyIdx == dups.length)
      this.keyIdx = 0;
    this.load(Object.values(dups[this.keyIdx]));
  },

  previous: function() {
    this.keyIdx -= 1;
    if (this.keyIdx < 0)
      this.keyIdx = dups.length - 1;
    this.load(Object.values(dups[this.keyIdx]));
  },

  load: function(nextDups) {
    this.clear();
    this.grid.parse(nextDups);
    this.grid.adjust();
  },

  remove: function() {
    var items = this.grid.getSelectedItem(true);
    var ids = [];
    var idx = this.keyIdx;
    items.forEach(function(item) {
      ids.push(item.id);
      delete dups[idx][item.id];
      conDupsPanelCtlr.deletes.push(item.id);
    });
    this.grid.remove(ids);
    webix.message('Record(s) will be removed upon saving.')
  },

  isVoterRec: function(row) {
    var voter_id = this.grid.getText(row, "voter_id");
    return voter_id !== "";
  },

  isCrossColumns: function(srcCol, tarCol) {
    var pattern = new RegExp("^phone");
    if (pattern.test(srcCol) && pattern.test(tarCol))
      return false;
    return srcCol != tarCol;
  },

  save: function() {
    var updateRex = [];
    dups.forEach(function(dup) {
      Object.keys(dup).forEach(function(id) {
        if (conDupsPanelCtlr.updates.indexOf(parseInt(id)) >= 0)
          updateRex.push(Object.values(dup)[0])
      })
    });

    var data = {
      'updates': updateRex,
      'deletes': conDupsPanelCtlr.deletes
    };

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("con.duplicates");

    ajaxDao.post(url, [updateRex, conDupsPanelCtlr.deletes], function() {
      webix.message("Update Successful!");
    });
  }
};

/*=====================================================================
Duplicates Grid Toolbar
=====================================================================*/
var conDupsGridToolbar = {
  view: "toolbar",
  id: "conDupsGridToolbar",
  height: 35,
  rows: [
    {
      cols: [
        {view: "label", label: "Duplicates", width: 100},
        //{
        //  view: "text",
        //  id: "dupFilter",
        //  label: "Filter",
        //  labelAlign: "right",
        //  width: 200,
        //  on: {
        //    onTimedKeyPress: function() {
        //      conDupsGridCtlr.filter(this.getValue());
        //    }
        //  }
        //},
        //{
        //  view: "button",
        //  label: "Voter Lookup",
        //  width: 150,
        //  click: "conDupsGridCtlr.voterLookup();"
        //},
        //{
        //  view: "button",
        //  value: "Save",
        //  width: 150,
        //  click: "conDupsGridCtlr.save();"
        //},
        {
          view: "button",
          value: "Previous",
          width: 150,
          click: "conDupsGridCtlr.previous();"
        },
        {
          view: "button",
          value: "Next",
          width: 150,
          click: "conDupsGridCtlr.next();"
        },
        {
          view: "button",
          label: "Remove Selected",
          width: 150,
          click: "conDupsGridCtlr.remove();"
        },
        {
          view: "button",
          value: "Save",
          width: 150,
          click: "conDupsGridCtlr.save();"
        },
        {}
      ]
    }
  ]
};

/*=====================================================================
Duplicates Grid Panel
=====================================================================*/
var conDupsPanel = {
  rows: [conDupsGridToolbar, conDupsGrid]
};

/*=====================================================================
Duplicates Grid Panel Controller
=====================================================================*/
var conDupsPanelCtlr = {
  updates: [],
  deletes: [],

  init: function() {
    build_streets_db();
    addDisplay2Dups();
    this.setEditors();
    conDupsGridCtlr.init();
    conDupsGridCtlr.next();
  },

  setEditors: function() {
    webix.editors.upperCaseEditor = webix.extend({
      render: function() {
        return webix.html.create("div", {
          "class": "webix_dt_editor",
        }, "<input type='text' onkeyup='this.value=this.value.toUpperCase();'>");
      }
    }, webix.editors.text);
  }
};
