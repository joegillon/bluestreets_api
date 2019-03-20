/**
 * Created by Joe on 3/13/2017.
 */

function add2list(list_name, sort_fld, obj) {
  //$$(list_name).data.push(obj);
  var list_id = $$(list_name).add(obj);
  $$(list_name).data.sort(sort_fld, "asc");
  $$(list_name).refresh();
  $$(list_name).select(list_id);
}

function twoDigits(d) {
  if (0 <= d && d < 10) return "0" + d.toString();
  return d.toString();
}

function toSQLDate(d) {
  return d.getFullYear().toString() + "-" +
    twoDigits(d.getMonth() + 1) + "-" +
    twoDigits(d.getDate());
}

function toSQLDateTime(d, t) {
  return toSQLDate(d) + " " +
      twoDigits(t.getHours()) + ":" +
      twoDigits(t.getMinutes());
}

function phone_prettify(phone) {
  if (!phone) return "";
  if (phone.match(/^\(\d{3}\)\d{3}-\d{4}$/)) return phone;
  return "(" + phone.substr(0,3) + ")" + phone.substr(3,3) + "-" + phone.substr(6);
}

function phone_uglify(phone) {
  return phone.replace(/\D/g, '');
}

function isPhone(value) {
  value = phone_uglify(value);
  return value == "" || value.match(/^\d{10}$/);
}

function phoneMask(input) {
  input = input.replace(/\D/g, "");
  input = input.substring(0, 10);
  var size = input.length;
  if (size == 0) {
    input = input;
  } else if (size < 4) {
    input = "(" + input;
  } else if (size < 7) {
    input = "(" + input.substring(0, 3) + ")" + input.substring(3, 6);
  } else {
    input = "(" + input.substring(0, 3) + ")" +
        input.substring(3, 6) + "-" + input.substring(6, 10);
  }
  return input;
}

function isZip(value) {
  return value == "" || value.match(/^\d{5}$/);
}

function isEmail(value) {
  return value == "" || value.match(/(\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3})/);
}

function sortByName(a, b) {
  if (a.last_name == b.last_name) {
    if (a.first_name == b.first_name) {
      return (a.middle_name > b.middle_name) ? 1 : -1;
    } else {
      return (a.first_name > b.first_name) ? 1 : -1;
    }
  } else {
    return (a.last_name > b.last_name) ? 1 : -1;
  }
}

function ajaxAsyncGet(url, params) {
  webix.ajax(url, params).
    then(function(result) {
      return result.json();
  }).
    fail(function(xhr) {
      var response = JSON.parse(xhr.response);
      throw resonse.error.message;
  });
}

function ajaxAsyncPost(url, params) {
  webix.ajax().post(url, params).
    then(function(result) {
      return result.json();

  }).
  fail(function(xhr) {
    var response = JSON.parse(xhr.response);
    webix.message({type: "error", text: response.error.message});
  });
}

function ajaxSyncGet(url, params, result) {
  webix.ajax().sync().get(url, params, {
    error: function (text, data, XmlHttpRequest) {
      msg = "Error " + XmlHttpRequest.status + ": " + XmlHttpRequest.statusText;
      webix.message({type: "error", text: msg});
      result = null;
    },
    success: function (text, data, XmlHttpRequest) {
      result = data.json();
    }
  });
}

function wholeName(names) {
  var result = names.last + ", " + names.first;
  if (names.middle) {
    result += " " + names.middle;
  }
  if (names.suffix) {
    result += ", " + names.suffix;
  }
  return result;
}

function commonName(names) {
  var result = names.last + ", ";
  if (names.hasOwnProperty("nickname") && names.nickname != "" ) {
    result += names.nickname;
  } else {
    result += names.first;
  }
  return result;
}

function wholeAddress(addr) {
  if (!addr.street_name) return "";
  var result = "";
  if (addr.house_number) result += addr.house_number + " ";
  if (addr.pre_direction) result += addr.pre_direction + " ";
  result += addr.street_name + " ";
  if (addr.street_type) result += addr.street_type + " ";
  if (addr.suf_direction) result += addr.suf_direction + " ";
  if (addr.unit) result += "Unit " + addr.unit;
  return result.trim();
}

var redLocationFields = [
  "jurisdiction", "ward", "precinct", "city", "county", "zip"
];

var pinkLocationFields = [
  "voter_id", "state_house", "state_senate", "congress"
];

function missingLocationData(rec) {
  var result = [];
  for (var i=0; i<redLocationFields.length; i++) {
    if (!rec.hasOwnProperty(redLocationFields[i]) || rec[redLocationFields[i]] == "") {
      result.push(redLocationFields[i]);
    }
  }
  if (result) {
    return result;
  }
}

function sortAddress(a, b) {
  var numA = parseInt(a.address);
  var numB = parseInt(b.address);
  var stA = a.address.match(/[A-Z A-Z]+/)[0].trim();
  var stB = b.address.match(/[A-Z A-Z]+/)[0].trim();
  if (stA == stB)
    return (numA > numB) ? 1 : -1;
  else
    return (stA > stB) ? 1 : -1;
}

function exportGrid(grid) {
  var filename = prompt("Enter a filename", "Data");
  if (filename === null) {
    return;
  }

  webix.csv.delimiter.rows = "\n";
  webix.csv.delimiter.cols = ",";
  webix.toCSV(grid, {
    ignore: {"id": true},
    filename: filename
  });
}

function getWebixList(list) {
  var items = [];
  for (var i=0; i<list.count(); i++) {
    items.push(list.getItem(list.getIdByIndex(i)));
  }
  return items;
}

function isDigit(c) {
  var n = c.charCodeAt(0);
  return (n > 47 && n < 58);
}

function isValidAddress(address, city, zipcode) {
  return true;  // TODO: need address validation
}

function isValidName(s) {
  return /^[A-Z][A-Z,'-]? ?[A-Z,\.]+$/.test(s);
}

function isValidNameChar(c) {
  return /^[A-Z,' -]$/.test(c);
}

function handleNameInput(code, ctl) {
  if (code < 32) return true;
  var c = String.fromCharCode(code).toUpperCase();
  if (isValidNameChar(c)) {
    ctl.setValue(ctl.getValue() + c);
  }
  return false;
}

function multipleValidator() {
  var args = arguments;
  return function(value, row, name) {
    for (var i=0; i<args.length; i++) {
      var obj = args[i], rule = obj.rule, message = obj.message;
      if (!rule.apply(this, arguments)) {
        this.elements[name].config.invalidMessage = message;
        return false;
      }
    }
    return true;
  }
}

function rebuildAddress(ctlValue, streetDisplayName) {
  var result = streetDisplayName;
  var addr = parseAddress.parseLocation(ctlValue);
  if (addr.hasOwnProperty("number")) {
    result = addr.number + " " + result;
  }
  if (addr.hasOwnProperty("sec_unit_num")) {
    result += " UNIT " + addr.sec_unit_num;
  }
  return result;
}

function sortByWholeName(a, b) {
  a = a.name.whole_name;
  b = b.name.whole_name;
  return a > b ? 1 : (a < b ?  -1 : 0);
}

function sortByPrecinctName(a, b) {
  a = a.voter_info.precinct_name;
  b = b.voter_info.precinct_name;
  return a > b ? 1 : (a < b ?  -1 : 0);
}

function sortByCongressionalDistrict(a, b) {
  a = a.voter_info.congress;
  b = b.voter_info.congress;
  return a > b ? 1 : (a < b ?  -1 : 0);
}

function sortBySenateDistrict(a, b) {
  a = a.voter_info.senate;
  b = b.voter_info.senate;
  return a > b ? 1 : (a < b ?  -1 : 0);
}

function sortByHouseDistrict(a, b) {
  a = a.voter_info.house;
  b = b.voter_info.house;
  return a > b ? 1 : (a < b ?  -1 : 0);
}
