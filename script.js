/**
 * Ron do Povo 11333 — Interactive Script
 * Handles Navigation, Accessibility tools, Jingle Audio Player,
 * Canvas Photo Frame Generator, Modals and Scroll Spy.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. MOBILE DRAWER & NAV ---
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const drawer = document.querySelector('[data-menu]');
  const drawerOverlay = document.querySelector('[data-drawer-overlay]');
  const drawerCloseBtn = document.querySelector('[data-menu-close]');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopNavLinks = document.querySelectorAll('.header__nav .nav-link');
  const reveals = document.querySelectorAll('.reveal');

  function openDrawer() {
    drawer?.classList.add('is-open');
    drawerOverlay?.classList.add('is-open');
    menuToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer?.classList.remove('is-open');
    drawerOverlay?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuToggle?.addEventListener('click', () => {
    const isOpen = drawer?.classList.contains('is-open');
    if (isOpen) closeDrawer();
    else openDrawer();
  });

  drawerCloseBtn?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', closeDrawer);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // --- 2. ACCESSIBILITY CONTROLS ---
  const htmlEl = document.documentElement;
  let currentFontSize = 16;
  const minFontSize = 12;
  const maxFontSize = 22;

  const btnFontDec = document.getElementById('btn-font-dec');
  const btnFontInc = document.getElementById('btn-font-inc');
  const btnFontReset = document.getElementById('btn-font-reset');
  const btnContrast = document.getElementById('btn-contrast');
  const btnDarkMode = document.getElementById('btn-darkmode');
  const btnLibras = document.getElementById('btn-libras');
  const floatingAccessBtn = document.getElementById('floating-access-btn');

  btnFontDec?.addEventListener('click', () => {
    if (currentFontSize > minFontSize) {
      currentFontSize -= 1;
      htmlEl.style.fontSize = `${currentFontSize}px`;
    }
  });

  btnFontInc?.addEventListener('click', () => {
    if (currentFontSize < maxFontSize) {
      currentFontSize += 1;
      htmlEl.style.fontSize = `${currentFontSize}px`;
    }
  });

  btnFontReset?.addEventListener('click', () => {
    currentFontSize = 16;
    htmlEl.style.fontSize = '16px';
  });

  btnContrast?.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    if (currentTheme === 'contrast') {
      htmlEl.setAttribute('data-theme', 'default');
    } else {
      htmlEl.setAttribute('data-theme', 'contrast');
    }
  });

  btnDarkMode?.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      htmlEl.setAttribute('data-theme', 'default');
    } else {
      htmlEl.setAttribute('data-theme', 'dark');
    }
  });

  btnLibras?.addEventListener('click', () => {
    alert('Acessibilidade em Libras ativada. Suporte integrado para tradução em Libras.');
  });

  floatingAccessBtn?.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    if (currentTheme === 'contrast') {
      htmlEl.setAttribute('data-theme', 'default');
    } else {
      htmlEl.setAttribute('data-theme', 'contrast');
    }
  });

  // --- 3. JINGLE AUDIO PLAYER ---
  const audio = document.getElementById('audio-jingle');
  const playBtn = document.getElementById('jingle-play-btn');
  const iconPlay = playBtn?.querySelector('.icon-play');
  const iconPause = playBtn?.querySelector('.icon-pause');
  const progressFill = document.getElementById('jingle-progress-fill');
  const curTimeEl = document.getElementById('jingle-cur-time');
  const durTimeEl = document.getElementById('jingle-dur-time');
  const soundWave = document.getElementById('sound-wave');
  const progressBar = document.querySelector('.jingle-progress-bar');

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  if (audio && playBtn) {
    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().then(() => {
          iconPlay?.classList.add('visually-hidden');
          iconPause?.classList.remove('visually-hidden');
          soundWave?.classList.add('is-playing');
        }).catch(err => {
          console.log('Audio play notice:', err);
        });
      } else {
        audio.pause();
        iconPlay?.classList.remove('visually-hidden');
        iconPause?.classList.add('visually-hidden');
        soundWave?.classList.remove('is-playing');
      }
    });

    audio.addEventListener('loadedmetadata', () => {
      if (durTimeEl) durTimeEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      if (curTimeEl) curTimeEl.textContent = formatTime(audio.currentTime);
      if (progressFill && audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${percent}%`;
      }
    });

    audio.addEventListener('ended', () => {
      iconPlay?.classList.remove('visually-hidden');
      iconPause?.classList.add('visually-hidden');
      soundWave?.classList.remove('is-playing');
      if (progressFill) progressFill.style.width = '0%';
    });

    progressBar?.addEventListener('click', (e) => {
      if (!audio.duration) return;
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      audio.currentTime = (clickX / width) * audio.duration;
    });
  }

  // --- 4. PHOTO FRAME GENERATOR (CANVAS) ---
  const photoInput = document.getElementById('user-photo-input');
  const downloadBtn = document.getElementById('download-framed-photo');
  const canvas = document.getElementById('photo-frame-canvas');
  const placeholderOverlay = document.getElementById('canvas-placeholder-overlay');

  if (canvas && photoInput) {
    const ctx = canvas.getContext('2d');
    const frameImg = new Image();
    frameImg.src = 'images/moldura-foto-perfil.png';

    photoInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const userImg = new Image();
        userImg.onload = () => {
          canvas.width = 600;
          canvas.height = 600;

          // Clear canvas
          ctx.clearRect(0, 0, 600, 600);

          // Calculate scaling and center crop for user image
          const aspectCanvas = 600 / 600;
          const aspectImg = userImg.width / userImg.height;
          let drawWidth, drawHeight, offsetX, offsetY;

          if (aspectImg > aspectCanvas) {
            drawHeight = 600;
            drawWidth = 600 * aspectImg;
            offsetX = -(drawWidth - 600) / 2;
            offsetY = 0;
          } else {
            drawWidth = 600;
            drawHeight = 600 / aspectImg;
            offsetX = 0;
            offsetY = -(drawHeight - 600) / 2;
          }

          // Draw user photo
          ctx.drawImage(userImg, offsetX, offsetY, drawWidth, drawHeight);

          // Draw frame over user image
          if (frameImg.complete) {
            ctx.drawImage(frameImg, 0, 0, 600, 600);
          } else {
            frameImg.onload = () => {
              ctx.drawImage(frameImg, 0, 0, 600, 600);
            };
          }

          // Hide placeholder overlay and enable download
          placeholderOverlay?.classList.add('is-hidden');
          if (downloadBtn) {
            downloadBtn.removeAttribute('disabled');
            downloadBtn.classList.remove('btn-download-frame:disabled');
          }
        };
        userImg.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });

    downloadBtn?.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'Foto-Apoio-Ron-do-Povo-11333.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

  // --- 5. MODALS (SEARCH & COOKIES) ---
  const searchModal = document.getElementById('search-modal');
  const openSearchBtn = document.getElementById('open-search-modal');
  const closeSearchBtn = document.getElementById('close-search-modal');
  const searchInput = document.getElementById('search-input');

  openSearchBtn?.addEventListener('click', () => {
    searchModal?.classList.add('is-active');
    searchModal?.setAttribute('aria-hidden', 'false');
    searchInput?.focus();
  });

  closeSearchBtn?.addEventListener('click', () => {
    searchModal?.classList.remove('is-active');
    searchModal?.setAttribute('aria-hidden', 'true');
  });

  const cookieModal = document.getElementById('cookie-modal');
  const openCookieBtn = document.getElementById('open-cookie-modal');
  const closeCookieBtn = document.getElementById('close-cookie-modal');
  const saveCookieBtn = document.getElementById('btn-save-cookies');

  openCookieBtn?.addEventListener('click', () => {
    cookieModal?.classList.add('is-active');
    cookieModal?.setAttribute('aria-hidden', 'false');
  });

  closeCookieBtn?.addEventListener('click', () => {
    cookieModal?.classList.remove('is-active');
    cookieModal?.setAttribute('aria-hidden', 'true');
  });

  saveCookieBtn?.addEventListener('click', () => {
    cookieModal?.classList.remove('is-active');
    cookieModal?.setAttribute('aria-hidden', 'true');
    alert('Preferências salvas com sucesso!');
  });

  // Close modals on click outside
  window.addEventListener('click', (e) => {
    if (e.target === searchModal) searchModal.classList.remove('is-active');
    if (e.target === cookieModal) cookieModal.classList.remove('is-active');
  });

  // --- 6. SCROLL SPY & REVEALS ---
  const sections = document.querySelectorAll('main > section[id]');

  function updateActiveNav() {
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('is-active');
          } else {
            link.classList.remove('is-active');
          }
        });

        mobileNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('is-active');
          } else {
            link.classList.remove('is-active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -20px 0px'
    });

    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('is-visible');
      } else {
        revealObserver.observe(el);
      }
    });
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }
});
