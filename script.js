const header = document.getElementById('siteHeader');
const progress = document.getElementById('scrollProgress');
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('mainNav');

function onScroll() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const percent = total > 0 ? (window.scrollY / total) * 100 : 0;
  progress.style.width = `${percent}%`;
  header.classList.toggle('scrolled', window.scrollY > 30);
}

window.addEventListener('scroll', onScroll);
onScroll();

menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeLightbox = document.getElementById('closeLightbox');

// Media fallback: if relative paths fail in some hosting modes, retry with root-relative paths.
function withRootPath(path) {
  return path.startsWith('./') ? path.slice(1) : path;
}

document.querySelectorAll('img').forEach((img) => {
  img.addEventListener('error', () => {
    if (!img.dataset.fallbackTried) {
      img.dataset.fallbackTried = '1';
      img.src = withRootPath(img.getAttribute('src') || '');
    }
  });
});

document.querySelectorAll('video').forEach((video) => {
  video.addEventListener('error', () => {
    const source = video.querySelector('source');
    if (source && !source.dataset.fallbackTried) {
      source.dataset.fallbackTried = '1';
      source.src = withRootPath(source.getAttribute('src') || '');
      video.load();
    }
  });
});

document.querySelectorAll('#galleryGrid button').forEach(btn => {
  btn.addEventListener('click', () => {
    lightboxImg.src = btn.dataset.img;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

function closeGallery() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
}

closeLightbox.addEventListener('click', closeGallery);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeGallery();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeGallery();
});
