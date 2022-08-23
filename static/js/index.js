/**
 * Action items when window is opened
 */
window.addEventListener("load", function() {
  update_profile_height();
  attachEventListeners();
});

function attachEventListeners() {
  window.addEventListener("resize", update_profile_height);
}

/**
 * Update profile height when screen resizes
 */
function update_profile_height() {
  var size = document.getElementById("profile_pic").offsetWidth;
  let width = "height:".concat(size).concat("px");
  //   console.log(width);
  document.getElementById("profile_pic").setAttribute("style", width);
}