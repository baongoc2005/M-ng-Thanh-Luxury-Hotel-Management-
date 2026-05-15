// ===== CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px';
});
function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.left = followerX + 'px'; follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// ===== SCROLL PROGRESS =====
const progressBar = document.createElement('div');
progressBar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:#c9a96e;z-index:9999;width:0%;transition:width 0.1s linear;';
document.body.prepend(progressBar);
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = pct + '%';
});

// ===== LOADER =====
const loader = document.getElementById('loader');
const progress = document.getElementById('loaderProgress');
let prog = 0;
const interval = setInterval(() => {
  prog += Math.random() * 25;
  if (prog >= 100) { prog = 100; clearInterval(interval); }
  progress.style.width = prog + '%';
}, 200);
window.addEventListener('load', () => {
  setTimeout(() => { loader.classList.add('hidden'); }, 1800);
  setTimeout(() => { document.getElementById('heroImg').classList.add('loaded'); }, 2200);
  setTimeout(() => { animateHero(); }, 2000);
});

// ===== HERO ANIMATION =====
function animateHero() {
  const label = document.querySelector('.hero-label');
  const lines = document.querySelectorAll('.title-line');
  const sub = document.querySelector('.hero-sub');
  const cta = document.querySelector('.hero-cta');
  const stats = document.querySelector('.hero-stats');
  const scroll = document.querySelector('.hero-scroll');

  label.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  label.style.opacity = '1'; label.style.transform = 'translateY(0)';

  lines.forEach((line, i) => {
    const inner = document.createElement('span');
    inner.innerHTML = line.innerHTML;
    line.innerHTML = '';
    line.appendChild(inner);
    setTimeout(() => {
      inner.style.transition = 'transform 1s cubic-bezier(0.16,1,0.3,1), opacity 0.8s ease';
      inner.style.transform = 'translateY(0)'; inner.style.opacity = '1';
    }, 200 + i * 150);
  });

  [sub, cta, stats, scroll].forEach((el, i) => {
    if (!el) return;
    setTimeout(() => {
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      el.style.opacity = '1'; el.style.transform = 'translateY(0)';
    }, 700 + i * 150);
  });
}

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
});

// ===== MOBILE MENU =====
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
    spans[1].style.transform = 'rotate(-45deg) translate(4px, -4px)';
  } else {
    spans[0].style.transform = ''; spans[1].style.transform = '';
  }
});
mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => s.style.transform = '');
  });
});

// ===== REVEAL ON SCROLL =====
const reveals = document.querySelectorAll('.reveal-up');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = parseFloat(e.target.dataset.delay || 0);
      setTimeout(() => e.target.classList.add('visible'), delay * 1000);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObs.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el, target) {
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 25);
}
const statNums = document.querySelectorAll('.stat-num');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target, parseInt(e.target.dataset.target));
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => counterObs.observe(el));

// ===== PARALLAX HERO =====
window.addEventListener('scroll', () => {
  const heroImg = document.getElementById('heroImg');
  if (heroImg) {
    const scrolled = window.scrollY;
    heroImg.style.transform = `scale(1) translateY(${scrolled * 0.25}px)`;
  }
});

// ===== DEST CARDS STAGGER =====
const destCards = document.querySelectorAll('.dest-card');
const destObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      const idx = parseInt(e.target.dataset.index || 0);
      setTimeout(() => {
        e.target.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)';
      }, idx * 120);
      destObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
destCards.forEach(el => {
  el.style.opacity = '0'; el.style.transform = 'translateY(40px)';
  destObs.observe(el);
});

// ===== TESTIMONIAL SLIDER =====
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
function goToSlide(index) {
  testimonials[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  testimonials[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}
dots.forEach(dot => dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index))));
setInterval(() => goToSlide((currentSlide + 1) % testimonials.length), 5000);

// ===== BOOKING FORM =====
document.getElementById('bookingForm').addEventListener('submit', e => {
  e.preventDefault();
  const dest = document.getElementById('bookingDest').value;
  const checkIn = document.getElementById('checkIn').value;
  const checkOut = document.getElementById('checkOut').value;
  const guests = document.getElementById('guests').value.replace(/\D/g,'') || '2';
  const params = new URLSearchParams({ dest, checkIn, checkOut, guests });
  window.location.href = 'search.html?' + params.toString();
});

// ===== DATE DEFAULTS =====
const today = new Date();
const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfter = new Date(today); dayAfter.setDate(dayAfter.getDate() + 2);
const fmt = d => d.toISOString().split('T')[0];
document.getElementById('checkIn').value = fmt(tomorrow);
document.getElementById('checkOut').value = fmt(dayAfter);
document.getElementById('checkIn').min = fmt(today);
document.getElementById('checkOut').min = fmt(tomorrow);

// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
