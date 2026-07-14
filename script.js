const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');
const themeToggle = document.querySelector('.theme-toggle');
const scrollTop = document.querySelector('.scroll-top');

function formatTenure(startDateStr) {
  const start = new Date(startDateStr);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  if (now.getDate() < start.getDate()) months--;
  if (months < 0) { years--; months += 12; }
  const parts = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (months > 0 || years === 0) parts.push(`${months} mo${months !== 1 ? 's' : ''}`);
  return parts.join(' ');
}

if (themeToggle) {
  const icon = themeToggle.querySelector('i');
  const savedTheme = localStorage.getItem('theme');
  const isLight = savedTheme === 'light';
  document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
  if (icon) icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (icon) icon.className = nextTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
  });
}

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
  });
  document.querySelectorAll('.nav-menu a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  });
}, { threshold: 0.35 });

document.querySelectorAll('section[id]').forEach((section) => sectionObserver.observe(section));

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 18);
  scrollTop.classList.toggle('visible', window.scrollY > 420);
});

if (scrollTop) {
  scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

const tenureEl = document.querySelector('[data-tenure-start]');
if (tenureEl) {
  const start = tenureEl.getAttribute('data-tenure-start');
  const parent = tenureEl.closest('.timeline-date') || tenureEl.parentElement;
  if (parent) {
    parent.textContent = `Mar 2026 – Present · ${formatTenure(start)}`;
  } else {
    tenureEl.textContent = formatTenure(start);
  }
}

const roleEl = document.querySelector('.hero-role');
if (roleEl) {
  const text = roleEl.dataset.text || roleEl.textContent;
  roleEl.textContent = '';
  let index = 0;
  const type = () => {
    if (index < text.length) {
      roleEl.textContent += text[index];
      index += 1;
      setTimeout(type, 45);
    }
  };
  type();
}
