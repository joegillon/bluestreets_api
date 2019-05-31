/**
 * Created by Joe on 11/19/2017.
 */

const ajaxDao = {
  result: {
    error: function(text, data, XmlHttpRequest) {
      let msg = "Error " + XmlHttpRequest.status + ": " + XmlHttpRequest.statusText;
      webix.message({type: "error", text: msg});
    },
    success: function(text, data) {
      let result = data.json();
      if (result["error"]) {
        webix.message({type: "error", text: result["error"]});
        return;
      }
      ajaxDao.callback(result);
    }
  },

  get: function(url, callback) {
    if (callback === undefined) {
      let request = new XMLHttpRequest();
      request.open('GET', url, false);
      request.send(null);

      if (request.status == 200) {
        return request.responseText;
      }
      let msg = "Error " + request.status + ": " + request.statusText;
      webix.message({type: "error", text: msg});
      return null;
    } else {
      ajaxDao.callback = callback;
      webix.ajax(url, this.result)
    }
  },

  post: function(url, params, callback) {
    ajaxDao.callback = callback;
    webix.ajax().post(url, {params: params}, this.result)
  }

};