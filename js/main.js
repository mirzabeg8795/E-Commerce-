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

function fixHeaderLinks(base) {
    if (!base) return;
    document.querySelectorAll('.site-header a, .mobile-pill-nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('/') && !href.startsWith('mailto:')) {
            link.setAttribute('href', base + href);
        }
    });
    document.querySelectorAll('.site-header img').forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http') && !src.startsWith('/')) {
            img.setAttribute('src', base + src);
        }
    });
}

/* ============================================
   Main Application Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', async function() {
    const base = getBasePath();
    await loadIncludes();
    fixHeaderLinks(base);
    initHeaderScroll();
    initPillNav();
    initScrollAnimations();
    initTestimonialCarousel();
    initActiveNavLinks();
    initCalculators();
});

/* ============================================
   Pill Navigation (Desktop + Mobile)
   ============================================ */
function initPillNav() {
    const indicator = document.querySelector('.pill-indicator');
    const items = document.querySelectorAll('.pill-nav-item');
    if (!indicator || !items.length) return;

    function updateIndicator() {
        const activeItem = document.querySelector('.pill-nav-item.active');
        if (!activeItem) return;
        const index = parseInt(activeItem.getAttribute('data-index')) || 0;
        const itemWidth = activeItem.offsetWidth;
        const offset = activeItem.offsetLeft;
        indicator.style.transform = `translateX(${offset + (itemWidth - 54) / 2}px)`;
    }

    updateIndicator();
    window.addEventListener('resize', updateIndicator);

    /* Mobile bottom nav indicator */
    const mpIndicator = document.querySelector('.mp-indicator');
    const mpItems = document.querySelectorAll('.mobile-pill-list li');
    if (mpIndicator && mpItems.length) {
        function updateMpIndicator() {
            const activeItem = document.querySelector('.mobile-pill-list li.active');
            if (!activeItem) return;
            const itemWidth = activeItem.offsetWidth;
            const offset = activeItem.offsetLeft;
            mpIndicator.style.transform = `translateX(${offset + (itemWidth - 50) / 2}px)`;
        }
        updateMpIndicator();
        window.addEventListener('resize', updateMpIndicator);
    }
}

/* ============================================
   Header Scroll Effect
   ============================================ */
function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    function onScroll() {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ============================================
   Scroll Animations (Fade-in)
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
        rootMargin: '0px 0px -40px 0px'
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

    setInterval(() => {
        goTo((current + 1) % total);
    }, 5000);
}

/* ============================================
   Active Navigation Links
   ============================================ */
function initActiveNavLinks() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Clear all existing active states first
    document.querySelectorAll('.pill-nav-item, .mobile-pill-list li').forEach(item => {
        item.classList.remove('active');
    });

    document.querySelectorAll('.pill-nav-item a, .mobile-pill-list li a').forEach(link => {
        const href = link.getAttribute('href');
        if ((href && href.endsWith(currentPage)) || (currentPage === '' && href === 'index.html')) {
            link.parentElement.classList.add('active');
        }
    });
    
    // Re-initialize navigation indicators after setting active state
    initPillNav();
}

/* ============================================
   Calculators
   ============================================ */
function initCalculators() {
    initAmazonCalculator();
    initEtsyCalculator();
    initEbayCalculator();
}

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
    }

    [priceEl, costEl, fbaEl, refEl].forEach(el => {
        if (el) el.addEventListener('input', calculate);
    });
    calculate();
}

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
        const listingFee = 0.20;
        const transactionFee = price * 0.065;
        const paymentFee = (price * 0.03) + 0.25;
        const totalFees = listingFee + transactionFee + paymentFee;
        const profit = price - cost - shipping - totalFees;
        const margin = price > 0 ? ((profit / price) * 100) : 0;
        resultEl.textContent = margin.toFixed(2) + '%';
    }

    [priceEl, costEl, shippingEl].forEach(el => {
        if (el) el.addEventListener('input', calculate);
    });
    calculate();
}

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
        const finalValueFee = price * 0.1325;
        const profit = price - cost - shipping - finalValueFee;
        const margin = price > 0 ? ((profit / price) * 100) : 0;
        resultEl.textContent = margin.toFixed(2) + '%';
    }

    [priceEl, costEl, shippingEl].forEach(el => {
        if (el) el.addEventListener('input', calculate);
    });
    calculate();
}

window.initAmazonCalculator = initAmazonCalculator;
window.initEtsyCalculator = initEtsyCalculator;
window.initEbayCalculator = initEbayCalculator;
