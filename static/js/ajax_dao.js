/**
 * Created by Joe on 11/19/2017.
 */

var ajaxDao = {
  result: {
    error: function(text, data, XmlHttpRequest) {
      var msg = "Error " + XmlHttpRequest.status + ": " + XmlHttpRequest.statusText;
      webix.message({type: "error", text: msg});
    },
    success: function(text, data) {
      var result = data.json();
      if (result["error"]) {
        webix.message({type: "error", text: result["error"]});
        return;
      }
      ajaxDao.callback(result);
    }
  },

  get: function(url, callback) {
    ajaxDao.callback = callback;
    webix.ajax(url, this.result)
  },

  post: function(url, params, callback) {
    ajaxDao.callback = callback;
    webix.ajax().post(url, {params: params}, this.result)
  }

};