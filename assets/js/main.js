/* ---------- LOADER ---------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2200);
});

/* ---------- CURSOR ---------- */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
const canUseCustomCursor =
  window.matchMedia('(hover: hover) and (pointer: fine)').matches && dot && ring;

if (canUseCustomCursor) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function moveCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(moveCursor);
  })();

  document.querySelectorAll('a,button,.btn-primary,.btn-secondary,.tech-chip,.project-card,.exp-card,.contact-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.transform = 'translate(-50%,-50%) scale(1.6)';
      ring.style.borderColor = 'rgba(236,72,153,0.6)';
      dot.style.transform = 'translate(-50%,-50%) scale(0.5)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.borderColor = 'rgba(6,182,212,0.5)';
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
}

/* ---------- PARTICLE CANVAS ---------- */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const COLORS = ['#4f46e5', '#ec4899', '#06b6d4', '#f59e0b'];
const NUM = window.innerWidth <= 600 ? 35 : window.innerWidth <= 1024 ? 55 : 80;
const particles = [];

if (canvas && ctx && !reduceMotion) {
  for (let i = 0; i < NUM; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      a: Math.random() * 0.6 + 0.3,
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.c;
    ctx.globalAlpha = p.a;
    ctx.fill();
  });

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = particles[i].c;
        ctx.globalAlpha = (1 - dist / 120) * 0.15;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  ctx.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}
if (canvas && ctx && !reduceMotion) {
  drawParticles();
}

/* ---------- SCROLL REVEAL ---------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, idx) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), idx * 80);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

/* ---------- SKILL BARS ---------- */
const skillBars = document.querySelectorAll('.skill-bar-fill');
skillBars.forEach((bar) => {
  bar.style.width = '0%';
});
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const bar = e.target;
      const pct = bar.getAttribute('data-pct');
      bar.classList.add('animating');
      bar.style.width = pct + '%';
      setTimeout(() => {
        bar.classList.remove('animating');
        bar.classList.add('animated');
      }, 5000);
      barObs.unobserve(bar);
    }
  });
}, { threshold: 0.3 });
skillBars.forEach(b => barObs.observe(b));

/* ---------- HERO CARD INTERACTIONS ---------- */
const heroCardWrap = document.querySelector('.hero-card-wrap');
const heroCard = document.querySelector('.hero-3d-card');
const heroSpotlight = document.querySelector('.hero-card-spotlight');
const heroCardAvatar = document.querySelector('.card-avatar');
const heroCardName = document.querySelector('.card-name');
const heroCardRole = document.querySelector('.card-role');
const heroStatItems = document.querySelectorAll('.hero-3d-card .stat-item');

if (heroCardWrap && heroCard) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      heroCardWrap.classList.remove('intro-pending');
      heroCardWrap.classList.add('assemble-in');
    }, 2350);
  });

  heroCardWrap.addEventListener('mousemove', (e) => {
    const rect = heroCardWrap.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 18;
    const rotateX = (0.5 - py) * 16;
    heroCard.style.transform = `translateY(-7px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    if (heroSpotlight) {
      heroSpotlight.style.left = `${e.clientX - rect.left}px`;
      heroSpotlight.style.top = `${e.clientY - rect.top}px`;
    }

    if (heroCardAvatar) {
      heroCardAvatar.style.transform = `translate3d(${(px - 0.5) * 12}px, ${(py - 0.5) * 12}px, 20px)`;
    }
    if (heroCardName) {
      heroCardName.style.transform = `translate3d(${(px - 0.5) * 8}px, ${(py - 0.5) * 8}px, 14px)`;
    }
    if (heroCardRole) {
      heroCardRole.style.transform = `translate3d(${(px - 0.5) * 6}px, ${(py - 0.5) * 6}px, 10px)`;
    }
  });

  heroCardWrap.addEventListener('mouseleave', () => {
    heroCard.style.transform = '';
    if (heroCardAvatar) heroCardAvatar.style.transform = '';
    if (heroCardName) heroCardName.style.transform = '';
    if (heroCardRole) heroCardRole.style.transform = '';
    heroStatItems.forEach((item) => { item.style.transform = ''; });
  });

  heroCard.addEventListener('click', (e) => {
    const rect = heroCard.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'hero-click-ripple';
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    heroCard.appendChild(ripple);
    setTimeout(() => ripple.remove(), 720);
  });
}

heroStatItems.forEach((item) => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const tx = (x - 0.5) * 8;
    const ty = (y - 0.5) * 8;
    item.style.transform = `translate(${tx}px, ${ty - 2}px)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

const statNums = document.querySelectorAll('.stat-num[data-count]');
const statObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const decimals = Number.isInteger(target) ? 0 : 1;
    const duration = 1300;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = `${value.toFixed(decimals)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    observer.unobserve(el);
  });
}, { threshold: 0.35 });

statNums.forEach((el) => statObserver.observe(el));

/* ---------- MOBILE NAV ---------- */
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});
