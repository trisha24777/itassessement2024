// Product Filtering and Sorting Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all necessary elements
    const searchInput = document.querySelector('.search-filter input');
    const categorySelect = document.querySelector('.category-filter select');
    const priceSelect = document.querySelector('.price-filter select');
    const sortSelect = document.querySelector('.sort-filter select');
    const productsGrid = document.querySelector('.products-grid');
    const productCards = document.querySelectorAll('.product-card');
    
    // Pagination elements
    const paginationContainer = document.querySelector('.pagination-container');
    const paginationButtons = document.querySelectorAll('.pagination-btn[data-page]');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    
    // Pagination variables
    const productsPerPage = 6;
    let currentPage = 1;
    let totalPages = Math.ceil(productCards.length / productsPerPage);
    let filteredProducts = Array.from(productCards);

    // Store original product cards for reset functionality
    const originalProducts = Array.from(productCards);

    // Function to filter products
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value.toLowerCase();
        const selectedPrice = priceSelect.value;
        const selectedSort = sortSelect.value;

        // Filter products based on search term and category
        filteredProducts = originalProducts.filter(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            const productCategory = product.querySelector('.product-category').textContent.toLowerCase();
            const productPrice = parseFloat(product.querySelector('.product-price').textContent.replace('$', ''));

            // Search term filter
            const matchesSearch = productName.includes(searchTerm);

            // Category filter
            const matchesCategory = selectedCategory === '' || productCategory === selectedCategory;

            // Price range filter
            let matchesPrice = true;
            if (selectedPrice !== '') {
                const [min, max] = selectedPrice.split('-').map(Number);
                if (max) {
                    matchesPrice = productPrice >= min && productPrice <= max;
                } else {
                    matchesPrice = productPrice >= min;
                }
            }

            return matchesSearch && matchesCategory && matchesPrice;
        });

        // Sort products
        filteredProducts.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
            const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));

            switch (selectedSort) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'newest':
                    const isNewA = a.querySelector('.product-badge.new') !== null;
                    const isNewB = b.querySelector('.product-badge.new') !== null;
                    return isNewB - isNewA;
                default: // 'featured'
                    const isFeaturedA = a.querySelector('.product-badge.best-seller') !== null;
                    const isFeaturedB = b.querySelector('.product-badge.best-seller') !== null;
                    return isFeaturedB - isFeaturedA;
            }
        });

        // Reset to first page when filtering
        currentPage = 1;
        
        // Update the display
        updateProductDisplay();
    }

    // Function to update product display
    function updateProductDisplay() {
        // Clear current display
        productsGrid.innerHTML = '';
        
        // Update total pages based on filtered products
        totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        
        // Reset to first page if current page is out of bounds
        if (currentPage > totalPages) {
            currentPage = 1;
        }
        
        // Update pagination buttons
        updatePaginationButtons();
        
        // Calculate start and end indices for current page
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = Math.min(startIndex + productsPerPage, filteredProducts.length);
        
        // Add filtered products for current page
        for (let i = startIndex; i < endIndex; i++) {
            const product = filteredProducts[i].cloneNode(true);
            productsGrid.appendChild(product);
        }

        // Update event listeners for new elements
        initializeQuickView();
        initializeAddToCartButtons();
    }
    
    // Function to update pagination buttons
    function updatePaginationButtons() {
        // Update page number buttons
        paginationButtons.forEach(button => {
            const pageNum = parseInt(button.getAttribute('data-page'));
            button.classList.remove('active');
            
            // Only show buttons for existing pages
            if (pageNum <= totalPages) {
                button.style.display = 'block';
                if (pageNum === currentPage) {
                    button.classList.add('active');
                }
            } else {
                button.style.display = 'none';
            }
        });
        
        // Update prev/next buttons
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }
    
    // Function to handle pagination
    function handlePagination(page) {
        currentPage = page;
        updateProductDisplay();
    }
    
    // Add event listeners for pagination
    paginationButtons.forEach(button => {
        button.addEventListener('click', () => {
            const page = parseInt(button.getAttribute('data-page'));
            handlePagination(page);
        });
    });
    
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            handlePagination(currentPage - 1);
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            handlePagination(currentPage + 1);
        }
    });

    // Add event listeners for filters
    searchInput.addEventListener('input', filterProducts);
    categorySelect.addEventListener('change', filterProducts);
    priceSelect.addEventListener('change', filterProducts);
    sortSelect.addEventListener('change', filterProducts);

    // Quick View Modal Functionality
    function initializeQuickView() {
        const quickViewButtons = document.querySelectorAll('.quick-view-btn');
        const modal = document.querySelector('.quick-view-modal');
        const closeModal = document.querySelector('.close-modal');

        quickViewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productImage = productCard.querySelector('.product-image img').src;
                const productName = productCard.querySelector('h3').textContent;
                const productCategory = productCard.querySelector('.product-category').textContent;
                const productRating = productCard.querySelector('.product-rating').innerHTML;
                const productPrice = productCard.querySelector('.product-price').innerHTML;

                // Update modal content
                modal.querySelector('.modal-product-image img').src = productImage;
                modal.querySelector('h2').textContent = productName;
                modal.querySelector('.product-category').textContent = productCategory;
                modal.querySelector('.product-rating').innerHTML = productRating;
                modal.querySelector('.product-price').innerHTML = productPrice;

                // Show modal
                modal.style.display = 'block';
            });
        });

        // Close modal when clicking the close button
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Initialize quick view functionality
    initializeQuickView();

    // Quantity Selector Functionality
    function initializeQuantitySelectors() {
        const quantitySelectors = document.querySelectorAll('.quantity-selector');
        
        quantitySelectors.forEach(selector => {
            const minusBtn = selector.querySelector('.minus');
            const plusBtn = selector.querySelector('.plus');
            const input = selector.querySelector('input');

            minusBtn.addEventListener('click', () => {
                const currentValue = parseInt(input.value);
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                }
            });

            plusBtn.addEventListener('click', () => {
                const currentValue = parseInt(input.value);
                input.value = currentValue + 1;
            });

            input.addEventListener('change', () => {
                const value = parseInt(input.value);
                if (value < 1) {
                    input.value = 1;
                }
            });
        });
    }

    // Initialize quantity selectors
    initializeQuantitySelectors();
    
    // Initialize pagination
    updatePaginationButtons();

    // Function to initialize add to cart buttons
    function initializeAddToCartButtons() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        
        addToCartButtons.forEach(button => {
            // Remove any existing event listeners to prevent duplicates
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = productCard.querySelector('.product-price').textContent;
                
                // Add to cart logic
                addToCart(productName, productPrice);
                
                // Show notification
                showNotification('Product added to cart!');
            });
        });
    }
    
    // Function to add product to cart
    function addToCart(productName, productPrice) {
        // Get cart from localStorage or initialize empty array
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product already exists in cart
        const existingProductIndex = cart.findIndex(item => item.name === productName);
        
        if (existingProductIndex !== -1) {
            // Update quantity if product already exists
            cart[existingProductIndex].quantity += 1;
        } else {
            // Add new product to cart
            cart.push({
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
    }
    
    // Function to update cart count
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Hide cart count if cart is empty
        if (totalItems === 0) {
            cartCount.style.display = 'none';
        } else {
            cartCount.style.display = 'block';
        }
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
    
    // Initialize cart count
    updateCartCount();
    
    // Initialize the display
    updateProductDisplay();
}); 