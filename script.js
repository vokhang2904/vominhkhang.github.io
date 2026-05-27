document.addEventListener('DOMContentLoaded', () => {
    
    // 1. TYPING EFFECT
    const typingElement = document.querySelector('.typing-effect');
    const textArray = ["Dedicated Marketing Executive ", "Digital Marketer ", "Growth Driver "];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = textArray[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = 100;

        if (isDeleting) {
            typeSpeed /= 2;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at the end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            typeSpeed = 500; // Pause before typing next
        }

        setTimeout(type, typeSpeed);
    }
    
    // Start typing effect after a short delay
    setTimeout(type, 1000);

    // 2. SCROLL ANIMATIONS (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // If it's a progress bar, trigger its width animation
                if (entry.target.classList.contains('skill-group')) {
                    const progress = entry.target.querySelector('.progress');
                    if (progress) {
                        const targetWidth = progress.style.width;
                        progress.style.width = '0'; // reset
                        setTimeout(() => {
                            progress.style.width = targetWidth;
                        }, 100);
                    }
                }
                
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // 3. NUMBER COUNTER ANIMATION
    const counters = document.querySelectorAll('.counter, .counter-decimal');
    
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const isDecimal = counter.classList.contains('counter-decimal');
                let startTime = null;
                
                function updateCounter(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const progress = timestamp - startTime;
                    const percentage = Math.min(progress / duration, 1);
                    
                    // Easing function for smoother stop
                    const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
                    
                    const current = target * easeOutQuart;
                    
                    if (isDecimal) {
                        counter.textContent = current.toFixed(1);
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                    
                    if (progress < duration) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        // Ensure final value is exact
                        counter.textContent = target;
                    }
                }
                
                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));
});
