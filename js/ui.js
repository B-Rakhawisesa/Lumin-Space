/**
 * Lumin Space – Shared UI helpers
 * Navbar, cart drawer, toast, scroll animations.
 * Loaded on every page AFTER store.js.
 */

/* ── Toast ────────────────────────────────────────────── */
function showToast(msg, duration = 3000) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}
window.showToast = showToast;

/* ── Navbar scroll state ──────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Scroll shadow
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburgerBtn.classList.toggle('open', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });

    // Close on mobile link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburgerBtn.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // Highlight active page
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ── Cart Drawer ──────────────────────────────────────── */
function initCartDrawer() {
  const overlay = document.getElementById('cart-overlay');
  const toggleBtn = document.getElementById('cart-toggle-btn');
  const closeBtn = document.getElementById('cart-close-btn');
  const emptyState = document.getElementById('cart-empty-state');
  const itemsList = document.getElementById('cart-items-list');
  const totalPriceEl = document.getElementById('cart-total-price');
  const badgeEl = document.getElementById('cart-badge');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (!overlay) return;

  function renderCart() {
    const cart = Store.getCart();
    const count = Store.totalCount();
    const total = Store.totalPrice();

    // Badge
    if (badgeEl) {
      badgeEl.textContent = count;
      badgeEl.setAttribute('data-count', count);
      toggleBtn && toggleBtn.setAttribute('aria-label', `Open cart (${count} item${count !== 1 ? 's' : ''})`);
    }

    // Empty / items
    if (!itemsList) return;
    if (cart.length === 0) {
      emptyState && (emptyState.style.display = 'flex');
      itemsList.innerHTML = '';
      if (totalPriceEl) totalPriceEl.textContent = '$0';
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }
    emptyState && (emptyState.style.display = 'none');
    if (checkoutBtn) checkoutBtn.disabled = false;
    if (totalPriceEl) totalPriceEl.textContent = Store.formatPrice(total);

    itemsList.innerHTML = cart.map(item => `
      <li class="cart-item" data-key="${item.variantKey}">
        <img src="${item.image}" alt="${item.name}" class="cart-item__img" loading="lazy" />
        <div class="cart-item__info">
          <div class="cart-item__name">${item.name}${item.finish ? ` · ${item.finish}` : ''}${item.size ? ` · ${item.size}` : ''}</div>
          <div class="cart-item__price">${Store.formatPrice(item.price)}</div>
          <div class="cart-item__qty-row">
            <button class="qty-btn" data-action="dec" data-key="${item.variantKey}" aria-label="Decrease quantity">−</button>
            <span class="qty-val" aria-label="Quantity: ${item.qty}">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-key="${item.variantKey}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item__remove" data-key="${item.variantKey}" aria-label="Remove ${item.name} from cart">✕</button>
      </li>
    `).join('');

    // Remove buttons
    itemsList.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', () => {
        Store.removeItem(btn.dataset.key);
        showToast('Item removed from cart.');
      });
    });

    // Qty buttons
    itemsList.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cart = Store.getCart();
        const item = cart.find(i => i.variantKey === btn.dataset.key);
        if (!item) return;
        const newQty = btn.dataset.action === 'inc' ? item.qty + 1 : item.qty - 1;
        Store.setQty(btn.dataset.key, newQty);
      });
    });
  }

  function openCart() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    toggleBtn && toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    renderCart();
  }

  function closeCart() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    toggleBtn && toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (toggleBtn && toggleBtn.tagName === 'BUTTON') {
    toggleBtn.addEventListener('click', openCart);
  }
  closeBtn && closeBtn.addEventListener('click', closeCart);

  // Click outside drawer
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeCart();
  });

  // Keyboard close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeCart();
  });

  // Checkout stub
  checkoutBtn && checkoutBtn.addEventListener('click', () => {
    window.location.href = 'cart.html';
  });

  // Listen for store updates
  window.addEventListener('cart:updated', renderCart);

  // Initial render (badge)
  renderCart();
}

/* ── Scroll-in animations ─────────────────────────────── */
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => observer.observe(el));
}

/* ── Animated stat counters ───────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const step = 16;
      const steps = duration / step;
      let current = 0;
      const increment = target / steps;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current).toLocaleString() + suffix;
      }, step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

/* ── Footer year ──────────────────────────────────────── */
function initFooter() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ── Newsletter form ──────────────────────────────────── */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  const status = document.getElementById('newsletter-status');
  if (!form || !status) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.querySelector('#newsletter-email').value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = 'Please enter a valid email address.';
      status.className = 'newsletter-status error';
      return;
    }
    status.textContent = '🎉 You\'re in! Check your inbox for a welcome gift.';
    status.className = 'newsletter-status success';
    form.querySelector('#newsletter-email').value = '';
    setTimeout(() => { status.textContent = ''; status.className = 'newsletter-status'; }, 6000);
  });
}

/* ── Page Transitions (Animasi Pindah Halaman) ────────── */
function initPageTransitions() {
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      const target = link.getAttribute('target');

      // Pastikan animasi hanya jalan untuk link internal (bukan eksternal, bukan hash '#')
      if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && target !== '_blank') {
        e.preventDefault(); // Tahan dulu perpindahan halamannya
        // Jalankan animasi fade-out dan pindah ketika transition selesai
        if (document.body.classList.contains('page-transitioning')) return; // already navigating
        document.body.classList.add('page-transitioning');
        let navigated = false;
        const onEnd = () => {
          if (navigated) return;
          navigated = true;
          document.body.removeEventListener('transitionend', onEnd);
          window.location.href = href;
        };

        // Listen for transition end with a small safety timeout
        document.body.addEventListener('transitionend', onEnd);
        const computed = getComputedStyle(document.documentElement).getPropertyValue('--page-transition-duration') || '360ms';
        const ms = parseFloat(computed) * (computed.indexOf('ms') > -1 ? 1 : 1000);
        setTimeout(onEnd, ms + 80);
      }
    });
  });
}

/* ── Boot on DOMContentLoaded ─────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCartDrawer();
  initScrollAnimations();
  initCounters();
  initFooter();
  initNewsletter();
  initPageTransitions(); // <-- Tambahkan ini
});
