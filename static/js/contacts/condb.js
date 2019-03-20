/**
 * Created by Joe on 1/29/2019.
 */

/*=====================================================================
Contact Globals
=====================================================================*/
var contactsCollection;
var groupsCollection;
var membershipsCollection;
var streetsCollection;
var zipcodeOptions;
var cityOptions;

var ordinalStreets = {
    'FIRST': '1ST', 'SECOND': '2ND', 'THIRD': '3RD',
    'FOURTH': '4TH', 'FIFTH': '5TH', 'SIXTH': '6TH',
    'SEVENTH': '7TH', 'EIGHTH': '8TH', 'NINTH': '9TH',
    'TENTH': '10TH', 'ELEVENTH': '11TH', 'TWELFTH': '12TH'
  };

var digitMappings = {
    '0': 'ZERO',
    '1': 'ONE',
    '2': 'TWO',
    '3': 'THREE',
    '4': 'FOUR',
    '5': 'FIVE',
    '6': 'SIX',
    '7': 'SEVEN',
    '8': 'EIGHT',
    '9': 'NINE'
  };

function build_db() {
  contactsCollection = db.collection("contacts").deferredCalls(false);
  contactsCollection.insert(contactRecords);

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

  streetsCollection = db.collection("streets").deferredCalls(false);
  streetsCollection.insert(streetRecords);

  zipcodeOptions = streetsCollection.find(
    {$distinct: {zipcode: {$ne: ""}}},
    {$orderBy: {zipcode: 1}}
  ).map(function(street) {
    return street.zipcode;
  });
  zipcodeOptions.unshift({id: "", value: ""});

  cityOptions = streetsCollection.find(
    {$distinct: {city: {$ne: ""}}},
    {$orderBy: {city: 1}}
  ).map(function(street) {
    return street.city;
  });
  cityOptions.unshift({id: "", value: ""});

  addDisplay2Contacts();

}

function addDisplay2Contacts() {
  contactsCollection.find().forEach(function(contact) {
    var params = {
      name: {whole_name: wholeName(contact.name)},
      address: {whole_addr: wholeAddress(contact.address)},
      voter_info: {
        precinct_name: "",
        congress: "",
        senate: "",
        house: ""
      }
    };
    if (contact.voter_info.precinct_id) {
      var street = streetsCollection.findOne(
        {precinct_id: contact.voter_info.precinct_id}
      );
      params.voter_info = {
        precinct_name: street.pct_name,
        congress: street.congress,
        senate: street.state_senate,
        house: street.state_house
      };
    }
    contactsCollection.update({id: contact.id}, params);
  });
}
