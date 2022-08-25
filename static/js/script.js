window.addEventListener("load", function() {
  adjust_header_height();
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
}

function navBar_pressed() {
  if(document.getElementById("dropdown-navbar").offsetHeight > 0) {
    closeNavbar();
  } else {
    displayNavbar();
  }
}

function displayNavbar() {
  document.getElementById("dropdown-navbar").style.height = "100%";
  document.getElementById("dropdown-navbar-content").style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeNavbar() {
  document.getElementById("dropdown-navbar").style.height = "0";
  document.getElementById("dropdown-navbar-content").style.display = "none";
  document.body.style.overflow = "";
}