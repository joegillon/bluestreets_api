/**
 * Created by Joe on 4/16/2019.
 */

class  Street {
  constructor(arg) {
    this.state = "MI ";    // TODO: generalize this

    this.ordinalStreets = {
      'FIRST': '1ST', 'SECOND': '2ND', 'THIRD': '3RD',
      'FOURTH': '4TH', 'FIFTH': '5TH', 'SIXTH': '6TH',
      'SEVENTH': '7TH', 'EIGHTH': '8TH', 'NINTH': '9TH',
      'TENTH': '10TH', 'ELEVENTH': '11TH', 'TWELFTH': '12TH'
    };

    this.digitMappings = {
      '0': 'ZERO', '1': 'ONE', '2': 'TWO', '3': 'THREE', '4': 'FOUR',
      '5': 'FIVE', '6': 'SIX', '7': 'SEVEN', '8': 'EIGHT', '9': 'NINE'
    };

    // If arg is string, parse to dict
    if (typeof arg == "string") {

      // Remove commas
      arg = arg.replace(/,/g, '');

      // Need a house number to parse correctly
      arg = "0 " + arg.toUpperCase();

      var addr = parseAddress.parseLocation(arg);

      // May need to insert state to get good parse
      if (addr.hasOwnProperty('zip') && !addr.hasOwnProperty('state')) {
        arg = arg.splice(arg.indexOf(addr.zip), 0, this.state);
        addr = parseAddress.parseLocation(arg);
      }

      arg = {
        prefix: addr.hasOwnProperty('prefix') ? addr.prefix : "",
        name: addr.hasOwnProperty('street') ? addr.street : "",
        type: addr.hasOwnProperty('type') ? addr.type.toUpperCase() : "",
        suffix: addr.hasOwnProperty('suffix') ? addr.suffix : ""
      }
    }

    this.prefix = arg.street_prefix;
    this.name = (this.ordinalStreets[arg.street_name]) ?
      this.ordinalStreets[arg.street_name] : arg.street_name;
    this.type = arg.street_type;
    this.suffix = arg.street_suffix;
    this.metaphone = arg.hasOwnProperty('street_metaphone') ?
      arg.street_metaphone : this.getMetaphone();
  }

  getMetaphone() {
    var s = "";
    var digitMappings = this.digitMappings;
    this.name.split("").forEach(function (c) {
      s += isDigit(c) ? digitMappings[c] : c;
    });
    return double_metaphone(s)[0];
  }
}