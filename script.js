document.addEventListener("DOMContentLoaded", function() {
    // DOM Caching
    const preloader = document.querySelector('.preloader');
    const main = document.getElementById('main') || document.querySelector('[data-scroll-container]');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const progressText = document.querySelector('.progress-text');
    const scrollContainer = document.querySelector('[data-scroll-container]');
    const themeSwitcher = document.querySelector(".theme-switcher");
    const dynamicSkillsetElement = document.querySelector(".dynamic-skillset");
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const projectsContainer = document.querySelector(".projects-container");
    const modal = document.getElementById("projectModal");
    const closeModal = document.querySelector(".close-button");
    const contactForm = document.querySelector(".contact-form");

    // Fallback: Hide preloader after 4 seconds
    const preloaderTimeout = setTimeout(() => {
        if (preloader && preloader.style.display !== 'none') {
            preloader.style.display = 'none';
            if (main) main.style.visibility = 'visible';
            safeInitAll();
        }
    }, 4000);

    function safeInitAll() {
        try { initLocomotiveScroll(); } catch(e) { console.error('LocomotiveScroll init failed:', e); }
        try { initVanta(); } catch(e) { console.error('Vanta init failed:', e); }
        try { initGSAPAnimations(); } catch(e) { console.error('GSAP Animations init failed:', e); }
        try { initTypingAnimation(); } catch(e) { console.error('Typing Animation init failed:', e); }
        try { initThemeSwitcher(); } catch(e) { console.error('Theme Switcher init failed:', e); }
        try { initCursor(); } catch(e) { console.error('Cursor init failed:', e); }
    }

    // Preloader Animation
    const preloaderTimeline = gsap.timeline({
        onComplete: () => {
            clearTimeout(preloaderTimeout);
            if (preloader) preloader.style.display = "none";
            if (main) main.style.visibility = 'visible';
            safeInitAll();
        }
    });

    preloaderTimeline.to(".progress-bar", {
        width: "100%",
        duration: 2,
        ease: "power2.out",
        onStart: () => {
            if (progressBarContainer) progressBarContainer.classList.add('active');
            gsap.to(progressText, { textContent: "100%", duration: 2, roundProps: "textContent", ease: "power2.out" });
        }
    })
    .to(".preloader-logo", { opacity: 0, y: -20, duration: 0.5 }, "+=0.5")
    .to(progressBarContainer, { opacity: 0, duration: 0.5 }, "-=0.5")
    .to(preloader, { opacity: 0, scale: 0.9, duration: 1 });

    let scroll;

    function initLocomotiveScroll() {
        if (!scrollContainer) {
            console.warn('No [data-scroll-container] found. Skipping LocomotiveScroll.');
            return;
        }
        scroll = new LocomotiveScroll({ el: scrollContainer, smooth: true, lerp: 0.05, multiplier: 1.2 });
        scroll.on("scroll", ScrollTrigger.update);
        ScrollTrigger.scrollerProxy(scrollContainer, {
            scrollTop(value) {
                return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
            },
            getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            },
            pinType: scrollContainer.style.transform ? "transform" : "fixed"
        });
        ScrollTrigger.addEventListener("refresh", () => scroll.update());
        ScrollTrigger.refresh();
    }

    let vantaEffect;

    function initVanta() {
        const theme = document.documentElement.getAttribute("data-theme");
        const bgColor = theme === "light" ? 0xf4f4f4 : 0x0a0a0a;
        const baseColor = theme === "light" ? 0x6f42c1 : 0x8a2be2;

        if (vantaEffect) vantaEffect.destroy();

        vantaEffect = VANTA.HALO({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            backgroundColor: bgColor,
            baseColor: baseColor,
            amplitudeFactor: 1.5,
            size: 1.2
        });
    }

    function initThemeSwitcher() {
        if (!themeSwitcher) return;
        const doc = document.documentElement;
        const savedTheme = localStorage.getItem('theme') || 'dark';
        doc.setAttribute("data-theme", savedTheme);

        themeSwitcher.addEventListener("click", () => {
            let newTheme = doc.getAttribute("data-theme") === "light" ? "dark" : "light";
            doc.setAttribute("data-theme", newTheme);
            localStorage.setItem('theme', newTheme);
            initVanta();
        });
    }

    function initTypingAnimation() {
        if (!dynamicSkillsetElement) return;
        const skills = ["Backend Developer", "Frontend Developer", "Automation & Scripting", "AI and ML", "Zapier & n8n"];
        let skillIndex = 0;

        function type() {
            let skill = skills[skillIndex];
            gsap.to(dynamicSkillsetElement, { text: skill, duration: 1, ease: "none", onComplete: () => {
                gsap.delayedCall(2, erase);
            }});
        }

        function erase() {
            gsap.to(dynamicSkillsetElement, { text: "", duration: 1, ease: "none", onComplete: () => {
                skillIndex = (skillIndex + 1) % skills.length;
                type();
            }});
        }

        type();
    }

    function initCursor() {
        if (!cursorDot || !cursorOutline) return;

        let posX = 0, posY = 0;
        let mouseX = 0, mouseY = 0;

        gsap.to({}, 0.016, {
            repeat: -1,
            onRepeat: function() {
                posX += (mouseX - posX) / 9;
                posY += (mouseY - posY) / 9;
                gsap.set(cursorOutline, { css: { left: posX - 15, top: posY - 15 } });
                gsap.set(cursorDot, { css: { left: mouseX, top: mouseY } });
            }
        });

        window.addEventListener("mousemove", e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        document.querySelectorAll("a, button, .project-card, .tech-tag, .theme-switcher").forEach(el => {
            el.addEventListener("mouseenter", () => {
                gsap.to(cursorOutline, { scale: 1.5, borderColor: "var(--secondary-color)", duration: 0.3 });
            });
            el.addEventListener("mouseleave", () => {
                gsap.to(cursorOutline, { scale: 1, borderColor: "var(--primary-color)", duration: 0.3 });
            });
        });
    }

    function initGSAPAnimations() {
        gsap.from(navbar, { y: -100, opacity: 0, duration: 1, ease: "power3.out" });

        if (hamburger && navLinks) {
            hamburger.addEventListener("click", () => {
                navLinks.classList.toggle("nav-active");
                hamburger.classList.toggle("toggle");
            });

            navLinks.querySelectorAll("a").forEach(link => {
                link.addEventListener("click", e => {
                    e.preventDefault();
                    const targetId = e.currentTarget.getAttribute("href");
                    const targetElement = document.querySelector(targetId);
                    if (targetElement && scroll) scroll.scrollTo(targetElement);
                    if (navLinks.classList.contains("nav-active")) {
                        navLinks.classList.remove("nav-active");
                        hamburger.classList.remove("toggle");
                    }
                });
            });
        }

        gsap.to(".cta-button", { scale: 1.05, repeat: -1, yoyo: true, duration: 0.8, ease: "power1.inOut" });
        gsap.to(".neon-orb", { y: -20, duration: 3, repeat: -1, yoyo: true, ease: "power1.inOut" });
        gsap.to(".glow-element", { y: 20, duration: 4, repeat: -1, yoyo: true, ease: "power1.inOut", stagger: 0.5 });

        gsap.from(".about-section", { filter: "blur(10px)", scrollTrigger: { trigger: ".about-section", scroller: scrollContainer, start: "top 80%", end: "top 30%", scrub: 1 } });
        gsap.from(".profile-image-container", { x: -100, opacity: 0, duration: 1, scrollTrigger: { trigger: ".about-section", scroller: scrollContainer, start: "top 70%" } });
        gsap.from(".skill-icons i", { opacity: 0, y: 20, stagger: 0.1, duration: 0.5, scrollTrigger: { trigger: ".skill-icons", scroller: scrollContainer, start: "top 90%" } });

        gsap.from(".project-card", { y: 100, scale: 0.9, stagger: 0.2, duration: 1, ease: "power4.out", scrollTrigger: { trigger: projectsContainer, scroller: scrollContainer, start: "top 85%" } });

        if (projectsContainer && modal && closeModal) {
            projectsContainer.addEventListener("click", e => {
                const card = e.target.closest(".project-card");
                if (!card) return;

                modal.querySelector(".modal-title").textContent = card.dataset.title;
                modal.querySelector(".modal-description").textContent = card.dataset.description;
                modal.querySelector(".modal-tech-stack").innerHTML = card.dataset.tech;
                modal.querySelector(".modal-img").src = card.querySelector("img").src;
                modal.querySelector(".project-link").href = card.dataset.github;

                modal.classList.add("active");
                if (scroll) scroll.stop();
            });

            const closeModalFunc = () => {
                modal.classList.remove("active");
                if (scroll) scroll.start();
            };

            closeModal.addEventListener("click", closeModalFunc);
            modal.addEventListener("click", e => { if (e.target === modal) closeModalFunc(); });
        }

        if (contactForm) {
            contactForm.addEventListener("submit", e => e.preventDefault());
        }

        gsap.from(".glassmorphic-input", { x: -50, stagger: 0.1, duration: 0.5, scrollTrigger: { trigger: contactForm, scroller: scrollContainer, start: "top 80%" } });
        gsap.from(".submit-button", { scale: 0.8, duration: 0.5, scrollTrigger: { trigger: ".submit-button", scroller: scrollContainer, start: "top 90%" } });
        gsap.to(".submit-button", { scale: 1.02, repeat: -1, yoyo: true, duration: 0.6, ease: "power1.inOut" });
        gsap.from(".hero-socials a", { opacity: 0, y: 20, stagger: 0.1, duration: 0.5, delay: 1 });
        gsap.from(".social-icons i", { y: 20, stagger: 0.1, duration: 0.5, scrollTrigger: { trigger: ".social-icons", scroller: scrollContainer, start: "top 90%" } });

        gsap.from(".footer-section", { opacity: 0, y: 60, filter: "blur(10px)", duration: 1, scrollTrigger: { trigger: ".footer-section", scroller: scrollContainer, start: "top 90%" } });
        gsap.to(".footer-glow-particles .particle", { y: -15, x: 15, duration: 4, repeat: -1, yoyo: true, ease: "power1.inOut", stagger: 0.7 });
    }
});