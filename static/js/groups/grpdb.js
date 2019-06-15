/**
 * Created by Joe on 1/29/2019.
 */

/*=====================================================================
Group Globals
=====================================================================*/
var contactsCollection;
var groupsCollection;
var membershipsCollection;

function build_db() {
  contactsCollection = db.collection("contacts").deferredCalls(false);
  contactsCollection.insert(contactRecords);
  contactsCollection.find().forEach(function(contact) {
    contactsCollection.update(
      {id: contact.id},
      {common_name: commonName(contact.name)}
    )
  });

  groupsCollection = db.collection("groups").deferredCalls(false);
  groupsCollection.insert(groupRecords);

  membershipsCollection = db.collection("memberships").deferredCalls(false);
  membershipsCollection.insert(membershipRecords);

  groupRecords.forEach(function(group) {
    membershipsCollection.update(
      {group_id: group.id},
      {group_name: group.name}
    )
  });

  contactRecords.forEach(function(contact) {
    membershipsCollection.update(
      {contact_id: contact.id},
      {contact_name: commonName(contact.name)}
    )
  });
}

function getMemberIds(group_id) {
  return membershipsCollection.find(
    {group_id: group_id}, {_id: 0, contact_id: 1}).
    map(function(rec) {return rec.contact_id})
}

function getNonMembers(group_id) {
  var memberIds = getMemberIds(group_id);
  return contactsCollection.find(
    {id: {$nin: memberIds}}
  ).map(function(contact) {
    return {id: contact.id, value: contact.common_name}
  });
}

function getAllGroups() {
  return groupsCollection.find({}, {$orderBy: {name: 1}});
}

function getGroup(id) {
  return groupsCollection.findOne({id: parseInt(id)});
}

function getGroupByName(name) {
  return groupsCollection.find(
    {name: new RegExp(name, "i")}
  );
}

function getGroupByCode(code) {
  return groupsCollection.find(
    {code: new RegExp(code, "i")}
  );
}

function addGroup(d) {
  d.id = parseInt(d.id);
  groupsCollection.insert(d);
}

function updateGroup(d) {
  groupsCollection.update(
    {id: parseInt(d.id)},
    {name: d.name, code: d.code, description: d.description}
  );
}

function dropGroup(id) {
  id = parseInt(id);
  membershipsCollection.remove({group_id: id});
  groupsCollection.remove({id: id});
}

function getAllMemberships() {
  return membershipsCollection.find({}, {$orderBy: {contact_name: 1}});
}

function addMembership(d) {
  d.group_name = groupsCollection.findOne({id: d.group_id}).name;
  d.contact_name = contactsCollection.findOne({id: d.contact_id}).common_name;
  membershipsCollection.insert(d);
}

function updateMembership(d) {
  membershipsCollection.update(
    {id: parseInt(d.id)},
    {
      group_id: d.group_id,
      contact_id: d.contact_id,
      role: d.role,
      comment: d.comment
    }
  );
}

function dropMembership(id) {
  membershipsCollection.remove({id: parseInt(id)});
}

function getContact(id) {
  return contactsCollection.findOne({id: id});
}