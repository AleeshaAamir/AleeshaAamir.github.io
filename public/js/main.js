(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const data = window.PORTFOLIO || { projects: [], gallery: { web: [], graphic: [] } };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, val) { try { localStorage.setItem(key, val); } catch { /* storage unavailable */ } },
  };

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const themeBtn = $('#themeToggle');
  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    themeBtn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    $('meta[name="theme-color"]').setAttribute('content', theme === 'dark' ? '#0c0a1a' : '#f7f5ff');
  };
  applyTheme(store.get('theme') || 'dark');
  themeBtn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    store.set('theme', next);
  });

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('#menuBtn');
  const navLinks = $('#navLinks');
  const setMenu = (open) => {
    navLinks.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    document.body.classList.toggle('no-scroll', open);
  };
  menuBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
  $$('a', navLinks).forEach((a) => a.addEventListener('click', () => setMenu(false)));

  /* ---------- Header state, active link, back-to-top ---------- */
  const header = $('#header');
  const toTop = $('#toTop');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 20);
    toTop.classList.toggle('show', y > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  const sectionLinks = $$('.nav-links a');
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        sectionLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  $$('main section[id]').forEach((s) => spy.observe(s));

  /* ---------- Typing effect ---------- */
  const typedEl = $('#typed');
  const phrases = [
    'responsive web apps',
    'secure REST APIs',
    'MERN stack projects',
    'PHP & MySQL backends',
    'Flutter mobile apps',
    'clean UIs in Figma',
  ];
  if (typedEl && !reduceMotion) {
    let p = 0, i = phrases[0].length, deleting = true;
    const tick = () => {
      const word = phrases[p];
      typedEl.textContent = word.slice(0, i);
      if (deleting) {
        i--;
        if (i < 0) { deleting = false; p = (p + 1) % phrases.length; i = 0; }
      } else {
        i++;
        if (i > phrases[p].length) { deleting = true; setTimeout(tick, 1600); return; }
      }
      setTimeout(tick, deleting ? 35 : 75);
    };
    setTimeout(tick, 2200);
  }

  /* ---------- Render projects ---------- */
  const grid = $('#projectsGrid');
  grid.innerHTML = data.projects
    .map(
      (p) => `
      <article class="card project reveal" data-category="${p.category}">
        <button class="project-media" data-project="${p.id}" aria-label="View details of ${escapeHtml(p.title)}">
          <img src="${p.image}" alt="${escapeHtml(p.title)} preview" loading="lazy" />
          <span class="project-hover"><i class="fa-solid fa-expand"></i> View details</span>
        </button>
        <div class="project-body">
          <span class="project-label">${escapeHtml(p.label)}</span>
          <h3>${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(p.summary)}</p>
          <ul class="stack">${p.stack.slice(0, 5).map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
          <div class="project-actions">
            <button class="link-btn" data-project="${p.id}">Case study <i class="fa-solid fa-arrow-right"></i></button>
            ${p.links
              .filter((l) => !l.lightbox)
              .map((l) => `<a class="link-btn muted" href="${l.url}" target="_blank" rel="noopener noreferrer"><i class="${l.icon}"></i> ${escapeHtml(l.label)}</a>`)
              .join('')}
          </div>
        </div>
      </article>`
    )
    .join('');

  /* Filter projects */
  const projectFilters = $$('#projects .filter');
  projectFilters.forEach((btn) =>
    btn.addEventListener('click', () => {
      projectFilters.forEach((b) => { b.classList.toggle('active', b === btn); b.setAttribute('aria-selected', String(b === btn)); });
      const f = btn.dataset.filter;
      $$('.project', grid).forEach((card) => {
        card.hidden = !(f === 'all' || card.dataset.category === f);
      });
    })
  );

  /* ---------- Lightbox ---------- */
  const lb = $('#lightbox');
  const lbImg = $('#lbImg');
  const lbCap = $('#lbCaption');
  let lbItems = [];
  let lbIndex = 0;
  let lastFocus = null;

  const showLb = (idx) => {
    lbIndex = (idx + lbItems.length) % lbItems.length;
    const item = lbItems[lbIndex];
    lbImg.src = item.src;
    lbImg.alt = item.title;
    lbCap.innerHTML = `<strong>${escapeHtml(item.title)}</strong>${item.tag ? ` · ${escapeHtml(item.tag)}` : ''}`;
    $$('.lb-nav', lb).forEach((b) => (b.hidden = lbItems.length < 2));
  };
  const openLb = (items, idx) => {
    lastFocus = document.activeElement;
    lbItems = items;
    showLb(idx);
    lb.hidden = false;
    document.body.classList.add('no-scroll');
    $('.lb-close', lb).focus();
  };
  const closeLb = () => {
    lb.hidden = true;
    lbImg.src = '';
    if (modal.hidden) document.body.classList.remove('no-scroll');
    lastFocus && lastFocus.focus();
  };
  lb.addEventListener('click', (e) => {
    const action = e.target.closest('[data-lb]')?.dataset.lb;
    if (action === 'close' || e.target === lb) closeLb();
    if (action === 'prev') showLb(lbIndex - 1);
    if (action === 'next') showLb(lbIndex + 1);
  });

  /* ---------- Gallery ---------- */
  const gallery = $('#gallery');
  const renderGallery = (key) => {
    const items = data.gallery[key] || [];
    gallery.className = `gallery gallery-${key}`;
    gallery.innerHTML = items
      .map(
        (g, i) => `
        <button class="card shot" data-index="${i}" aria-label="Open ${escapeHtml(g.title)}">
          <img src="${g.src}" alt="${escapeHtml(g.title)}" loading="lazy" />
          <span class="shot-cap"><strong>${escapeHtml(g.title)}</strong><small>${escapeHtml(g.tag)}</small></span>
        </button>`
      )
      .join('');
    gallery.dataset.key = key;
  };
  renderGallery('web');
  gallery.addEventListener('click', (e) => {
    const shot = e.target.closest('.shot');
    if (shot) openLb(data.gallery[gallery.dataset.key], Number(shot.dataset.index));
  });
  const galleryFilters = $$('#designs .filter');
  galleryFilters.forEach((btn) =>
    btn.addEventListener('click', () => {
      galleryFilters.forEach((b) => { b.classList.toggle('active', b === btn); b.setAttribute('aria-selected', String(b === btn)); });
      renderGallery(btn.dataset.gallery);
    })
  );

  /* ---------- Project modal ---------- */
  const modal = $('#projectModal');
  const modalContent = $('#modalContent');
  const openModal = (id) => {
    const p = data.projects.find((x) => x.id === id);
    if (!p) return;
    lastFocus = document.activeElement;
    modalContent.innerHTML = `
      <img class="modal-img" src="${p.image}" alt="${escapeHtml(p.title)} preview" />
      <div class="modal-body">
        <span class="project-label">${escapeHtml(p.label)}</span>
        <h3 id="modalTitle">${escapeHtml(p.title)}</h3>
        <p class="modal-sub">${escapeHtml(p.subtitle)} · <em>${escapeHtml(p.context)}</em></p>
        <p>${escapeHtml(p.summary)}</p>
        <h4>Key features</h4>
        <ul class="tl-list">${p.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}</ul>
        <h4>Tech stack</h4>
        <ul class="stack">${p.stack.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
        <div class="modal-actions">
          ${p.links
            .map((l) =>
              l.lightbox
                ? `<button class="btn btn-primary btn-sm" data-lightbox="${l.url}" data-title="${escapeHtml(p.title)}"><i class="${l.icon}"></i> ${escapeHtml(l.label)}</button>`
                : `<a class="btn btn-primary btn-sm" href="${l.url}" target="_blank" rel="noopener noreferrer"><i class="${l.icon}"></i> ${escapeHtml(l.label)}</a>`
            )
            .join('')}
          <a class="btn btn-outline btn-sm" href="#contact" data-close><i class="fa-regular fa-comments"></i> Ask about this project</a>
        </div>
      </div>`;
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    $('.modal-close', modal).focus();
  };
  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
    lastFocus && lastFocus.focus();
  };
  grid.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-project]');
    if (trigger) openModal(trigger.dataset.project);
  });
  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) closeModal();
    const lbBtn = e.target.closest('[data-lightbox]');
    if (lbBtn) openLb([{ src: lbBtn.dataset.lightbox, title: lbBtn.dataset.title, tag: 'Full Figma design' }], 0);
  });

  document.addEventListener('keydown', (e) => {
    if (!lb.hidden) {
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
      if (e.key === 'ArrowRight') showLb(lbIndex + 1);
      return;
    }
    if (!modal.hidden && e.key === 'Escape') closeModal();
    if (navLinks.classList.contains('open') && e.key === 'Escape') setMenu(false);
  });

  /* ---------- Reveal on scroll & counters ---------- */
  const animateCount = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / 1200, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const revealer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        $$('[data-count]', entry.target).forEach(animateCount);
        revealer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  $$('.reveal').forEach((el) => revealer.observe(el));

  /* ---------- Contact form ---------- */
  const form = $('#contactForm');
  const status = $('#formStatus');
  const submitBtn = $('#submitBtn');
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const validate = (values) => {
    const errors = {};
    if (values.name.trim().length < 2) errors.name = 'Please enter your name.';
    if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Please enter a valid email address.';
    if (values.subject.trim().length < 3) errors.subject = 'Please add a subject.';
    if (values.message.trim().length < 10) errors.message = 'Message should be at least 10 characters.';
    return errors;
  };
  const showErrors = (errors) => {
    $$('.error', form).forEach((el) => {
      const msg = errors[el.dataset.for] || '';
      el.textContent = msg;
      form.elements[el.dataset.for].setAttribute('aria-invalid', msg ? 'true' : 'false');
    });
  };
  const setStatus = (msg, type) => {
    status.textContent = msg;
    status.className = `form-status ${type || ''}`;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());
    const errors = validate(values);
    showErrors(errors);
    if (Object.keys(errors).length) {
      form.elements[Object.keys(errors)[0]].focus();
      return;
    }

    submitBtn.disabled = true;
    $('.btn-label', submitBtn).textContent = 'Sending...';
    setStatus('', '');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => null);

      if (res.ok && json?.ok) {
        form.reset();
        setStatus(json.message || 'Thank you! Your message has been sent.', 'success');
      } else if (json?.errors) {
        showErrors(json.errors);
        setStatus('Please fix the highlighted fields.', 'error');
      } else if (!json) {
        throw new Error('No API available');
      } else {
        setStatus(json.error || 'Something went wrong. Please try again.', 'error');
      }
    } catch {
      // No backend (for example static hosting): open the visitor's email app instead.
      const body = encodeURIComponent(`${values.message}\n\n— ${values.name} (${values.email})`);
      window.location.href = `mailto:aleeshaaamir4@gmail.com?subject=${encodeURIComponent(values.subject)}&body=${body}`;
      setStatus('Opening your email app to send the message...', 'success');
    } finally {
      submitBtn.disabled = false;
      $('.btn-label', submitBtn).textContent = 'Send Message';
    }
  });

  /* ---------- Footer year ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
