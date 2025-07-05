document.addEventListener("DOMContentLoaded", function() {
    // Preloader Animation
    const preloaderTimeline = gsap.timeline();

    preloaderTimeline.to(".progress-bar", {
        width: "100%",
        duration: 2,
        ease: "power2.out",
        onUpdate: function() {
            const bar = document.querySelector('.progress-bar');
            if (bar) {
                const currentWidth = parseFloat(bar.style.width || '0');
                bar.textContent = Math.round(currentWidth) + '%';
                if (currentWidth > 0) {
                    bar.parentElement.classList.add('active'); // Activate shine effect
                }
            }
        }
    })
    .to(".progress-bar-container::before", { opacity: 1, duration: 0.5 }, "-=1.5") // Fade in shine
    .to(".progress-bar-container::before", { opacity: 0, duration: 0.5 }, "-=0.5") // Fade out shine
    .to(".progress-bar-context", { opacity: 1, y: 0, duration: 0.5 }, "-=1") // Fade in context
    .to(".preloader-logo", {
        opacity: 0,
        y: -20,
        duration: 0.5
    }, "-=0.5")
    .to(".progress-bar-container", {
        opacity: 0,
        duration: 0.5
    }, "-=0.5")
    .to(".progress-bar-context", { opacity: 0, duration: 0.5 }, "-=0.5")
    .to(".preloader", {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        onComplete: () => {
            document.querySelector(".preloader").style.display = "none";
            initLocomotiveScroll();
            initVanta();
            initGSAPAnimations();
            initTypingAnimation();
        }
    });

    function initLocomotiveScroll() {
        const scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true,
            lerp: 0.05, // Lower value for smoother scroll
            multiplier: 1.2, // Adjust scroll speed
        });

        // Update ScrollTrigger on Locomotive Scroll events
        scroll.on("scroll", ScrollTrigger.update);

        // Pinning and other ScrollTrigger effects
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
            pinType: document.querySelector("[data-scroll-container]").style.transform ? "transform" : "fixed"
        });

        ScrollTrigger.addEventListener("refresh", () => scroll.update());
        ScrollTrigger.refresh();
    }

    function initVanta() {
        try {
            VANTA.HALO({
                el: "#vanta-bg",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                // Add more Vanta.js options here if needed
            });
        } catch (e) {
            console.error("Vanta.js initialization failed: ", e);
        }
    }

    function initTypingAnimation() {
        const typingTextElement = document.querySelector(".typing-text");
        const dynamicSkillsetElement = document.querySelector(".dynamic-skillset");
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
                setTimeout(() => isDeleting = true, 1000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                skillIndex = (skillIndex + 1) % skills.length;
            }

            const typingSpeed = isDeleting ? 50 : 100;
            setTimeout(typeSkillset, typingSpeed);
        }

        typeSkillset();
    }

    function initGSAPAnimations() {
        // Navbar Animation
        gsap.from(".navbar", {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });

        const hamburger = document.querySelector(".hamburger");
        const navLinks = document.querySelector(".nav-links");

        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("nav-active");
            hamburger.classList.toggle("toggle");
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("nav-active");
                hamburger.classList.remove("toggle");
            });
        });

        // Hero Section Animations
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

        // About Section Animations
        gsap.from(".about-section", {
            opacity: 0,
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

        // Projects Section Animations
        gsap.from(".project-card", {
            opacity: 0,
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

        // Modal Logic
        const projectCards = document.querySelectorAll(".project-card");
        const modal = document.getElementById("projectModal");
        const closeModal = document.querySelector(".close-button");

        projectCards.forEach(card => {
            card.addEventListener("click", () => {
                const title = card.dataset.title;
                const description = card.dataset.description;
                const tech = card.dataset.tech;
                const imgSrc = card.querySelector("img").src;

                modal.querySelector(".modal-title").textContent = title;
                modal.querySelector(".modal-description").textContent = description;
                modal.querySelector(".modal-tech-stack").innerHTML = tech;
                modal.querySelector(".modal-img").src = imgSrc;
                const githubLink = card.dataset.github;
                modal.querySelector(".project-link").href = githubLink;

                modal.classList.add("active");
                // Disable Locomotive Scroll when modal is active
                if (typeof scroll !== 'undefined' && scroll) {
                    scroll.stop();
                }
            });
        });

        const closeModalFunc = () => {
            modal.classList.remove("active");
            // Enable Locomotive Scroll when modal is closed
            if (typeof scroll !== 'undefined' && scroll) {
                scroll.start();
            }
        };

        closeModal.addEventListener("click", closeModalFunc);
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeModalFunc();
            }
        });

        // Contact Section Animations
        gsap.from(".glassmorphic-input", {
            x: -50,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            scrollTrigger: {
                trigger: ".contact-form",
                scroller: "[data-scroll-container]",
                start: "top 80%",
            }
        });
        gsap.from(".submit-button", {
            opacity: 0,
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
        gsap.from(".social-icons i", {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.5,
            scrollTrigger: {
                trigger: ".social-icons",
                scroller: "[data-scroll-container]",
                start: "top 90%",
            }
        });

        // Footer Section Animations
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