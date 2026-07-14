/* ==========================================================================
   Hemora Jewellery — Luxury Jewellery Landing Page (Nike-Style)
   JavaScript Interactivity & UI Logic
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- 1. PROMO BAR DISMISS ---------- */
  const promoBar = document.getElementById("promo-bar");
  const promoClose = document.getElementById("promo-close");
  const navbar = document.getElementById("navbar");

  if (promoClose && promoBar) {
    promoClose.addEventListener("click", () => {
      promoBar.classList.add("hidden");
      navbar.classList.add("announcement-dismissed");
      document.documentElement.style.setProperty("--promo-height", "0px");
    });
  }

  /* ---------- 2. NAVBAR SCROLL EFFECT ---------- */
  function checkScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", checkScroll, { passive: true });
  checkScroll(); // Run once

  /* ---------- 3. MOBILE HAMBURGER MENU ---------- */
  const hamburger = document.getElementById("hamburger");
  const mainNav = document.getElementById("main-nav");
  const mobileOverlay = document.getElementById("mobile-overlay");

  if (hamburger && mainNav) {
    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.classList.toggle("active");
      mainNav.classList.toggle("mobile-open");
      if (mobileOverlay) mobileOverlay.classList.toggle("active");
      hamburger.setAttribute("aria-expanded", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", () => {
      hamburger.classList.remove("active");
      mainNav.classList.remove("mobile-open");
      mobileOverlay.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  }

  /* ---------- 4. HERO CAROUSEL LOGIC (3 SLIDES) ---------- */
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".carousel-dot");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  let currentSlide = 0;
  let carouselInterval;
  const slideDuration = 6000;

  function showSlide(index) {
    slides.forEach((slide) => {
      const video = slide.querySelector("video");
      if (video) video.pause();
      slide.classList.remove("active");
    });
    dots.forEach((dot) => dot.classList.remove("active"));

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");

    // Play active video
    const activeVideo = slides[currentSlide].querySelector("video");
    if (activeVideo) {
      activeVideo.play().catch((err) => console.log("Autoplay blocked:", err));
      const playpauseBtn = document.getElementById("video-playpause");
      if (playpauseBtn) {
        playpauseBtn.querySelector(".icon-pause").style.display = "block";
        playpauseBtn.querySelector(".icon-play").style.display = "none";
      }
    }
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
    resetTimer();
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
    resetTimer();
  }

  function startTimer() {
    carouselInterval = setInterval(nextSlide, slideDuration);
  }

  function resetTimer() {
    clearInterval(carouselInterval);
    startTimer();
  }

  if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      resetTimer();
    });
  });

  if (slides.length > 0) {
    showSlide(0);
    startTimer();
  }

  /* ---------- 5. VIDEO PLAY/PAUSE FOR CAROUSEL ---------- */
  const playpauseBtn = document.getElementById("video-playpause");
  if (playpauseBtn) {
    playpauseBtn.addEventListener("click", () => {
      const activeVideo = slides[currentSlide].querySelector("video");
      if (activeVideo) {
        if (activeVideo.paused) {
          activeVideo.play();
          playpauseBtn.querySelector(".icon-pause").style.display = "block";
          playpauseBtn.querySelector(".icon-play").style.display = "none";
        } else {
          activeVideo.pause();
          playpauseBtn.querySelector(".icon-pause").style.display = "none";
          playpauseBtn.querySelector(".icon-play").style.display = "block";
        }
      }
    });
  }

  /* ---------- 6. SEARCH OVERLAY ---------- */
  const searchToggle = document.getElementById("search-toggle");
  const navbarSearchBox = document.getElementById("navbar-search-box");
  const searchOverlay = document.getElementById("search-overlay");
  const searchClose = document.getElementById("search-close");
  const searchInput = document.getElementById("search-input");

  function openSearch() {
    if (searchOverlay) {
      searchOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        if (searchInput) searchInput.focus();
      }, 100);
    }
  }

  if (searchToggle) searchToggle.addEventListener("click", openSearch);
  if (navbarSearchBox) navbarSearchBox.addEventListener("click", openSearch);

  if (searchClose && searchOverlay) {
    searchClose.addEventListener("click", () => {
      searchOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim().toLowerCase();
        if (query) {
          searchOverlay.classList.remove("active");
          document.body.style.overflow = "";

          let targetPage = "women.html";
          if (query.includes("diamond")) {
            targetPage = "diamonds.html";
          } else if (
            query.includes("men") ||
            query.includes("boy") ||
            query.includes("kada") ||
            query.includes("chain")
          ) {
            targetPage = "men.html";
          } else if (
            query.includes("kid") ||
            query.includes("child") ||
            query.includes("baby")
          ) {
            targetPage = "kids.html";
          }

          window.location.href = `${targetPage}?search=${encodeURIComponent(query)}`;
        }
      }
    });
  }

  /* ---------- 7. CART SIDEBAR & SHOPPING BAG ---------- */
  const bagToggle = document.getElementById("bag-toggle");
  let cart = JSON.parse(localStorage.getItem("hemora_cart")) || [];

  function openCart() {
    window.location.href = "bag.html";
  }

  function closeCart() {
    // No-op since we navigate to a new page
  }

  if (bagToggle) {
    bagToggle.addEventListener("click", (e) => {
      e.preventDefault();
      openCart();
    });
  }

  /* ---------- 8. CART QUANTITY / ADD / REMOVE ---------- */
  function updateBagBadge() {
    const bagCount = document.getElementById("bag-count");
    if (bagCount) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      bagCount.textContent = totalItems;
    }
  }

  function saveCart() {
    localStorage.setItem("hemora_cart", JSON.stringify(cart));
    updateBagBadge();
  }

  function changeQuantity(id, change) {
    // No-op - handled in bag.html
  }

  function removeFromCart(id) {
    // No-op - handled in bag.html
  }

  function renderCart() {
    // No-op - handled in bag.html
  }

  // Expose cart functions globally for cross-template integration
  window.updateCartCount = () => {
    cart = JSON.parse(localStorage.getItem("hemora_cart")) || [];
    updateBagBadge();
  };
  window.renderCart = () => {
    // No-op
  };
  window.openCart = openCart;
  window.closeCart = closeCart;

  updateBagBadge();

  document.addEventListener("click", (e) => {
    // Handle "Add to Bag" from any page (class-based catalog buttons)
    const button = e.target.closest(".btn-add-bag");
    if (button) {
      // Redirect on second click if it already says "View Bag"
      if (button.textContent.trim().toLowerCase() === "view bag") {
        window.location.href = "bag.html";
        return;
      }

      // Try to extract item data from the button's context
      const card = button.closest(".catalog-card, .trend-card, .related-card");
      if (card) {
        const nameEl = card.querySelector(
          ".catalog-card__name a, .catalog-card__name, h3, h4",
        );
        const priceEl = card.querySelector(".catalog-card__price, p");
        const imgEl = card.querySelector("img");
        const itemName = nameEl ? nameEl.textContent.trim() : "Hemora Item";
        const itemPrice = priceEl ? priceEl.textContent.trim() : "₹0";
        const itemImg = imgEl ? imgEl.src : "";
        const itemId =
          "card-" + itemName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();

        let cart = JSON.parse(localStorage.getItem("hemora_cart")) || [];
        const existing = cart.find((i) => i.id === itemId);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({
            id: itemId,
            name: itemName,
            price: itemPrice,
            image: itemImg,
            quantity: 1,
          });
        }
        localStorage.setItem("hemora_cart", JSON.stringify(cart));
      }

      cart = JSON.parse(localStorage.getItem("hemora_cart")) || [];
      updateBagBadge();

      // Set button to View Bag state
      button.textContent = "View Bag";
      button.style.backgroundColor = "#A98A5B";
      showToast("Added to the Bag ✅");
      return;
    }

    // Handle bag toggle (open cart sidebar)
    const toggle = e.target.closest("#bag-toggle");
    if (toggle) {
      e.preventDefault();
      e.stopPropagation();
      openCart();
      return;
    }

    // Handle cart close
    const close = e.target.closest("#cart-close");
    if (close) {
      e.preventDefault();
      closeCart();
      return;
    }

    // Handle cart overlay click
    if (e.target.id === "cart-overlay") {
      e.preventDefault();
      closeCart();
      return;
    }
  });

  // Sync cart updates across tabs/pages using storage events
  window.addEventListener("storage", (e) => {
    if (e.key === "hemora_cart") {
      cart = JSON.parse(e.newValue) || [];
      updateBagBadge();
      renderCart();
    }
  });

  /* ---------- 9. MAIN SHOWCASE GALLERY & ZOOM CONTROLLER ---------- */
  const showcaseMainImg = document.getElementById("showcase-main-img");
  const thumbnails = document.querySelectorAll(".showcase__thumb");
  const zoomContainer = document.getElementById("showcase-zoom-container");
  const zoomLens = document.getElementById("zoom-lens");
  const zoomResult = document.getElementById("zoom-result");
  const zoomSlider = document.getElementById("zoom-slider");
  const zoomValue = document.getElementById("zoom-value");

  let zoomFactor = 2.5;

  if (zoomSlider && zoomValue) {
    zoomSlider.addEventListener("input", (e) => {
      zoomFactor = parseFloat(e.target.value);
      zoomValue.textContent = zoomFactor + "x";
      updateZoomDisplay();
    });
  }

  let lastX = 0,
    lastY = 0;

  function updateZoomDisplay() {
    if (!zoomResult || !zoomResult.style.backgroundImage) return;
    const cx = zoomResult.offsetWidth / zoomLens.offsetWidth;
    const cy = zoomResult.offsetHeight / zoomLens.offsetHeight;
    zoomResult.style.backgroundSize =
      showcaseMainImg.width * cx * (zoomFactor / 2.5) +
      "px " +
      showcaseMainImg.height * cy * (zoomFactor / 2.5) +
      "px";
    zoomResult.style.backgroundPosition =
      "-" +
      lastX * cx * (zoomFactor / 2.5) +
      "px -" +
      lastY * cy * (zoomFactor / 2.5) +
      "px";
  }

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const newSrc = thumb.getAttribute("data-img");
      if (showcaseMainImg && newSrc) {
        showcaseMainImg.style.opacity = "0";
        setTimeout(() => {
          showcaseMainImg.src = newSrc;
          showcaseMainImg.style.opacity = "1";
        }, 200);
        thumbnails.forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
      }
    });
  });

  if (showcaseMainImg) {
    showcaseMainImg.style.transition = "opacity 0.2s ease";
  }

  if (zoomContainer && showcaseMainImg && zoomLens && zoomResult) {
    function moveLens(e) {
      e.preventDefault();
      const pos = getCursorPos(e);

      let x = pos.x - zoomLens.offsetWidth / 2;
      let y = pos.y - zoomLens.offsetHeight / 2;

      if (x > showcaseMainImg.width - zoomLens.offsetWidth) {
        x = showcaseMainImg.width - zoomLens.offsetWidth;
      }
      if (x < 0) {
        x = 0;
      }
      if (y > showcaseMainImg.height - zoomLens.offsetHeight) {
        y = showcaseMainImg.height - zoomLens.offsetHeight;
      }
      if (y < 0) {
        y = 0;
      }

      zoomLens.style.left = x + "px";
      zoomLens.style.top = y + "px";

      lastX = x;
      lastY = y;

      zoomResult.style.backgroundImage = `url('${showcaseMainImg.src}')`;
      updateZoomDisplay();
    }

    function getCursorPos(e) {
      const rect = showcaseMainImg.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return { x: x, y: y };
    }

    if (window.innerWidth >= 1024) {
      zoomContainer.addEventListener("mouseenter", () => {
        zoomLens.style.display = "block";
        zoomResult.style.display = "block";
      });
      zoomContainer.addEventListener("mouseleave", () => {
        zoomLens.style.display = "none";
        zoomResult.style.display = "none";
      });
      zoomContainer.addEventListener("mousemove", moveLens);
    }
  }

  /* ---------- 10. SCROLL REVEAL ANIMATIONS ---------- */
  const revealElements = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach((el) => el.classList.add("revealed"));
  }

  // Close overlays on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (searchOverlay) searchOverlay.classList.remove("active");
      closeCart();
      document.body.style.overflow = "";
    }
  });

  /* ---------- 11. INTERACTIVE CATEGORY EXPAND (VIEW ALL TOGGLE) ---------- */
  const categoryMoreCard = document.getElementById("category-more-card");
  const hiddenCategories = document.querySelectorAll(".hidden-category");
  const moreCardCount = document.getElementById("more-card-count");
  const moreCardText = document.getElementById("more-card-text");
  const moreCardLink = document.getElementById("more-card-link");

  if (categoryMoreCard && hiddenCategories.length > 0) {
    categoryMoreCard.addEventListener("click", (e) => {
      e.preventDefault();

      // Check if categories are currently shown
      const isExpanded = hiddenCategories[0].classList.contains("show");

      hiddenCategories.forEach((el) => {
        if (isExpanded) {
          el.classList.remove("show");
        } else {
          el.classList.add("show");
        }
      });

      if (isExpanded) {
        // Return card to default state
        if (moreCardCount) moreCardCount.innerHTML = "10+";
        if (moreCardText) moreCardText.innerHTML = "Categories to chose from";
        if (moreCardLink) moreCardLink.innerHTML = "Explore All &rarr;";
      } else {
        // Change card to "Show Less" state
        if (moreCardCount) moreCardCount.innerHTML = "&larr;";
        if (moreCardText) moreCardText.innerHTML = "Show Less";
        if (moreCardLink) moreCardLink.innerHTML = "Collapse Grid";
      }
    });
  }
  // Toast Notification helper — works on ALL pages
  function showToast(msg) {
    // First try the static toast element
    const staticToast = document.getElementById("toast-notify");
    const staticToastText = document.getElementById("toast-text");
    if (staticToast && staticToastText) {
      staticToastText.textContent = msg;
      staticToast.classList.add("active");
      setTimeout(() => staticToast.classList.remove("active"), 2500);
      return;
    }

    // Fallback: create a dynamic toast
    let toast = document.createElement("div");
    toast.style.cssText =
      "position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(20px);background:#1A1410;color:#fff;padding:14px 28px;border-radius:9999px;font-size:0.9rem;font-weight:600;z-index:10000;box-shadow:0 8px 32px rgba(0,0,0,0.25);opacity:0;transition:all 0.3s ease;display:flex;align-items:center;gap:8px;font-family:Inter,sans-serif;";
    toast.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> ' +
      msg;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(-50%) translateY(0)";
    }, 50);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(20px)";
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  /* ---------- 13. AUTHENTICATION MODAL — CLASSIC TWO-VIEW FLOW ---------- */
  const authOverlay = document.getElementById("auth-overlay");
  const authModal = document.getElementById("auth-modal");
  const authClose = document.getElementById("auth-close");

  // Views
  const signinView = document.getElementById("auth-signin-view");
  const signupView = document.getElementById("auth-signup-view");

  // Forms
  const signinForm = document.getElementById("signin-form");
  const signupForm = document.getElementById("signup-form");

  // Switches
  const switchSignup = document.getElementById("switch-to-signup");
  const switchSignin = document.getElementById("switch-to-signin");

  let authScrollY = 0;

  // Helper to lock scroll when modal is active
  function lockPageAtCurrentPosition() {
    authScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = "fixed";
    document.body.style.top = `-${authScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
  }

  function unlockPagePosition() {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.body.style.overflow = "";
    window.scrollTo(0, authScrollY);
  }

  // ============================================================
  // CLERK AUTHENTICATION CONTROLLER
  // ============================================================
  // Dynamically inject the Clerk script if not present
  if (!document.querySelector('script[src*="clerk-js"]')) {
    const clerkScript = document.createElement("script");
    clerkScript.async = true;
    clerkScript.crossOrigin = "anonymous";
    clerkScript.src =
      "https://robust-skink-24.clerk.accounts.dev/npm/@clerk/clerk-js@latest/dist/clerk.browser.js";
    clerkScript.setAttribute(
      "data-clerk-publishable-key",
      "pk_test_cm9idXN0LXNraW5rLTI0LmNsZXJrLmFjY291bnRzLmRldiQ",
    );
    document.head.appendChild(clerkScript);
  }

  async function initClerk() {
    if (!window.Clerk) {
      setTimeout(initClerk, 50);
      return;
    }

    try {
      const pathParts = window.location.pathname.split("/");
      pathParts[pathParts.length - 1] = "index.html";
      const homeRedirectUrl = window.location.origin + pathParts.join("/");

      await window.Clerk.load({
        signInForceRedirectUrl: homeRedirectUrl,
        signUpForceRedirectUrl: homeRedirectUrl,
      });

      // Sync Clerk session state with local application UI
      updateAuthUI();

      // Setup listeners to handle sign-in / sign-out session changes
      window.Clerk.addListener(({ session }) => {
        updateAuthUI();
      });
    } catch (err) {
      console.error("Error loading Clerk:", err);
    }
  }

  function updateAuthUI() {
    const loginLink = document.getElementById("utility-login");
    const joinLink = document.getElementById("utility-join");

    // Check if Clerk is loaded and has a logged-in user
    const user = window.Clerk && window.Clerk.user ? window.Clerk.user : null;

    if (user) {
      if (loginLink) {
        loginLink.textContent = "Sign Out";
        loginLink.onclick = async function (e) {
          e.preventDefault();
          try {
            await window.Clerk.signOut();
            showToast("Signed out. See you soon! 👋");
          } catch (err) {
            console.error("Clerk sign out error:", err);
          }
        };
      }
      if (joinLink) {
        const name =
          user.firstName ||
          user.username ||
          user.primaryEmailAddress.emailAddress.split("@")[0] ||
          "Member";
        joinLink.textContent = "Hi, " + name.split(" ")[0];
        joinLink.onclick = function (e) {
          e.preventDefault();
        };
      }
    } else {
      if (loginLink) {
        loginLink.textContent = "Sign In";
        loginLink.onclick = function (e) {
          e.preventDefault();
          if (window.Clerk) {
            const pathParts = window.location.pathname.split("/");
            pathParts[pathParts.length - 1] = "index.html";
            const homeRedirectUrl =
              window.location.origin + pathParts.join("/");
            window.Clerk.openSignIn({
              forceRedirectUrl: homeRedirectUrl,
            });
          } else {
            showToast("Auth system is loading, please try again…");
          }
        };
      }
      if (joinLink) {
        joinLink.textContent = "Join Us";
        joinLink.onclick = function (e) {
          e.preventDefault();
          if (window.Clerk) {
            const pathParts = window.location.pathname.split("/");
            pathParts[pathParts.length - 1] = "index.html";
            const homeRedirectUrl =
              window.location.origin + pathParts.join("/");
            window.Clerk.openSignUp({
              forceRedirectUrl: homeRedirectUrl,
            });
          } else {
            showToast("Auth system is loading, please try again…");
          }
        };
      }
    }
  }

  // Call initClerk when DOM content is loaded
  initClerk();

  // Auto-open check for shopping bag on home page load
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("openBag") === "true") {
    setTimeout(function () {
      openCart();
    }, 350);
  }

  // --- Show / Hide password toggle ---
  document.addEventListener("click", function (e) {
    const toggleBtn = e.target.closest(".toggle-pw");
    if (!toggleBtn) return;
    const targetId = toggleBtn.getAttribute("data-target");
    const input = document.getElementById(targetId);
    if (!input) return;
    if (input.type === "password") {
      input.type = "text";
      toggleBtn.setAttribute("aria-label", "Hide password");
    } else {
      input.type = "password";
      toggleBtn.setAttribute("aria-label", "Show password");
    }
  });

  /* ---------- 14. CATALOG SIDEBAR INTERACTIONS (NIKE STYLE) ---------- */
  const toggleFiltersBtn = document.getElementById("toggle-filters-btn");
  const filterSidebar = document.getElementById("filter-sidebar");
  const toggleFiltersText = document.getElementById("toggle-filters-text");
  const filterResetBtn = document.getElementById("filter-reset-btn");

  if (toggleFiltersBtn && filterSidebar) {
    toggleFiltersBtn.addEventListener("click", (e) => {
      e.preventDefault();
      filterSidebar.classList.toggle("hidden");
      const isHidden = filterSidebar.classList.contains("hidden");
      if (toggleFiltersText) {
        toggleFiltersText.textContent = isHidden
          ? "Show Filters"
          : "Hide Filters";
      }
    });
  }

  // Collapsible Accordions for Filters
  document.querySelectorAll(".filter-header").forEach((header) => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      if (content && content.classList.contains("filter-content")) {
        const isCollapsed = content.style.display === "none";
        content.style.display = isCollapsed ? "flex" : "none";

        const chevron = header.querySelector(".chevron-icon");
        if (chevron) {
          chevron.style.transform = isCollapsed
            ? "rotate(0deg)"
            : "rotate(-90deg)";
        }
      }
    });
  });

  // Reset Filters button
  if (filterResetBtn) {
    filterResetBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Clear check states
      document
        .querySelectorAll('.filter-sidebar input[type="checkbox"]')
        .forEach((cb) => (cb.checked = false));

      // Reset radio to featured
      const featuredRadio = document.querySelector(
        '.filter-sidebar input[type="radio"][value="featured"]',
      );
      if (featuredRadio) featuredRadio.checked = true;

      // Call page-specific applyFilters function if it exists
      if (typeof applyFilters === "function") {
        applyFilters();
      }
    });
  }

  /* ---------- 15. VIDEO LIGHTBOX MODAL ---------- */
  const videoLightbox = document.getElementById("video-lightbox");
  const lightboxVideo = document.getElementById("lightbox-video");
  const videoLightboxClose = document.getElementById("video-lightbox-close");

  if (videoLightbox && lightboxVideo) {
    document.body.addEventListener("click", (e) => {
      const trigger = e.target.closest(".watch-video-trigger");
      if (trigger) {
        e.preventDefault();
        const videoSrc = trigger.getAttribute("data-video-src");
        if (videoSrc) {
          lightboxVideo.src = videoSrc;
          videoLightbox.classList.add("active");
          lightboxVideo.load();
          lightboxVideo.play();
          document.body.style.overflow = "hidden";
        }
      }
    });

    const closeVideoLightbox = () => {
      lightboxVideo.pause();
      lightboxVideo.src = "";
      videoLightbox.classList.remove("active");
      document.body.style.overflow = "";
    };

    if (videoLightboxClose) {
      videoLightboxClose.addEventListener("click", closeVideoLightbox);
    }

    videoLightbox.addEventListener("click", (e) => {
      if (e.target === videoLightbox) {
        closeVideoLightbox();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeVideoLightbox();
      }
    });
  }

  updateAuthUI(); // Initial run on DOM load

  // ============================================================
  // DYNAMIC PRODUCTS CATALOG PAGE CONTROLLER
  // ============================================================
  const productGrid = document.getElementById("product-grid");
  if (productGrid) {
    const bodyId = document.body ? document.body.id : "";
    const pathName = window.location.pathname.toLowerCase();

    let pageGender = "";
    if (pathName.includes("men.html") || bodyId === "men-page")
      pageGender = "male";
    else if (pathName.includes("women.html") || bodyId === "women-page")
      pageGender = "female";
    else if (pathName.includes("kids.html") || bodyId === "kids-page")
      pageGender = "kids";
    else if (pathName.includes("diamonds.html") || bodyId === "diamonds-page")
      pageGender = "diamonds";
    else if (pathName.includes("silver.html") || bodyId === "silver-page")
      pageGender = "silver";
    else if (
      pathName.includes("mangalsutra.html") ||
      bodyId === "mangalsutra-page"
    )
      pageGender = "mangalsutra";
    else if (pathName.includes("wedding.html") || bodyId === "wedding-page")
      pageGender = "wedding";
    else if (pathName.includes("gold.html") || bodyId === "gold-page")
      pageGender = "gold";
    else if (
      pathName.includes("daily_wear.html") ||
      bodyId === "daily-wear-page"
    )
      pageGender = "daily_wear";
    else if (
      pathName.includes("auspicious.html") ||
      bodyId === "auspicious-page"
    )
      pageGender = "auspicious";
    else if (pathName.includes("gifting.html") || bodyId === "gifting-page")
      pageGender = "gifting";
    else if (pathName.includes("custom.html") || bodyId === "custom-page")
      pageGender = "custom";

    const allProducts = window.products || [];

    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get("filter");

    let pageProducts = [];
    if (filterParam) {
      const filterLower = filterParam.toLowerCase();
      if (filterLower === "18k-gold") {
        pageProducts = allProducts.filter(
          (p) =>
            p.image.toLowerCase().includes("assets/custom/") ||
            p.image.toLowerCase().includes("assets/women/"),
        );
      } else if (filterLower === "stunning-earring") {
        pageProducts = allProducts.filter(
          (p) =>
            (p.image.toLowerCase().includes("assets/women/") &&
              p.image.toLowerCase().includes("earring")) ||
            (p.image.toLowerCase().includes("assets/kids/") &&
              p.image.toLowerCase().includes("earring")),
        );
      } else if (filterLower === "sub-50k") {
        pageProducts = allProducts.filter(
          (p) =>
            p.image.toLowerCase().includes("assets/daily_wear/") ||
            p.image.toLowerCase().includes("assets/gifting_items/"),
        );
      } else if (filterLower === "category-bangle") {
        pageProducts = allProducts.filter(
          (p) =>
            (p.image.toLowerCase().includes("assets/kids/") &&
              p.image.toLowerCase().includes("bangle")) ||
            (p.image.toLowerCase().includes("assets/women/") &&
              p.image.toLowerCase().includes("bangle")),
        );
      } else if (filterLower === "category-earring") {
        pageProducts = allProducts.filter(
          (p) =>
            (p.image.toLowerCase().includes("assets/men/") &&
              p.image.toLowerCase().includes("earring")) ||
            (p.image.toLowerCase().includes("assets/women/") &&
              p.image.toLowerCase().includes("earring")) ||
            (p.image.toLowerCase().includes("assets/kids/") &&
              p.image.toLowerCase().includes("earring")),
        );
      } else if (filterLower === "category-bracelet") {
        pageProducts = allProducts.filter(
          (p) =>
            (p.image.toLowerCase().includes("assets/men/") &&
              p.image.toLowerCase().includes("bracelet")) ||
            (p.image.toLowerCase().includes("assets/women/") &&
              p.image.toLowerCase().includes("bangle")),
        );
      } else if (filterLower === "category-chain") {
        pageProducts = allProducts.filter(
          (p) =>
            p.image.toLowerCase().includes("assets/daily_wear/") ||
            (p.image.toLowerCase().includes("assets/men/") &&
              p.image.toLowerCase().includes("chain")) ||
            (p.image.toLowerCase().includes("assets/women/") &&
              p.image.toLowerCase().includes("necklace")),
        );
      } else if (filterLower === "category-ring") {
        pageProducts = allProducts.filter(
          (p) =>
            (p.image.toLowerCase().includes("assets/kids/") &&
              p.image.toLowerCase().includes("ring")) ||
            (p.image.toLowerCase().includes("assets/men/") &&
              p.image.toLowerCase().includes("ring")) ||
            (p.image.toLowerCase().includes("assets/women/") &&
              p.image.toLowerCase().includes("ring")),
        );
      } else if (filterLower === "category-gold") {
        pageProducts = [];
      } else if (filterLower === "category-mangalsutra") {
        pageProducts = allProducts.filter((p) =>
          p.image.toLowerCase().includes("assets/mangalsutra/"),
        );
      } else if (filterLower === "category-pendant") {
        pageProducts = allProducts.filter((p) =>
          p.image.toLowerCase().includes("assets/custom/"),
        );
      } else if (filterLower === "trending-auspicious") {
        pageProducts = allProducts.filter((p) =>
          p.image.toLowerCase().includes("assets/ocassions/"),
        );
      } else if (filterLower === "trending-gifting") {
        pageProducts = allProducts.filter((p) =>
          p.image.toLowerCase().includes("assets/gifting_items/"),
        );
      } else if (filterLower === "trending-custom") {
        pageProducts = allProducts.filter((p) =>
          p.image.toLowerCase().includes("assets/custom/"),
        );
      } else if (filterLower === "occasion-wedding") {
        pageProducts = allProducts.filter((p) =>
          p.image.toLowerCase().includes("assets/weddings/"),
        );
      } else if (filterLower === "occasion-diamond") {
        pageProducts = allProducts.filter((p) =>
          p.image.toLowerCase().includes("assets/diamonds/"),
        );
      } else if (filterLower === "occasion-gold") {
        pageProducts = allProducts.filter(
          (p) =>
            p.image.toLowerCase().includes("assets/custom/") ||
            p.image.toLowerCase().includes("assets/kids/") ||
            p.image.toLowerCase().includes("assets/mangalsutra/") ||
            p.image.toLowerCase().includes("assets/men/") ||
            p.image.toLowerCase().includes("assets/ocassions/") ||
            p.image.toLowerCase().includes("assets/weddings/") ||
            p.image.toLowerCase().includes("assets/women/"),
        );
      } else if (filterLower === "occasion-daily_wear") {
        pageProducts = allProducts.filter((p) =>
          p.image.toLowerCase().includes("assets/daily_wear/"),
        );
      } else if (filterLower === "silver") {
        pageProducts = allProducts.filter((p) =>
          p.image.toLowerCase().includes("assets/silver/"),
        );
      } else if (filterLower === "mangalsutra") {
        pageProducts = allProducts.filter((p) =>
          p.image.toLowerCase().includes("assets/mangalsutra/"),
        );
      } else if (filterLower === "men") {
        pageProducts = allProducts.filter((p) =>
          p.image.toLowerCase().includes("assets/men/"),
        );
      } else if (filterLower === "women") {
        pageProducts = allProducts.filter((p) =>
          p.image.toLowerCase().includes("assets/women/"),
        );
      } else if (filterLower === "kids") {
        pageProducts = allProducts.filter((p) =>
          p.image.toLowerCase().includes("assets/kids/"),
        );
      } else if (filterLower === "new_arrivals") {
        pageProducts = allProducts.filter((p) =>
          p.image.toLowerCase().includes("assets/new_arrivals/"),
        );
      } else {
        pageProducts = [...allProducts];
      }
    } else {
      if (pageGender === "male") {
        pageProducts = allProducts.filter((p) => p.gender === "male");
      } else if (pageGender === "female") {
        pageProducts = allProducts.filter((p) => p.gender === "female");
      } else if (pageGender === "kids") {
        pageProducts = allProducts.filter((p) => p.gender === "kids");
      } else if (pageGender === "diamonds") {
        pageProducts = allProducts.filter(
          (p) =>
            p.gender === "diamonds" ||
            p.category === "diamond" ||
            p.name.toLowerCase().includes("diamond") ||
            p.desc.toLowerCase().includes("diamond"),
        );
      } else if (pageGender === "silver") {
        pageProducts = allProducts.filter(
          (p) =>
            p.gender === "silver" ||
            p.name.toLowerCase().includes("silver") ||
            p.desc.toLowerCase().includes("silver"),
        );
      } else if (pageGender === "mangalsutra") {
        pageProducts = allProducts.filter(
          (p) =>
            p.gender === "mangalsutra" ||
            p.name.toLowerCase().includes("mangalsutra"),
        );
      } else if (pageGender === "wedding") {
        pageProducts = allProducts.filter(
          (p) =>
            p.gender === "wedding" ||
            p.name.toLowerCase().includes("bridal") ||
            p.name.toLowerCase().includes("wedding"),
        );
      } else if (pageGender === "gold") {
        pageProducts = allProducts.filter(
          (p) =>
            p.gender !== "silver" &&
            !p.name.toLowerCase().includes("silver") &&
            !p.desc.toLowerCase().includes("silver"),
        );
      } else if (pageGender === "daily_wear") {
        pageProducts = allProducts.filter((p) => p.gender === "daily_wear");
      } else if (pageGender === "auspicious") {
        pageProducts = allProducts.filter(
          (p) => p.gender === "auspicious" || p.gender === "wedding",
        );
      } else if (pageGender === "gifting") {
        pageProducts = allProducts.filter((p) => p.gender === "gifting");
      } else if (pageGender === "custom") {
        pageProducts = allProducts.filter((p) => p.gender === "custom");
      } else {
        pageProducts = [...allProducts];
      }
    }

    const typeCheckboxes = document.querySelectorAll('input[name="type"]');
    const priceCheckboxes = document.querySelectorAll('input[name="price"]');
    const resultsCount =
      document.getElementById("results-count") ||
      document.querySelector(".results-count");
    const filterResetBtn = document.getElementById("filter-reset-btn");
    const toggleFiltersBtn = document.getElementById("toggle-filters-btn");
    const filterSidebar = document.getElementById("filter-sidebar");
    const catalogLayout = document.querySelector(".catalog-layout");
    const toggleFiltersText = document.getElementById("toggle-filters-text");

    // Sort options (handles both sort-options-btn and sort-dropdown-btn)
    const sortOptionsBtn =
      document.getElementById("sort-options-btn") ||
      document.getElementById("sort-dropdown-btn");
    const sortOptions = document.getElementById("sort-options");
    let currentSort = "featured";

    if (sortOptionsBtn && sortOptions) {
      sortOptionsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        sortOptions.classList.toggle("active");
      });
      document.addEventListener("click", () => {
        sortOptions.classList.remove("active");
      });
      sortOptions.querySelectorAll(".sort-option").forEach((option) => {
        option.addEventListener("click", (e) => {
          e.preventDefault();
          sortOptions
            .querySelectorAll(".sort-option")
            .forEach((opt) => opt.classList.remove("active"));
          option.classList.add("active");
          currentSort = option.dataset.sort;
          const sortTextMap = {
            featured: "Featured",
            newest: "Newest",
            "price-low": "Price: Low to High",
            "price-high": "Price: High to Low",
          };
          const btnSpan = sortOptionsBtn.querySelector("span");
          if (btnSpan)
            btnSpan.textContent = sortTextMap[currentSort] || "Sort By";
          sortOptions.classList.remove("active");
          applyFilters();
        });
      });
    }

    if (toggleFiltersBtn && filterSidebar && catalogLayout) {
      toggleFiltersBtn.addEventListener("click", () => {
        filterSidebar.classList.toggle("hidden");
        catalogLayout.classList.toggle("filters-hidden");
        if (filterSidebar.classList.contains("hidden")) {
          if (toggleFiltersText) toggleFiltersText.textContent = "Show Filters";
        } else {
          if (toggleFiltersText) toggleFiltersText.textContent = "Hide Filters";
        }
      });
    }

    if (filterResetBtn) {
      filterResetBtn.addEventListener("click", () => {
        typeCheckboxes.forEach((c) => (c.checked = false));
        priceCheckboxes.forEach((c) => (c.checked = false));
        const newUrl = window.location.pathname;
        window.history.pushState({}, "", newUrl);
        applyFilters();
      });
    }

    function render(list) {
      productGrid.innerHTML = "";
      if (resultsCount) {
        resultsCount.textContent = `Showing ${list.length} pieces`;
      }

      if (list.length === 0) {
        productGrid.innerHTML = `
                    <div style="grid-column: 1/-1; padding: 60px 0; text-align: center; color: var(--color-text-muted);">
                        <h3 style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--color-text-dark); margin-bottom: 12px;">No results found</h3>
                        <p style="margin-bottom: 20px;">We couldn't find any matches. Try adjusting your filters or search query.</p>
                        <button class="btn btn--outline" id="filter-reset-btn-empty" style="border-radius: 9999px;">Reset All Filters</button>
                    </div>
                `;
        const emptyReset = document.getElementById("filter-reset-btn-empty");
        if (emptyReset) {
          emptyReset.addEventListener("click", () => {
            typeCheckboxes.forEach((c) => (c.checked = false));
            priceCheckboxes.forEach((c) => (c.checked = false));
            applyFilters();
          });
        }
        return;
      }

      list.forEach((p) => {
        // Determine Badge Text based on metal / collection
        let badgeText = "22K Gold • BIS 916";
        if (p.gender === "silver" || p.name.toLowerCase().includes("silver")) {
          badgeText = "92.5 Sterling Silver";
        } else if (
          p.gender === "diamonds" ||
          p.name.toLowerCase().includes("diamond") ||
          p.category === "diamond"
        ) {
          badgeText = "18K Gold • VVS Diamond";
        } else if (p.gender === "kids") {
          badgeText = "18K Kid-Safe Gold";
        }

        const card = document.createElement("div");
        card.className = "trend-card";
        card.innerHTML = `
                    <div class="trend-card__img-wrap" style="position: relative; aspect-ratio: 1; overflow: hidden; border-bottom: 1px solid var(--color-border);">
                        <img src="${p.image}" alt="${p.name}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-slow);" onerror="this.src='https://images.unsplash.com/photo-1599643478518-a854e5da47f0?q=80&w=600'">
                    </div>
                    <div class="trend-card__info" style="padding: 20px; display: flex; flex-direction: column; flex-grow: 1;">
                        <div class="card-meta" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span class="card-category" style="font-size: 0.72rem; font-weight: 700; color: var(--color-primary-dark); letter-spacing: 1px; text-transform: uppercase;">${p.category}</span>
                            <span class="card-rating" style="font-size: 0.75rem; font-weight: 600; color: #b8860b;">⭐ 4.8</span>
                        </div>
                        <div class="card-badge-row" style="margin-bottom: 12px; display: flex;">
                            <span class="card-badge-inline" style="font-size: 0.68rem; font-weight: 700; color: var(--color-text-light); background-color: var(--color-bg-alt); padding: 3px 8px; border-radius: 4px; border: 1px solid var(--color-border); text-transform: uppercase; letter-spacing: 0.5px;">${badgeText}</span>
                        </div>
                        <h3 style="font-size: 1.15rem; font-weight: 600; color: var(--color-text-dark); margin-bottom: 8px; font-family: var(--font-heading);">${p.name}</h3>
                        <p class="card-desc" style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 2.8em;">
                            ${p.desc || "Exquisite traditional style crafted with strict quality control and certified hallmark testing."}
                        </p>
                        <p class="trend-card__price" style="font-size: 1.2rem; font-weight: 700; color: var(--color-text-dark); margin-top: auto; margin-bottom: 12px;">₹${p.price.toLocaleString("en-IN")}</p>
                        <a href="product.html?id=${p.id}" class="btn btn--outline btn--full" style="width: 100%; text-align: center; justify-content: center;">View Details</a>
                    </div>
                `;
        productGrid.appendChild(card);
      });
    }

    // Helper to dynamically match custom price ranges
    function matchPriceRange(productPrice, rangeString) {
      const str = rangeString.toLowerCase();

      function parseAmount(valStr) {
        valStr = valStr.trim();
        let multiplier = 1;
        if (valStr.endsWith("k")) {
          multiplier = 1000;
          valStr = valStr.slice(0, -1);
        } else if (valStr.endsWith("l")) {
          multiplier = 100000;
          valStr = valStr.slice(0, -1);
        }
        return parseFloat(valStr) * multiplier;
      }

      if (str.startsWith("under-")) {
        const limit = parseAmount(str.replace("under-", ""));
        return productPrice < limit;
      } else if (str.startsWith("above-")) {
        const limit = parseAmount(str.replace("above-", ""));
        return productPrice > limit;
      } else if (str.includes("-")) {
        const parts = str.split("-");
        const min = parseAmount(parts[0]);
        const max = parseAmount(parts[1]);
        return productPrice >= min && productPrice <= max;
      }
      return false;
    }

    function applyFilters() {
      let filtered = [...pageProducts];

      // Search query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const searchQuery = urlParams.get("search");
      if (searchQuery) {
        const queryLower = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(queryLower) ||
            p.category.toLowerCase().includes(queryLower) ||
            (p.desc && p.desc.toLowerCase().includes(queryLower)),
        );
      }

      // Category type checkboxes
      const selectedTypes = Array.from(typeCheckboxes)
        .filter((c) => c.checked)
        .map((c) => c.value);
      if (selectedTypes.length > 0) {
        filtered = filtered.filter((p) => selectedTypes.includes(p.category));
      }

      // Price range checkboxes (now parsed dynamically!)
      const selectedPrices = Array.from(priceCheckboxes)
        .filter((c) => c.checked)
        .map((c) => c.value);
      if (selectedPrices.length > 0) {
        filtered = filtered.filter((p) => {
          return selectedPrices.some((range) =>
            matchPriceRange(p.price, range),
          );
        });
      }

      // Sorting options
      if (currentSort === "newest") {
        filtered.sort((a, b) => (a.releaseDays || 99) - (b.releaseDays || 99));
      } else if (currentSort === "price-low") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (currentSort === "price-high") {
        filtered.sort((a, b) => b.price - a.price);
      }

      render(filtered);
    }

    // Auto-check filters from URL parameters on load
    const preFilterType = urlParams.get("type");
    if (preFilterType) {
      const checkbox = document.querySelector(
        `input[name="type"][value="${preFilterType}"]`,
      );
      if (checkbox) checkbox.checked = true;
    }
    const preFilterSearch = urlParams.get("search");
    if (preFilterSearch) {
      const checkbox = document.querySelector(
        `input[name="type"][value="${preFilterSearch}"]`,
      );
      if (checkbox) checkbox.checked = true;
    }

    typeCheckboxes.forEach((c) => c.addEventListener("change", applyFilters));
    priceCheckboxes.forEach((c) => c.addEventListener("change", applyFilters));

    applyFilters();
  }
});
