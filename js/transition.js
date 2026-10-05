(function () {

  var closeTime = 450;
  var holdTime = 250;
  var openTime = 700;
  var letter = "S";

  var pageNames = {
    "index.html": "Home",
    "watchlist.html": "Watchlist",
    "trophies.html": "Trophies",
    "try-game.html": "Try Out The Game",
    "projects.html": "Projects",
    "journey.html": "The Journey",
    "about.html": "About Me"
  };


  var body = document.body;
  if (!body) { return; }

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var leaving = false;


  function fileOf(pathname) {
    var name = pathname.split("/").pop();
    return name === "" ? "index.html" : name;
  }

  function removeOverlay(root) {
    if (root && root.parentNode) { root.parentNode.removeChild(root); }
  }

  function buildOverlay(state, label) {
    var root = document.createElement("div");
    root.id = "page-transition";
    root.className = state;
    root.setAttribute("aria-hidden", "true");
    root.style.setProperty("--pt-close", closeTime + "ms");
    root.style.setProperty("--pt-open", openTime + "ms");
    root.innerHTML =
      '<div class="pt-door pt-door-top"></div>' +
      '<div class="pt-door pt-door-bottom"></div>' +
      '<div class="pt-center">' +
        '<div class="pt-emblem">' +
          '<svg class="pt-ring" viewBox="0 0 100 100" aria-hidden="true">' +
            '<defs><linearGradient id="ptGradient" x1="0" y1="0" x2="1" y2="1">' +
              '<stop class="pt-stop-1" offset="0%"></stop>' +
              '<stop class="pt-stop-2" offset="55%"></stop>' +
              '<stop class="pt-stop-3" offset="100%"></stop>' +
            '</linearGradient></defs>' +
            '<circle class="pt-ring-track" cx="50" cy="50" r="46"></circle>' +
            '<circle class="pt-ring-arc" cx="50" cy="50" r="46" stroke="url(#ptGradient)"></circle>' +
          '</svg>' +
          '<div class="pt-logo"></div>' +
          '<div class="pt-letter">' + letter + '</div>' +
        '</div>' +
        '<div class="pt-label"></div>' +
      '</div>';
    root.querySelector(".pt-label").textContent = label;
    return root;
  }


  function showArrival() {
    var label = pageNames[fileOf(window.location.pathname)] || document.title.split("|")[0].trim();
    var root = buildOverlay("closed", label);

    body.classList.add("pt-covered", "pt-nofade");
    body.insertBefore(root, body.firstChild);

    var loaded = document.readyState === "complete";
    var waited = false;
    var opened = false;

    function open() {
      if (opened) { return; }
      opened = true;
      root.className = "opening";
      body.classList.remove("pt-covered");
      body.classList.add("intro");
      setTimeout(function () {
        removeOverlay(root);
        body.classList.remove("intro");
      }, openTime + 300);
    }

    function check() {
      if (loaded && waited) { open(); }
    }

    window.addEventListener("load", function () {
      loaded = true;
      check();
    });

    setTimeout(function () {
      waited = true;
      check();
    }, holdTime);

    setTimeout(open, 4000);
  }

  var incoming = false;
  if (window.name.indexOf("pt:") === 0) {
    incoming = Date.now() - parseInt(window.name.slice(3), 10) < 8000;
    window.name = "";
  }

  if (incoming && !reduceMotion && !document.getElementById("preloader")) {
    try {
      showArrival();
    } catch (error) {
      removeOverlay(document.getElementById("page-transition"));
      body.classList.remove("pt-covered");
    }
  }


  function startLeaving(url, link) {
    leaving = true;
    removeOverlay(document.getElementById("page-transition"));

    var label = pageNames[fileOf(url.pathname)] || link.textContent.trim();
    var root = buildOverlay("", label);
    body.insertBefore(root, body.firstChild);
    void root.offsetWidth;
    root.className = "closing";

    window.name = "pt:" + Date.now();

    setTimeout(function () {
      window.location.href = link.href;
    }, closeTime + 100);

    setTimeout(function () {
      if (document.getElementById("page-transition") === root) { reopen(root); }
    }, 6000);
  }

  function reopen(root) {
    leaving = false;
    window.name = "";
    root.className = "opening";
    setTimeout(function () { removeOverlay(root); }, openTime + 300);
  }

  document.addEventListener("click", function (e) {
    if (reduceMotion || leaving || e.defaultPrevented) { return; }
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) { return; }

    var link = e.target.closest ? e.target.closest("a") : null;
    if (!link) { return; }

    var href = link.getAttribute("href");
    if (!href || href.charAt(0) === "#" || link.target === "_blank" || link.hasAttribute("download")) { return; }
    if (/^(mailto:|tel:|sms:|javascript:)/i.test(href)) { return; }

    var url = new URL(link.href, window.location.href);
    if (url.protocol !== window.location.protocol || url.host !== window.location.host) { return; }
    if (url.pathname === window.location.pathname && url.search === window.location.search) {
      e.stopPropagation();
      if (!url.hash) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    startLeaving(url, link);
  }, true);

  window.addEventListener("pageshow", function (e) {
    var root = document.getElementById("page-transition");
    if (e.persisted && root) { reopen(root); }
  });

})();