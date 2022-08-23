var nav_height = document.getElementsByClassName("nav-parent")[0].offsetHeight;
var header = document.getElementsByTagName("Header")[0];
console.log(header.offsetHeight);
console.log(window.screen.height-nav_height);
if(header.offsetHeight <= window.screen.height-nav_height) {
  header.style.height = "calc(100vh - var(--header-height))";
}
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