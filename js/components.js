/**
 * Lumin Space – Shared Components
 * Injects navbar, cart drawer, and footer into every page.
 * Must be loaded BEFORE store.js and ui.js so elements exist in DOM.
 */

(function () {
  /* ── Shared Nav HTML ──────────────────────────────── */
  const NAV_HTML = `
  <div id="cart-overlay" class="cart-overlay" aria-hidden="true" role="dialog" aria-label="Shopping cart">
    <div class="cart-drawer">
      <div class="cart-header">
        <h2 class="cart-title">Your Cart</h2>
        <button id="cart-close-btn" class="cart-close" aria-label="Close cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="cart-body">
        <div class="cart-empty" id="cart-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <p>Your cart is empty</p>
          <span>Add a product to get started</span>
        </div>
        <ul class="cart-items" id="cart-items-list" aria-label="Cart items"></ul>
      </div>
      <div class="cart-footer">
        <div class="cart-total">
          <span>Total</span>
          <strong id="cart-total-price">$0</strong>
        </div>
        <a href="cart.html" class="btn btn-primary btn-full" id="checkout-btn">View Cart &amp; Checkout</a>
      </div>
    </div>
  </div>

  <header class="navbar" id="navbar" role="banner">
    <div class="nav-container">
      <a href="index.html" class="nav-logo" aria-label="Lumin Space home">
        <span class="logo-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="2" width="24" height="24" rx="6" fill="#3892d1" opacity="0.12"/>
            <rect x="6" y="10" width="16" height="2.5" rx="1.25" fill="#3892d1"/>
            <rect x="6" y="15" width="10" height="2.5" rx="1.25" fill="#342d47"/>
            <circle cx="20" cy="16.25" r="2" fill="#3892d1"/>
          </svg>
        </span>
        <span class="logo-text">Lumin <strong>Space</strong></span>
      </a>

      <nav class="nav-links" role="navigation" aria-label="Main navigation">
        <a href="index.html"         class="nav-link">Home</a>
        <a href="shop.html"          class="nav-link">Shop</a>
        <a href="consultations.html" class="nav-link">Consultations</a>
        <a href="cart.html"          class="nav-link">My Cart</a>
      </nav>

      <div class="nav-actions">
        <a href="consultations.html" class="btn btn-outline-sm">Book a Call</a>
        <a href="cart.html" class="cart-toggle" id="cart-toggle-btn" aria-label="Open cart" aria-expanded="false">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <span class="cart-badge" id="cart-badge">0</span>
        </a>
        <button class="hamburger" id="hamburger-btn" aria-label="Toggle mobile menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
      <a href="index.html"         class="mobile-link">Home</a>
      <a href="shop.html"          class="mobile-link">Shop</a>
      <a href="consultations.html" class="mobile-link">Consultations</a>
      <a href="cart.html"          class="mobile-link">My Cart</a>
      <a href="consultations.html" class="mobile-link mobile-link--accent">Book a Call</a>
    </div>
  </header>`;

  /* ── Shared Footer HTML ───────────────────────────── */
  const FOOTER_HTML = `
  <footer class="site-footer" role="contentinfo">
    <div class="footer-container">
      <div class="footer-brand">
        <a href="index.html" class="nav-logo" aria-label="Lumin Space home">
          <span class="logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="2" width="24" height="24" rx="6" fill="#3892d1" opacity="0.18"/>
              <rect x="6" y="10" width="16" height="2.5" rx="1.25" fill="#3892d1"/>
              <rect x="6" y="15" width="10" height="2.5" rx="1.25" fill="rgba(255,255,255,0.6)"/>
              <circle cx="20" cy="16.25" r="2" fill="#3892d1"/>
            </svg>
          </span>
          <span class="logo-text logo-text--light">Lumin <strong>Space</strong></span>
        </a>
        <p class="footer-tagline">Intelligent design for intentional living.</p>
        <div class="footer-social" aria-label="Social media links">
          <a href="#" class="social-link" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg></a>
          <a href="#" class="social-link" aria-label="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg></a>
          <a href="#" class="social-link" aria-label="Pinterest"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.23-5.22 1.23-5.22s-.31-.63-.31-1.57c0-1.47.85-2.57 1.91-2.57.9 0 1.34.68 1.34 1.49 0 .91-.58 2.27-.88 3.53-.25 1.05.52 1.91 1.55 1.91 1.86 0 3.11-2.39 3.11-5.22 0-2.15-1.45-3.76-4.08-3.76-2.97 0-4.8 2.22-4.8 4.7 0 .85.25 1.46.64 1.92.18.21.2.3.14.54-.05.17-.16.58-.2.74-.07.24-.28.33-.51.24-1.39-.57-2.04-2.09-2.04-3.8 0-2.82 2.39-6.19 7.14-6.19 3.83 0 6.35 2.78 6.35 5.76 0 3.95-2.18 6.9-5.39 6.9-1.08 0-2.1-.58-2.44-1.24l-.68 2.6c-.25.93-.73 1.86-1.17 2.59.88.27 1.81.42 2.77.42 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg></a>
        </div>
      </div>
      <nav class="footer-nav" aria-label="Footer navigation">
        <div class="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><a href="shop.html">Smart Tables</a></li>
            <li><a href="shop.html">Standing Desks</a></li>
            <li><a href="shop.html">Coffee Tables</a></li>
            <li><a href="shop.html">Accessories</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Consultations</h4>
          <ul>
            <li><a href="consultations.html">Find an Architect</a></li>
            <li><a href="consultations.html">Interior Design</a></li>
            <li><a href="consultations.html">Smart Home</a></li>
            <li><a href="consultations.html">Space Planning</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="index.html#about">About Lumin</a></li>
            <li><a href="#">Sustainability</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Shipping &amp; Returns</a></li>
            <li><a href="#">Warranty</a></li>
            <li><a href="#">Track Order</a></li>
          </ul>
        </div>
      </nav>
    </div>
    <div class="footer-bottom">
      <p>© <span id="footer-year"></span> Lumin Space. All rights reserved.</p>
      <div class="footer-legal">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Cookie Settings</a>
      </div>
    </div>
  </footer>
  <div class="toast" id="toast" role="alert" aria-live="assertive" aria-atomic="true"></div>`;

  /* ── Inject on DOM ready ──────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    // Prepend nav to body
    const navWrap = document.createElement('div');
    navWrap.innerHTML = NAV_HTML;
    document.body.prepend(...navWrap.childNodes);

    // Append footer to body
    const footerWrap = document.createElement('div');
    footerWrap.innerHTML = FOOTER_HTML;
    document.body.append(...footerWrap.childNodes);
  });
})();
