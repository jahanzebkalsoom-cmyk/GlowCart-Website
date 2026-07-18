const cartState = {
  items: {},
};

const getCartCount = () => Object.values(cartState.items).reduce((total, item) => total + item.quantity, 0);

const updateCartBadges = () => {
  const count = getCartCount();
  document.querySelectorAll('.badge').forEach(badge => {
    badge.textContent = count;
  });
};

const formatCartItem = (item) => `${item.name} × ${item.quantity} — $${item.price * item.quantity}`;

const openCartModal = (modalId, itemsContainerId, messageId, checkoutBtnId) => {
  const modal = document.getElementById(modalId);
  const itemsContainer = document.getElementById(itemsContainerId);
  const message = document.getElementById(messageId);
  const checkoutButton = document.getElementById(checkoutBtnId);
  const items = Object.values(cartState.items);

  if (items.length === 0) {
    itemsContainer.innerHTML = '';
    message.textContent = 'Your cart is empty. Add something stylish.';
    checkoutButton.classList.add('hidden');
  } else {
    message.textContent = 'Great choice! Review your picks before checkout.';
    itemsContainer.innerHTML = items.map(item => `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-qty">Quantity: ${item.quantity}</div>
        </div>
        <div class="cart-item-price">$${item.price * item.quantity}</div>
      </div>
    `).join('');
    checkoutButton.classList.remove('hidden');
  }

  modal.classList.remove('hidden');
};

const closeCartModal = (modalId) => {
  document.getElementById(modalId).classList.add('hidden');
};

const addToCart = (product) => {
  if (cartState.items[product.id]) {
    cartState.items[product.id].quantity += 1;
  } else {
    cartState.items[product.id] = { ...product, quantity: 1 };
  }
  updateCartBadges();
};

const initCartButtons = () => {
  document.querySelectorAll('.add-cart').forEach(button => {
    button.addEventListener('click', (event) => {
      const card = event.currentTarget.closest('.product-card');
      const id = card.dataset.id;
      const name = card.dataset.name;
      const price = Number(card.dataset.price);
      addToCart({ id, name, price });
      event.currentTarget.textContent = 'Added';
      event.currentTarget.disabled = true;
      setTimeout(() => {
        event.currentTarget.textContent = 'Add to Cart';
        event.currentTarget.disabled = false;
      }, 1100);
    });
  });
};

const initCartModals = () => {
  const cartButtons = [
    { buttonId: 'cartButton', modalId: 'cartModal', itemsId: 'cartItems', messageId: 'cartMessage', checkoutId: 'checkoutButton', closeId: 'closeModal' },
    { buttonId: 'cartButtonShop', modalId: 'cartModalShop', itemsId: 'cartItemsShop', messageId: 'cartMessageShop', checkoutId: 'checkoutButtonShop', closeId: 'closeModalShop' }
  ];

  cartButtons.forEach(config => {
    const openButton = document.getElementById(config.buttonId);
    const closeButton = document.getElementById(config.closeId);
    const modal = document.getElementById(config.modalId);
    const checkoutButton = document.getElementById(config.checkoutId);

    if (openButton) {
      openButton.addEventListener('click', () => openCartModal(config.modalId, config.itemsId, config.messageId, config.checkoutId));
    }

    if (closeButton) {
      closeButton.addEventListener('click', () => closeCartModal(config.modalId));
    }

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeCartModal(config.modalId);
      }
    });

    if (checkoutButton) {
      checkoutButton.addEventListener('click', () => {
        window.alert('Thank you! Checkout flow is ready.');
        cartState.items = {};
        updateCartBadges();
        closeCartModal(config.modalId);
      });
    }
  });
};

window.addEventListener('DOMContentLoaded', () => {
  updateCartBadges();
  initCartButtons();
  initCartModals();
});
