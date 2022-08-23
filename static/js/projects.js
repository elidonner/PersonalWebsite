var slideIndex = 1;

showSlides(slideIndex);

/**
 * Action items when window is opened
 */
 window.addEventListener("load", function() {
    setImageHeight();
    attachEventListeners();
});

function attachEventListeners() {
    window.addEventListener("resize", setImageHeight);
}

function plusSlides(n) {
    showSlides((slideIndex += n));
  }
  
  function currentSlide(n) {
    showSlides((slideIndex = n));
  }
  
  function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("img-slides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "flex";
    dots[slideIndex - 1].className += " active";
    setImageHeight();
  }
  
  function setImageHeight() {
    //fix the image height if needed
    let slides = document.getElementsByClassName("img-slides");
    var image = slides[slideIndex - 1].getElementsByTagName("img")[0];
    var image_width = image.offsetWidth;
    var slide_container_width = document.getElementsByClassName(
      "slideshow-container"
    )[0].offsetWidth;
    var width = slide_container_width - image_width;
    var slide_text = document.getElementsByClassName("text")[slideIndex - 1];
  
    if (image_width < slide_container_width / 2) {
      slide_text.style.width = width + "px";
    } else {
      slide_text.style.width = "50%";
    }
  }

function lightbox_open(el_id) {
  document.removeEventListener('keydown', keyEvent(e));
  var lightBoxVideo = document.getElementById(el_id);
  window.scrollTo(0, 0);
  document.getElementById('light').style.display = 'block';
  document.getElementById('fade').style.display = 'block';
}

function lightbox_close() {
  document.removeEventListener('keydown', keyEvent(e));
  var lightBoxVideo = document.getElementById("VisaChipCardVideo");
  document.getElementById('light').style.display = 'none';
  document.getElementById('fade').style.display = 'none';
  lightBoxVideo.pause();
}

function keyEvent(e) {
  if (e.code === "27") {
    lightbox_close();
  }
}