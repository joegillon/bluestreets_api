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
              name: "last_name",
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
              name: "first_name",
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
              name: "middle_name",
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
              name: "name_suffix",
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

  show: function(data) {
    $$("conNameForm").setValues(data);
    this.popup.show();
  },

  hide: function() {
    conNameFormCtlr.clear();
    this.popup.hide();
  },

  submit: function() {
    let values = conNameFormCtlr.getValues();
    let currentItem = conDupsGridCtlr.getSelectedItem();
    if (values.last_name != "") currentItem.last_name = values.last_name;
    if (values.first_name != "") currentItem.first_name = values.first_name;
    if (values.middle_name != "") currentItem.middle_name = values.middle_name;
    if (values.name_suffix != "") currentItem.name_suffix = values.name_suffix;
    if (values.nickname != "") currentItem.nickname = values.nickname;
    currentItem.display_name = getDisplayName(currentItem);
    conDupsGridCtlr.updateSelectedItem(currentItem);
    this.hide();
  }
};