/* ============================================================
   L4K TECHNOLOGY — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  initLoader();
  initNavbar();
  initHeroRotator();
  initCounters();
  initReveal();
  initTestimonialSlider();
  initHeroParallax();
});


/* ---------- Loading Screen ---------- */
function initLoader(){
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Set stroke lengths for the draw animation dynamically per path
  document.querySelectorAll('.stroke-draw').forEach(path => {
    const len = path.getTotalLength ? path.getTotalLength() : 300;
    path.style.setProperty('--len', len);
  });

  document.body.style.overflow = 'hidden';

  const finish = () => {
    loader.classList.add('hide');
    document.body.style.overflow = '';
    setTimeout(() => loader.remove(), 800);
  };

  window.addEventListener('load', () => {
    setTimeout(finish, 2500);
  });
  // fallback in case load event already fired
  setTimeout(() => {
    if (document.readyState === 'complete') finish();
  }, 2600);
}

/* ---------- Navbar ---------- */
function initNavbar(){
  const nav = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toggle && links){
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    }));
  }
}

/* ---------- Hero Rotating Headline ---------- */
function initHeroRotator(){
  const headlines = document.querySelectorAll('.headline');
  if (!headlines.length) return;
  let idx = 0;
  headlines[0].classList.add('active');

  const interval = 2200; // visible duration between swaps
  setInterval(() => {
    const current = headlines[idx];
    const nextIdx = (idx + 1) % headlines.length;
    const next = headlines[nextIdx];

    current.classList.remove('active');
    current.style.position = 'absolute';

    next.style.position = 'relative';
    // force reflow so transition applies
    void next.offsetWidth;
    next.classList.add('active');

    idx = nextIdx;
  }, interval);
}

/* ---------- Animated Counters ---------- */
function initCounters(){
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = el.getAttribute('data-count');
    const numMatch = target.match(/[\d.]+/);
    if (!numMatch) { el.textContent = target; return; }
    const num = parseFloat(numMatch[0]);
    const suffix = target.replace(numMatch[0], '');
    const duration = 1400;
    const start = performance.now();

    function step(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * num);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = num + suffix;
    }
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
}

/* ---------- Scroll Reveal ---------- */
function initReveal(){
  const els = document.querySelectorAll('.reveal, .reveal-scale');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}

/* ---------- Testimonial Slider ---------- */
function initTestimonialSlider(){
  const track = document.querySelector('.testimonial-track');
  const dotsWrap = document.querySelector('.slider-dots');
  if (!track || !dotsWrap) return;
  const cards = track.children;
  let index = 0;
  const dots = dotsWrap.querySelectorAll('button');

  function goTo(i){
    index = (i + cards.length) % cards.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === index));
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  let auto = setInterval(() => goTo(index + 1), 5000);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(auto));
  track.parentElement.addEventListener('mouseleave', () => {
    auto = setInterval(() => goTo(index + 1), 5000);
  });

  goTo(0);
}

/* ---------- Hero Visual Parallax (mouse move) ---------- */
function initHeroParallax(){
  const visual = document.querySelector('.hero-visual');
  if (!visual) return;
  const svg = visual.querySelector('svg');
  if (!svg) return;

  window.addEventListener('mousemove', (e) => {
    const rect = visual.getBoundingClientRect();
    const relX = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const relY = (e.clientY - rect.top - rect.height / 2) / rect.height;
    svg.style.transform = `rotateY(${relX * 8}deg) rotateX(${-relY * 8}deg)`;
  });
}