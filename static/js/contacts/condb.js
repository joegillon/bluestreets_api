/**
 * Created by Joe on 1/29/2019.
 */

/*======================================================================
Contacts Collection
======================================================================*/
function buildContactsCollection(data) {
  for (var rec of data) {
    rec.display_name = getDisplayName(rec);
    rec.display_addr = getDisplayAddress(rec);
    rec.display_pct = "";
    rec.senate = "";
    rec.house = "";
    rec.congress = "";
    if (rec.precinct_id) {
      let pct = db.pcts({id: rec.precinct_id}).first();
      rec.display_pct = pct.display;
      rec.senate = pct.state_senate;
      rec.house = pct.state_house;
      rec.congress = pct.congress;
    }
  }
  db.contacts = TAFFY(data);
}

/*======================================================================
Precincts Collection
======================================================================*/
function buildPrecinctsCollection() {
  for (var rec of PCT_REX) {
    rec["display"] = rec["jurisdiction_name"] + ", " +
        rec["ward"] + "/" + rec["precinct"];
  }
  db.pcts = TAFFY(PCT_REX);
}

/*======================================================================
Streets Collection
======================================================================*/
function buildStreetsCollection() {
  for (var rec of STREET_REX) {
    rec["display"] = getDisplayAddress(rec);
  }
  db.streets = TAFFY(STREET_REX);
}

/*======================================================================
City and Zipcode Collections
======================================================================*/
function buildCityZips() {
  db.zipcodes = db.streets().distinct("zipcode").sort();
  db.cities = db.streets().distinct("city").sort();
}

function addDisplay2Dups() {
  dups.forEach(function(dup) {
    Object.values(dup).forEach(function(d) {
      d['display_name'] = getDisplayName(d);
      d['display_addr'] = getDisplayAddress(d);
      d['display_pct'] = db.pcts({id: d['precinct_id']}).first().display;
    })
  });
}

/*======================================================================
Groups and Memberships Collections
======================================================================*/
function buildGroupsCollections() {
  db.groups = TAFFY(GROUP_REX);
  db.memberships = TAFFY(MEMBERSHIP_REX);

  db.groups().each(function (group) {
    db.memberships({group_id: group.id}).update({group_name: group.name});
  });
}
