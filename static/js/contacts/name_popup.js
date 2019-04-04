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
              invalidMessage: "Last name required!"
            },
            {
              view: "text",
              label: "First",
              name: "first",
              required: true,
              width: 100,
              validate: webix.rules.isNotEmpty,
              invalidMessage: "First name required!"
            },
            {
              view: "text",
              label: "Middle",
              name: "middle",
              width: 100
            },
            {
              view: "text",
              label: "Suffix",
              name: "suffix",
              width: 50
            }
          ]
        },
        {
          cols: [
            {
              view: "text",
              label: "Nickname",
              name: "nickname"
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
    this.popup.hide();
  },

  submit: function() {
    //var values = conNameFormCtlr.getValues();
  }
};