/**
 * Created by Joe on 1/29/2019.
 */

/*======================================================================
Contacts Collection
======================================================================*/
function buildContactsCollection(data) {
  for (let rec of data) {
    rec.display_name = getDisplayName(rec);
    rec.display_addr = getDisplayAddress(rec);
    rec.display_pct = "";
    rec.senate = "";
    rec.house = "";
    rec.congress = "";
    if (rec.precinct_id) {
      let pct = DB.pcts({id: rec.precinct_id}).first();
      rec.display_pct = pct.display;
      rec.senate = pct.state_senate;
      rec.house = pct.state_house;
      rec.congress = pct.congress;
    }
  }
  DB.contacts = TAFFY(data);
}

/*======================================================================
Precincts Collection
======================================================================*/
function buildPrecinctsCollection() {
  let json_str = null;
  if (isNotModified("precincts")) {
    json_str = localStorage.getItem("bluestreets_precincts");
  }

  // Either table has been changed or did not exist in localStorage
  if (json_str === null) {

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    let url = Flask.url_for("trf.get_precincts");
    json_str = ajaxDao.get(url);
    if (json_str === null) {
      throw "Unable to load precincts from server!"
    }
    localStorage.setItem("bluestreets_precincts", json_str);
  }

  let json_rex = JSON.parse(json_str);
  for (let rec of json_rex) {
    rec["display"] = rec["jurisdiction_name"] + ", " +
        rec["ward"] + "/" + rec["precinct"];
  }
  DB.pcts = TAFFY(json_rex);
}

/*======================================================================
Streets Collection
======================================================================*/
function buildStreetsCollection() {
  let json_str = null;
  if (isNotModified("streets")) {
    json_str = localStorage.getItem("bluestreets_streets");
  }

  if (json_str == null) {
    // Either table has been changed or did not exist in localStorage

    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    let url = Flask.url_for("trf.get_streets");
    json_str = ajaxDao.get(url);
    if (json_str === null) {
      throw "Unable to load streets from server!"
    }
    localStorage.setItem("bluestreets_streets", json_str);
  }

  let json_rex = JSON.parse(json_str);
  for (let rec of json_rex) {
    rec["display"] = getDisplayAddress(rec);
  }
  DB.streets = TAFFY(json_rex);
  if (DB.pcts !== undefined) {
    DB.pcts().each(pct => DB.streets({precinct_id: pct.id}).
        update({display_pct: pct.display}));
  }
}

/*======================================================================
City and Zipcode Collections
======================================================================*/
function buildCityZips() {
  DB.zipcodes = DB.streets().distinct("zipcode").sort();
  DB.cities = DB.streets().distinct("city").sort();
}

function addDisplay2Dups() {
  dups.forEach(function(dup) {
    Object.values(dup).forEach(function(d) {
      d['display_name'] = getDisplayName(d);
      d['display_addr'] = getDisplayAddress(d);
      d['display_pct'] = DB.pcts({id: d['precinct_id']}).first().display;
    })
  });
}
