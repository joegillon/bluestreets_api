/**
 * Created by Joe on 4/16/2019.
 */

function Street(param) {
  if (typeof param == "string") {
    var addr = parseAddress.parseLocation(param);
    param = {
      house_number: addr.hasOwnProperty('number') ? parseInt(addr.number) : "",
      pre_direction: addr.hasOwnProperty('prefix') ? addr.prefix : "",
      street_name: addr.hasOwnProperty('street') ? addr.street : "",
      street_type: addr.hasOwnProperty('type') ? addr.type : "",
      suf_direction: addr.hasOwnProperty('suffix') ? addr.suffix : "",
      unit: addr.hasOwnProperty('sec_unit_num') ? addr.sec_unit_num : "",
      street_metaphone: addr.hasOwnProperty('street_metaphone') ? addr.street_metaphone : ""
    }
  }
  this.house_number = param.house_number;
  this.pre_direction = param.pre_direction;
  this.street_name = (ordinal_streets[param.street_name]) ?
    ordinal_streets[param.street_name] : param.street_name;
  this.street_type = param.street_type;
  this.suf_direction = param.suf_direction;
  this.unit = param.unit;
  this.metaphone = param.hasOwnProperty('street_metaphone') ?
    param.street_metaphone : this.getMetaphone();

  this.getMatches = function(collection) {
    var cond = {
      street_metaphone: this.metaphone
    };
    if (this.hasOwnProperty("house_number")) {
      cond.house_num_low = {"$lte": this.house_number};
      cond.house_num_high = {"$gte": this.house_number}
    }
    var matches = collection.find(cond);

    var myStreetName = this.street_name;
    matches = matches.filter(function(match) {
      return match.street_name[0] == myStreetName[0];b
    });

    return matches;
  }
}

Street.prototype.getMetaphone = function() {
  var s = "";
  this.street_name.split("").forEach(function(c) {
    s += isDigit(c) ? digitMappings[c] : c;
  });
  return double_metaphone(s)[0];
};

var ordinal_streets = {
  'FIRST': '1ST', 'SECOND': '2ND', 'THIRD': '3RD',
  'FOURTH': '4TH', 'FIFTH': '5TH', 'SIXTH': '6TH',
  'SEVENTH': '7TH', 'EIGHTH': '8TH', 'NINTH': '9TH',
  'TENTH': '10TH', 'ELEVENTH': '11TH', 'TWELFTH': '12TH'
};

var digit_mappings = {
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

