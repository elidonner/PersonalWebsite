/**
 * Action items when window is opened
 */
window.addEventListener("load", function() {
  update_profile_height();
  order_photos();
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

/**
 * Order the images so they alternate
 */
function order_photos() {
  var project_imgs = document.querySelectorAll(".project-img");
  for (let i=0; i<project_imgs.length; i++) {
    if (i % 2 != 0) {
      project_imgs[i].classList.add("project-img-right")
    }
  }
}