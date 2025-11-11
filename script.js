

function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  if (menu) menu.classList.toggle("open");
  if (icon) icon.classList.toggle("open");
}

// load cart from localStorage
let cart = (function(){
  try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch(e){ return []; }
})();

let cartTotal = cart.reduce((s, it) => s + Number(it.price || 0) * (Number(it.quantity || 1)), 0);

function saveCart() {
  try { localStorage.setItem('cart', JSON.stringify(cart)); }
  catch (e) { console.error('Failed saving cart', e); }
}

// expose update so other pages/windows can call it
window.updateCartCount = function() {
  const count = cart.length;
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
  // keep cart in storage (ensures other tabs receive storage event)
  saveCart();
};

function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    if (notification && notificationMessage) {
        notificationMessage.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

function sanitizePrice(price) {
  if (typeof price === 'number') return price;
  if (!price) return 0;
  const cleaned = String(price).replace(/[^0-9\.\-]/g, '');
  return Number(cleaned) || 0;
}

function addToCart(productName, price) {
    if (!productName) {
        console.error('Product name is missing');
        return;
    }
    const p = sanitizePrice(price);
    cart.push({
        name: productName,
        price: p,
        quantity: 1
    });
    
    cartTotal += p;
    saveCart();
    updateCartCount();
    showNotification(`${productName} added to cart!`);
}

// update counts on load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

// react to cart changes from other tabs/windows
window.addEventListener('storage', (e) => {
  if (e.key === 'cart') {
    try {
      cart = JSON.parse(e.newValue || '[]');
    } catch(_) { cart = []; }
    cartTotal = cart.reduce((s, it) => s + Number(it.price || 0) * (Number(it.quantity || 1)), 0);
    updateCartCount();
  }
});
