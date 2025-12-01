var slideIndex;
var currentVideo;
var currentImage;
/**
 * Action items when window is opened
 */
 window.addEventListener("load", function() {
  slideIndex = 1;

  showSlides(slideIndex);
  attachEventListeners();
});

function attachEventListeners() {
    window.addEventListener("resize", function() {
      setImageHeight(slideIndex-1);
    });

    var play_buttons = document.querySelectorAll(".embedded-video");
    for(let i=0; i<play_buttons.length; i++) {
      play_buttons[i].addEventListener("mouseover", play_animate);
      play_buttons[i].addEventListener("mouseout", play_unanimate);
    }
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
    var slide_text = document.getElementsByClassName("slide-text")[n];
    //fix the image height if needed
    if(screen.width > 767)
    {
      var img_containers = document.getElementsByClassName("img-container");
      var slide = document.getElementsByClassName("img-slides")[n];
      var image = slide.getElementsByTagName("img")[0];


      img_containers[n].style.width = image.offsetWidth+"px";
      if ( image.offsetWidth < slide.offsetWidth / 2) {
        slide_text.style.width = (slide.offsetWidth - image.offsetWidth) + "px";
      }
      else {
        slide_text.style.width = "50%";
      }
    }
    else {
      slide_text.style.width = "";
    }
  }

function lightbox_open(el_id) {
  currentVideo = el_id;
  var iframe = currentVideo.querySelector('iframe');
  var player = new Vimeo.Player(iframe);
  player.play();
  document.addEventListener("keydown", light_button);
  currentVideo.style.display = 'flex';
  document.body.style.overflow = "hidden";
}

function lightbox_close() {
  var iframe = currentVideo.querySelector('iframe');
  var player = new Vimeo.Player(iframe);
  player.pause();
  document.removeEventListener("keydown", light_button);
  currentVideo.style.display = 'none';
  document.body.style.overflow = "";
}

function enlargeImage(el) {
  currentImage = el.parentNode;
  currentImage.classList.add("img-container-active")
  document.addEventListener("keydown", img_button);
  currentImage.getElementsByClassName("video-popup")[0].style.display='flex';
  document.body.style.overflow = "hidden";
}

function closeImage() {
  currentImage.classList.remove("img-container-active")
  document.removeEventListener("keydown", img_button);
  console.log(currentImage.getElementsByClassName("video-popup")[0])
  currentImage.getElementsByClassName("video-popup")[0].style.display='none';
  document.body.style.overflow = "";
}

function light_button(e) {
  e.preventDefault();
  if (e.code === 'Escape') {
    lightbox_close();
  }
}

function img_button(e) {
  e.preventDefault();
  if (e.code === 'Escape') {
    closeImage();
  }
}

function play_animate() {
  var num_play_buttons = document.querySelectorAll(".play-button").length;
  var dotted = document.querySelectorAll(".stroke-dotted");
  var solid = document.querySelectorAll(".stroke-solid");
  var icon = document.querySelectorAll(".icon");
  for(let i=0; i<num_play_buttons; i++) {
    dotted[i].classList.add("stroke-dotted-active");
    solid[i].classList.add("stroke-solid-active");
    icon[i].classList.add("icon-active");
  }
}

function play_unanimate() {
  var num_play_buttons = document.querySelectorAll(".play-button").length;
  var dotted = document.querySelectorAll(".stroke-dotted");
  var solid = document.querySelectorAll(".stroke-solid");
  var icon = document.querySelectorAll(".icon");
  for(let i=0; i<num_play_buttons; i++) {
    dotted[i].classList.remove("stroke-dotted-active");
    solid[i].classList.remove("stroke-solid-active");
    icon[i].classList.remove("icon-active");
  }
}