/* ============================================================
   MAPALA Universitas Semarang – Media Publikasi Resmi
   script.js | Versi 1.0
   ============================================================ */

(function () {
  'use strict';

  /* ===================================================
     1. LOADING SCREEN
     =================================================== */
  const loadingScreen = document.getElementById('loading-screen');

  function hideLoading() {
    document.body.classList.remove('loading-active');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      // Remove from DOM after transition ends
      loadingScreen.addEventListener('transitionend', () => {
        loadingScreen.remove();
      }, { once: true });
    }
  }

  // Add class to prevent scroll during loading
  document.body.classList.add('loading-active');

  // Hide loading screen after page is fully loaded (or 2s max)
  window.addEventListener('load', () => {
    setTimeout(hideLoading, 800);
  });

  // Safety fallback
  setTimeout(hideLoading, 2500);


  /* ===================================================
     2. STICKY NAVBAR
     =================================================== */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Active nav link based on scroll position
  function updateActiveNavLink() {
    const sections = ['beranda', 'publikasi', 'tentang'];
    let current   = 'beranda';

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) {
        current = id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    handleNavbarScroll();
    updateActiveNavLink();
  }, { passive: true });

  handleNavbarScroll();


  /* ===================================================
     3. HAMBURGER MENU
     =================================================== */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu      = document.getElementById('nav-menu');

  function toggleMenu() {
    if (!hamburgerBtn || !navMenu) return;
    const isOpen = navMenu.classList.toggle('open');
    hamburgerBtn.classList.toggle('open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', isOpen.toString());
  }

  function closeMenu() {
    if (!navMenu || !hamburgerBtn) return;
    navMenu.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMenu);
  }

  // Close menu on nav link click
  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (
      navMenu &&
      navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !hamburgerBtn.contains(e.target)
    ) {
      closeMenu();
    }
  });


  /* ===================================================
     4. SMOOTH SCROLL
     =================================================== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId  = this.getAttribute('href').slice(1);
      const targetEl  = document.getElementById(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const navH   = navbar ? navbar.offsetHeight : 0;
      const offset = targetEl.getBoundingClientRect().top + window.scrollY - navH - 16;

      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });


  /* ===================================================
     5. FADE-UP ON SCROLL (Intersection Observer)
     =================================================== */
  const fadeElements = document.querySelectorAll('.fade-up');

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  fadeElements.forEach((el, i) => {
    // Stagger delay for multiple elements
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    fadeObserver.observe(el);
  });


  /* ===================================================
     6. BACK TO TOP
     =================================================== */
  const backToTopBtn = document.getElementById('back-to-top');

  function handleBackToTop() {
    if (!backToTopBtn) return;
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleBackToTop, { passive: true });
  handleBackToTop();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ===================================================
     7. SHARE BUTTONS
     =================================================== */

  // WhatsApp Share
  const btnShareWa = document.getElementById('btn-share-wa');
  if (btnShareWa) {
    btnShareWa.addEventListener('click', () => {
      const title = 'KONSERVASI – TBRS MAPALA USM';
      const url   = window.location.href;
      const text  = encodeURIComponent(`*${title}*\n"Menjaga Sumber Kehidupan, Merawat Masa Depan"\n\n${url}`);
      window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
    });
  }

  // Copy Link
  const btnCopyLink = document.getElementById('btn-copy-link');
  const copyToast   = document.getElementById('copy-toast');

  if (btnCopyLink) {
    btnCopyLink.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showCopyToast();
      } catch {
        // Fallback for older browsers
        const textarea       = document.createElement('textarea');
        textarea.value       = window.location.href;
        textarea.style.position = 'fixed';
        textarea.style.opacity  = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showCopyToast();
      }
    });
  }

  function showCopyToast() {
    if (!copyToast) return;
    copyToast.classList.add('visible');
    setTimeout(() => copyToast.classList.remove('visible'), 2200);
  }


  /* ===================================================
     8. LIGHTBOX
     =================================================== */
  const lightbox         = document.getElementById('lightbox');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxImg      = document.getElementById('lightbox-img');
  const lightboxCaption  = document.getElementById('lightbox-caption');
  const lightboxClose    = document.getElementById('lightbox-close');
  const lightboxPrev     = document.getElementById('lightbox-prev');
  const lightboxNext     = document.getElementById('lightbox-next');
  const lightboxCounter  = document.getElementById('lightbox-counter');

  // Build gallery data from gallery items
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryData  = [];

  galleryItems.forEach((item) => {
    const img     = item.querySelector('.gallery-img');
    const src     = img ? img.getAttribute('src') : '';
    const alt     = img ? img.getAttribute('alt') : '';
    galleryData.push({ src, alt });
  });

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxMedia();
    if (lightbox)         lightbox.hidden         = false;
    if (lightboxBackdrop) lightboxBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    if (lightboxClose) {
      setTimeout(() => lightboxClose.focus(), 50);
    }
  }

  function closeLightbox() {
    if (lightbox)         lightbox.hidden         = true;
    if (lightboxBackdrop) lightboxBackdrop.hidden = true;
    document.body.style.overflow = '';
  }

  function updateLightboxMedia() {
    const item = galleryData[currentIndex];
    if (!item || !lightboxImg) return;

    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt || '';

    if (lightboxCaption) {
      lightboxCaption.textContent = item.alt || '';
    }

    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${galleryData.length}`;
    }

    // Show / hide prev-next
    if (lightboxPrev) lightboxPrev.style.display = galleryData.length <= 1 ? 'none' : '';
    if (lightboxNext) lightboxNext.style.display = galleryData.length <= 1 ? 'none' : '';
  }

  function goPrev() {
    currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxMedia();
  }

  function goNext() {
    currentIndex = (currentIndex + 1) % galleryData.length;
    updateLightboxMedia();
  }

  // Attach click handlers to gallery items
  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  if (lightboxClose)    lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev)     lightboxPrev.addEventListener('click', goPrev);
  if (lightboxNext)     lightboxNext.addEventListener('click', goNext);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  goPrev();
    if (e.key === 'ArrowRight') goNext();
  });


  /* ===================================================
     9. HERO PARALLAX (Subtle)
     =================================================== */
  const heroImg = document.querySelector('.hero-img');

  function handleParallax() {
    if (!heroImg) return;
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroImg.style.transform = `scale(1) translateY(${scrollY * 0.18}px)`;
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });


  /* ===================================================
     10. PROGRESSIVE IMAGE LOADING (Blur-up)
     =================================================== */
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  const imgObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.style.transition = 'opacity .5s ease';

          img.addEventListener('load', () => {
            img.style.opacity = '1';
          }, { once: true });

          imgObserver.unobserve(img);
        }
      });
    },
    { rootMargin: '200px' }
  );

  lazyImages.forEach((img) => {
    img.style.opacity = '.6';
    imgObserver.observe(img);
  });

})();
