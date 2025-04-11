document.addEventListener('DOMContentLoaded', function() {
    // Slider functionality
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let currentSlide = 0;
    const slideCount = slides.length;

    // Function to update slider position
    function updateSlider() {
        slider.style.transform = `translateX(-${currentSlide * 33.333}%)`;
    }

    // Function to go to next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlider();
    }

    // Function to go to previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateSlider();
    }

    // Add click event listeners to buttons
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto slide every 5 seconds
    setInterval(nextSlide, 5000);

    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const searchToggle = document.querySelector('.search-toggle');
    const searchBar = document.querySelector('.search-bar');
    const searchInput = document.querySelector('.search-container input');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Toggle search bar
    searchToggle.addEventListener('click', function(e) {
        e.preventDefault();
        searchBar.style.display = searchBar.style.display === 'block' ? 'none' : 'block';
        if (searchBar.style.display === 'block') {
            searchInput.focus();
        }
    });

    // Close mobile menu and search bar when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
        if (!searchToggle.contains(e.target) && !searchBar.contains(e.target)) {
            searchBar.style.display = 'none';
        }
    });

    // Handle search form submission
    const searchForm = document.querySelector('.search-container');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchQuery = searchInput.value.trim();
        if (searchQuery) {
            window.location.href = `products.html?search=${encodeURIComponent(searchQuery)}`;
        }
    });

    // Update cart count (placeholder)
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        // This would typically be updated based on actual cart data
        cartCount.textContent = '0';
    }

    // Initialize cart count
    updateCartCount();
}); 