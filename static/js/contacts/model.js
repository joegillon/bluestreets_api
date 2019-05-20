/**
 * Created by Joe on 4/16/2019.
 */

function Street(arg) {
  this.digit_mappings = {
    '0': 'ZERO',  '1': 'ONE',  '2': 'TWO',  '3': 'THREE',  '4': 'FOUR',
    '5': 'FIVE',  '6': 'SIX',  '7': 'SEVEN',  '8': 'EIGHT',  '9': 'NINE'
  };

  this.ordinal_streets = {
    'FIRST': '1ST', 'SECOND': '2ND', 'THIRD': '3RD',
    'FOURTH': '4TH', 'FIFTH': '5TH', 'SIXTH': '6TH',
    'SEVENTH': '7TH', 'EIGHTH': '8TH', 'NINTH': '9TH',
    'TENTH': '10TH', 'ELEVENTH': '11TH', 'TWELFTH': '12TH'
  };

  // If param is string, parse into dict
  if (typeof arg == "string") {
    var addr = parseAddress.parseLocation(arg);
    arg = {
      prefix: addr.hasOwnProperty('prefix') ? addr.prefix : "",
      name: addr.hasOwnProperty('street') ? addr.street : "",
      type: addr.hasOwnProperty('type') ? addr.type : "",
      suffix: addr.hasOwnProperty('suffix') ? addr.suffix : "",
      metaphone: addr.hasOwnProperty('metaphone') ?
        addr.metaphone : ""
    }
  }

  this.prefix = arg.prefix;
  this.name = (ordinalStreets[arg.name]) ?
    ordinal_streets[arg.name] : arg.name;
  this.type = arg.type;
  this.suffix = arg.suffix;
  this.metaphone = arg.hasOwnProperty('metaphone') ?
    arg.metaphone : this.getMetaphone();
}

Street.prototype.getMetaphone = function() {
  var s = "";
  this.name.split("").forEach(function(c) {
    s += isDigit(c) ? this.digitMappings[c] : c;
  });
  return double_metaphone(s)[0];
};
