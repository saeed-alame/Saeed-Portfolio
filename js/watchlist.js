


(function () {

  document.documentElement.classList.add("snap");

  var rings = [];
  var activeRing = null;
  var lastX = 0;
  var movedDistance = 0;


  document.querySelectorAll(".ring").forEach(function (ringEl) {

    var cards = [];

    Array.prototype.slice.call(ringEl.querySelectorAll("img")).forEach(function (img) {
      var card = document.createElement("div");
      card.className = "ring-card";
      card.dataset.label = img.alt || "Image";
      card.dataset.path = img.getAttribute("src");

      img.parentNode.insertBefore(card, img);
      card.appendChild(img);
      cards.push(card);

      function markMissing() {
        card.classList.add("missing");
        img.style.display = "none";
      }
      img.addEventListener("error", markMissing);
      if (img.complete && img.naturalWidth === 0) { markMissing(); }
    });

    var ring = {
      el: ringEl,
      cards: cards,
      rotation: 0,
      velocity: 0,
      speed: 0.25,
      targetSpeed: 0.25,
      radius: 300,
      angle: 360 / cards.length,
      visible: false,
      scene: ringEl.closest(".ring-scene")
    };

    rings.push(ring);
    arrange(ring);

    new IntersectionObserver(function (entries) {
      ring.visible = entries[0].isIntersecting;
    }).observe(ring.scene);

    ring.scene.addEventListener("mouseenter", function () { ring.targetSpeed = 0.05; });
    ring.scene.addEventListener("mouseleave", function () { ring.targetSpeed = 0.25; });

    ring.scene.addEventListener("pointerdown", function (e) {
      activeRing = ring;
      lastX = e.clientX;
      movedDistance = 0;
    });
  });


  function arrange(ring) {
    var cardWidth = ring.cards[0].offsetWidth || 180;
    ring.radius = Math.round((cardWidth / 2) / Math.tan(Math.PI / ring.cards.length)) + 90;

    ring.cards.forEach(function (card, i) {
      card.style.transform = "rotateY(" + (i * ring.angle) + "deg) translateZ(" + ring.radius + "px)";
    });
  }

  window.addEventListener("resize", function () {
    rings.forEach(arrange);
  });


  window.addEventListener("pointermove", function (e) {
    if (!activeRing) { return; }
    var dx = e.clientX - lastX;
    lastX = e.clientX;
    movedDistance += Math.abs(dx);
    activeRing.rotation += dx * 0.4;
    activeRing.velocity = dx * 0.4;
  });

  window.addEventListener("pointerup", function (e) {
    if (activeRing && movedDistance < 6) {
      var card = e.target.closest ? e.target.closest(".ring-card") : null;
      if (card && !card.classList.contains("missing")) {
        openLightbox(card.querySelector("img").src);
      }
    }
    activeRing = null;
  });


  function animate() {
    rings.forEach(function (ring) {
      if (!ring.visible) { return; }

      ring.speed += (ring.targetSpeed - ring.speed) * 0.05;

      if (activeRing !== ring) {
        ring.rotation += ring.speed + ring.velocity;
        ring.velocity *= 0.95;
      }

      ring.el.style.transform = "translateZ(" + (-ring.radius) + "px) rotateY(" + ring.rotation + "deg)";

      ring.cards.forEach(function (card, i) {
        var total = (i * ring.angle + ring.rotation) * Math.PI / 180;
        var facing = Math.cos(total);
        var brightness = 0.3 + 0.7 * ((facing + 1) / 2);
        card.style.filter = "brightness(" + brightness.toFixed(2) + ")";
      });
    });

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);


  var lightbox = document.createElement("div");
  lightbox.id = "lightbox";
  lightbox.innerHTML = '<img src="" alt="">';
  document.body.appendChild(lightbox);

  function openLightbox(src) {
    lightbox.querySelector("img").src = src;
    lightbox.classList.add("open");
  }

  lightbox.addEventListener("click", function () {
    lightbox.classList.remove("open");
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { lightbox.classList.remove("open"); }
  });


  var sections = document.querySelectorAll(".show-section");
  var dotList = document.createElement("ul");
  dotList.className = "side-dots";

  sections.forEach(function (section) {
    var li = document.createElement("li");
    li.innerHTML = '<a href="#' + section.id + '" data-title="' + section.dataset.title + '"></a>';
    dotList.appendChild(li);
  });
  document.body.appendChild(dotList);

  var dotLinks = dotList.querySelectorAll("a");

  var dotObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        dotLinks.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(function (section) { dotObserver.observe(section); });

})();
