/* RS Multi-Services — main scripts */

// 0a) Theme toggle (light/dark) — persisté dans localStorage
(function () {
  const root = document.documentElement;
  const buttons = document.querySelectorAll('[data-theme-toggle]');
  if (!buttons.length) return;

  const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  const currentTheme = () => {
    const stored = (() => { try { return localStorage.getItem('rs-theme'); } catch { return null; } })();
    if (stored === 'dark' || stored === 'light') return stored;
    return mq && mq.matches ? 'dark' : 'light';
  };

  const apply = (theme) => {
    root.setAttribute('data-theme', theme);
    buttons.forEach((b) => {
      b.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      b.title = theme === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre';
    });
  };

  apply(currentTheme());

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('rs-theme', next); } catch {}
      apply(next);
    });
  });

  // Suit la préférence OS si l'utilisateur n'a pas explicitement choisi
  if (mq && mq.addEventListener) {
    mq.addEventListener('change', () => {
      try {
        if (!localStorage.getItem('rs-theme')) apply(mq.matches ? 'dark' : 'light');
      } catch {}
    });
  }
})();


// 1) Mobile menu toggle
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  });
})();

// 2) Sticky header shadow on scroll
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// 3) Reveal-on-scroll
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach((el) => io.observe(el));
})();

// 4) Active nav link
(function () {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// 5) Footer year
(function () {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// 6) Lightbox for project gallery
(function () {
  const triggers = document.querySelectorAll('[data-lightbox]');
  if (!triggers.length) return;
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<button class="close" aria-label="Fermer"><i class="fa-solid fa-xmark"></i></button><img alt="">';
  document.body.appendChild(lb);
  const img = lb.querySelector('img');
  const closeBtn = lb.querySelector('.close');
  const open = (src, alt) => {
    img.src = src;
    img.alt = alt || '';
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  triggers.forEach((t) => {
    t.addEventListener('click', (e) => {
      e.preventDefault();
      const src = t.getAttribute('data-lightbox') || t.querySelector('img')?.src;
      const alt = t.querySelector('img')?.alt;
      if (src) open(src, alt);
    });
  });
  closeBtn.addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

// 7) Testimonials carousel controls
(function () {
  const track = document.querySelector('.testimonial-track');
  const prev = document.querySelector('[data-testimonial-prev]');
  const next = document.querySelector('[data-testimonial-next]');
  if (!track) return;
  const step = () => track.querySelector('.testimonial-card')?.offsetWidth + 24 || 380;
  prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
})();

// 0) Always start at top of page on refresh (so header transparent state is visible at load)
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// 8z) Global image fallback (Unsplash → Picsum themed)
(function () {
  const slug = (s) => (s || 'photo').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);

  const handler = (img) => {
    if (img.dataset.rsFallbackHandled) return;
    img.dataset.rsFallbackHandled = '1';
    img.addEventListener('error', () => {
      if (img.dataset.rsFallbackUsed) return;
      img.dataset.rsFallbackUsed = '1';
      const seed = 'rs-' + slug(img.alt || img.getAttribute('data-fallback-seed') || 'photo');
      const w = img.naturalWidth || img.width || 900;
      const h = img.naturalHeight || img.height || Math.round(w * 0.66);
      img.src = `https://picsum.photos/seed/${seed}/${w}/${h}`;
    });
    if (img.complete && img.naturalWidth === 0) img.dispatchEvent(new Event('error'));
  };
  document.querySelectorAll('img').forEach(handler);
})();

// 8a) Scroll progress bar
(function () {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const total = h.scrollHeight - h.clientHeight;
    const pct = total > 0 ? (h.scrollTop / total) * 100 : 0;
    bar.style.width = pct + '%';
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();

// 8b) Animated counters
(function () {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length || !('IntersectionObserver' in window)) return;
  const animate = (el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = target * eased;
      el.textContent = decimals ? val.toFixed(decimals) : Math.round(val).toString();
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = decimals ? target.toFixed(decimals) : target.toString();
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); }
    });
  }, { threshold: 0.5 });
  nums.forEach((n) => io.observe(n));
})();

// 8c) FAQ accordion
(function () {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
})();

// 8d) Cookie banner
(function () {
  const KEY = 'rs-cookie-accepted-v1';
  if (localStorage.getItem(KEY)) return;
  const banner = document.querySelector('.cookie-banner');
  if (!banner) return;
  setTimeout(() => banner.classList.add('is-visible'), 1200);
  banner.querySelectorAll('[data-cookie-accept], [data-cookie-close]').forEach((b) => {
    b.addEventListener('click', () => {
      localStorage.setItem(KEY, '1');
      banner.classList.remove('is-visible');
    });
  });
})();

// 8e) Pre-fill contact form service from URL param
(function () {
  const params = new URLSearchParams(location.search);
  const svc = params.get('service');
  const select = document.querySelector('#contact-form select[name="service"]');
  if (svc && select) {
    const map = {
      'bricolage': 'Petit bricolage',
      'jardinage': 'Entretien espace vert',
      'nettoyage': 'Nettoyage',
      'encombrants': 'Encombrants',
      'demenagement': 'D\u00e9m\u00e9nagement'
    };
    const target = map[svc] || svc;
    [...select.options].forEach((o) => { if (o.value === target) o.selected = true; });
  }
})();

// 9) Contact form (EmailJS with automatic mailto fallback)
(function () {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const msg = form.querySelector('.form-msg');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalLabel = submitBtn ? submitBtn.innerHTML : '';

  const setMsg = (cls, text) => {
    msg.className = 'form-msg' + (cls ? ' ' + cls : '');
    msg.textContent = text;
  };

  // Popup modal (créé une fois, réutilisable)
  const showPopup = (type, title, body) => {
    let modal = document.querySelector('.rs-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'rs-modal';
      modal.innerHTML = `
        <div class="rs-modal__backdrop"></div>
        <div class="rs-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="rs-modal-title">
          <button class="rs-modal__close" aria-label="Fermer"><i class="fa-solid fa-xmark"></i></button>
          <div class="rs-modal__icon"></div>
          <h3 id="rs-modal-title"></h3>
          <p></p>
          <button type="button" class="btn btn-primary rs-modal__ok">OK</button>
        </div>`;
      document.body.appendChild(modal);

      const close = () => {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
      };
      modal.querySelector('.rs-modal__close').addEventListener('click', close);
      modal.querySelector('.rs-modal__backdrop').addEventListener('click', close);
      modal.querySelector('.rs-modal__ok').addEventListener('click', close);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
      });
    }
    const icons = {
      success: '<i class="fa-solid fa-circle-check"></i>',
      error:   '<i class="fa-solid fa-circle-exclamation"></i>'
    };
    modal.dataset.type = type;
    modal.querySelector('.rs-modal__icon').innerHTML = icons[type] || icons.success;
    modal.querySelector('h3').textContent = title;
    modal.querySelector('p').textContent = body;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => modal.querySelector('.rs-modal__ok').focus(), 50);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const fields = {
      from_name:  (data.get('name')    || '').toString().trim(),
      from_email: (data.get('email')   || '').toString().trim(),
      phone:      (data.get('phone')   || '').toString().trim(),
      city:       (data.get('city')    || '').toString().trim(),
      service:    (data.get('service') || '').toString(),
      message:    (data.get('message') || '').toString().trim()
    };
    fields.reply_to = fields.from_email;

    if (!fields.from_name || !fields.from_email || !fields.message) {
      setMsg('error', 'Merci de remplir au moins votre nom, votre email et votre message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.from_email)) {
      setMsg('error', 'Adresse email invalide.');
      return;
    }

    const cfg = window.EMAILJS_CONFIG;
    const useEmailJS = !!(window.emailjs && cfg
      && cfg.publicKey && cfg.serviceId && cfg.templateId
      && !/^VOTRE_/.test(cfg.publicKey)
      && !/^VOTRE_/.test(cfg.serviceId)
      && !/^VOTRE_/.test(cfg.templateId));

    if (useEmailJS) {
      setMsg('', 'Envoi en cours…');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours…';
      }
      try {
        await emailjs.send(cfg.serviceId, cfg.templateId, fields);
        setMsg('success', 'Merci ' + fields.from_name + ' ! Votre demande nous est bien parvenue. Nous revenons vers vous très vite.');
        form.reset();
      } catch (err) {
        console.error('EmailJS error:', err);
        setMsg('error', "L'envoi a échoué. Vous pouvez nous appeler au 06 19 69 68 12 ou écrire à raymond.spire31@gmail.com.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalLabel;
        }
      }
      return;
    }

    // Fallback : ouverture du client mail
    const subject = encodeURIComponent('[Devis RS] ' + (fields.service || 'Demande') + ' — ' + fields.from_name);
    const body = encodeURIComponent(
      'Nom : ' + fields.from_name +
      '\nEmail : ' + fields.from_email +
      '\nTéléphone : ' + fields.phone +
      '\nVille : ' + fields.city +
      '\nService : ' + fields.service +
      '\n\nMessage :\n' + fields.message +
      '\n\n---\nEnvoyé depuis rsmultiservices.fr'
    );
    window.location.href = 'mailto:raymond.spire31@gmail.com?subject=' + subject + '&body=' + body;
    setMsg('success', 'Votre client mail s\'ouvre avec votre message prêt à envoyer.');
    showPopup('success',
      'Votre client mail va s\'ouvrir',
      'Vérifiez que le message est bien rempli puis cliquez sur Envoyer dans votre application mail. Nous vous répondrons en moins de 7 minutes en moyenne.'
    );
    form.reset();
  });
})();
