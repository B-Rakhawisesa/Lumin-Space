/**
 * Lumin Space – Cart Store
 * Manages cart state in localStorage so it persists across all pages.
 */

const CART_KEY = 'lumin_cart';
const ORDERS_KEY = 'lumin_orders';

// DATABASE PRODUK INTERNAL (Meja, Lampu Baru dengan .PNG, & Konsultasi Asli)
const PRODUCTS = {
  // --- KATEGORI: MEJA ---
  apex_pro: {
    id: 'apex_pro',
    name: 'Lumin Meeting Table',
    price: 1000.00,
    image: './assets/Lumin Meeting Table.png',
    finishes: ['Natural Walnut', 'Charcoal Ash', 'Satin White'],
    sizes: ['140×70 cm', '160×80 cm']
  },
  desk: {
    id: 'desk',
    name: 'Lumin Single Desk',
    price: 500.00,
    image: './assets/Lumin Single Desk.png',
    finishes: ['Oak / White Base', 'Walnut / Black Base'],
    sizes: ['160×80 cm', '180×90 cm']
  },

  // --- KATEGORI: LAMPU BARU (Menggunakan ekstensi huruf besar .PNG sesuai sistem file VS Code) ---
  clip_lamp: {
    id: 'clip_lamp',
    name: 'Lumin Clip Lamp',
    price: 5.00,
    image: './assets/Lampmini.png',
    finishes: ['Graphite Black', 'Soft Silver'],
    sizes: ['Clip Mount']
  },
  desk_lamp: {
    id: 'desk_lamp',
    name: 'Lumin Nightstand',
    price: 200.00,
    image: './assets/Lumin Nightstand.png',
    finishes: ['Natural Oak', 'Warm Walnut'],
    sizes: ['60×45 cm']
  },
  egg_lamp: {
    id: 'egg_lamp',
    name: 'Lumin Egg Lamp',
    price: 10.00,
    image: './assets/Egglamp.png',
    finishes: ['Warm White', 'Soft Beige'],
    sizes: ['Standard']
  },

  // --- KATEGORI: DESIGN CONSULTATIONS (Kembali ke Semula / Asli) ---
  con_elena: {
    id: 'con_elena',
    name: 'Minimalist Space Transformation',
    price: 150.00,
    image: './assets/architect_profile.png'
  },
  con_marcus: {
    id: 'con_marcus',
    name: 'Smart Home Architectural Integration',
    price: 250.00,
    image: './assets/consultant_marco.png'
  },
  con_saraswati: {
    id: 'con_saraswati',
    name: 'Eco-Luxury Material & Lighting Styling',
    price: 180.00,
    image: './assets/consultant_saya.png'
  }
};

const Store = {
  /** @returns {Array} cart items */
  getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  },

  /** Save cart to localStorage */
  saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart } }));
  },

  /** Add a product to the cart */
  addItem({ id, name, price, image, finish = '', size = '' }) {
    const cart = this.getCart();
    const variantKey = `${id}__${finish}__${size}`;
    const existing = cart.find(i => i.variantKey === variantKey);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, variantKey, name, price, image, finish, size, qty: 1 });
    }
    this.saveCart(cart);
  },

  /** Remove item by variantKey */
  removeItem(variantKey) {
    const cart = this.getCart().filter(i => i.variantKey !== variantKey);
    this.saveCart(cart);
  },

  /** Set quantity for a variantKey */
  setQty(variantKey, qty) {
    if (qty <= 0) { this.removeItem(variantKey); return; }
    const cart = this.getCart();
    const item = cart.find(i => i.variantKey === variantKey);
    if (item) { item.qty = qty; this.saveCart(cart); }
  },

  /** Total item count */
  totalCount() {
    return this.getCart().reduce((sum, i) => sum + i.qty, 0);
  },

  /** Total price */
  totalPrice() {
    return this.getCart().reduce((sum, i) => sum + (i.price * i.qty), 0);
  },

  /** Clear the entire cart */
  clearCart() {
    this.saveCart([]);
  },

  /** @returns {Array} saved customer orders */
  getOrders() {
    try {
      return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    } catch {
      return [];
    }
  },

  /** Save an order snapshot to localStorage */
  saveOrder(order) {
    const orders = this.getOrders();
    const existingIndex = orders.findIndex(i => i.orderId === order.orderId);
    const nextOrder = {
      ...order,
      status: order.status || 'processing',
      paymentStatus: order.paymentStatus || 'paid',
      total: order.total ?? order.subtotal ?? 0
    };

    if (existingIndex >= 0) {
      orders[existingIndex] = { ...orders[existingIndex], ...nextOrder };
    } else {
      orders.unshift(nextOrder);
    }

    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('orders:updated', { detail: { orders } }));
  },

  /** Update order status by id */
  updateOrderStatus(orderId, status) {
    const orders = this.getOrders().map(order => (
      order.orderId === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
    ));
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('orders:updated', { detail: { orders } }));
  },

  /** Format number to USD currency format ($) */
  formatPrice(num) {
    return '$' + Number(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};

// Expose variables globally
window.PRODUCTS = PRODUCTS;
window.Store = Store;
