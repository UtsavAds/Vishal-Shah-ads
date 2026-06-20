const registrationUrl = document.body.dataset.registrationUrl?.trim();

if (registrationUrl) {
  document.querySelectorAll('a[href^="https://rzp.io"], a[href="#registration"]').forEach((link) => {
    link.setAttribute("href", registrationUrl);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
    link.addEventListener("click", () => {
      const section = link.closest("section");
      const location = section?.id || section?.className?.split(" ")[0] || "site";

      if (typeof window.fbq === "function") {
        window.fbq("track", "InitiateCheckout", {
          content_name: "Business Skool ₹99 Webinar",
          content_category: "Webinar",
          value: 99,
          currency: "INR"
        });
        window.fbq("trackCustom", "Webinar99ButtonClick", {button_location: location});
      }
    });
  });
}

document.querySelectorAll(".video-launch").forEach((button) => {
  button.addEventListener("click", () => {
    const videoId = button.dataset.videoId;
    const videoLabel = button.dataset.videoLabel || "Business Skool testimonial";
    const videoEvent = button.dataset.videoEvent || "TestimonialVideoPlay";

    if (!videoId) return;

    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", videoEvent, {
        video_id: videoId,
        video_name: videoLabel
      });
    }

    if (window.location.protocol === "file:") {
      const notice = document.createElement("span");
      notice.className = "local-video-badge";
      notice.textContent = "Video plays here on the live website";
      button.append(notice);
      button.classList.add("is-local-preview");
      return;
    }

    const iframe = document.createElement("iframe");
    const liveOrigin = window.location.protocol === "http:" || window.location.protocol === "https:"
      ? window.location.origin
      : "https://lead.businessschool.in";
    const playerParams = new URLSearchParams({
      autoplay: "1",
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      origin: liveOrigin,
      widget_referrer: `${liveOrigin}/`
    });
    iframe.src = `https://www.youtube.com/embed/${videoId}?${playerParams.toString()}`;
    iframe.title = videoLabel;
    iframe.loading = "eager";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    button.replaceChildren(iframe);
    button.classList.add("is-playing");
    button.closest(".video-embed")?.classList.add("is-playing");
  }, {once: true});
});

const assessmentRanges = document.querySelectorAll(".assessment-range");
const assessmentScore = document.querySelector("#assessment-score");
const assessmentMessage = document.querySelector("#assessment-message");

if (assessmentRanges.length && assessmentScore && assessmentMessage) {
  const updateAssessment = () => {
    let total = 0;

    assessmentRanges.forEach((range) => {
      const value = Number(range.value);
      total += value;
      const output = range.parentElement?.querySelector("output");
      if (output) output.value = String(value);
    });

    assessmentScore.textContent = `${total}/25`;

    if (total <= 10) {
      assessmentMessage.textContent = "Low dependency. Use the webinar to make your systems even stronger.";
    } else if (total <= 20) {
      assessmentMessage.textContent = "Your business needs stronger ownership, systems and follow-through.";
    } else {
      assessmentMessage.textContent = "High owner dependency. This webinar will help you choose what to fix first.";
    }
  };

  assessmentRanges.forEach((range) => range.addEventListener("input", updateAssessment));
  updateAssessment();
}

const countdown = document.querySelector(".mini-countdown[data-countdown-end]");

if (countdown) {
  const countdownEnd = new Date(countdown.dataset.countdownEnd).getTime();
  const countdownParts = {
    days: countdown.querySelector('[data-countdown="days"]'),
    hours: countdown.querySelector('[data-countdown="hours"]'),
    minutes: countdown.querySelector('[data-countdown="minutes"]'),
    seconds: countdown.querySelector('[data-countdown="seconds"]')
  };

  const updateCountdown = () => {
    const remaining = Math.max(0, countdownEnd - Date.now());
    const totalSeconds = Math.floor(remaining / 1000);
    const values = {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60
    };

    Object.entries(values).forEach(([key, value]) => {
      if (countdownParts[key]) countdownParts[key].textContent = String(value).padStart(2, "0");
    });

    if (remaining === 0) {
      const heading = countdown.querySelector(":scope > strong");
      if (heading) heading.textContent = "The live webinar is starting now.";
      window.clearInterval(countdownTimer);
    }
  };

  const countdownTimer = window.setInterval(updateCountdown, 1000);
  updateCountdown();
}

const counterElements = document.querySelectorAll("[data-counter]");

if (counterElements.length) {
  const animateCounter = (element) => {
    const target = Number(element.dataset.counter || 0);
    const duration = 1100;
    const startedAt = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased).toLocaleString("en-IN");
      if (progress < 1) window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, {threshold: 0.7});

    counterElements.forEach((element) => counterObserver.observe(element));
  } else {
    counterElements.forEach(animateCounter);
  }
}

document.querySelector(".floating-whatsapp")?.addEventListener("click", () => {
  if (typeof window.fbq === "function") {
    window.fbq("track", "Contact", {content_name: "Webinar WhatsApp Enquiry"});
    window.fbq("trackCustom", "WhatsAppClick", {button_location: "floating_site_button"});
  }
});

const galleryButtons = [...document.querySelectorAll(".glimpse-card")];
const galleryDialog = document.querySelector(".glimpse-lightbox");

if (galleryButtons.length && galleryDialog) {
  const galleryImage = galleryDialog.querySelector("img");
  const galleryCount = galleryDialog.querySelector("p");
  const galleryClose = galleryDialog.querySelector(".glimpse-close");
  const galleryPrev = galleryDialog.querySelector(".glimpse-prev");
  const galleryNext = galleryDialog.querySelector(".glimpse-next");
  let activeGalleryIndex = 0;

  const showGalleryImage = (index) => {
    activeGalleryIndex = (index + galleryButtons.length) % galleryButtons.length;
    const sourceImage = galleryButtons[activeGalleryIndex].querySelector("img");

    if (galleryImage && sourceImage) {
      galleryImage.src = sourceImage.src;
      galleryImage.alt = sourceImage.alt;
    }

    if (galleryCount) galleryCount.textContent = `${activeGalleryIndex + 1} of ${galleryButtons.length}`;
  };

  galleryButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      showGalleryImage(index);
      if (typeof galleryDialog.showModal === "function") galleryDialog.showModal();
      else galleryDialog.setAttribute("open", "");

      if (typeof window.fbq === "function") {
        window.fbq("trackCustom", "WebinarGalleryOpen", {image_number: index + 1});
      }
    });
  });

  galleryClose?.addEventListener("click", () => galleryDialog.close());
  galleryPrev?.addEventListener("click", () => showGalleryImage(activeGalleryIndex - 1));
  galleryNext?.addEventListener("click", () => showGalleryImage(activeGalleryIndex + 1));
  galleryDialog.addEventListener("click", (event) => {
    if (event.target === galleryDialog) galleryDialog.close();
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}
