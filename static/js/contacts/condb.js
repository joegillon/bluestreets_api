/**
 * Created by Joe on 1/29/2019.
 */

/*======================================================================
Contacts Collection
======================================================================*/
function buildContactsCollection() {
  for (var rec of CONTACT_REX) {
    rec["display_name"] = getDisplayName(rec);
    rec["display_addr"] = getDisplayAddress(rec);
    rec["display_pct"] = rec["precinct_id"] ?
      db.pcts({id: rec["precinct_id"]}).display : "";
  }
  db.contacts = TAFFY(CONTACT_REX);
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
  const pcts = streetsCollection.find(
    {$distinct: {precinct_id: 1}},
    {precinct_id: 1, pct_name: 1, _id: 0}
  );
  const pct_names = {};
  pcts.forEach(function(pct) {
    pct_names[pct['precinct_id']] = pct['pct_name'];
  });

  dups.forEach(function(dup) {
    Object.values(dup).forEach(function(d) {
      d['pct_name'] = pct_names[d['precinct_id']];
      d['name'] = wholeName(d)
    })
  });
}

/*======================================================================
Groups and Memberships Collections
======================================================================*/
function build_groups_db() {
  groupsCollection = db.collection("groups").deferredCalls(false);
  groupsCollection.insert(groupRecords);

  membershipsCollection = db.collection("memberships").deferredCalls(false);
  membershipsCollection.insert(membershipRecords);

  groupRecords.forEach(function (group) {
    membershipsCollection.update(
      {group_id: group.id},
      {group_name: group.name}
    )
  });
}
