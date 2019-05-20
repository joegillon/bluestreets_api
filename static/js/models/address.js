/**
 * Created by Joe on 4/20/2019.
 */

class Address  {
  constructor(arg) {
    this.state = "MI ";    // TODO: generalize this
    
    // If arg is string, parse to dict
    if (typeof arg == "string") {

      // Remove commas, upper case
      arg = arg.replace(/,/g, '').toUpperCase();

      let addr = parseAddress.parseLocation(arg);
      if (!addr.hasOwnProperty("number")) {
        throw "Invalid address: missing house number!";
      }

      // May need to insert state to get good parse
      if (addr.hasOwnProperty('zip') && !addr.hasOwnProperty('state')) {
        arg = arg.splice(arg.indexOf(addr.zip), 0, this.state);
        addr = parseAddress.parseLocation(arg);
      }

      arg = {
        house_number: addr.hasOwnProperty('number') ?
          parseInt(addr.number) : "",
        street_prefix: addr.hasOwnProperty('prefix') ? addr.prefix : "",
        street_name: addr.hasOwnProperty('street') ? addr.street : "",
        street_type: addr.hasOwnProperty('type') ? addr.type : "",
        street_suffix: addr.hasOwnProperty('suffix') ? addr.suffix : "",
        unit: addr.hasOwnProperty('sec_unit_num') ?
          addr.sec_unit_num : "",
        city: addr.hasOwnProperty('city') ? addr.city : "",
        zipcode: addr.hasOwnProperty('zip') ? addr.zip : ""
      }
    }

    this.house_number = arg.house_number;
//     this.block = new Block();
    this.street = new Street(arg);
    this.unit = arg.unit;
    this.city = arg.city;
    this.zipcode = arg.zipcode;
  }

  getMatches(collection) {
    let cond = {
      street_metaphone: this.street.metaphone
    };
    if (this.hasOwnProperty("house_number")) {
      cond.house_num_low = {lte: this.house_number};
      cond.house_num_high = {gte: this.house_number}
    }
    let matches = collection(cond).get();

    let thisStreetName = this.street.name;
    matches = matches.filter(function(match) {
      return match.street_name[0] == thisStreetName[0];
    });

    return matches;
  }
}