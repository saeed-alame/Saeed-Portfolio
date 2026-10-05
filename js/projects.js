







(function () {

  var section = document.getElementById("h-scroll");
  var track = document.getElementById("h-track");
  var fill = document.getElementById("h-progress-fill");
  var counter = document.getElementById("h-count");

  if (!section || !track) { return; }

  var total = track.querySelectorAll(".project-card").length;
  var sidewaysDistance = 0;

  function isSmallScreen() {
    return window.innerWidth <= 768;
  }

  function setup() {
    if (isSmallScreen()) {
      section.style.height = "auto";
      track.style.transform = "";
      return;
    }
    sidewaysDistance = track.scrollWidth - window.innerWidth;
    section.style.height = (sidewaysDistance + window.innerHeight) + "px";
    update();
  }

  function update() {
    if (isSmallScreen()) { return; }

    var top = section.getBoundingClientRect().top;
    var scrolled = -top;                                   // how far inside the section we are
    var progress = Math.max(0, Math.min(1, scrolled / sidewaysDistance));

    track.style.transform = "translateX(" + (-progress * sidewaysDistance) + "px)";
    fill.style.width = (progress * 100) + "%";

    var current = Math.min(total, Math.floor(progress * total) + 1);
    counter.textContent = "0" + current + " / 0" + total;
  }

  window.addEventListener("scroll", update);
  window.addEventListener("resize", setup);
  window.addEventListener("load", setup);   // images change the width, so measure again
  setup();

})();
