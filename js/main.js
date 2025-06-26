/**
 * BLISS CATERING - Consolidated JavaScript
 * All functionality in one file for better maintainability
 */

// Global utilities and configuration
const BlissUtils = {
    // Form validation utilities
    FormUtils: {
        validateEmail: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        validatePhone: function(phone) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
        },

        showError: function(fieldId, message) {
            const field = document.getElementById(fieldId);
            const errorElement = document.getElementById(fieldId + '-error');
            
            if (field) {
                field.classList.add('error');
                field.style.borderColor = '#dc3545';
            }
            
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
                errorElement.classList.add('show');
            }
        },

        clearError: function(fieldId) {
            const field = document.getElementById(fieldId);
            const errorElement = document.getElementById(fieldId + '-error');
            
            if (field) {
                field.classList.remove('error');
                field.style.borderColor = '';
            }
            
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
                errorElement.classList.remove('show');
            }
        },

        clearAllErrors: function(formId) {
            const form = document.getElementById(formId);
            if (form) {
                const errorElements = form.querySelectorAll('.error-message');
                const inputElements = form.querySelectorAll('input, select, textarea');
                
                errorElements.forEach(error => {
                    error.textContent = '';
                    error.style.display = 'none';
                    error.classList.remove('show');
                });
                
                inputElements.forEach(input => {
                    input.classList.remove('error');
                    input.style.borderColor = '';
                });
            }
        }
    },

    // Storage utilities
    Storage: {
        get: function(key) {
            try {
                return JSON.parse(localStorage.getItem(key));
            } catch (e) {
                return null;
            }
        },

        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                return false;
            }
        },

        remove: function(key) {
            localStorage.removeItem(key);
        }
    },

    // Utility functions
    Utils: {
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        getUrlParameter: function(name) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        }
    },

    // Toast notifications
    Toast: {
        show: function(message, type = 'info', duration = 3000) {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = message;
            
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 4px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                max-width: 300px;
            `;

            // Set background color based on type
            switch (type) {
                case 'success':
                    toast.style.backgroundColor = '#27AE60';
                    break;
                case 'error':
                    toast.style.backgroundColor = '#E74C3C';
                    break;
                case 'warning':
                    toast.style.backgroundColor = '#F39C12';
                    break;
                default:
                    toast.style.backgroundColor = '#3498DB';
            }

            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, duration);
        }
    }
};

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeLazyLoading();
    
    // Page-specific initialization
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('login') || currentPage.includes('signup')) {
        initializeAuthPages();
    }
    
    if (currentPage.includes('menu')) {
        initializeMenuPage();
    }
    
    if (currentPage.includes('contact')) {
        initializeContactPage();
    }
    
    console.log('Bliss Catering website initialized successfully');
});

/**
 * Navigation functionality
 */
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) bar.style.opacity = '0';
                    if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                }
            });
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                // Reset hamburger animation
                const bars = navToggle.querySelectorAll('.bar');
                bars.forEach(bar => {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                });
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active') && 
            !navMenu.contains(event.target) && 
            !navToggle.contains(event.target)) {
            navMenu.classList.remove('active');
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        }
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add shadow when scrolled
            if (scrollTop > 100) {
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                navbar.style.background = 'white';
                navbar.style.backdropFilter = 'none';
            }

            // Hide/show navbar on scroll (optional)
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

/**
 * Scroll effects and smooth scrolling
 */
function initializeScrollEffects() {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll-to-top functionality
    createScrollToTopButton();
}

/**
 * Create and manage scroll-to-top button
 */
function createScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.className = 'scroll-to-top';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    
    // Add styles
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollButton);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top when clicked
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.1)';
    });
    
    scrollButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
}

/**
 * Initialize animations and intersection observer
 */
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.service-card, .menu-item, .team-member, .value-card, .feature'
    );

    animateElements.forEach((element, index) => {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        observer.observe(element);
    });

    // Counter animation for statistics (if any)
    initializeCounters();
}

/**
 * Initialize counter animations for numeric values
 */
function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        counter.textContent = Math.floor(current);
                    }, 16);
                    observer.unobserve(counter);
                }
            });
        });
        
        observer.observe(counter);
    });
}

/**
 * Lazy loading for images
 */
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
                
                // Add fade-in effect
                img.style.opacity = '0';
                img.onload = function() {
                    img.style.transition = 'opacity 0.3s ease';
                    img.style.opacity = '1';
                };
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Initialize authentication pages (login/signup)
 */
function initializeAuthPages() {
    initializePasswordToggle();
    
    if (window.location.pathname.includes('login')) {
        initializeLoginForm();
    } else if (window.location.pathname.includes('signup')) {
        initializeSignupForm();
        initializePasswordStrength();
    }
}

/**
 * Initialize login form
 */
function initializeLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        BlissUtils.FormUtils.clearAllErrors('login-form');
        
        // Validate form
        if (validateLoginForm()) {
            submitLoginForm();
        }
    });
    
    // Initialize real-time validation
    initializeLoginValidation();
}

/**
 * Validate login form
 */
function validateLoginForm() {
    let isValid = true;
    
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    
    // Validate email
    if (!email.value.trim()) {
        BlissUtils.FormUtils.showError('email', 'Email is required');
        isValid = false;
    } else if (!BlissUtils.FormUtils.validateEmail(email.value.trim())) {
        BlissUtils.FormUtils.showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (!password.value) {
        BlissUtils.FormUtils.showError('password', 'Password is required');
        isValid = false;
    } else if (password.value.length < 6) {
        BlissUtils.FormUtils.showError('password', 'Password must be at least 6 characters long');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Submit login form
 */
function submitLoginForm() {
    const form = document.getElementById('login-form');
    const submitButton = form.querySelector('button[type="submit"]');
    const successMessage = document.getElementById('login-success');
    
    // Show loading state
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    submitButton.disabled = true;
    
    // The form will be submitted naturally to Flask backend
    // This is just for UI feedback
    setTimeout(() => {
        BlissUtils.Toast.show('Signing you in...', 'info', 2000);
    }, 500);
}

/**
 * Initialize signup form
 */
function initializeSignupForm() {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) return;
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        BlissUtils.FormUtils.clearAllErrors('signup-form');
        
        // Validate form
        if (validateSignupForm()) {
            // Submit the form naturally to Flask
            this.submit();
        }
    });
    
    // Initialize real-time validation
    initializeSignupValidation();
}

/**
 * Validate signup form
 */
function validateSignupForm() {
    let isValid = true;
    
    const firstName = document.getElementById('first-name');
    const lastName = document.getElementById('last-name');
    const email = document.getElementById('signup-email');
    const phone = document.getElementById('phone');
    const password = document.getElementById('signup-password');
    const confirmPassword = document.getElementById('confirm-password');
    const terms = document.getElementById('terms');
    
    // Validate first name
    if (!firstName.value.trim()) {
        BlissUtils.FormUtils.showError('first-name', 'First name is required');
        isValid = false;
    } else if (firstName.value.trim().length < 2) {
        BlissUtils.FormUtils.showError('first-name', 'First name must be at least 2 characters long');
        isValid = false;
    }
    
    // Validate last name
    if (!lastName.value.trim()) {
        BlissUtils.FormUtils.showError('last-name', 'Last name is required');
        isValid = false;
    } else if (lastName.value.trim().length < 2) {
        BlissUtils.FormUtils.showError('last-name', 'Last name must be at least 2 characters long');
        isValid = false;
    }
    
    // Validate email
    if (!email.value.trim()) {
        BlissUtils.FormUtils.showError('signup-email', 'Email is required');
        isValid = false;
    } else if (!BlissUtils.FormUtils.validateEmail(email.value.trim())) {
        BlissUtils.FormUtils.showError('signup-email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone
    if (!phone.value.trim()) {
        BlissUtils.FormUtils.showError('phone', 'Phone number is required');
        isValid = false;
    } else if (!BlissUtils.FormUtils.validatePhone(phone.value.trim())) {
        BlissUtils.FormUtils.showError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Validate password
    const passwordStrength = checkPasswordStrength(password.value);
    if (!password.value) {
        BlissUtils.FormUtils.showError('signup-password', 'Password is required');
        isValid = false;
    } else if (passwordStrength < 2) {
        BlissUtils.FormUtils.showError('signup-password', 'Password is too weak. Please use a stronger password.');
        isValid = false;
    }
    
    // Validate confirm password
    if (!confirmPassword.value) {
        BlissUtils.FormUtils.showError('confirm-password', 'Please confirm your password');
        isValid = false;
    } else if (password.value !== confirmPassword.value) {
        BlissUtils.FormUtils.showError('confirm-password', 'Passwords do not match');
        isValid = false;
    }
    
    // Validate terms acceptance
    if (!terms.checked) {
        BlissUtils.FormUtils.showError('terms', 'You must accept the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Initialize real-time validation for login form
 */
function initializeLoginValidation() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    
    if (email) {
        email.addEventListener('blur', function() {
            if (this.value.trim() && !BlissUtils.FormUtils.validateEmail(this.value.trim())) {
                BlissUtils.FormUtils.showError('email', 'Please enter a valid email address');
            } else {
                BlissUtils.FormUtils.clearError('email');
            }
        });
    }
    
    if (password) {
        password.addEventListener('input', function() {
            if (this.value && this.value.length > 0) {
                BlissUtils.FormUtils.clearError('password');
            }
        });
    }
}

/**
 * Initialize real-time validation for signup form
 */
function initialize/**
 * BLISS CATERING - Consolidated JavaScript
 * All functionality for the catering website in a single file
 * Handles navigation, authentication, menu filtering, forms, and animations
 */

// Global utility object
const BlissUtils = {
    // Form validation utilities
    FormUtils: {
        validateEmail: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        validatePhone: function(phone) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
        },

        showError: function(fieldId, message) {
            const field = document.getElementById(fieldId);
            const errorElement = document.getElementById(fieldId + '-error');
            
            if (field) {
                field.classList.add('error');
                field.style.borderColor = '#dc3545';
            }
            
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
                errorElement.classList.add('show');
            }
        },

        clearError: function(fieldId) {
            const field = document.getElementById(fieldId);
            const errorElement = document.getElementById(fieldId + '-error');
            
            if (field) {
                field.classList.remove('error');
                field.style.borderColor = '';
            }
            
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
                errorElement.classList.remove('show');
            }
        },

        clearAllErrors: function(formId) {
            const form = document.getElementById(formId);
            if (form) {
                const errorElements = form.querySelectorAll('.error-message');
                const inputElements = form.querySelectorAll('input, select, textarea');
                
                errorElements.forEach(error => {
                    error.textContent = '';
                    error.style.display = 'none';
                    error.classList.remove('show');
                });
                
                inputElements.forEach(input => {
                    input.classList.remove('error');
                    input.style.borderColor = '';
                });
            }
        }
    },

    // Storage utilities
    Storage: {
        set: function(key, data) {
            try {
                localStorage.setItem(key, JSON.stringify(data));
            } catch (e) {
                console.warn('Storage not available:', e);
            }
        },

        get: function(key) {
            try {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : null;
            } catch (e) {
                console.warn('Storage not available:', e);
                return null;
            }
        },

        remove: function(key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.warn('Storage not available:', e);
            }
        }
    },

    // Toast notification system
    Toast: {
        show: function(message, type = 'info', duration = 3000) {
            // Remove existing toast
            const existingToast = document.querySelector('.toast-notification');
            if (existingToast) {
                existingToast.remove();
            }

            // Create toast element
            const toast = document.createElement('div');
            toast.className = `toast-notification toast-${type}`;
            toast.innerHTML = `
                <div class="toast-content">
                    <i class="fas ${this.getIcon(type)}"></i>
                    <span>${message}</span>
                    <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

            // Add styles
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                min-width: 300px;
                animation: slideInRight 0.3s ease;
            `;

            const toastContent = toast.querySelector('.toast-content');
            toastContent.style.cssText = `
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px;
                color: ${this.getColor(type)};
                border-left: 4px solid ${this.getColor(type)};
            `;

            const closeBtn = toast.querySelector('.toast-close');
            closeBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                color: #999;
                margin-left: auto;
            `;

            // Add to DOM
            document.body.appendChild(toast);

            // Auto remove
            setTimeout(() => {
                if (toast && toast.parentNode) {
                    toast.style.animation = 'slideOutRight 0.3s ease';
                    setTimeout(() => toast.remove(), 300);
                }
            }, duration);
        },

        getIcon: function(type) {
            const icons = {
                success: 'fa-check-circle',
                error: 'fa-exclamation-circle',
                warning: 'fa-exclamation-triangle',
                info: 'fa-info-circle'
            };
            return icons[type] || icons.info;
        },

        getColor: function(type) {
            const colors = {
                success: '#27AE60',
                error: '#E74C3C',
                warning: '#F39C12',
                info: '#3498DB'
            };
            return colors[type] || colors.info;
        }
    },

    // General utilities
    Utils: {
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        getUrlParameter: function(name) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        },

        formatCurrency: function(amount) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);
        }
    }
};

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeLazyLoading();
    
    // Page-specific initialization
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('login') || currentPage.includes('signup')) {
        initializeAuthPages();
    }
    
    if (currentPage.includes('menu')) {
        initializeMenuPage();
    }
    
    if (currentPage.includes('contact')) {
        initializeContactPage();
    }
    
    // Add CSS animations for toasts
    addToastStyles();
    
    console.log('Bliss Catering website initialized successfully');
});

/**
 * Navigation functionality
 */
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) bar.style.opacity = '0';
                    if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                }
            });
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                // Reset hamburger animation
                const bars = navToggle.querySelectorAll('.bar');
                bars.forEach(bar => {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                });
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active') && 
            !navMenu.contains(event.target) && 
            !navToggle.contains(event.target)) {
            navMenu.classList.remove('active');
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        }
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add shadow when scrolled
            if (scrollTop > 100) {
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                navbar.style.background = 'white';
                navbar.style.backdropFilter = 'none';
            }

            // Hide/show navbar on scroll (optional)
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

/**
 * Scroll effects and smooth scrolling
 */
function initializeScrollEffects() {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll-to-top functionality
    createScrollToTopButton();
}

/**
 * Create and manage scroll-to-top button
 */
function createScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.className = 'scroll-to-top';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    
    // Add styles
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollButton);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top when clicked
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.1)';
    });
    
    scrollButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
}

/**
 * Initialize animations and intersection observer
 */
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.service-card, .menu-item, .team-member, .value-card, .contact-item'
    );

    animateElements.forEach((element, index) => {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        observer.observe(element);
    });

    // Counter animation for statistics (if any)
    initializeCounters();
}

/**
 * Initialize counter animations for numeric values
 */
function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        counter.textContent = Math.floor(current);
                    }, 16);
                    observer.unobserve(counter);
                }
            });
        });
        
        observer.observe(counter);
    });
}

/**
 * Lazy loading for images
 */
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
                
                // Add fade-in effect
                img.style.opacity = '0';
                img.onload = function() {
                    img.style.transition = 'opacity 0.3s ease';
                    img.style.opacity = '1';
                };
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Authentication pages functionality
 */
function initializeAuthPages() {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('login')) {
        initializeLoginPage();
    } else if (currentPage.includes('signup')) {
        initializeSignupPage();
    }
}

/**
 * Initialize login page functionality
 */
function initializeLoginPage() {
    initializeLoginForm();
    initializePasswordToggle();
    initializeSocialLogin();
    console.log('Login page initialized');
}

/**
 * Initialize signup page functionality
 */
function initializeSignupPage() {
    initializeSignupForm();
    initializePasswordToggle();
    initializePasswordStrength();
    initializeSocialLogin();
    console.log('Signup page initialized');
}

/**
 * Initialize login form
 */
function initializeLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        BlissUtils.FormUtils.clearAllErrors('login-form');
        
        // Validate form
        if (validateLoginForm()) {
            // Let the form submit naturally to Flask backend
            this.submit();
        }
    });
    
    // Initialize real-time validation
    initializeLoginValidation();
}

/**
 * Validate login form
 */
function validateLoginForm() {
    let isValid = true;
    
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    
    // Validate email
    if (!email.value.trim()) {
        BlissUtils.FormUtils.showError('email', 'Email is required');
        isValid = false;
    } else if (!BlissUtils.FormUtils.validateEmail(email.value.trim())) {
        BlissUtils.FormUtils.showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (!password.value) {
        BlissUtils.FormUtils.showError('password', 'Password is required');
        isValid = false;
    } else if (password.value.length < 6) {
        BlissUtils.FormUtils.showError('password', 'Password must be at least 6 characters long');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Initialize signup form
 */
function initializeSignupForm() {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) return;
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        BlissUtils.FormUtils.clearAllErrors('signup-form');
        
        // Validate form
        if (validateSignupForm()) {
            // Let the form submit naturally to Flask backend
            this.submit();
        }
    });
    
    // Initialize real-time validation
    initializeSignupValidation();
}

/**
 * Validate signup form
 */
function validateSignupForm() {
    let isValid = true;
    
    const firstName = document.getElementById('first-name');
    const lastName = document.getElementById('last-name');
    const email = document.getElementById('signup-email');
    const phone = document.getElementById('phone');
    const password = document.getElementById('signup-password');
    const confirmPassword = document.getElementById('confirm-password');
    const terms = document.getElementById('terms');
    
    // Validate first name
    if (!firstName.value.trim()) {
        BlissUtils.FormUtils.showError('first-name', 'First name is required');
        isValid = false;
    } else if (firstName.value.trim().length < 2) {
        BlissUtils.FormUtils.showError('first-name', 'First name must be at least 2 characters long');
        isValid = false;
    }
    
    // Validate last name
    if (!lastName.value.trim()) {
        BlissUtils.FormUtils.showError('last-name', 'Last name is required');
        isValid = false;
    } else if (lastName.value.trim().length < 2) {
        BlissUtils.FormUtils.showError('last-name', 'Last name must be at least 2 characters long');
        isValid = false;
    }
    
    // Validate email
    if (!email.value.trim()) {
        BlissUtils.FormUtils.showError('signup-email', 'Email is required');
        isValid = false;
    } else if (!BlissUtils.FormUtils.validateEmail(email.value.trim())) {
        BlissUtils.FormUtils.showError('signup-email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone
    if (!phone.value.trim()) {
        BlissUtils.FormUtils.showError('phone', 'Phone number is required');
        isValid = false;
    } else if (!BlissUtils.FormUtils.validatePhone(phone.value.trim())) {
        BlissUtils.FormUtils.showError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Validate password
    const passwordStrength = checkPasswordStrength(password.value);
    if (!password.value) {
        BlissUtils.FormUtils.showError('signup-password', 'Password is required');
        isValid = false;
    } else if (passwordStrength < 2) {
        BlissUtils.FormUtils.showError('signup-password', 'Password is too weak. Please use a stronger password.');
        isValid = false;
    }
    
    // Validate confirm password
    if (!confirmPassword.value) {
        BlissUtils.FormUtils.showError('confirm-password', 'Please confirm your password');
        isValid = false;
    } else if (password.value !== confirmPassword.value) {
        BlissUtils.FormUtils.showError('confirm-password', 'Passwords do not match');
        isValid = false;
    }
    
    // Validate terms acceptance
    if (!terms.checked) {
        BlissUtils.FormUtils.showError('terms', 'You must accept the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Initialize password toggle functionality
 */
function initializePasswordToggle() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentNode.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

/**
 * Global toggle password function for HTML onclick
 */
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(inputId + '-eye');
    
    if (input && icon) {
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

/**
 * Initialize password strength indicator
 */
function initializePasswordStrength() {
    const passwordInput = document.getElementById('signup-password');
    if (!passwordInput) return;
    
    const strengthIndicator = document.getElementById('password-strength');
    if (!strengthIndicator) return;
    
    passwordInput.addEventListener('input', function() {
        const strength = checkPasswordStrength(this.value);
        updatePasswordStrengthDisplay(strength, strengthIndicator);
    });
}

/**
 * Check password strength
 */
function checkPasswordStrength(password) {
    if (!password) return 0;
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    // Common patterns (reduce score)
    if (/(.)\1{2,}/.test(password)) score--; // Repeated characters
    if (/123|abc|qwe/i.test(password)) score--; // Sequential characters
    
    return Math.max(0, Math.min(3, score)); // Clamp between 0-3
}

/**
 * Update password strength display
 */
function updatePasswordStrengthDisplay(strength, indicator) {
    // Remove existing classes
    indicator.classList.remove('weak', 'medium', 'strong');
    
    if (strength === 0) {
        indicator.style.display = 'none';
    } else {
        indicator.style.display = 'block';
        
        if (strength === 1) {
            indicator.classList.add('weak');
        } else if (strength === 2) {
            indicator.classList.add('medium');
        } else {
            indicator.classList.add('strong');
        }
    }
}

/**
 * Initialize login validation
 */
function initializeLoginValidation() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value.trim() && !BlissUtils.FormUtils.validateEmail(this.value.trim())) {
                BlissUtils.FormUtils.showError('email', 'Please enter a valid email address');
            } else {
                BlissUtils.FormUtils.clearError('email');
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            if (this.value && this.value.length < 6) {
                BlissUtils.FormUtils.showError('password', 'Password must be at least 6 characters long');
            } else {
                BlissUtils.FormUtils.clearError('password');
            }
        });
    }
}

/**
 * Initialize signup validation
 */
function initializeSignupValidation() {
    const inputs = {
        'first-name': (value) => value.trim().length >= 2,
        'last-name': (value) => value.trim().length >= 2,
        'signup-email': (value) => BlissUtils.FormUtils.validateEmail(value.trim()),
        'phone': (value) => BlissUtils.FormUtils.validatePhone(value.trim()),
        'signup-password': (value) => checkPasswordStrength(value) >= 2,
        'confirm-password': (value) => {
            const password = document.getElementById('signup-password').value;
            return value === password;
        }
    };
    
    Object.keys(inputs).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                if (this.value && !inputs[fieldId](this.value)) {
                    const messages = {
                        'first-name': 'First name must be at least 2 characters long',
                        'last-name': 'Last name must be at least 2 characters long',
                        'signup-email': 'Please enter a valid email address',
                        'phone': 'Please enter a valid phone number',
                        'signup-password': 'Password is too weak',
                        'confirm-password': 'Passwords do not match'
                    };
                    BlissUtils.FormUtils.showError(fieldId, messages[fieldId]);
                } else {
                    BlissUtils.FormUtils.clearError(fieldId);
                }
            });
        }
    });
}

/**
 * Initialize social login
 */
function initializeSocialLogin() {
    const socialButtons = document.querySelectorAll('.btn-social');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            BlissUtils.Toast.show('Social login is not yet implemented. Please use email registration.', 'info', 3000);
        });
    });
}

/**
 * Menu page functionality
 */
function initializeMenuPage() {
    initializeMenuFilter();
    initializeMenuSearch();
    initializeMenuAnimations();
    console.log('Menu page initialized');
}

/**
 * Menu filtering system
 */
function initializeMenuFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (!filterButtons.length || !menuItems.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter menu items
            filterMenuItems(category, menuItems);
            
            // Update URL without page reload
            updateURL(category);
        });
    });
    
    // Initialize with URL parameter if present
    const urlCategory = BlissUtils.Utils.getUrlParameter('category');
    if (urlCategory) {
        const targetButton = document.querySelector(`[data-category="${urlCategory}"]`);
        if (targetButton) {
            targetButton.click();
        }
    }
}

/**
 * Filter menu items by category
 */
function filterMenuItems(category, menuItems) {
    menuItems.forEach((item, index) => {
        const itemCategory = item.getAttribute('data-category');
        const shouldShow = category === 'all' || itemCategory === category;
        
        if (shouldShow) {
            // Show item with animation delay
            item.style.display = 'block';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 50);
        } else {
            // Hide item
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
    
    // Update results count
    updateResultsCount(category);
}

/**
 * Menu search functionality
 */
function initializeMenuSearch() {
    const searchInput = document.getElementById('menu-search');
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (!searchInput || !menuItems.length) return;
    
    // Debounce search to improve performance
    const debouncedSearch = BlissUtils.Utils.debounce(function(searchTerm) {
        performSearch(searchTerm, menuItems);
    }, 300);
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        // Reset filters when searching
        if (searchTerm) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector('[data-category="all"]').classList.add('active');
        }
        
        debouncedSearch(searchTerm);
    });
    
    // Clear search on escape key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            this.blur();
            performSearch('', menuItems);
        }
    });
}

/**
 * Perform search on menu items
 */
function performSearch(searchTerm, menuItems) {
    let visibleCount = 0;
    
    menuItems.forEach((item, index) => {
        const itemName = item.querySelector('h3').textContent.toLowerCase();
        const itemDescription = item.querySelector('p').textContent.toLowerCase();
        const matches = searchTerm === '' || 
                       itemName.includes(searchTerm) || 
                       itemDescription.includes(searchTerm);
        
        if (matches) {
            visibleCount++;
            item.style.display = 'block';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 30);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
    
    // Show no results message if needed
    showNoResultsMessage(visibleCount === 0, searchTerm);
}

/**
 * Show/hide no results message
 */
function showNoResultsMessage(show, searchTerm = '') {
    let noResultsDiv = document.getElementById('no-results-message');
    
    if (show && !noResultsDiv) {
        noResultsDiv = document.createElement('div');
        noResultsDiv.id = 'no-results-message';
        noResultsDiv.className = 'no-results';
        noResultsDiv.innerHTML = `
            <div class="no-results-content">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3>No items found</h3>
                <p>We couldn't find any menu items matching "${searchTerm}"</p>
                <button class="btn btn-primary" onclick="clearSearch()">
                    <i class="fas fa-times"></i> Clear Search
                </button>
            </div>
        `;
        
        noResultsDiv.style.cssText = `
            text-align: center;
            padding: 3rem;
            grid-column: 1 / -1;
            background: white;
            border-radius: 16px;
            box-shadow: var(--shadow);
        `;
        
        const menuGrid = document.getElementById('menu-grid');
        if (menuGrid) {
            menuGrid.appendChild(noResultsDiv);
        }
    } else if (!show && noResultsDiv) {
        noResultsDiv.remove();
    }
}

/**
 * Clear search function (called from no results button)
 */
function clearSearch() {
    const searchInput = document.getElementById('menu-search');
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
        
        const menuItems = document.querySelectorAll('.menu-item');
        performSearch('', menuItems);
    }
}

/**
 * Update results count display
 */
function updateResultsCount(category) {
    const menuItems = document.querySelectorAll('.menu-item');
    const visibleItems = Array.from(menuItems).filter(item => {
        return item.style.display !== 'none';
    });
    
    let countDisplay = document.getElementById('results-count');
    
    if (!countDisplay) {
        countDisplay = document.createElement('div');
        countDisplay.id = 'results-count';
        countDisplay.style.cssText = `
            text-align: center;
            margin: 1rem 0;
            color: #666;
            font-size: 0.9rem;
        `;
        
        const menuControls = document.querySelector('.menu-controls .container');
        if (menuControls) {
            menuControls.appendChild(countDisplay);
        }
    }
    
    const categoryName = category === 'all' ? 'All Items' : 
                        category.charAt(0).toUpperCase() + category.slice(1);
    
    countDisplay.textContent = `Showing ${visibleItems.length} items in ${categoryName}`;
}

/**
 * Update URL for category filtering
 */
function updateURL(category) {
    const url = new URL(window.location);
    if (category === 'all') {
        url.searchParams.delete('category');
    } else {
        url.searchParams.set('category', category);
    }
    window.history.replaceState({}, '', url);
}

/**
 * Initialize menu animations
 */
function initializeMenuAnimations() {
    // Stagger animation for menu items on page load
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Add hover effects for menu items
    addMenuItemHoverEffects();
}

/**
 * Add hover effects to menu items
 */
function addMenuItemHoverEffects() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const image = item.querySelector('.menu-item-image img');
        
        item.addEventListener('mouseenter', function() {
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
            
            // Add floating effect
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
        });
        
        item.addEventListener('mouseleave', function() {
            if (image) {
                image.style.transform = 'scale(1)';
            }
            
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    });
}

/**
 * Contact page functionality
 */
function initializeContactPage() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        BlissUtils.FormUtils.clearAllErrors('contact-form');
        
        // Validate form
        if (validateContactForm()) {
            // Let the form submit naturally to Flask backend
            this.submit();
        }
    });
    
    console.log('Contact page initialized');
}

/**
 * Validate contact form
 */
function validateContactForm() {
    let isValid = true;
    
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    
    // Validate name
    if (!name.value.trim()) {
        BlissUtils.FormUtils.showError('name', 'Name is required');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        BlissUtils.FormUtils.showError('name', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Validate email
    if (!email.value.trim()) {
        BlissUtils.FormUtils.showError('email', 'Email is required');
        isValid = false;
    } else if (!BlissUtils.FormUtils.validateEmail(email.value.trim())) {
        BlissUtils.FormUtils.showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate message
    if (!message.value.trim()) {
        BlissUtils.FormUtils.showError('message', 'Message is required');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        BlissUtils.FormUtils.showError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Add toast notification styles
 */
function addToastStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .toast-notification {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .toast-close:hover {
            color: #666 !important;
        }
    `;
    document.head.appendChild(style);
}

// Make functions globally available for HTML onclick handlers
window.togglePassword = togglePassword;
window.clearSearch = clearSearch;
