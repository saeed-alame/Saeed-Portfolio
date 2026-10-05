try {sessionStorage.removeItem("preloaderSeen");} catch (error){}
(function () {
  var yourName = "SAEED ALAME";
  var tagline = "Student &middot; Web Developer &middot; Future Cloud Architect";
  var buttonText = "Enter the Portfolio";
  var loadingTime = 4500;
  var showOnlyOncePerVisit = false;

  var messages = [
    { at: 0,   icon: "bi-power",               text: "Booting up the portfolio" },
    { at: 14,  icon: "bi-film",                text: "Loading movies &amp; series" },
    { at: 34,  icon: "bi-trophy-fill",         text: "Collecting PlayStation trophies" },
    { at: 54,  icon: "bi-code-slash",          text: "Compiling projects" },
    { at: 74,  icon: "bi-signpost-split-fill", text: "Mapping the journey" },
    { at: 90,  icon: "bi-cloud-fill",          text: "Connecting to the cloud" },
    { at: 100, icon: "bi-stars",               text: "All set. Welcome!" }
  ];

  var modules = [
    { at: 34, icon: "bi-film",                name: "Watchlist" },
    { at: 54, icon: "bi-trophy-fill",         name: "Trophies" },
    { at: 74, icon: "bi-code-slash",          name: "Projects" },
    { at: 90, icon: "bi-signpost-split-fill", name: "Journey" }
  ];


  var body = document.body;
  if (!body) { return; }

  var seen = false;
  try {
    seen = sessionStorage.getItem("preloaderSeen") === "yes";
  } catch (error) {
    seen = false;
  }
  if (showOnlyOncePerVisit && seen) { return; }

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) { loadingTime = 1500; }
  var hardLimit = loadingTime + 4000;


  var chipsHtml = "";
  modules.forEach(function (m) {
    chipsHtml += '<li class="pre-chip"><i class="bi ' + m.icon + '"></i>' + m.name + '<i class="bi bi-check-circle-fill pre-tick"></i></li>';
  });

  var html =
    '<div class="pre-door pre-door-top"></div>' +
    '<div class="pre-door pre-door-bottom"></div>' +
    '<div class="pre-glow"></div>' +
    '<canvas class="pre-canvas"></canvas>' +
    '<div class="pre-content">' +
      '<div class="pre-emblem">' +
        '<svg class="pre-ring" viewBox="0 0 200 200" aria-hidden="true">' +
          '<defs><linearGradient id="preGradient" x1="0" y1="0" x2="1" y2="1">' +
            '<stop class="pre-stop-1" offset="0%"></stop>' +
            '<stop class="pre-stop-2" offset="55%"></stop>' +
            '<stop class="pre-stop-3" offset="100%"></stop>' +
          '</linearGradient></defs>' +
          '<circle class="pre-ring-track" cx="100" cy="100" r="92"></circle>' +
          '<circle class="pre-ring-fill" cx="100" cy="100" r="92" stroke="url(#preGradient)" transform="rotate(-90 100 100)"></circle>' +
          '<circle class="pre-ring-head" cx="100" cy="8" r="4.5"></circle>' +
        '</svg>' +
        '<div class="pre-orbit pre-orbit-1">' +
          '<i class="bi bi-cloud-fill" data-module="3"></i>' +
          '<i class="bi bi-film second" data-module="0"></i>' +
        '</div>' +
        '<div class="pre-orbit pre-orbit-2">' +
          '<i class="bi bi-code-slash" data-module="2"></i>' +
          '<i class="bi bi-controller second" data-module="1"></i>' +
        '</div>' +
        '<div class="pre-logo"></div>' +
        '<div class="pre-letter">' + yourName.charAt(0) + '</div>' +
      '</div>' +
      '<div class="pre-name">' + yourName + '</div>' +
      '<div class="pre-tagline">' + tagline + '</div>' +
      '<div class="pre-status" aria-live="polite"><span class="pre-percent">0%</span><span class="pre-text"></span></div>' +
      '<ul class="pre-chips">' + chipsHtml + '</ul>' +
      '<div class="pre-action">' +
        '<button class="pre-enter" type="button">' + buttonText + '<i class="bi bi-arrow-right"></i></button>' +
        '<span class="pre-hint">or press <kbd>Enter</kbd></span>' +
      '</div>' +
    '</div>' +
    '<div class="pre-corner"><i class="bi bi-geo-alt-fill"></i>Lebanon<i class="bi bi-arrow-right"></i><i class="bi bi-cloud-fill"></i>The Cloud</div>' +
    '<button class="pre-skip" type="button">Skip</button>' +
    '<div class="pre-flash"></div>';

  var root = document.createElement("div");
  root.id = "preloader";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-label", "Welcome to " + yourName + " portfolio");
  root.innerHTML = html;

  body.classList.add("is-loading");
  body.insertBefore(root, body.firstChild);

  var canvas = root.querySelector(".pre-canvas");
  var ctx = canvas.getContext("2d");
  var emblem = root.querySelector(".pre-emblem");
  var glow = root.querySelector(".pre-glow");
  var ringFill = root.querySelector(".pre-ring-fill");
  var ringHead = root.querySelector(".pre-ring-head");
  var percentEl = root.querySelector(".pre-percent");
  var textEl = root.querySelector(".pre-text");
  var chips = root.querySelectorAll(".pre-chip");
  var orbitIcons = root.querySelectorAll(".pre-orbit i");
  var enterButton = root.querySelector(".pre-enter");
  var skipButton = root.querySelector(".pre-skip");


  var circumference = 2 * Math.PI * 92;
  var progress = 0;
  var lastShown = -1;
  var currentMessage = -1;
  var pageLoaded = document.readyState === "complete";
  var ready = false;
  var opened = false;
  var finished = false;
  var startTime = 0;
  var openedAt = 0;
  var warp = 0;
  var hovering = false;
  var hoverMix = 0;

  var width = window.innerWidth;
  var height = window.innerHeight;
  var mouse = { x: width / 2, y: height / 2 };
  var smooth = { x: width / 2, y: height / 2 };
  var vanish = { x: width / 2, y: height / 2 };

  var stars = [];
  var depth = 1000;
  var focal = 500;

  var themeStyles = getComputedStyle(body);
  var palette = [
    "white",
    "white",
    themeStyles.getPropertyValue("--accent").trim() || "cyan",
    themeStyles.getPropertyValue("--accent2").trim() || "violet",
    themeStyles.getPropertyValue("--accent3").trim() || "hotpink"
  ];

  ringFill.style.strokeDasharray = circumference;
  ringFill.style.strokeDashoffset = circumference;


  function newStar(anywhere) {
    return {
      x: (Math.random() - 0.5) * width * 1.8,
      y: (Math.random() - 0.5) * height * 1.8,
      z: anywhere ? Math.random() * depth : depth,
      color: palette[Math.floor(Math.random() * palette.length)]
    };
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    focal = Math.min(width, height) * 0.8;

    var amount = Math.floor((width * height) / 7000);
    amount = Math.max(120, Math.min(amount, 260));

    stars = [];
    for (var i = 0; i < amount; i++) {
      stars.push(newStar(true));
    }
  }

  function drawStars(speed) {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var before = s.z + speed * 1.8 + 0.4;
      s.z -= speed;

      if (s.z < 1) {
        stars[i] = newStar(false);
        continue;
      }

      var k = focal / s.z;
      var x = vanish.x + s.x * k;
      var y = vanish.y + s.y * k;

      if (x < -60 || x > width + 60 || y < -60 || y > height + 60) {
        stars[i] = newStar(false);
        continue;
      }

      var kBefore = focal / before;
      var near = 1 - s.z / depth;

      ctx.globalAlpha = Math.min(1, near * 1.6);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = near * 2.4 + 0.5;
      ctx.beginPath();
      ctx.moveTo(vanish.x + s.x * kBefore, vanish.y + s.y * kBefore);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  }


  function updateMessage(shown) {
    var index = 0;
    for (var i = 0; i < messages.length; i++) {
      if (shown >= messages[i].at) { index = i; }
    }
    if (index === currentMessage) { return; }

    currentMessage = index;
    var m = messages[index];
    textEl.innerHTML = '<i class="bi ' + m.icon + '"></i><span>' + m.text + '</span>';
    textEl.classList.remove("swap");
    void textEl.offsetWidth;
    textEl.classList.add("swap");
  }

  function updateModules(shown) {
    modules.forEach(function (m, i) {
      if (shown >= m.at && !chips[i].classList.contains("done")) {
        chips[i].classList.add("done");
        for (var k = 0; k < orbitIcons.length; k++) {
          if (orbitIcons[k].getAttribute("data-module") === String(i)) {
            orbitIcons[k].classList.add("lit");
          }
        }
      }
    });
  }

  function showProgress(value) {
    var shown = Math.floor(value);

    ringFill.style.strokeDashoffset = circumference * (1 - value / 100);

    var angle = (value / 100) * Math.PI * 2 - Math.PI / 2;
    ringHead.setAttribute("cx", 100 + 92 * Math.cos(angle));
    ringHead.setAttribute("cy", 100 + 92 * Math.sin(angle));

    if (shown !== lastShown) {
      lastShown = shown;
      percentEl.textContent = shown + "%";
      updateMessage(shown);
      updateModules(shown);
    }
  }

  function becomeReady() {
    if (ready) { return; }
    ready = true;
    root.classList.add("ready");
    setTimeout(function () {
      if (!opened) {
        try { enterButton.focus({ preventScroll: true }); } catch (error) {}
      }
    }, 800);
  }


  function enter() {
    if (opened) { return; }
    opened = true;

    if (!ready) {
      progress = 100;
      showProgress(100);
      becomeReady();
    }

    openedAt = performance.now();
    root.classList.add("opening");
    setTimeout(split, 950);
    setTimeout(finish, 2300);
  }

  function split() {
    root.classList.add("split");
    body.classList.remove("is-loading");
    body.classList.add("intro");
    document.removeEventListener("keydown", onKey);

    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    try {
      sessionStorage.setItem("preloaderSeen", "yes");
    } catch (error) {}
  }

  function finish() {
    finished = true;
    removeListeners();
    if (root.parentNode) { root.parentNode.removeChild(root); }
    setTimeout(function () { body.classList.remove("intro"); }, 2500);
  }

  function emergencyExit() {
    finished = true;
    body.classList.remove("is-loading");
    removeListeners();
    if (root.parentNode) { root.parentNode.removeChild(root); }
  }


  function frame(now) {
    if (finished) { return; }

    try {
      if (!startTime) { startTime = now; }
      var elapsed = now - startTime;

      if (!ready) {
        var t = Math.min(elapsed / loadingTime, 1);
        var eased = t * t * (3 - 2 * t);
        var cap = (pageLoaded || elapsed > hardLimit) ? 100 : 92;
        var target = Math.min(eased * 100, cap);

        progress += (target - progress) * 0.1;
        if (target >= 100 && progress > 99.6) { progress = 100; }

        showProgress(progress);
        if (progress >= 100) { becomeReady(); }
      }

      if (opened) { warp = Math.min((now - openedAt) / 900, 1); }
      hoverMix += ((hovering ? 1 : 0) - hoverMix) * 0.08;

      smooth.x += (mouse.x - smooth.x) * 0.08;
      smooth.y += (mouse.y - smooth.y) * 0.08;

      glow.style.transform = "translate(" + smooth.x + "px, " + smooth.y + "px)";
      emblem.style.transform = "translate(" + ((smooth.x - width / 2) * -0.025) + "px, " + ((smooth.y - height / 2) * -0.025) + "px)";

      vanish.x += (width / 2 + (mouse.x - width / 2) * 0.2 * (1 - warp) - vanish.x) * 0.05;
      vanish.y += (height / 2 + (mouse.y - height / 2) * 0.2 * (1 - warp) - vanish.y) * 0.05;

      var speed = 0;
      if (!reduceMotion) {
        speed = 1.2 + progress * 0.05 + hoverMix * 5 + warp * warp * 75;
      }
      drawStars(speed);
    } catch (error) {
      emergencyExit();
      return;
    }

    requestAnimationFrame(frame);
  }


  function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  function onTouchMove(e) {
    if (e.touches.length) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }

  function onLoad() {
    pageLoaded = true;
  }

  function blockScroll(e) {
    e.preventDefault();
  }

  function onKey(e) {
    var key = e.key;

    if (key === "Tab") {
      e.preventDefault();
      var order = ready ? [enterButton, skipButton] : [skipButton];
      var next = order.indexOf(document.activeElement) + (e.shiftKey ? -1 : 1);
      if (next < 0) { next = order.length - 1; }
      order[next % order.length].focus();
    } else if (key === "Enter" || key === " ") {
      e.preventDefault();
      if (ready) { enter(); }
    } else if (key === "Escape") {
      enter();
    } else if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].indexOf(key) !== -1) {
      e.preventDefault();
    }
  }

  function removeListeners() {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("resize", resize);
    window.removeEventListener("load", onLoad);
    document.removeEventListener("keydown", onKey);
  }

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("resize", resize);
  window.addEventListener("load", onLoad);
  document.addEventListener("keydown", onKey);

  root.addEventListener("wheel", blockScroll, { passive: false });
  root.addEventListener("touchmove", blockScroll, { passive: false });

  enterButton.addEventListener("click", enter);
  skipButton.addEventListener("click", enter);
  enterButton.addEventListener("mouseenter", function () { hovering = true; });
  enterButton.addEventListener("mouseleave", function () { hovering = false; });

  try {
    resize();
    showProgress(0);
    requestAnimationFrame(frame);
  } catch (error) {
    emergencyExit();
  }

})();