// Shopping Cart Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Cart data structure
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // DOM Elements
    const cartIcon = document.querySelector('.nav-icons a:nth-child(2)');
    const cartCount = document.querySelector('.cart-count');
    const cartModal = document.querySelector('.cart-modal');
    const closeCartButton = document.querySelector('.close-cart');
    
    // Create cart modal if it doesn't exist
    if (!cartModal) {
        createCartModal();
    } else {
        // Add event listener to existing close button
        closeCartButton.addEventListener('click', toggleCartModal);
        
        // Close modal when clicking outside
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                toggleCartModal();
            }
        });
        
        // Add event listener to checkout button
        const checkoutButton = document.querySelector('.checkout-btn');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', showCheckoutPopup);
        }
    }
    
    // Update cart count on page load
    updateCartCount();
    
    // Function to initialize add to cart buttons
    function initializeAddToCartButtons() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        
        addToCartButtons.forEach(button => {
            // Remove any existing event listeners to prevent duplicates
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productImage = productCard.querySelector('.product-image img').src;
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = productCard.querySelector('.product-price').textContent;
                const productCategory = productCard.querySelector('.product-category').textContent;
                
                // Get quantity if it exists (from quick view modal)
                let quantity = 1;
                const quantityInput = document.querySelector('.quantity-selector input');
                if (quantityInput) {
                    quantity = parseInt(quantityInput.value);
                }
                
                // Add to cart
                addToCart({
                    id: generateProductId(productName),
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    category: productCategory,
                    quantity: quantity
                });
                
                // Show success message
                showNotification('Product added to cart!');
            });
        });
    }
    
    // Initialize add to cart buttons
    initializeAddToCartButtons();
    
    // Add event listener to cart icon
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        toggleCartModal();
    });
    
    // Function to add product to cart
    function addToCart(product) {
        // Check if product already exists in cart
        const existingProductIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingProductIndex !== -1) {
            // Update quantity if product already exists
            cart[existingProductIndex].quantity += product.quantity;
        } else {
            // Add new product to cart
            cart.push(product);
        }
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Update cart modal if it's open
        updateCartModal();
    }
    
    // Function to update cart count
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Hide cart count if cart is empty
        if (totalItems === 0) {
            cartCount.style.display = 'none';
        } else {
            cartCount.style.display = 'block';
        }
    }
    
    // Function to create cart modal
    function createCartModal() {
        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        modal.innerHTML = `
            <div class="cart-content">
                <div class="cart-header">
                    <h2>Your Cart</h2>
                    <button class="close-cart"><i class="fas fa-times"></i></button>
                </div>
                <div class="cart-items">
                    <!-- Cart items will be added here dynamically -->
                </div>
                <div class="cart-summary">
                    <div class="cart-total">
                        <span>Total:</span>
                        <span class="total-amount">$0.00</span>
                    </div>
                    <button class="checkout-btn">Checkout</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listener to close button
        const closeButton = modal.querySelector('.close-cart');
        closeButton.addEventListener('click', toggleCartModal);
        
        // Add event listener to checkout button
        const checkoutButton = modal.querySelector('.checkout-btn');
        checkoutButton.addEventListener('click', showCheckoutPopup);
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                toggleCartModal();
            }
        });
    }
    
    // Function to toggle cart modal
    function toggleCartModal() {
        const modal = document.querySelector('.cart-modal');
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
        } else {
            modal.style.display = 'block';
            updateCartModal();
        }
    }
    
    // Function to update cart modal
    function updateCartModal() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const totalAmountElement = document.querySelector('.total-amount');
        
        // Clear current items
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            totalAmountElement.textContent = '$0.00';
            return;
        }
        
        // Calculate total
        let total = 0;
        
        // Add each item to the cart
        cart.forEach((item, index) => {
            const price = parseFloat(item.price.replace('$', ''));
            const itemTotal = price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-category">${item.category}</p>
                    <p class="cart-item-price">${item.price}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <input type="number" value="${item.quantity}" min="1" data-index="${index}">
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Update total
        totalAmountElement.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners to quantity buttons
        const minusButtons = document.querySelectorAll('.cart-item-quantity .minus');
        const plusButtons = document.querySelectorAll('.cart-item-quantity .plus');
        const quantityInputs = document.querySelectorAll('.cart-item-quantity input');
        const removeButtons = document.querySelectorAll('.remove-item');
        
        minusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const input = document.querySelector(`.cart-item-quantity input[data-index="${index}"]`);
                const currentValue = parseInt(input.value);
                
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                    updateCartItemQuantity(index, currentValue - 1);
                }
            });
        });
        
        plusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const input = document.querySelector(`.cart-item-quantity input[data-index="${index}"]`);
                const currentValue = parseInt(input.value);
                
                input.value = currentValue + 1;
                updateCartItemQuantity(index, currentValue + 1);
            });
        });
        
        quantityInputs.forEach(input => {
            input.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const value = parseInt(this.value);
                
                if (value < 1) {
                    this.value = 1;
                    updateCartItemQuantity(index, 1);
                } else {
                    updateCartItemQuantity(index, value);
                }
            });
        });
        
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeFromCart(index);
            });
        });
    }
    
    // Function to update cart item quantity
    function updateCartItemQuantity(index, quantity) {
        cart[index].quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartModal();
    }
    
    // Function to remove item from cart
    function removeFromCart(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartModal();
    }
    
    // Function to generate a unique ID for a product
    function generateProductId(name) {
        return name.toLowerCase().replace(/\s+/g, '-');
    }
    
    // Function to show notification
    function showNotification(message) {
        // Create notification element if it doesn't exist
        if (!document.querySelector('.notification')) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        const notification = document.querySelector('.notification');
        notification.textContent = message;
        notification.classList.add('show');
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Function to show checkout popup
    function showCheckoutPopup() {
        // Close the cart modal first
        toggleCartModal();
        
        // Calculate total
        let total = 0;
        cart.forEach(item => {
            const price = parseFloat(item.price.replace('$', ''));
            total += price * item.quantity;
        });
        
        // Create popup
        const popup = document.createElement('div');
        popup.className = 'checkout-popup';
        popup.innerHTML = `
            <div class="checkout-content">
                <h2>Thank You!</h2>
                <p>Your order has been placed successfully.</p>
                <p>Your bill is: <strong>$${total.toFixed(2)}</strong></p>
                <button class="close-popup">Close</button>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(popup);
        
        // Function to handle popup closing
        function closePopup() {
            // Clear cart
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            // Close popup
            document.body.removeChild(popup);
            
            // Show success message
            showNotification('Thank you for your purchase!');
            
            // Reinitialize add to cart buttons after checkout
            initializeAddToCartButtons();
        }
        
        // Add event listener to close button
        const closeButton = popup.querySelector('.close-popup');
        closeButton.addEventListener('click', closePopup);
        
        // Add event listener to close when clicking outside
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                closePopup();
            }
        });
    }
    
    // Listen for pagination changes to reinitialize add to cart buttons
    document.addEventListener('paginationChanged', function() {
        initializeAddToCartButtons();
    });
    
    // Listen for filter changes to reinitialize add to cart buttons
    document.addEventListener('filterChanged', function() {
        initializeAddToCartButtons();
    });
}); 