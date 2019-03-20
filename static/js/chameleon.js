/**
 * Created by Joe on 12/23/2017.
 */

var mySkin = "bluestreets_skin";

function switch_skin(skinName) {
  var i, link_tag;

  for (i=0, link_tag = document.getElementsByTagName("link"); i<link_tag.length; i++) {
    if ((link_tag[i].rel.indexOf("stylesheet") != -1) && link_tag[i].title) {
      link_tag[i].disabled = true;
      if (link_tag[i].title == skinName || link_tag[i].title == "bluestreets") {
        link_tag[i].disabled = false;
      }
    }
    set_skin(skinName);
  }
}

function set_skin_from_storage() {
  var skinName = get_skin();
  if (skinName.length) {
    switch_skin(skinName);
  }
}

function set_skin(skinName) {
  localStorage.setItem(mySkin, skinName);
}

function get_skin() {
  return localStorage.getItem(mySkin) || "";
}