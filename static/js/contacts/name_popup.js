/**
 * Created by Joe on 4/2/2019.
 */

/*=====================================================================
Contact Name Form
=====================================================================*/
var conNameForm = {
  view: "form",
  id: "conNameForm",
  autowidth: true,
  autoheight: true,
  elements: [
    {
      rows: [
        {
          cols:[
            {
              view: "text",
              label: "Last",
              name: "last",
              required: true,
              width: 200,
              validate: webix.rules.isNotEmpty,
              invalidMessage: "Last name required!",
              on: {
                onKeyPress: function(code) {
                  return handleNameInput(code, this);
                }
              }
            },
            {
              view: "text",
              label: "First",
              name: "first",
              required: true,
              width: 100,
              validate: webix.rules.isNotEmpty,
              invalidMessage: "First name required!",
              on: {
                onKeyPress: function(code) {
                  return handleNameInput(code, this);
                }
              }
            },
            {
              view: "text",
              label: "Middle",
              name: "middle",
              width: 100,
              on: {
                onKeyPress: function(code) {
                  return handleNameInput(code, this);
                }
              }
            },
            {
              view: "text",
              label: "Suffix",
              name: "suffix",
              width: 50,
              on: {
                onTimedKeyPress: function() {
                  this.setValue(this.getValue().toUpperCase());
                }
              }
            }
          ]
        },
        {
          cols: [
            {
              view: "text",
              label: "Nickname",
              name: "nickname",
              invalidMessage: "Invalid nickname characters!",
              on: {
                onKeyPress: function(code) {
                  return handleNameInput(code, this);
                }
              }
            }
          ]
        }
      ]
    }
  ],
  elementsConfig: {
    labelPosition: "top"
  }
};

var conNameFormCtlr = {
  frm: null,

  init: function() {
    this.frm = $$("conNameForm");
  },

  clear: function() {
    this.frm.clear();
  },

  getValues: function() {
    return this.frm.getValues();
  }
};

/*=====================================================================
Contact Name Form Popup
=====================================================================*/
var conNameFormPopup = {
  view: "window",
  id: "conNameFormPopup",
  move: true,
  resize: true,
  top: 20,
  left: 20,
  autowidth: true,
  autoheight: true,
  position: "center",
  modal: true,
  head: {
    cols: [
      {
        view: "label",
        css: "popup_header",
        label: "Contact Name Form"
      },
      {
        view: "button",
        value: "Clear",
        click: "conNameFormCtlr.clear();"
      },
      {
        view: "button",
        value: "Cancel",
        click: "conNameFormPopupCtlr.hide();"
      },
      {
        view: "button",
        value: "Submit",
        click: "conNameFormPopupCtlr.submit();"
      }
    ]
  },
  body: {
    cols: [conNameForm]
  }
};

var conNameFormPopupCtlr = {
  popup: null,

  init: function() {
    this.popup = $$("conNameFormPopup");
    conNameFormCtlr.init();
  },

  show: function() {
    this.popup.show();
  },

  hide: function() {
    conNameFormCtlr.clear();
    this.popup.hide();
  },

  submit: function() {
    var values = conNameFormCtlr.getValues();
    var currentItem = conDupsGridCtlr.getSelectedItem();
    if (values.last != "") currentItem.last = values.last;
    if (values.first != "") currentItem.first = values.first;
    if (values.middle != "") currentItem.middle = values.middle;
    if (values.suffix != "") currentItem.suffix = values.suffix;
    if (values.nickname != "") currentItem.nickname = values.nickname;
    currentItem.name = wholeName(currentItem);
    conDupsGridCtlr.updateSelectedItem(currentItem);
    this.hide();
  }
};