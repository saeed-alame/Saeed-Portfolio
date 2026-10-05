




(function () {

  var bar = document.createElement("div");
  bar.id = "scroll-progress";
  document.body.appendChild(bar);

  var nav = document.querySelector(".site-nav");
  var parallaxItems = document.querySelectorAll("[data-speed]");
  var sideMovers = document.querySelectorAll("[data-xspeed]");

  function onScroll() {
    var scrollTop = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (scrollTop / max) * 100 : 0) + "%";

    if (nav) {
      nav.classList.toggle("scrolled", scrollTop > 40);
    }

    parallaxItems.forEach(function (item) {
      item.style.transform = "translateY(" + scrollTop * item.dataset.speed + "px)";
    });

    sideMovers.forEach(function (item) {
      var rect = item.getBoundingClientRect();
      var offset = rect.top + rect.height / 2 - window.innerHeight / 2;
      item.style.transform = "translateX(" + offset * item.dataset.xspeed + "px)";
    });
  }

  window.addEventListener("scroll", onScroll);
  onScroll();


  function runCounter(el) {
    if (el.dataset.done) { return; }
    el.dataset.done = "yes";

    var target = parseFloat(el.dataset.target);
    var decimals = parseInt(el.dataset.decimals || 0, 10);
    var duration = 1800;
    var start = null;

    function step(time) {
      if (start === null) { start = time; }
      var progress = Math.min((time - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) { requestAnimationFrame(step); }
    }
    requestAnimationFrame(step);
  }


  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add("show");
        if (el.classList.contains("counter")) { runCounter(el); }
        el.querySelectorAll(".counter").forEach(runCounter);
      } else if (el.dataset.repeat) {
        el.classList.remove("show");
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

  document.querySelectorAll(".reveal").forEach(function (el) {
    observer.observe(el);
  });

  document.querySelectorAll(".counter").forEach(function (el) {
    observer.observe(el);
  });


  document.querySelectorAll(".typing").forEach(function (el) {
    var words = el.dataset.words.split("|");
    var wordIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function tick() {
      var word = words[wordIndex];
      charIndex += deleting ? -1 : 1;
      el.textContent = word.substring(0, charIndex);

      var delay = deleting ? 40 : 90;

      if (!deleting && charIndex === word.length) {
        deleting = true;
        delay = 1600;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 400;
      }
      setTimeout(tick, delay);
    }
    tick();
  });

  document.querySelectorAll(".glass, .tilt").forEach(function (el) {

    el.addEventListener("mousemove", function (e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      el.style.setProperty("--mx", x + "px");
      el.style.setProperty("--my", y + "px");

      if (el.classList.contains("tilt")) {
        var rotateX = (y / rect.height - 0.5) * -12;
        var rotateY = (x / rect.width - 0.5) * 12;
        el.style.transform = "perspective(800px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-6px)";
      }
    });

    el.addEventListener("mouseleave", function () {
      if (el.classList.contains("tilt")) {
        el.style.transform = "";
      }
    });
  });


  document.querySelectorAll("img.soft").forEach(function (img) {
    function hide() { img.style.display = "none"; }
    img.addEventListener("error", hide);
    if (img.complete && img.naturalWidth === 0) { hide(); }
  });


  document.addEventListener("click", function (e) {
    var link = e.target.closest("a");
    if (!link) { return; }

    var href = link.getAttribute("href");
    if (!href || href.charAt(0) === "#" || link.target === "_blank") { return; }
    if (href.indexOf("http") === 0 || href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0) { return; }
    if (e.ctrlKey || e.metaKey || e.shiftKey) { return; }

    e.preventDefault();
    document.body.classList.add("leaving");
    setTimeout(function () {
      window.location.href = href;
    }, 350);
  });

  window.addEventListener("pageshow", function () {
    document.body.classList.remove("leaving");
  });

})();
