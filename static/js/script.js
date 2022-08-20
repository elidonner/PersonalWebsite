var projects = document.getElementsByClassName("project-container");

/**
 * Action items when window is opened
 */
window.onload = function () {
  update_profile_height();
  attachEventListeners();
};

function attachEventListeners() {
  window.addEventListener("resize", update_profile_height);


  for (var i = 0; i < projects.length; i++) {
    projects[i].addEventListener("click", function () {
      document.getElementById(this.title).classList.add("project-description-open");
      var body = document.getElementsByTagName("body");
      document.body.classList.add("hide-scroll");
    });
  }
}

function fn() {
    for (var i = 0; i < projects.length; i++) {
        document.getElementById(projects[i].title).classList.remove("project-description-open");
      document.body.classList.remove("hide-scroll");
    }
}

/**
 * Animation for down-arrow button
 */
var animation = bodymovin.loadAnimation({
  container: document.getElementById("down-arrow"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "/static/animation/down_arrow.json",
});

/**
 * Update profile height when screen resizes
 */
function update_profile_height() {
  var size = document.getElementById("profile_pic").offsetWidth;
  let width = "height:".concat(size).concat("px");
  //   console.log(width);
  window.setTimeout(function () {
    document.getElementById("profile_pic").setAttribute("style", width);
  }, 200);
}
