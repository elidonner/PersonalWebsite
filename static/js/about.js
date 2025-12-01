const tabsContainer = document.querySelector('.about-tabs'),
aboutSection = document.querySelector(".about-timeline");

window.onload = function(){
  attachEventListeners();
  updateCurrentPositionDate();
};

function updateCurrentPositionDate() {
  const startDate = new Date('2025-09-01'); // September 2025
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let duration = '';
  if (diffDays < 30) {
    duration = `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  } else {
    const months = Math.floor(diffDays / 30);
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0) {
      duration = `${years} yr${years !== 1 ? 's' : ''}`;
      if (remainingMonths > 0) {
        duration += ` ${remainingMonths} mo`;
      }
    } else {
      duration = `${months} mo`;
    }
  }

  const dateElement = document.getElementById('current-position-date');
  if (dateElement) {
    dateElement.textContent = `Sep 2025 - Present · ${duration}`;
  }
}

function attachEventListeners(){

  tabsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains('tab-item') && !e.target.classList.contains("active")) {
      tabsContainer.querySelector(".active").classList.remove("active");
      e.target.classList.add("active");
      const target = e.target.getAttribute("data-target");
      aboutSection.querySelector('.tab-content.active').classList.remove("active");
      aboutSection.querySelector(target).classList.add("active");
  }
  })
}