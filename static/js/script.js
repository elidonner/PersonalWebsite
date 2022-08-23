window.addEventListener("load", function() {
  document.querySelector(".page-loader").classList.add("fade-out");
  setTimeout(() => {
    document.querySelector(".page-loader").style.display = "none";
  }, 600);
});
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