/**
 * Created by Joe on 5/25/2019.
 */

class Contact {
  constructor(d) {
    this.last_name = d.last_name;
    this.first_name = d.first_name;
    this.middle_name = d.middle_name;
    this.name_suffix = d.name_suffix;
    this.nickname = d.nickname;
    this.alias = d.alias;
    this.name_metaphone = d.name_metaphone;

    this.address = new Address(d);
  }

  getName() {
    return getDisplayName({
      'last_name': this.last_name,
      'first_name': this.first_name,
      'middle_name': this.middle_name,
      'name_suffix': this.name_suffix
    })
  }

  byFuzzyNameAndAddr() {
    let candidates = DB.contacts(
      {
        street_metaphone: this.address.street.street_metaphone,
        house_number: {gte: this.address.block[0], lte: this.address.block[1]},
        name_metaphone: this.name_metaphone
      }
    ).get();
    return candidates.filter(
      candidate =>
        candidate.street_name[0] == this.address.street.street_name[0] &&
        candidate.last_name[0] == this.last_name[0])
  }

  byFuzzyName() {
    let candidates = DB.contacts({name_metaphone: this.name_metaphone}).get();
    return candidates.filter(
      candidate =>
        candidate.last_name[0] == this.last_name[0]
    )
  }

  fuzzyLookup() {
    if (this.address) {
      let matches = this.byFuzzyNameAndAddr();
      if (matches) return matches;
    }

    let candidates = this.byFuzzyName();
    let candidatesByName = {};
    for (let candidate in candidates) {
      candidatesByName[getDisplayName(candidate)] = candidate;
    }
    let names = candidates.map(candidate => getDisplayName(candidate));
    let matches = getBestPartials(this.getName(), names, 75);
    return candidatesByName.filter(name => matches.hasOwnProperty(name));
  }

}