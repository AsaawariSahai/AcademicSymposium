/* ============================================================
   HUMANITY IN TRANSITION — shared behaviour
============================================================ */

// ---- Nav toggle (mobile) ----
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('is-open');
  document.getElementById('navToggle').classList.toggle('is-open');
}

// ---- Dropdown (click support for touch/mobile; hover handles desktop via CSS) ----
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-dropdown > .nav-link').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 980) {
        e.preventDefault();
        trigger.parentElement.classList.toggle('open');
      }
    });
  });

  document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
});

// ---- Countdown to 5 Nov 2026, 09:00 IST ----
function startCountdown(targetISO) {
  const target = new Date(targetISO);
  const els = {
    d: document.getElementById('cd-days'),
    h: document.getElementById('cd-hours'),
    m: document.getElementById('cd-mins'),
    s: document.getElementById('cd-secs'),
  };
  if (!els.d) return;
  function tick() {
    const diff = target - new Date();
    if (diff <= 0) {
      els.d.textContent = els.h.textContent = els.m.textContent = els.s.textContent = '00';
      return;
    }
    els.d.textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
    els.h.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    els.m.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    els.s.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);
}

// ---- Stat counters (count up shortly after load) ----
function initCounters() {
  const cells = document.querySelectorAll('.stat-num[data-count]');
  if (!cells.length) return;
  const run = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const dur = 1100;
    const start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };
  cells.forEach(c => run(c));
}

// ============================================================
// DOT FIELD — formal constellation network for the home hero
// Slow-drifting nodes in navy/red on the light background,
// linking when close, with a gentle pointer-follow drift.
// ============================================================
function initDotField() {
  const canvas = document.getElementById('dotfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [];
  let mouseX = -9999, mouseY = -9999;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    build();
  }

  function build() {
    const count = Math.min(130, Math.floor((W * H) / 8500));
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 1.9 + 1.5,
        accent: Math.random() < 0.2,
      });
    }
  }

  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  canvas.parentElement.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

  const linkDist = 155;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      const dx = n.x - mouseX, dy = n.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110) {
        const push = (110 - dist) / 110 * 0.04;
        n.x += (dx / (dist || 1)) * push;
        n.y += (dy / (dist || 1)) * push;
      }
      if (n.x < -10) n.x = W + 10; if (n.x > W + 10) n.x = -10;
      if (n.y < -10) n.y = H + 10; if (n.y > H + 10) n.y = -10;
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < linkDist) {
          const alpha = (1 - d / linkDist) * 0.32;
          ctx.strokeStyle = `rgba(10,38,71,${alpha})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.accent ? 'rgba(166,25,46,0.75)' : 'rgba(10,38,71,0.55)';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

document.addEventListener('DOMContentLoaded', () => {
  initDotField();
  initCounters();
});
