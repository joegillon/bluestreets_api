/* conMatchPanel: conMatchToolbar, conMatchGrid */

/*=====================================================================
Contact Match Toolbar
=====================================================================*/
var conMatchToolbar = {
  view: "toolbar",
  id: "conMatchToolbar",
  height: 35,
  cols: [
    {
      view: "label",
      id: "matchLabel",
      label: "Matches"
    },
    {
      view: "button",
      label: "Voter Lookup",
      width: 100,
      click: function() {
        conMatchToolbarCtlr.voterMatch();
      }
    },
    {
      view: "button",
      label: "Street Lookup",
      width: 100,
      click: function() {
        conMatchToolbarCtlr.streetMatch();
      }
    }
  ]
};

var conMatchToolbarCtlr = {
  toolbar: null,

  init: function() {
    this.toolbar = $$("conMatchToolbar");
  },

  setLabel: function(matchType) {
    var lbl = $$("matchLabel");
    switch (matchType) {
      case "C":
        lbl.setValue("Contact Matches");
        break;
      case "V":
        lbl.setValue("Voter Matches");
        break;
      case "S":
        lbl.setValue("Street Matches");
        break;
      default:
        // TODO: error message
    }
  },

  voterMatch: function () {
    var values = conFormCtlr.getValues();
    if (values.last_name == "" || values.first_name == "") {
      webix.message({type: "error", text: "Must have at least first and last name!"});
      return;
    }
    var params = {
      last: values.last_name,
      first: values.first_name,
      middle: values.middle_name,
      address: values.display_addr,
      city: values.city,
      zipcode: values.zipcode
    };

    conMatchGridCtlr.config("V");

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    var url = Flask.url_for("con.voter_lookup");

    ajaxDao.post(url, params, function(data) {
      data["candidates"].forEach(function(candidate) {
        candidate.display_name = getDisplayName(candidate);
        candidate.display_addr = getDisplayAddress(candidate);
        candidate.display_pct = db.pcts({id: candidate.precinct_id}).first().display;
      });
      conMatchGridCtlr.load(data["candidates"]);
    });
  },

  streetMatch: function () {
    let values = conFormCtlr.getValues();
    if (values.display_addr == "") {
      webix.message({type: "error", text: "No address to lookup!"});
      return;
    }

    conMatchGridCtlr.clear();

    let street = new Street(values);

    let cond = {
      street_metaphone: street.metaphone
    };
    if (values.house_number) {
      cond.house_num_low = {lte: values.house_number};
      cond.house_num_high = {gte: values.house_number}
    }
    let matches = db.streets(cond).get();

    matches = matches.filter(function(match) {
      return match.street_name[0] == street.name[0];
    });

    if (matches.length > 0) {
      conMatchGridCtlr.config("S");
      conMatchGridCtlr.load(matches);
    }
  }

};

/*=====================================================================
Contact Match Grid
=====================================================================*/
var conCGrid = {
  view: "datatable",
  id: "conCGrid",
  select: "row",
  hidden: true,
  tooltip: true,
  columns: [
    {
      header: "Name",
      template: "#name.display#",
      adjust: "data",
      fillspace: true,
      tooltip: "#name.display#"
    },
   {
      header: 'Address',
      template: "#address.display#",
      adjust: "data",
      fillspace: true,
      tooltip: "#address.display#, #address.city#"
    },
    {
      header: 'Email',
      template: "#contact_info.email#",
      adjust: "data",
      fillspace: true,
      tooltip: "#contact_info.email#"
    },
    {
      header: 'Phone 1',
      template: function(obj) {
        return phone_prettify(obj.contact_info.phone1);
      },
      adjust: "data",
      fillspace: true,
      tooltip: "#contact_info.phone1#"
    },
    {
      header: 'Phone 2',
      template: function(obj) {
        return phone_prettify(obj.contact_info.phone2);
      },
      adjust: "data",
      fillspace: true,
      tooltip: "#contact_info.phone2#"
    }
  ],
  on: {
    onItemDblClick: function(id) {
      conFormCtlr.loadMembership(id.row);
      conGridCtlr.showSelection(id.row);
    }
  }
};

var conVGrid = {
  view: "datatable",
  id: "conVGrid",
  select: "row",
  hidden: true,
  tooltip: true,
  autowidth: true,
  columns: [
    {
      header: 'Name',
      template: "#display_name#",
      adjust: "data",
      tooltip: "#gender#, born #birth_year#"
    },
   {
      header: 'Address',
      template: "#display_addr#",
      adjust: "data",
      tooltip: "#city# #zipcode#"
    },
    {
      header: "Reg Date",
      template: "#reg_date#",
      adjust: "data",
      tooltip: "#display_pct#"
    }
  ],
  on: {
    onItemDblClick: function(id) {
      conFormCtlr.loadVoter(this.getSelectedItem());
    }
  }
};

var conSGrid = {
  view: "datatable",
  id: "conSGrid",
  select: "row",
  hidden: true,
  tooltip: true,
  columns: [
   {
      header: 'Street',
      template: "#display#",
      adjust: "data",
      tooltip: "#city# #zipcode#"
    },
    {
      header: "Low",
      template: "#house_num_low#",
      adjust: "data"
    },
    {
      header: "High",
      template: "#house_num_high#",
      adjust: "data"
    },
    {
      header: "Unit Low",
      template: "#ext_low#",
      adjust: "header"
    },
    {
      header: "Unit High",
      template: "#ext_high#",
      adjust: "header"
    },
    {
      header: "Side",
      template: "#street_side#",
      adjust: "header"
    }
  ],
  on: {
    onItemDblClick: function(id) {
      conFormCtlr.loadStreet(this.getSelectedItem());
    }
  }
};

var conMatchGridCtlr = {
  grid: null,

  init: function() {
    this.grid = $$("conCGrid");
    this.grid.show();
  },

  clear: function() {
    this.grid.clearAll();
  },

  config: function(matchType) {
    var gridName = "con" + matchType + "Grid";
    if (gridName != this.grid.config.id) {
      this.grid.hide();
      this.clear();
      this.grid = $$(gridName);
      this.grid.show();
    }

    conMatchToolbarCtlr.setLabel(matchType);
  },

  load: function(data) {
    this.grid.parse({
      pos: this.grid.count(),
      data: data
    });
    this.grid.refresh();
  }

};

/*=====================================================================
Contact Match Panel
=====================================================================*/
var conMatchPanel = {
  id: "conMatchPanel",
  rows: [conMatchToolbar, conCGrid, conVGrid, conSGrid]
};

var conMatchPanelCtlr = {
  panel: null,

  //ordinal_streets: {
  //  'FIRST': '1ST', 'SECOND': '2ND', 'THIRD': '3RD',
  //  'FOURTH': '4TH', 'FIFTH': '5TH', 'SIXTH': '6TH',
  //  'SEVENTH': '7TH', 'EIGHTH': '8TH', 'NINTH': '9TH',
  //  'TENTH': '10TH', 'ELEVENTH': '11TH', 'TWELFTH': '12TH'
  //},
  //
  //digit_mappings: {
  //  '0': 'ZERO',
  //  '1': 'ONE',
  //  '2': 'TWO',
  //  '3': 'THREE',
  //  '4': 'FOUR',
  //  '5': 'FIVE',
  //  '6': 'SIX',
  //  '7': 'SEVEN',
  //  '8': 'EIGHT',
  //  '9': 'NINE'
  //},

  init: function() {
    this.panel = $$("conMatchPanel");
    conMatchToolbarCtlr.init();
    conMatchGridCtlr.init();
  },

  clear: function() {
    conMatchGridCtlr.clear();
  },

  handleMatches: function(matches) {
    var current_ids = Object.values($$("conCGrid").data.pull).
      map(function(item) {
        return item.id;
      }
    );
    var newRows = matches.filter(function(match) {
      return current_ids.indexOf(match.id) == -1;
    });
    if (newRows.length > 0) {
      conMatchGridCtlr.config("C");
      conMatchGridCtlr.load(newRows);
    }
  },

  emailMatch: function(value) {
    if (value == "") return;
    var contacts = contactsCollection.find(
      {contact_info: {email: new RegExp("^" + value[0])}}
    );
    var emails = [];
    contacts.forEach(function(contact) {
      emails.push(contact.contact_info.email);
    });
    var matches = [];
    var choices = fuzzball.extract(value, emails, {cutoff: 80, returnObjects: true});
    choices.forEach(function(choice)
      {matches.push(contacts[choice.key]);}
    );
    this.handleMatches(matches);
  },

  phoneMatch: function(value) {
    if (value == "") return;
    var matches = contactsCollection.find(
      {contact_info: {'$or': [
        {phone1: value}, {phone2: value}
      ]}
    });
    this.handleMatches(matches);
  },

  lastNameMatch: function(value) {
    if (value == "") return;
    var dm = double_metaphone(value)[0];
    var matches = contactsCollection.find(
      {name: {last_meta: dm}}
    );
    matches = matches.filter(function(match) {
      return match.name.last[0] == value[0];
    });
    this.handleMatches(matches);
  },

  // TODO: Test this on ordinal streets
  addressMatch: function(value) {
    if (value == "") return;
    var street_name = parseAddress.parseLocation(value).street;
    if (this.ordinalStreets[street_name]) {
      street_name = this.ordinalStreets[street_name];
    }
    var n = "";
    var digit_mappings = this.digit_mappings;
    street_name.split("").forEach(function(c) {
      n += (isDigit(c)) ? digit_mappings[c] : c;
    });
    var dm = double_metaphone(n)[0];
    var matches = streetsCollection.find(
      {street_name_meta: dm}
    );
    matches = matches.filter(function(match) {
      return match.street_name[0] == street_name[0];
    });
    this.handleMatches(matches);
  }
};
