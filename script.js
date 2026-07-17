
(() => {
  const body = document.body;
  const loader = document.getElementById("loader");
  const loaderLine = document.getElementById("loaderLine");
  const loaderCount = document.getElementById("loaderCount");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let progress = 0;
  const loaderDuration = reducedMotion ? 200 : 1250;
  const loaderStart = performance.now();

  function animateLoader(now) {
    progress = Math.min(1, (now - loaderStart) / loaderDuration);
    const eased = 1 - Math.pow(1 - progress, 3);
    loaderLine.style.transform = `scaleX(${eased})`;
    loaderCount.textContent = String(Math.round(eased * 100)).padStart(2, "0");
    if (progress < 1) {
      requestAnimationFrame(animateLoader);
    } else {
      body.classList.remove("is-loading");
      body.classList.add("ready");
      loader.classList.add("is-done");
      setTimeout(() => loader.remove(), 1100);
    }
  }
  requestAnimationFrame(animateLoader);

  const pageProgress = document.getElementById("pageProgress");
  function updatePageProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? window.scrollY / max : 0;
    pageProgress.style.transform = `scaleX(${value})`;
  }
  updatePageProgress();
  window.addEventListener("scroll", updatePageProgress, { passive: true });

  const menuButton = document.getElementById("menuButton");
  const navLinks = document.getElementById("navLinks");
  const navOverlay = document.getElementById("navOverlay");
  const menuLabel = menuButton?.querySelector(".menu-label");

  function setNavigation(open) {
    if (!menuButton || !navOverlay || !navLinks) return;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    navOverlay.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("nav-open", open);
    if (menuLabel) menuLabel.textContent = open ? "Close" : "Menu";
  }

  menuButton?.addEventListener("click", () => {
    setNavigation(menuButton.getAttribute("aria-expanded") !== "true");
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNavigation(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
      setNavigation(false);
      menuButton?.focus();
    }
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      const heading = entry.target.closest(".section-heading, .contact-panel");
      if (heading) heading.classList.add("reveal-title");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -45px" });

  document.querySelectorAll(".reveal-up, .reveal-mask").forEach((item) => revealObserver.observe(item));

  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("reveal-title");
    });
  }, { threshold: .25 });
  document.querySelectorAll(".section-heading, .contact-panel").forEach((item) => titleObserver.observe(item));

  const manifestoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("visible", entry.isIntersecting);
    });
  }, { threshold: .65 });
  document.querySelectorAll(".manifesto-line").forEach((line) => manifestoObserver.observe(line));

  const sectionIndex = document.getElementById("sectionIndex");
  const sectionName = document.getElementById("sectionName");
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    sectionIndex.textContent = visible.target.dataset.section;
    sectionName.textContent = visible.target.dataset.sectionName;
  }, { threshold: [0.25, 0.45, 0.65] });
  document.querySelectorAll(".section-watch").forEach((section) => sectionObserver.observe(section));

  const cursor = document.getElementById("cursor");
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let x = -100, y = -100, cx = -100, cy = -100;
    window.addEventListener("pointermove", (event) => {
      x = event.clientX;
      y = event.clientY;
    }, { passive: true });

    function animateCursor() {
      cx += (x - cx) * .17;
      cy += (y - cy) * .17;
      cursor.style.left = `${cx}px`;
      cursor.style.top = `${cy}px`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll(".interactive-media").forEach((item) => {
      item.addEventListener("pointerenter", () => {
        cursor.querySelector("span").textContent = item.dataset.cursor || "View";
        cursor.classList.add("active");
      });
      item.addEventListener("pointerleave", () => cursor.classList.remove("active"));
      item.addEventListener("pointerdown", () => cursor.classList.remove("active"));
    });
    document.addEventListener("mouseleave", () => cursor.classList.remove("active"));
    document.addEventListener("scroll", () => cursor.classList.remove("active"), { passive: true });
  }

  if (!reducedMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".magnetic").forEach((item) => {
      item.addEventListener("pointermove", (event) => {
        const rect = item.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        item.style.transform = `translate(${x * .12}px, ${y * .18}px)`;
      });
      item.addEventListener("pointerleave", () => item.style.transform = "");
    });

    const portrait = document.querySelector("[data-parallax]");
    window.addEventListener("scroll", () => {
      const rect = portrait.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      const movement = (innerHeight / 2 - (rect.top + rect.height / 2)) * Number(portrait.dataset.parallax);
      portrait.style.transform = `translateY(${movement}px)`;
    }, { passive: true });
  }

  const profitVideo = document.getElementById("profitVideo");
  const videoToggle = document.getElementById("videoToggle");
  const videoCase = videoToggle.closest(".video-case");
  videoToggle.addEventListener("click", () => {
    if (profitVideo.paused) {
      profitVideo.play().then(() => {
        videoCase.classList.add("playing");
        videoToggle.textContent = "Pause";
        videoToggle.setAttribute("aria-label", "Pause ProfitPulse preview");
      }).catch(() => {});
    } else {
      profitVideo.pause();
      videoCase.classList.remove("playing");
      videoToggle.textContent = "Play";
      videoToggle.setAttribute("aria-label", "Play ProfitPulse preview");
    }
  });
  videoCase.addEventListener("click", (event) => {
    if (event.target.closest("a") || event.target === videoToggle) return;
    videoToggle.click();
  });
  profitVideo.addEventListener("pause", () => videoCase.classList.remove("playing"));

  const slider = document.getElementById("lighthouseSlider");
  const track = slider.querySelector(".project-slider-track");
  const slides = [...track.children];
  const sliderCount = document.getElementById("lighthouseCount");
  let sliderIndex = 0;
  let startX = 0;

  function renderSlider() {
    track.style.transform = `translateX(-${sliderIndex * 100}%)`;
    sliderCount.textContent = `${String(sliderIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  }
  slider.querySelector("[data-slider-prev]").addEventListener("click", () => {
    sliderIndex = (sliderIndex - 1 + slides.length) % slides.length;
    renderSlider();
  });
  slider.querySelector("[data-slider-next]").addEventListener("click", () => {
    sliderIndex = (sliderIndex + 1) % slides.length;
    renderSlider();
  });
  track.addEventListener("pointerdown", (event) => {
    startX = event.clientX;
    track.setPointerCapture(event.pointerId);
  });
  track.addEventListener("pointerup", (event) => {
    const delta = event.clientX - startX;
    if (Math.abs(delta) > 45) {
      sliderIndex = delta < 0
        ? (sliderIndex + 1) % slides.length
        : (sliderIndex - 1 + slides.length) % slides.length;
      renderSlider();
    }
  });

  const serviceRows = [...document.querySelectorAll(".service-row")];
  const serviceCards = [...document.querySelectorAll(".service-preview-card")];
  serviceRows.forEach((row) => {
    const activate = () => {
      const index = Number(row.dataset.service);
      serviceRows.forEach((item, itemIndex) => item.classList.toggle("active", itemIndex === index));
      serviceCards.forEach((card, cardIndex) => card.classList.toggle("active", cardIndex === index));
    };
    row.addEventListener("mouseenter", activate);
    row.addEventListener("focus", activate);
    row.addEventListener("click", activate);
  });

  const testimonialButtons = [...document.querySelectorAll(".testimonial-person")];
  const testimonialQuotes = [...document.querySelectorAll(".testimonial-quote")];
  testimonialButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.testimonial);
      testimonialButtons.forEach((item, itemIndex) => {
        item.classList.toggle("active", itemIndex === index);
        item.setAttribute("aria-selected", String(itemIndex === index));
      });
      testimonialQuotes.forEach((quote, quoteIndex) => quote.classList.toggle("active", quoteIndex === index));
    });
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");

  function openLightbox(src) {
    lightboxImage.src = src;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    lightboxImage.src = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-full]").forEach((item) => {
    item.addEventListener("click", (event) => {
      if (item.closest(".project-slider")) {
        event.preventDefault();
      }
      openLightbox(item.dataset.full);
    });
  });
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
  });
})();


(() => {
  const journey = document.getElementById("visualJourney");
  if (!journey) return;

  const steps = [...journey.querySelectorAll("[data-journey-step]")];
  const frames = [...journey.querySelectorAll("[data-journey-frame]")];
  const counter = document.getElementById("journeyCounter");
  const stageTitle = document.getElementById("journeyStageTitle");

  function activateJourney(index) {
    steps.forEach((step, stepIndex) => step.classList.toggle("is-active", stepIndex === index));
    frames.forEach((frame, frameIndex) => frame.classList.toggle("is-active", frameIndex === index));

    if (counter) {
      counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`;
    }
    if (stageTitle) {
      stageTitle.textContent = steps[index]?.dataset.journeyTitle || "";
    }
  }

  if ("IntersectionObserver" in window) {
    const stepObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      activateJourney(Number(visible.target.dataset.journeyStep));
    }, {
      rootMargin: "-28% 0px -45% 0px",
      threshold: [0.1, 0.35, 0.65]
    });

    steps.forEach((step) => stepObserver.observe(step));
  }

  const desktopDionneImage = document.getElementById("dionneJourneyImage");
  const mobileDionneImage = document.getElementById("dionneJourneyMobileImage");
  const dionneOptions = [...document.querySelectorAll(".dionne-cover-option")];

  dionneOptions.forEach((option) => {
    const selectCover = () => {
      dionneOptions.forEach((item) => item.classList.toggle("is-active", item === option));
      const src = option.dataset.dionneSrc;
      const alt = option.dataset.dionneAlt || "";

      if (desktopDionneImage) {
        desktopDionneImage.src = src;
        desktopDionneImage.alt = alt;
      }
      if (mobileDionneImage) {
        mobileDionneImage.src = src;
        mobileDionneImage.alt = alt;
      }
      if (stageTitle) {
        stageTitle.textContent = option.dataset.dionneTitle || "Dionne's Covers";
      }
    };

    option.addEventListener("mouseenter", selectCover);
    option.addEventListener("focus", selectCover);
    option.addEventListener("click", selectCover);
  });
})();


(() => {
  const tabs = [...document.querySelectorAll("[data-tool-tab]")];
  const panes = [...document.querySelectorAll("[data-tool-pane]")];

  if (!tabs.length || !panes.length) return;

  function activateToolCategory(index) {
    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === index;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    panes.forEach((pane, paneIndex) => {
      pane.classList.toggle("active", paneIndex === index);
    });
  }

  tabs.forEach((tab) => {
    const activate = () => activateToolCategory(Number(tab.dataset.toolTab));
    tab.addEventListener("mouseenter", activate);
    tab.addEventListener("focus", activate);
    tab.addEventListener("click", activate);
  });
})();



document.querySelectorAll('.nav-center-links a').forEach((link) => {
  link.addEventListener('click', () => {
    const overlay = document.getElementById('navOverlay');
    const menuButton = document.getElementById('menuButton');
    if (document.body.classList.contains('nav-open')) {
      document.body.classList.remove('nav-open');
      if (overlay) overlay.setAttribute('aria-hidden', 'true');
      if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
    }
  });
});


/* V11 hero sequence: explicit class trigger so the motion is always visible. */
(() => {
  const hero = document.querySelector(".hero-gap-v11");
  if (!hero) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function startHeroSequence() {
    if (reduced) {
      hero.classList.add("hero-animate");
      return;
    }

    hero.classList.remove("hero-animate");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => hero.classList.add("hero-animate"));
    });
  }

  if (document.body.classList.contains("ready")) {
    setTimeout(startHeroSequence, 80);
  } else {
    const readyObserver = new MutationObserver(() => {
      if (!document.body.classList.contains("ready")) return;
      readyObserver.disconnect();
      setTimeout(startHeroSequence, 80);
    });

    readyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"]
    });

    window.addEventListener("load", () => {
      setTimeout(() => {
        if (!hero.classList.contains("hero-animate")) startHeroSequence();
      }, 1500);
    }, { once: true });
  }
})();

/* V11 navigation: visible while scrolling, hidden after the page becomes idle. */
(() => {
  const header = document.querySelector(".site-header-minimal");
  const menuButton = document.getElementById("menuButton");
  if (!header) return;

  let idleTimer = 0;

  function showNavigation(delay = 1750) {
    window.clearTimeout(idleTimer);
    header.classList.remove("nav-idle");
    header.classList.add("nav-visible");

    idleTimer = window.setTimeout(() => {
      if (
        document.body.classList.contains("nav-open") ||
        header.matches(":hover") ||
        header.matches(":focus-within")
      ) return;

      header.classList.remove("nav-visible");
      header.classList.add("nav-idle");
    }, delay);
  }

  showNavigation(3000);

  window.addEventListener("scroll", () => showNavigation(1650), { passive: true });

  window.addEventListener("pointermove", (event) => {
    if (event.clientY <= 96) showNavigation(2100);
  }, { passive: true });

  header.addEventListener("mouseenter", () => showNavigation(2600));
  header.addEventListener("focusin", () => showNavigation(2600));

  menuButton?.addEventListener("click", () => showNavigation(2600));
})();


/* V14: continuous scroll-synced RON'S / portrait / WORK motion. */
(() => {
  const hero = document.querySelector(".hero-scroll-v14");
  if (!hero) return;

  const left = hero.querySelector(".hero-scroll-left .hero-scroll-word");
  const right = hero.querySelector(".hero-scroll-right .hero-scroll-word");
  const portrait = hero.querySelector(".hero-scroll-portrait");
  const portraitImage = portrait?.querySelector("img");
  const curtain = hero.querySelector(".hero-scroll-curtain");
  const copy = hero.querySelector(".hero-scroll-copy");
  const background = hero.querySelector(".hero-scroll-background img");
  const hint = hero.querySelector(".hero-scroll-hint");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!left || !right || !portrait || !portraitImage || !curtain || !copy) return;

  let ticking = false;
  const clamp = (v,a=0,b=1) => Math.min(b,Math.max(a,v));
  const map = (v,a,b) => clamp((v-a)/(b-a));
  const easeOut = v => 1-Math.pow(1-v,3);
  const easeInOut = v => v<.5 ? 4*v*v*v : 1-Math.pow(-2*v+2,3)/2;

  function render() {
    ticking = false;

    if (reduced.matches) {
      left.style.cssText = "transform:none;opacity:1;filter:none";
      right.style.cssText = "transform:none;opacity:1;filter:none";
      portrait.style.cssText += ";opacity:1;clip-path:inset(0);transform:none";
      portraitImage.style.transform = "none";
      curtain.style.transform = "scaleY(0)";
      copy.style.cssText += ";opacity:1;transform:none";
      if (hint) hint.style.opacity = "0";
      return;
    }

    const rect = hero.getBoundingClientRect();
    const range = Math.max(1, hero.offsetHeight-window.innerHeight);
    const p = clamp(-rect.top/range);

    const wp = easeOut(map(p,0,.64));
    const ip = easeInOut(map(p,.08,.67));
    const cp = easeOut(map(p,.54,.88));
    const mobile = window.innerWidth<=700;
    const distance = mobile
      ? Math.min(window.innerWidth*.25,120)
      : Math.min(window.innerWidth*.34,540);

    left.style.transform =
      `translate3d(${(-distance*(1-wp)).toFixed(2)}px,${(30*(1-wp)).toFixed(2)}%,0)`;
    right.style.transform =
      `translate3d(${(distance*(1-wp)).toFixed(2)}px,${(-30*(1-wp)).toFixed(2)}%,0)`;

    const opacity = .14+wp*.86;
    const blur = 12*(1-wp);
    left.style.opacity = opacity.toFixed(3);
    right.style.opacity = opacity.toFixed(3);
    left.style.filter = `blur(${blur.toFixed(2)}px)`;
    right.style.filter = `blur(${blur.toFixed(2)}px)`;

    const inset = 50*(1-ip);
    portrait.style.opacity = ip.toFixed(3);
    portrait.style.clipPath = `inset(${inset.toFixed(2)}% 0 ${inset.toFixed(2)}% 0)`;
    portrait.style.transform = `scale(${(.78+ip*.22).toFixed(4)}) rotate(${(-1.4+ip*1.4).toFixed(2)}deg)`;
    portraitImage.style.transform = `scale(${(1.18-ip*.165).toFixed(4)})`;
    curtain.style.transform = `scaleY(${Math.max(0,1-ip*1.18).toFixed(4)})`;

    copy.style.opacity = cp.toFixed(3);
    copy.style.transform = `translateY(${(28*(1-cp)).toFixed(2)}px)`;

    if (background) {
      background.style.transform =
        `scale(${(1.09-p*.055).toFixed(4)}) translateY(${(-p*2.2).toFixed(2)}%)`;
    }
    if (hint) hint.style.opacity = clamp(1-p*4).toFixed(3);
  }

  function requestRender() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(render);
  }

  window.addEventListener("scroll",requestRender,{passive:true});
  window.addEventListener("resize",requestRender,{passive:true});
  reduced.addEventListener?.("change",requestRender);
  requestRender();
})();


/* V27: reliable internal navigation with fixed-header offset. */
(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const header = document.querySelector(".site-header");
  const menuButton = document.getElementById("menuButton");
  const navOverlay = document.getElementById("navOverlay");
  const menuLabel = menuButton?.querySelector(".menu-label");

  function closeNavigation() {
    if (!menuButton || !navOverlay) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("nav-open");
    if (menuLabel) menuLabel.textContent = "Menu";
  }

  function goToSection(hash, updateHistory = true) {
    if (!hash || hash === "#") return false;

    let target;
    try {
      target = document.querySelector(hash);
    } catch (error) {
      return false;
    }
    if (!target) return false;

    closeNavigation();

    requestAnimationFrame(() => {
      const headerHeight = header?.getBoundingClientRect().height || 0;
      const top = Math.max(
        0,
        target.getBoundingClientRect().top + window.scrollY - headerHeight - 22
      );

      window.scrollTo({
        top,
        behavior: reducedMotion.matches ? "auto" : "smooth"
      });

      if (updateHistory && window.location.hash !== hash) {
        history.pushState(null, "", hash);
      }
    });

    return true;
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || !document.querySelector(hash)) return;
      event.preventDefault();
      goToSection(hash);
    });
  });

  window.addEventListener("load", () => {
    if (!window.location.hash) return;
    window.setTimeout(() => goToSection(window.location.hash, false), 1400);
  });

  window.addEventListener("popstate", () => {
    if (window.location.hash) goToSection(window.location.hash, false);
  });
})();
