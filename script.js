document.addEventListener("DOMContentLoaded", function() {
    // Fallback: Hide preloader after 4 seconds in case of animation/script failure
    setTimeout(() => {
        const preloader = document.querySelector('.preloader');
        const main = document.getElementById('main') || document.querySelector('[data-scroll-container]');
        if (preloader && preloader.style.display !== 'none') {
            preloader.style.display = 'none';
            if (main) main.style.visibility = 'visible';
            safeInitAll();
        }
    }, 4000);

    // Helper to safely initialize all features
    function safeInitAll() {
        try { if (typeof initLocomotiveScroll === 'function') initLocomotiveScroll(); } catch(e) { console.error('LocomotiveScroll initialization failed:', e); }
        try { if (typeof initVanta === 'function') initVanta(); } catch(e) { console.error('Vanta initialization failed:', e); }
        try { if (typeof initGSAPAnimations === 'function') initGSAPAnimations(); } catch(e) { console.error('GSAP Animations initialization failed:', e); }
        try { if (typeof initTypingAnimation === 'function') initTypingAnimation(); } catch(e) { console.error('Typing Animation initialization failed:', e); }
        try { if (typeof initThemeSwitcher === 'function') initThemeSwitcher(); } catch(e) { console.error('Theme Switcher initialization failed:', e); }
        try { if (typeof initCursor === 'function') initCursor(); } catch(e) { console.error('Cursor initialization failed:', e); }
    }

    // Preloader Animation
    const preloaderTimeline = gsap.timeline();
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const progressText = document.querySelector('.progress-text');

    preloaderTimeline.to(".progress-bar", {
        width: "100%",
        duration: 2,
        ease: "power2.out",
        onStart: () => {
            if (progressBarContainer) {
                progressBarContainer.classList.add('active');
            }
            gsap.to(progressText, {
                textContent: "100%",
                duration: 2,
                roundProps: "textContent",
                ease: "power2.out",
            });
        }
    })
    .to(".preloader-logo", {
        opacity: 0,
        y: -20,
        duration: 0.5
    }, "+=0.5")
    .to(".progress-bar-container", {
        opacity: 0,
        duration: 0.5
    }, "-=0.5")
    .to(".preloader", {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        onComplete: () => {
            const preloader = document.querySelector(".preloader");
            const main = document.getElementById('main') || document.querySelector('[data-scroll-container]');
            if (preloader) preloader.style.display = "none";
            if (main) main.style.visibility = 'visible';
            safeInitAll();
        }
    });

    let scroll;

    function initLocomotiveScroll() {
        const scrollContainer = document.querySelector('[data-scroll-container]');
        if (!scrollContainer) {
            console.warn('No [data-scroll-container] found. Skipping LocomotiveScroll.');
            return;
        }
        scroll = new LocomotiveScroll({
            el: scrollContainer,
            smooth: true,
            lerp: 0.05,
            multiplier: 1.2,
        });

        scroll.on("scroll", ScrollTrigger.update);

        ScrollTrigger.scrollerProxy("[data-scroll-container]", {
            scrollTop(value) {
                return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight
                };
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

        if (vantaEffect) {
            vantaEffect.destroy();
        }

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
        const themeSwitcher = document.querySelector(".theme-switcher");
        const doc = document.documentElement;
        if (!themeSwitcher) return;

        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            doc.setAttribute("data-theme", "light");
        } else {
            doc.removeAttribute("data-theme");
        }

        themeSwitcher.addEventListener("click", () => {
            let currentTheme = doc.getAttribute("data-theme");
            if (currentTheme === "light") {
                doc.removeAttribute("data-theme");
                localStorage.setItem('theme', 'dark');
            } else {
                doc.setAttribute("data-theme", "light");
                localStorage.setItem('theme', 'light');
            }
            initVanta();
        });
    }

    function initTypingAnimation() {
        const dynamicSkillsetElement = document.querySelector(".dynamic-skillset");
        if (!dynamicSkillsetElement) return;

        const skills = [
            "Backend Developer",
            "Frontend Developer",
            "Automation & Scripting",
            "AI and ML",
            "Zapier & n8n"
        ];
        let skillIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeSkillset() {
            const currentSkill = skills[skillIndex];
            if (isDeleting) {
                dynamicSkillsetElement.textContent = currentSkill.substring(0, charIndex - 1);
                charIndex--;
            } else {
                dynamicSkillsetElement.textContent = currentSkill.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentSkill.length) {
                setTimeout(() => isDeleting = true, 2000); // Pause before deleting
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                skillIndex = (skillIndex + 1) % skills.length;
            }

            const typingSpeed = isDeleting ? 50 : 100;
            setTimeout(typeSkillset, typingSpeed);
        }

        typeSkillset();
    }

    function initCursor() {
        const cursorDot = document.querySelector(".cursor-dot");
        const cursorOutline = document.querySelector(".cursor-outline");

        window.addEventListener("mousemove", function (e) {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate(
                {
                    left: `${posX}px`,
                    top: `${posY}px`,
                },
                { duration: 500, fill: "forwards" }
            );
        });

        document.querySelectorAll("a, button, .project-card, .tech-tag, .theme-switcher").forEach((el) => {
            el.addEventListener("mouseenter", () => {
                cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)";
                cursorOutline.style.borderColor = "var(--secondary-color)";
            });
            el.addEventListener("mouseleave", () => {
                cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
                cursorOutline.style.borderColor = "var(--primary-color)";
            });
        });
    }

    function initGSAPAnimations() {
        gsap.from(".navbar", {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });

        const hamburger = document.querySelector(".hamburger");
        const navLinks = document.querySelector(".nav-links");
        if (hamburger && navLinks) {
            hamburger.addEventListener("click", () => {
                navLinks.classList.toggle("nav-active");
                hamburger.classList.toggle("toggle");
            });

            navLinks.querySelectorAll("a").forEach(link => {
                link.addEventListener("click", (e) => {
                    e.preventDefault();
                    const targetId = e.currentTarget.getAttribute("href");
                    const targetElement = document.querySelector(targetId);
                    if (targetElement && scroll) {
                        scroll.scrollTo(targetElement);
                    }
                    if (navLinks.classList.contains("nav-active")) {
                        navLinks.classList.remove("nav-active");
                        hamburger.classList.remove("toggle");
                    }
                });
            });
        }

        /* 
        gsap.from(".hero-headline", {
            opacity: 0,
            y: 50,
            blur: 10,
            duration: 1,
            delay: 0.5,
            ease: "power3.out"
        });
        gsap.from(".cta-button", {
            opacity: 0,
            y: 50,
            duration: 1,
            delay: 0.8,
            ease: "power3.out"
        }); 
        */
        gsap.to(".cta-button", {
            scale: 1.05,
            repeat: -1,
            yoyo: true,
            duration: 0.8,
            ease: "power1.inOut"
        });
        gsap.to(".neon-orb", {
            y: -20,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
        gsap.to(".glow-element", {
            y: 20,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            stagger: 0.5
        });

        gsap.from(".about-section", {
            filter: "blur(10px)",
            scrollTrigger: {
                trigger: ".about-section",
                scroller: "[data-scroll-container]",
                start: "top 80%",
                end: "top 30%",
                scrub: 1,
            }
        });
        gsap.from(".profile-image-container", {
            x: -100,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: ".about-section",
                scroller: "[data-scroll-container]",
                start: "top 70%",
            }
        });
        gsap.from(".skill-icons i", {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.5,
            scrollTrigger: {
                trigger: ".skill-icons",
                scroller: "[data-scroll-container]",
                start: "top 90%",
            }
        });

        gsap.from(".project-card", {
            y: 100,
            scale: 0.9,
            stagger: 0.2,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
                trigger: ".projects-container",
                scroller: "[data-scroll-container]",
                start: "top 85%",
            }
        });

        const projectCards = document.querySelectorAll(".project-card");
        const modal = document.getElementById("projectModal");
        const closeModal = document.querySelector(".close-button");
        if (projectCards && modal && closeModal) {
            projectCards.forEach(card => {
                card.addEventListener("click", () => {
                    const title = card.dataset.title;
                    const description = card.dataset.description;
                    const tech = card.dataset.tech;
                    const imgSrc = card.querySelector("img").src;
                    const githubLink = card.dataset.github;

                    modal.querySelector(".modal-title").textContent = title;
                    modal.querySelector(".modal-description").textContent = description;
                    modal.querySelector(".modal-tech-stack").innerHTML = tech;
                    modal.querySelector(".modal-img").src = imgSrc;
                    modal.querySelector(".project-link").href = githubLink;

                    modal.classList.add("active");
                    if (scroll) scroll.stop();
                });
            });

            const closeModalFunc = () => {
                modal.classList.remove("active");
                if (scroll) scroll.start();
            };

            closeModal.addEventListener("click", closeModalFunc);
            modal.addEventListener("click", (e) => {
                if (e.target === modal) {
                    closeModalFunc();
                }
            });
        }
        // Prevent contact form submission (no reload)
        const contactForm = document.querySelector(".contact-form");
        if (contactForm) {
            contactForm.addEventListener("submit", function(e) {
                e.preventDefault();
                // Optionally, show a message or handle AJAX here
            });
        }

        gsap.from(".glassmorphic-input", {
            x: -50,
            stagger: 0.1,
            duration: 0.5,
            scrollTrigger: {
                trigger: ".contact-form",
                scroller: "[data-scroll-container]",
                start: "top 80%",
            }
        });
        gsap.from(".submit-button", {
            scale: 0.8,
            duration: 0.5,
            scrollTrigger: {
                trigger: ".submit-button",
                scroller: "[data-scroll-container]",
                start: "top 90%",
            }
        });
        gsap.to(".submit-button", {
            scale: 1.02,
            repeat: -1,
            yoyo: true,
            duration: 0.6,
            ease: "power1.inOut"
        });
        gsap.from(".hero-socials a", {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.5,
            delay: 1,
        });
        gsap.from(".social-icons i", {
            y: 20,
            stagger: 0.1,
            duration: 0.5,
            scrollTrigger: {
                trigger: ".social-icons",
                scroller: "[data-scroll-container]",
                start: "top 90%",
            }
        });

        gsap.from(".footer-section", {
            opacity: 0,
            y: 60,
            filter: "blur(10px)",
            duration: 1,
            scrollTrigger: {
                trigger: ".footer-section",
                scroller: "[data-scroll-container]",
                start: "top 90%",
            }
        });
        gsap.to(".footer-glow-particles .particle", {
            y: -15,
            x: 15,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            stagger: 0.7
        });
    }
});