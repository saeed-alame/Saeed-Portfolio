










(function () {

  // ---------- 1. create the layers ----------
  var aurora = document.createElement("div");
  aurora.className = "aurora";
  aurora.innerHTML = "<span></span><span></span><span></span>";
  document.body.prepend(aurora);

  var glow = document.createElement("div");
  glow.id = "mouse-glow";
  document.body.prepend(glow);

  var canvas = document.createElement("canvas");
  canvas.id = "bg-canvas";
  document.body.prepend(canvas);

  var ctx = canvas.getContext("2d");

  // ---------- 2. colors come from the page theme ----------
  var styles = getComputedStyle(document.body);
  var colors = [
    styles.getPropertyValue("--accent").trim(),
    styles.getPropertyValue("--accent2").trim(),
    styles.getPropertyValue("--accent3").trim(),
    "white"
  ];

  // ---------- 3. variables ----------
  var width = 0;
  var height = 0;
  var particles = [];
  var ripples = [];
  var shootingStars = [];

  var mouse = { x: -1000, y: -1000 };       // real mouse position
  var smooth = { x: 0, y: 0 };              // slowly follows the mouse

  var mouseRadius = 160;      // how far the mouse pushes particles
  var linkDistance = 120;     // max distance for a line between 2 particles

  // ---------- 4. particles ----------
  function makeParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      dx: (Math.random() - 0.5) * 0.5,      // slow drift that never stops
      dy: (Math.random() - 0.5) * 0.5,
      vx: 0,                                // push from mouse / ripples (fades away)
      vy: 0,
      size: Math.random() * 2 + 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2    // used for twinkling
    };
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    var amount = Math.floor((width * height) / 14000);
    amount = Math.max(50, Math.min(amount, 130));

    particles = [];
    for (var i = 0; i < amount; i++) {
      particles.push(makeParticle());
    }

    smooth.x = width / 2;
    smooth.y = height / 2;
  }

  // ---------- 5. mouse + touch + click ----------
  window.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("touchmove", function (e) {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener("mouseout", function () {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  window.addEventListener("click", function (e) {
    ripples.push({ x: e.clientX, y: e.clientY, radius: 0, alpha: 1 });
  });

  window.addEventListener("resize", resize);

  // ---------- 6. shooting stars ----------
  function addShootingStar() {
    shootingStars.push({
      x: Math.random() * width * 0.8,
      y: Math.random() * height * 0.4,
      vx: 9 + Math.random() * 4,
      vy: 4 + Math.random() * 3,
      life: 0
    });
    setTimeout(addShootingStar, 3000 + Math.random() * 4000);
  }

  // ---------- 7. draw loop ----------
  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    // the soft cloud + glow follow the mouse slowly
    var targetX = mouse.x > -500 ? mouse.x : width / 2;
    var targetY = mouse.y > -500 ? mouse.y : height / 2;
    smooth.x += (targetX - smooth.x) * 0.06;
    smooth.y += (targetY - smooth.y) * 0.06;

    glow.style.transform = "translate(" + (smooth.x - 260) + "px, " + (smooth.y - 260) + "px)";
    aurora.style.transform = "translate(" + (-(smooth.x - width / 2) * 0.03) + "px, " + (-(smooth.y - height / 2) * 0.03) + "px)";

    // update + draw ripples
    for (var r = ripples.length - 1; r >= 0; r--) {
      var rip = ripples[r];
      rip.radius += 7;
      rip.alpha -= 0.014;
      if (rip.alpha <= 0) {
        ripples.splice(r, 1);
        continue;
      }
      ctx.globalAlpha = rip.alpha;
      ctx.strokeStyle = colors[0];
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = colors[1];
      ctx.beginPath();
      ctx.arc(rip.x, rip.y, rip.radius * 0.65, 0, Math.PI * 2);
      ctx.stroke();
    }

    
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      
      var mx = p.x - mouse.x;
      var my = p.y - mouse.y;
      var mDist = Math.sqrt(mx * mx + my * my);
      if (mDist < mouseRadius && mDist > 0) {
        var force = (mouseRadius - mDist) / mouseRadius;
        p.vx += (mx / mDist) * force * 0.7;
        p.vy += (my / mDist) * force * 0.7;
      }

      
      for (var k = 0; k < ripples.length; k++) {
        var rx = p.x - ripples[k].x;
        var ry = p.y - ripples[k].y;
        var rDist = Math.sqrt(rx * rx + ry * ry);
        if (Math.abs(rDist - ripples[k].radius) < 30 && rDist > 0) {
          p.vx += (rx / rDist) * 1.2;
          p.vy += (ry / rDist) * 1.2;
        }
      }

      
      p.x += p.dx + p.vx;
      p.y += p.dy + p.vy;
      p.vx *= 0.94;
      p.vy *= 0.94;

      // 4) wrap around the screen edges
      if (p.x < 0) { p.x = width; }
      if (p.x > width) { p.x = 0; }
      if (p.y < 0) { p.y = height; }
      if (p.y > height) { p.y = 0; }
    }

    // draw lines between close particles
    ctx.lineWidth = 1;
    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var lx = particles[a].x - particles[b].x;
        var ly = particles[a].y - particles[b].y;
        var lDist = Math.sqrt(lx * lx + ly * ly);
        if (lDist < linkDistance) {
          ctx.globalAlpha = (1 - lDist / linkDistance) * 0.35;
          ctx.strokeStyle = colors[0];
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }

    // the mouse "grabs" nearby particles with brighter lines
    for (var m = 0; m < particles.length; m++) {
      var gx = particles[m].x - mouse.x;
      var gy = particles[m].y - mouse.y;
      var gDist = Math.sqrt(gx * gx + gy * gy);
      if (gDist < mouseRadius + 60) {
        ctx.globalAlpha = (1 - gDist / (mouseRadius + 60)) * 0.7;
        ctx.strokeStyle = colors[1];
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(particles[m].x, particles[m].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }

    // draw the glowing dots (they twinkle)
    for (var d = 0; d < particles.length; d++) {
      var dot = particles[d];
      var twinkle = 0.55 + 0.45 * Math.sin(time * 0.002 + dot.phase);
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = dot.color;
      ctx.shadowBlur = 12;
      ctx.shadowColor = dot.color;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // shooting stars
    for (var s = shootingStars.length - 1; s >= 0; s--) {
      var star = shootingStars[s];
      star.x += star.vx;
      star.y += star.vy;
      star.life -= 0.012;
      if (star.life <= 0) {
        shootingStars.splice(s, 1);
        continue;
      }
      ctx.globalAlpha = star.life;
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(star.x, star.y);
      ctx.lineTo(star.x - star.vx * 6, star.y - star.vy * 6);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  // ---------- 8. start ----------
  resize();
  setTimeout(addShootingStar, 2000);
  requestAnimationFrame(draw);

})();
