/* ============================================
   Include Loader (Header & Footer)
   ============================================ */
function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/services/') || path.includes('/calculators/')) {
        return '../';
    }
    return '';
}

async function loadIncludes() {
    const base = getBasePath();
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    
    if (headerPlaceholder) {
        try {
            const resp = await fetch(base + 'header.html');
            const html = await resp.text();
            headerPlaceholder.outerHTML = html;
        } catch (e) {
            console.error('Failed to load header', e);
        }
    }
    
    if (footerPlaceholder) {
        try {
            const resp = await fetch(base + 'footer.html');
            const html = await resp.text();
            footerPlaceholder.outerHTML = html;
        } catch (e) {
            console.error('Failed to load footer', e);
        }
    }
}

/* ============================================
   Ecommerce Mineral Business Consultancy
   Global JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', async function() {
    await loadIncludes();
    initHeaderScroll();
    initMobileMenu();
    initScrollAnimations();
    initTestimonialCarousel();
    initBreadcrumbActiveState();
});

/* ============================================
   Header Scroll Effect
   ============================================ */
function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    function onScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ============================================
   Mobile Menu Toggle
   ============================================ */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.nav-menu');
    const backdrop = document.querySelector('.mobile-backdrop');
    if (!toggle || !menu) return;

    function openMenu() {
        toggle.classList.add('open');
        menu.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        if (backdrop) backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        toggle.classList.remove('open');
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        if (backdrop) backdrop.classList.remove('open');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function() {
        if (menu.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    if (backdrop) {
        backdrop.addEventListener('click', closeMenu);
    }

    // Close menu when clicking a link
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
            closeMenu();
        }
    });
}

/* ============================================
   Scroll Animations (Fade-in on scroll)
   ============================================ */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    if (!fadeElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
}

/* ============================================
   Testimonial Carousel
   ============================================ */
function initTestimonialCarousel() {
    const track = document.querySelector('.testimonial-track');
    const dots = document.querySelectorAll('.carousel-dot');
    const items = document.querySelectorAll('.testimonial-item');
    if (!track || !items.length) return;

    let current = 0;
    const total = items.length;

    function goTo(index) {
        current = index;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goTo(i));
    });

    // Auto-play
    setInterval(() => {
        goTo((current + 1) % total);
    }, 5000);
}

/* ============================================
   Active Nav Link
   ============================================ */
function initBreadcrumbActiveState() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/* ============================================
   Calculator: Amazon
   ============================================ */
function initAmazonCalculator() {
    const priceEl = document.getElementById('amz-price');
    const costEl = document.getElementById('amz-cost');
    const fbaEl = document.getElementById('amz-fba');
    const refEl = document.getElementById('amz-referral');
    const resultEl = document.getElementById('amz-result');
    if (!priceEl || !resultEl) return;

    function calculate() {
        const price = parseFloat(priceEl.value) || 0;
        const cost = parseFloat(costEl.value) || 0;
        const fba = parseFloat(fbaEl.value) || 0;
        const refPct = parseFloat(refEl.value) || 15;
        const referral = price * (refPct / 100);
        const profit = price - cost - fba - referral;
        const margin = price > 0 ? ((profit / price) * 100) : 0;
        resultEl.textContent = margin.toFixed(2) + '%';
        return { profit, margin };
    }

    [priceEl, costEl, fbaEl, refEl].forEach(el => {
        if (el) el.addEventListener('input', calculate);
    });

    calculate();
}

/* ============================================
   Calculator: Etsy
   ============================================ */
function initEtsyCalculator() {
    const priceEl = document.getElementById('etsy-price');
    const costEl = document.getElementById('etsy-cost');
    const shippingEl = document.getElementById('etsy-shipping');
    const resultEl = document.getElementById('etsy-result');
    if (!priceEl || !resultEl) return;

    function calculate() {
        const price = parseFloat(priceEl.value) || 0;
        const cost = parseFloat(costEl.value) || 0;
        const shipping = parseFloat(shippingEl.value) || 0;
        // Etsy fees: $0.20 listing + 6.5% transaction + 3% + $0.25 payment processing
        const listingFee = 0.20;
        const transactionFee = price * 0.065;
        const paymentFee = (price * 0.03) + 0.25;
        const totalFees = listingFee + transactionFee + paymentFee;
        const profit = price - cost - shipping - totalFees;
        const margin = price > 0 ? ((profit / price) * 100) : 0;
        resultEl.textContent = margin.toFixed(2) + '%';
        return { profit, margin };
    }

    [priceEl, costEl, shippingEl].forEach(el => {
        if (el) el.addEventListener('input', calculate);
    });

    calculate();
}

/* ============================================
   Calculator: eBay
   ============================================ */
function initEbayCalculator() {
    const priceEl = document.getElementById('ebay-price');
    const costEl = document.getElementById('ebay-cost');
    const shippingEl = document.getElementById('ebay-shipping');
    const resultEl = document.getElementById('ebay-result');
    if (!priceEl || !resultEl) return;

    function calculate() {
        const price = parseFloat(priceEl.value) || 0;
        const cost = parseFloat(costEl.value) || 0;
        const shipping = parseFloat(shippingEl.value) || 0;
        // eBay fees: ~13.25% final value fee (varies by category)
        const finalValueFee = price * 0.1325;
        const profit = price - cost - shipping - finalValueFee;
        const margin = price > 0 ? ((profit / price) * 100) : 0;
        resultEl.textContent = margin.toFixed(2) + '%';
        return { profit, margin };
    }

    [priceEl, costEl, shippingEl].forEach(el => {
        if (el) el.addEventListener('input', calculate);
    });

    calculate();
}

// Expose calculator init functions globally so pages can call them
window.initAmazonCalculator = initAmazonCalculator;
window.initEtsyCalculator = initEtsyCalculator;
window.initEbayCalculator = initEbayCalculator;
