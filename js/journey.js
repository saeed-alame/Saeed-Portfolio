






(function () {

  var box = document.getElementById("timeline-box");
  var svg = document.getElementById("timeline-svg");
  var gradient = document.getElementById("lineGradient");
  var track = document.getElementById("line-track");
  var main = document.getElementById("line-main");
  var glow = document.getElementById("line-glow");
  var head = document.getElementById("line-head");
  var endText = document.getElementById("timeline-end");

  if (!box) { return; }

  var milestones = Array.prototype.slice.call(box.querySelectorAll(".milestone"));
  var points = [];        // where every milestone sits {x, y}
  var totalLength = 0;


  function build() {
    var width = box.clientWidth;
    var small = window.innerWidth < 768;

    var leftX = small ? 40 : width * 0.32;
    var rightX = small ? 76 : width * 0.68;

    milestones.forEach(function (m, i) {
      var goesLeft = (i % 2 === 0);
      var card = m.querySelector(".m-card");

      m.classList.remove("left", "right");
      if (small) {
        m.classList.add("right");                         // on phones every card is on the right
        card.style.width = (width - (goesLeft ? leftX : rightX) - 50 - 14) + "px";
        card.style.left = "50px";
        card.style.right = "auto";
      } else if (goesLeft) {
        m.classList.add("left");
        card.style.width = Math.min(300, leftX - 70) + "px";
        card.style.right = "55px";
        card.style.left = "auto";
      } else {
        m.classList.add("right");
        card.style.width = Math.min(300, width - rightX - 70) + "px";
        card.style.left = "55px";
        card.style.right = "auto";
      }
    });

    var tallest = 0;
    milestones.forEach(function (m) {
      tallest = Math.max(tallest, m.querySelector(".m-card").offsetHeight);
    });

    var spacing = Math.max(300, tallest + 120);
    var topPad = 130;

    points = milestones.map(function (m, i) {
      var x = (i % 2 === 0) ? leftX : rightX;
      var y = topPad + i * spacing;
      m.style.left = x + "px";
      m.style.top = y + "px";
      return { x: x, y: y };
    });

    var lastY = points[points.length - 1].y;
    var height = lastY + 360;

    box.style.height = height + "px";
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    gradient.setAttribute("y2", height);

    var d = "M " + points[0].x + " " + (points[0].y - 90) + " L " + points[0].x + " " + points[0].y;
    for (var i = 1; i < points.length; i++) {
      var a = points[i - 1];
      var b = points[i];
      var half = spacing / 2;
      d += " C " + a.x + " " + (a.y + half) + ", " + b.x + " " + (b.y - half) + ", " + b.x + " " + b.y;
    }
    d += " L " + points[points.length - 1].x + " " + (lastY + 150);

    track.setAttribute("d", d);
    main.setAttribute("d", d);
    glow.setAttribute("d", d);

    totalLength = main.getTotalLength();
    main.style.strokeDasharray = totalLength;
    glow.style.strokeDasharray = totalLength;

    if (endText) { endText.style.top = (lastY + 190) + "px"; }

    update();
  }


  function lengthAtY(targetY) {
    var low = 0;
    var high = totalLength;
    for (var i = 0; i < 22; i++) {
      var mid = (low + high) / 2;
      if (main.getPointAtLength(mid).y < targetY) { low = mid; } else { high = mid; }
    }
    return low;
  }


  function update() {
    var rect = box.getBoundingClientRect();

    var headY = window.innerHeight * 0.55 - rect.top;
    headY = Math.max(0, Math.min(headY, parseFloat(box.style.height)));

    var drawn = lengthAtY(headY);
    if (headY < points[0].y - 90) { drawn = 0; }

    main.style.strokeDashoffset = totalLength - drawn;
    glow.style.strokeDashoffset = totalLength - drawn;

    var point = main.getPointAtLength(drawn);
    head.setAttribute("cx", point.x);
    head.setAttribute("cy", point.y);
    head.setAttribute("r", 9);
    head.style.opacity = drawn > 1 ? 1 : 0;

    milestones.forEach(function (m, i) {
      m.classList.toggle("active", headY >= points[i].y - 10);
    });

    if (endText) {
      endText.classList.toggle("show", headY >= points[points.length - 1].y + 120);
    }
  }

  window.addEventListener("scroll", update);

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });

  window.addEventListener("load", build);
  build();

})();
