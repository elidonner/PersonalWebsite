var slideIndex;
/**
 * Action items when window is opened
 */
 window.addEventListener("load", function() {
  slideIndex = 1;

  showSlides(slideIndex);
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
    var i;
    var slides = document.getElementsByClassName("img-slides");
    var dots = document.getElementsByClassName("dot");
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
    setImageHeight(slideIndex - 1);
  }
  
  function setImageHeight(n) {
    //fix the image height if needed
    var img_containers = document.getElementsByClassName("img-container");
    var slide = document.getElementsByClassName("img-slides")[n];
    var slide_text = document.getElementsByClassName("text")[n];
    var image = slide.getElementsByTagName("img")[0];

    console.log(image.offsetWidth)
    img_containers[n].style.width = image.offsetWidth+"px";
    console.log(img_containers);
    if ( image.offsetWidth < slide.offsetWidth / 2) {
      slide_text.style.width = (slide.offsetWidth - image.offsetWidth) + "px";
    }
    else {
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