/*
 * Vanilla JavaScript implementation of the static online store demo.
 * This file renders a catalogue of products, manages a shopping cart
 * and handles a simple checkout interaction without any backend or
 * external libraries. All data is stored in memory and the DOM is
 * updated directly.
 */

(() => {
  // Hard‑coded catalogue. Customise these entries as needed.
  // Data URI for a simple grey placeholder image. Using an inline
  // SVG avoids any external network requests. The image shows the
  // text "Image" centred on a grey background.
  const PLACEHOLDER_IMAGE =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iI2NjY2NjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjNjY2NjY2Ij5JbWFnZTwvdGV4dD48L3N2Zz4=';
  const PRODUCTS = [
    {
      id: 1,
      name: 'Smartphone',
      description: 'Latest smartphone with high performance.',
      price: 699.99,
      image: PLACEHOLDER_IMAGE
    },
    {
      id: 2,
      name: 'Headphones',
      description: 'Noise cancelling headphones.',
      price: 199.99,
      image: PLACEHOLDER_IMAGE
    },
    {
      id: 3,
      name: 'Laptop',
      description: 'Powerful laptop for professionals.',
      price: 1299.99,
      image: PLACEHOLDER_IMAGE
    }
  ];

  // In‑memory shopping cart keyed by product id
  const cart = {};

  /**
   * Render the list of products into the .products container. Each
   * product card includes an Add to Cart button that hooks into
   * addToCart().
   */
  function renderProducts() {
    const container = document.querySelector('.products');
    container.innerHTML = '';
    PRODUCTS.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';

      const img = document.createElement('img');
      img.src = product.image;
      img.alt = product.name;

      const title = document.createElement('h2');
      title.textContent = product.name;

      const desc = document.createElement('p');
      desc.textContent = product.description;

      const price = document.createElement('p');
      price.textContent = '$' + product.price.toFixed(2);

      const button = document.createElement('button');
      button.textContent = 'Add to Cart';
      button.addEventListener('click', () => addToCart(product.id));

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(price);
      card.appendChild(button);
      container.appendChild(card);
    });
  }

  /**
   * Add a product to the cart. If the product already exists in the
   * cart, increment its quantity. Afterwards re-render the cart and
   * display a message.
   * @param {number} productId
   */
  function addToCart(productId) {
    if (cart[productId]) {
      cart[productId].quantity += 1;
    } else {
      const product = PRODUCTS.find(p => p.id === productId);
      cart[productId] = { product, quantity: 1 };
    }
    renderCart();
    const name = cart[productId].product.name;
    showMessage(`Added ${name} to cart.`);
  }

  /**
   * Remove one instance of the product from the cart. If the
   * quantity reaches zero the entry is deleted entirely.
   * @param {number} productId
   */
  function removeFromCart(productId) {
    if (cart[productId]) {
      cart[productId].quantity -= 1;
      if (cart[productId].quantity <= 0) {
        delete cart[productId];
      }
      renderCart();
    }
  }

  /**
   * Recompute the cart total and rebuild the cart items list in the
   * DOM. Called after any modification to the cart.
   */
  function renderCart() {
    const itemsContainer = document.querySelector('.cart-items');
    itemsContainer.innerHTML = '';
    const entries = Object.values(cart);
    if (entries.length === 0) {
      itemsContainer.innerHTML = '<p>Cart is empty.</p>';
    } else {
      const ul = document.createElement('ul');
      entries.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.product.name} x ${item.quantity} ($${(item.product.price * item.quantity).toFixed(2)})`;
        const btn = document.createElement('button');
        btn.textContent = 'Remove';
        btn.addEventListener('click', () => removeFromCart(item.product.id));
        li.appendChild(btn);
        ul.appendChild(li);
      });
      itemsContainer.appendChild(ul);
    }
    const totalEl = document.querySelector('.cart-total');
    const total = entries.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    totalEl.textContent = 'Total: $' + total.toFixed(2);
  }

  /**
   * Handle the checkout action. If the cart is empty a message is
   * displayed. Otherwise the cart is cleared and a thank you message
   * shown.
   */
  function checkout() {
    if (Object.keys(cart).length === 0) {
      showMessage('Your cart is empty.');
      return;
    }
    // Clear the cart
    for (const id in cart) {
      delete cart[id];
    }
    renderCart();
    showMessage('Thank you for your order!');
  }

  /**
   * Display a transient notification to the user. Messages fade out
   * automatically after a short delay.
   * @param {string} msg
   */
  function showMessage(msg) {
    const el = document.querySelector('.notification');
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => {
      el.style.display = 'none';
    }, 2000);
  }

  // Initialise the UI when the DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCart();
    document.querySelector('.checkout-button').addEventListener('click', checkout);
  });
})();