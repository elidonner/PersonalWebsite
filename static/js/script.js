window.addEventListener("load", function() {
  adjust_header_height();
  round_overflow_container();
  window.addEventListener("resize", adjust_header_height);
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

function adjust_header_height() {
  var nav_height = document.getElementsByClassName("nav-parent")[0].offsetHeight;
  var header = document.getElementsByClassName("Home");

  if(header.length > 0)
  {
    console.log(header[0].offsetHeight);
    console.log(window.screen.height-nav_height);
    
    if(header[0].offsetHeight <= window.screen.height-nav_height) {
      header[0].style.height = "calc(100vh - var(--header-height))";
    }
    else {
      header[0].style.height = "auto";
    }
  }

  // else {
  //   document.getElementById("down-arrow").style.display="none";
  // }
}

function round_overflow_container() {
  var containers = document.getElementsByClassName("overflow-container");
  console.log(containers);
  for(let i = 0; i < containers.length; i++) {
    if (containers[i].parentElement.style.order > 0) {
      containers[i].classList.add("round-xxlarge-right");
    } else {
      containers[i].classList.add("round-xxlarge-left");
    }
  }

}
