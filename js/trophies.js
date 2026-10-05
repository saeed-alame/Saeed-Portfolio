



(function () {

  var buttons = document.querySelectorAll(".filter-btn");
  var games = document.querySelectorAll(".game-item");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.dataset.filter;

      buttons.forEach(function (b) { b.classList.remove("active"); });
      button.classList.add("active");

      games.forEach(function (game) {
        var show = (filter === "all" || game.dataset.status === filter);
        game.classList.toggle("hide", !show);
      });
    });
  });


  var fills = document.querySelectorAll(".progress-fill");

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.value + "%";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(function (fill) { observer.observe(fill); });

})();
