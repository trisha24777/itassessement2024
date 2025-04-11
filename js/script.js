// Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const searchToggle = document.querySelector('.search-toggle');
    const searchBar = document.querySelector('.search-bar');
    const searchInput = document.querySelector('.search-container input');

    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Toggle search bar
    searchToggle.addEventListener('click', (e) => {
        e.preventDefault();
        searchBar.classList.toggle('active');
        if (searchBar.classList.contains('active')) {
            searchInput.focus();
        }
    });

    // Handle search submission
    const searchForm = document.querySelector('.search-container');
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchQuery = searchInput.value.trim();
        if (searchQuery) {
            window.location.href = `products.html?search=${encodeURIComponent(searchQuery)}`;
        }
    });

    // Close mobile menu and search bar when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
        if (!searchToggle.contains(e.target) && !searchBar.contains(e.target)) {
            searchBar.classList.remove('active');
        }
    });

    // Update cart count (placeholder - replace with actual cart functionality)
    function updateCartCount(count) {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = count;
        }
    }

    // Initialize cart count
    updateCartCount(0);
});

// Product Detail Modal for Best Sellers on Index Page
document.addEventListener('DOMContentLoaded', function() {
    const bestSellerCards = document.querySelectorAll('.best-seller-card');
    const modal = document.getElementById('product-detail-modal');
    const modalImage = document.getElementById('modal-product-image');
    const modalName = document.getElementById('modal-product-name');
    const modalDescription = document.getElementById('modal-product-description');
    const closeModalButton = modal ? modal.querySelector('.modal-close') : null;

    if (modal && bestSellerCards.length > 0) {
        bestSellerCards.forEach(card => {
            const imageElement = card.querySelector('.product-image img');
            if (imageElement) {
                imageElement.addEventListener('click', function() {
                    const productName = card.querySelector('h3').textContent;
                    const productDescription = card.getAttribute('data-description');
                    const productImageSrc = imageElement.src;

                    // Populate modal
                    modalImage.src = productImageSrc;
                    modalImage.alt = productName; // Set alt text for accessibility
                    modalName.textContent = productName;
                    modalDescription.textContent = productDescription;

                    // Show modal
                    modal.classList.add('modal-show');
                });
            }
        });

        // Close modal when close button is clicked
        if (closeModalButton) {
            closeModalButton.addEventListener('click', function() {
                modal.classList.remove('modal-show');
            });
        }

        // Close modal when clicking outside the modal content
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.classList.remove('modal-show');
            }
        });
    }
}); 