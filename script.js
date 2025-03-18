document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables
    const screens = document.querySelectorAll('.screen');
    const pageNavItems = document.querySelectorAll('.page-nav-item');
    const nextButton = document.getElementById('next-screen');
    const prevButton = document.getElementById('prev-screen');
    const menuItems = document.querySelectorAll('.menu-item');
    let currentScreen = 0;
    
    // Function to display a specific screen
    function showScreen(index) {
        // Remove active class from all screens and nav items
        screens.forEach(screen => screen.classList.remove('active'));
        pageNavItems.forEach(item => item.classList.remove('active'));
        
        // Add active class to selected screen and nav item
        screens[index].classList.add('active');
        pageNavItems[index].classList.add('active');
        
        currentScreen = index;
        
        // Hide/show navigation buttons based on position
        prevButton.style.opacity = index === 0 ? '0.3' : '1';
        nextButton.style.opacity = index === screens.length - 1 ? '0.3' : '1';
        
        // Ensure globe video plays when first screen is active
        const globeVideo = document.getElementById('globe-video');
        if (globeVideo) {
            if (index === 0) {
                globeVideo.play().catch(e => console.log('Video autoplay failed: User interaction required'));
            } else {
                globeVideo.pause();
            }
        }
    }
    
    // Event listeners for navigation buttons
    nextButton.addEventListener('click', () => {
        if (currentScreen < screens.length - 1) {
            showScreen(currentScreen + 1);
        }
    });
    
    prevButton.addEventListener('click', () => {
        if (currentScreen > 0) {
            showScreen(currentScreen - 1);
        }
    });
    
    // Event listeners for page nav items
    pageNavItems.forEach((navItem, index) => {
        navItem.addEventListener('click', () => {
            showScreen(index);
        });
    });
    
    // Event listeners for menu items
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            screens.forEach((screen, index) => {
                if (screen.id === targetId) {
                    showScreen(index);
                }
            });
        });
    });
    
    // Wheel event for scrolling between screens
    let isScrolling = false;
    document.addEventListener('wheel', (e) => {
        if (isScrolling) return;
        
        isScrolling = true;
        
        if (e.deltaY > 0 && currentScreen < screens.length - 1) {
            showScreen(currentScreen + 1);
        } else if (e.deltaY < 0 && currentScreen > 0) {
            showScreen(currentScreen - 1);
        }
        
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' && currentScreen < screens.length - 1) {
            showScreen(currentScreen + 1);
        } else if (e.key === 'ArrowUp' && currentScreen > 0) {
            showScreen(currentScreen - 1);
        }
    });

    // Initialize form submissions with animation and validation
    const forms = document.querySelectorAll('.terminal-form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const button = form.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            
            button.textContent = 'PROCESSING...';
            
            setTimeout(() => {
                button.textContent = 'SUBMITTED!';
                button.style.backgroundColor = 'var(--accent-color)';
                button.style.color = 'var(--terminal-bg)';
                
                // Clear form fields
                form.querySelectorAll('input, textarea, select').forEach(input => {
                    input.value = '';
                });
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = '';
                    button.style.color = '';
                }, 2000);
            }, 1000);
        });
    });

    // Initialize terminal typing effect
    const typingElements = document.querySelectorAll('.typing-text');
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 50);
    });

    // Carousel Functionality
    const carouselSetup = () => {
        const carousel = document.querySelector('.reasons-carousel');
        const cards = document.querySelectorAll('.reason-card');
        const prevArrow = document.querySelector('.prev-card');
        const nextArrow = document.querySelector('.next-card');
        const dots = document.querySelectorAll('.carousel-dot');
        const reasonCounter = document.querySelector('.reason-counter');
        let currentIndex = 0;
        let touchStartX = 0;
        let touchEndX = 0;

        // Update the carousel position and counter
        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update reason counter
            reasonCounter.textContent = `Reason ${currentIndex + 1} of ${cards.length}`;
            
            // Update active dot
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        // Event listeners for arrows
        nextArrow.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        });

        prevArrow.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCarousel();
        });

        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });

        // Touch swipe functionality
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        const handleSwipe = () => {
            const swipeThreshold = 50;
            if (touchEndX + swipeThreshold < touchStartX) {
                // Swipe left, go next
                currentIndex = (currentIndex + 1) % cards.length;
                updateCarousel();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right, go prev
                currentIndex = (currentIndex - 1 + cards.length) % cards.length;
                updateCarousel();
            }
        };

        // Initialize the carousel
        updateCarousel();
    };

    // Initialize the carousel if we're on the why screen
    if (document.querySelector('.reasons-carousel')) {
        carouselSetup();
    }
    
    // Timeline Carousel Functionality
    const timelineSetup = () => {
        const timelineCarousel = document.querySelector('.timeline-carousel');
        const phaseCards = document.querySelectorAll('.phase-card');
        const prevArrow = document.querySelector('.prev-phase');
        const nextArrow = document.querySelector('.next-phase');
        const phaseCounter = document.querySelector('.phase-counter');
        const yearIndicator = document.querySelector('.year-indicator');
        const timelineMarkers = document.querySelectorAll('.timeline-marker');
        const years = ["2024", "2025-2026", "2027-2028", "2029-2030", "2031+"];
        let currentIndex = 0;
        let touchStartX = 0;
        let touchEndX = 0;

        // Update the timeline position, counter, and markers
        const updateTimeline = () => {
            timelineCarousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update phase counter
            phaseCounter.textContent = `Phase ${currentIndex + 1} of ${phaseCards.length}`;
            
            // Update year indicator
            yearIndicator.textContent = years[currentIndex];
            
            // Update timeline markers
            timelineMarkers.forEach((marker, index) => {
                marker.classList.toggle('active', index === currentIndex);
            });
        };

        // Event listeners for arrows
        nextArrow.addEventListener('click', () => {
            if (currentIndex < phaseCards.length - 1) {
                currentIndex++;
            } else {
                // Reset to beginning when at the end
                currentIndex = 0;
            }
            updateTimeline();
        });

        prevArrow.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                // Jump to end when at the beginning
                currentIndex = phaseCards.length - 1;
            }
            updateTimeline();
        });

        // Touch swipe functionality
        timelineCarousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        timelineCarousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        const handleSwipe = () => {
            const swipeThreshold = 50;
            if (touchEndX + swipeThreshold < touchStartX) {
                // Swipe left, go next
                if (currentIndex < phaseCards.length - 1) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateTimeline();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right, go prev
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    currentIndex = phaseCards.length - 1;
                }
                updateTimeline();
            }
        };

        // Initialize the timeline
        updateTimeline();
    };

    // Initialize the timeline if we're on the roadmap screen
    if (document.querySelector('.timeline-carousel')) {
        timelineSetup();
    }

    // Initially show first screen
    showScreen(0);
});