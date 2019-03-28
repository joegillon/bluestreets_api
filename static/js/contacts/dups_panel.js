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
  multiselect: true,
  select: true,
  height: 200,
  autoWidth: true,
  resizeColumn: true,
  drag: true,
  columns: [
    {id: "id", header: "ID", adjust: true, readonly: true},
    {id: "name", header: "Name", adjust: "data", sort: "string", editor: "text"},
    {id: "address", header: "Address", adjust: true, sort: "string", editor: "text"},
    //{id: "city", header: "City", sort: "string", editor: "select", options: cities},
    {id: "zipcode", header: "Zip", sort: "string", editor: "text", width: 50},
    {id: "email", header: "Email", adjust: "data", sort: "string", editor: "text"},
    {id: "phone1", header: "Phone 1", sort: "string", editor: "text"},
    {id: "phone2", header: "Phone 2", sort: "string", editor: "text"},
    {id: "birth_year", header: "BYr", readonly: true, sort: "string", width: 50},
    {id: "gender", header: "Sex", adjust: "header", readonly: true, sort: "string", width: 50},
    {id: "voter_id", header: "Voter ID", adjust: "data", readonly: true, sort: "string"},
    {id: "precinct_id", header: "Pct", adjust: "data", readonly: true, sort: "string"},
    {id: "dirty", hidden: true}
  ]
};

/*=====================================================================
Duplicates Grid Controller
=====================================================================*/
var conDupsGridCtlr = {
  grid: null,
  sourceColumn: null,

  init: function() {
    this.grid = $$("conDupsGrid");
    this.keyIdx = -1;

    // These events won't work properly unless they are here. Ugh.
    this.grid.attachEvent("onBeforeDrag", function(context, ev) {
      var sourceInfo = this.locate(ev);
      this.sourceColumn = sourceInfo.column;
      context.value = context.from.getItem(sourceInfo.row)[sourceInfo.column];
      context.html = "<div style='padding: 8px;'>" +
          context.value + "<br></div>";
    });

    this.grid.attachEvent("onBeforeDrop", function(context) {
      if (this.sourceColumn != context.target.column) {
        webix.message({type: "error", text: "Can't drag across columns!"});
        return false;
      }
      var item = this.getItem(context.target.row);
      var currentValue = item[context.target.column];
      var newValue = context.value;
      if (currentValue == newValue) {
        return false;
      }
      item[context.target.column] = context.value;
      item.dirty = true;
      this.updateItem(context.target.row, item);
    });

    this.grid.attachEvent("onAfterDrop", function(context) {
      if (context.target.column == "address") {
        var sourceItem = $$("conDupsGrid").getItem(context.source);
        var targetItem = $$("conDupsGrid").getItem(context.target.row);
        targetItem.city = sourceItem.city;
        targetItem.zipcode = sourceItem.zipcode;
        $$("conDupsGrid").updateItem(context.target.row, targetItem);
      }
    })
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
    //dups.forEach(function(dup) {
    //  dup.dirty = false;
    //});
    this.grid.parse(nextDups[0]);
    this.grid.adjust();
  },

  getDups: function(type) {
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("con.duplicates", {type: type});

    ajaxDao.get(url, function(data) {
      var dups = data["dups"];
      if (dups.length == 0) {
        webix.message("No duplicates!");
        return;
      }
      conDupsGridCtlr.load(dups);
    });
  },

  voterLookup: function() {
    var items = this.grid.getSelectedItem(true);
    if (items.length != 1) {
      webix.message({type: "error", text: "Can lookup one at a time only!"});
      return;
    }

    var item = {
      last_name: items[0].last_name,
      first_name: items[0].first_name,
      last_name_meta: items[0].last_name_meta,
      first_name_meta: items[0].first_name_meta,
      address: ""
    };

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("con.voter_lookup");

    ajaxDao.post(url, item, function(data) {
      voterMatchPopupCtlr.show(data["candidates"]);
    });
  },

  remove: function() {
    var items = this.grid.getSelectedItem(true);
    var ids = [];
    items.forEach(function(item) {
      ids.push(item.id);
    });

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("con.drop_many");

    ajaxDao.post(url, {ids: ids}, function() {
      $$("conDupsGrid").remove(ids);
    });

  },

  save: function() {
    var items = this.grid.data.pull;
    var updates = [];
    for (var key in items) {
      if (items[key].dirty) {
        updates.push(items[key]);
      }
    }

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("con.update_many");

    ajaxDao.post(url, {data: updates}, function() {
      webix.message("Update Successful!");
    });
  },

  quit: function() {

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
          value: "Done",
          width: 150,
          click: "conDupsGridCtlr.quit();"
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
  init: function() {
    conDupsGridCtlr.init();
    conDupsGridCtlr.next();
  }
};
