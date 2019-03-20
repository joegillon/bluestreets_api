/**
 * Created by Joe on 12/23/2018.
 */
/* conDetailPanel: conFormPanel, conMatchPanel */

/*=====================================================================
Contact Detail Panel
=====================================================================*/
var conDetailPanel = {
  id: "conDetailPanel",
  cols: [conFormPanel, conMatchPanel]
};

var conDetailPanelCtlr = {
  panel: null,

  init: function() {
    this.panel = $$("conDetailPanel");
    conFormPanelCtlr.init();
    conMatchPanelCtlr.init();
    coaPopupCtlr.init();
    memPopupCtlr.init();
  }
};

