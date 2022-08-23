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
  window.addEventListener("resize", setImageHeight);



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
  document.getElementById("profile_pic").setAttribute("style", width);
}


let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("img-slides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "flex";  
  dots[slideIndex-1].className += " active";
  setImageHeight();
}

function setImageHeight() {
  //fix the image height if needed
  let slides = document.getElementsByClassName("img-slides");
  var image = slides[slideIndex-1].getElementsByTagName("img")[0];
  var image_width = image.offsetWidth;
  var slide_container_width = document.getElementsByClassName("slideshow-container")[0].offsetWidth;
  var width = (slide_container_width - image_width);
  var slide_text = document.getElementsByClassName("text")[slideIndex-1];

  if(image_width < slide_container_width/2) {
    slide_text.style.width = width + "px";
  } else {
    slide_text.style.width = "50%";
  }
}