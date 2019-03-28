/**
 * Created by Joe on 3/24/2019.
 */

addEventListener('message', function(e) {
  var data = e.data;
  switch(data.cmd) {
    case 'start':
      break;
    case 'stop':
      break;
  }

}, false);

function findEmailDups(contacts) {
  var dups = [];
  var emailDict = {};
  var phoneDict = {};
  contacts.forEach(function(contact) {
    var email = contact.contact_info.email;
    if (email != "") {
      var metaphone = contact.contact_info.email_metaphone;
      if (!emailDict.hasOwnProperty(metaphone))
        emailDict[metaphone] = [];
      emailDict[metaphone].push(contact);
    }
  });

}